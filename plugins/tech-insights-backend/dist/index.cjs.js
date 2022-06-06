'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var express = require('express');
var Router = require('express-promise-router');
var luxon = require('luxon');
var catalogModel = require('@backstage/catalog-model');
var backendCommon = require('@backstage/backend-common');
var errors = require('@backstage/errors');
var semver = require('semver');
var lodash = require('lodash');
var camelCase = require('lodash/camelCase');
var catalogClient = require('@backstage/catalog-client');
var isEmpty = require('lodash/isEmpty');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var camelCase__default = /*#__PURE__*/_interopDefaultLegacy(camelCase);
var isEmpty__default = /*#__PURE__*/_interopDefaultLegacy(isEmpty);

async function createRouter(options) {
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  const { persistenceContext, factChecker, logger } = options;
  const { techInsightsStore } = persistenceContext;
  if (factChecker) {
    logger.info("Fact checker configured. Enabling fact checking endpoints.");
    router.get("/checks", async (_req, res) => {
      return res.send(await factChecker.getChecks());
    });
    router.post("/checks/run/:namespace/:kind/:name", async (req, res) => {
      const { namespace, kind, name } = req.params;
      const { checks } = req.body;
      const entityTriplet = catalogModel.stringifyEntityRef({ namespace, kind, name });
      const checkResult = await factChecker.runChecks(entityTriplet, checks);
      return res.send(checkResult);
    });
    router.post("/checks/run", async (req, res) => {
      const {
        checks,
        entities
      } = req.body;
      const tasks = entities.map(async (entity) => {
        const entityTriplet = typeof entity === "string" ? entity : catalogModel.stringifyEntityRef(entity);
        const results2 = await factChecker.runChecks(entityTriplet, checks);
        return {
          entity: entityTriplet,
          results: results2
        };
      });
      const results = await Promise.all(tasks);
      return res.send(results);
    });
  } else {
    logger.info("Starting tech insights module without fact checking endpoints.");
  }
  router.get("/fact-schemas", async (req, res) => {
    const ids = req.query.ids;
    return res.send(await techInsightsStore.getLatestSchemas(ids));
  });
  router.get("/facts/latest", async (req, res) => {
    const { entity } = req.query;
    const { namespace, kind, name } = catalogModel.parseEntityRef(entity);
    const ids = req.query.ids;
    return res.send(await techInsightsStore.getLatestFactsByIds(ids, catalogModel.stringifyEntityRef({ namespace, kind, name })));
  });
  router.get("/facts/range", async (req, res) => {
    const { entity } = req.query;
    const { namespace, kind, name } = catalogModel.parseEntityRef(entity);
    const ids = req.query.ids;
    const startDatetime = luxon.DateTime.fromISO(req.query.startDatetime);
    const endDatetime = luxon.DateTime.fromISO(req.query.endDatetime);
    if (!startDatetime.isValid || !endDatetime.isValid) {
      return res.status(422).send({
        message: "Failed to parse datetime from request",
        field: !startDatetime.isValid ? "startDateTime" : "endDateTime",
        value: !startDatetime.isValid ? startDatetime : endDatetime
      });
    }
    const entityTriplet = catalogModel.stringifyEntityRef({ namespace, kind, name });
    return res.send(await techInsightsStore.getFactsBetweenTimestampsByIds(ids, entityTriplet, startDatetime, endDatetime));
  });
  router.use(backendCommon.errorHandler());
  return router;
}

function randomDailyCron() {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  return `${rand(0, 59)} ${rand(0, 23)} * * *`;
}
function duration(startTimestamp) {
  const delta = process.hrtime(startTimestamp);
  const seconds = delta[0] + delta[1] / 1e9;
  return `${seconds.toFixed(1)}s`;
}
class FactRetrieverEngine {
  constructor(repository, factRetrieverRegistry, factRetrieverContext, logger, scheduler, defaultCadence, defaultTimeout) {
    this.repository = repository;
    this.factRetrieverRegistry = factRetrieverRegistry;
    this.factRetrieverContext = factRetrieverContext;
    this.logger = logger;
    this.scheduler = scheduler;
    this.defaultCadence = defaultCadence;
    this.defaultTimeout = defaultTimeout;
  }
  static async create(options) {
    const {
      repository,
      factRetrieverRegistry,
      factRetrieverContext,
      scheduler,
      defaultCadence,
      defaultTimeout
    } = options;
    await Promise.all(factRetrieverRegistry.listRetrievers().map((it) => repository.insertFactSchema(it)));
    return new FactRetrieverEngine(repository, factRetrieverRegistry, factRetrieverContext, factRetrieverContext.logger, scheduler, defaultCadence, defaultTimeout);
  }
  async schedule() {
    const registrations = this.factRetrieverRegistry.listRegistrations();
    const newRegs = [];
    await Promise.all(registrations.map(async (registration) => {
      const { factRetriever, cadence, lifecycle, timeout } = registration;
      const cronExpression = cadence || this.defaultCadence || randomDailyCron();
      const timeLimit = timeout || this.defaultTimeout || luxon.Duration.fromObject({ minutes: 5 });
      try {
        await this.scheduler.scheduleTask({
          id: factRetriever.id,
          frequency: { cron: cronExpression },
          fn: this.createFactRetrieverHandler(factRetriever, lifecycle),
          timeout: timeLimit
        });
        newRegs.push(factRetriever.id);
      } catch (e) {
        this.logger.warn(`Failed to schedule fact retriever ${factRetriever.id}, ${e}`);
      }
    }));
    this.logger.info(`Scheduled ${newRegs.length}/${registrations.length} fact retrievers into the tech-insights engine`);
  }
  getJobRegistration(ref) {
    return this.factRetrieverRegistry.get(ref);
  }
  async triggerJob(ref) {
    await this.scheduler.triggerTask(ref);
  }
  createFactRetrieverHandler(factRetriever, lifecycle) {
    return async () => {
      const startTimestamp = process.hrtime();
      this.logger.info(`Retrieving facts for fact retriever ${factRetriever.id}`);
      let facts = [];
      try {
        facts = await factRetriever.handler({
          ...this.factRetrieverContext,
          entityFilter: factRetriever.entityFilter
        });
        this.logger.debug(`Retrieved ${facts.length} facts for fact retriever ${factRetriever.id} in ${duration(startTimestamp)}`);
      } catch (e) {
        this.logger.error(`Failed to retrieve facts for retriever ${factRetriever.id}`, e);
      }
      try {
        await this.repository.insertFacts({
          id: factRetriever.id,
          facts,
          lifecycle
        });
        this.logger.info(`Stored ${facts.length} facts for fact retriever ${factRetriever.id} in ${duration(startTimestamp)}`);
      } catch (e) {
        this.logger.warn(`Failed to insert facts for fact retriever ${factRetriever.id}`, e);
      }
    };
  }
}

class FactRetrieverRegistry {
  constructor(retrievers) {
    this.retrievers = /* @__PURE__ */ new Map();
    retrievers.forEach((it) => {
      this.register(it);
    });
  }
  register(registration) {
    if (this.retrievers.has(registration.factRetriever.id)) {
      throw new errors.ConflictError(`Tech insight fact retriever with identifier '${registration.factRetriever.id}' has already been registered`);
    }
    this.retrievers.set(registration.factRetriever.id, registration);
  }
  get(retrieverReference) {
    const registration = this.retrievers.get(retrieverReference);
    if (!registration) {
      throw new errors.NotFoundError(`Tech insight fact retriever with identifier '${retrieverReference}' is not registered.`);
    }
    return registration;
  }
  listRetrievers() {
    return [...this.retrievers.values()].map((it) => it.factRetriever);
  }
  listRegistrations() {
    return [...this.retrievers.values()];
  }
  getSchemas() {
    return this.listRetrievers().map((it) => it.schema);
  }
}

const generateAnnotationFactName = (annotation) => camelCase__default["default"](`hasAnnotation-${annotation}`);
const entityHasAnnotation = (entity, annotation) => Boolean(lodash.get(entity, ["metadata", "annotations", annotation]));
const isTtl = (lifecycle) => {
  return !!lifecycle.timeToLive;
};
const isMaxItems = (lifecycle) => {
  return !!lifecycle.maxItems;
};

class TechInsightsDatabase {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
    this.CHUNK_SIZE = 50;
  }
  async getLatestSchemas(ids) {
    const queryBuilder = this.db("fact_schemas");
    if (ids) {
      queryBuilder.whereIn("id", ids);
    }
    const existingSchemas = await queryBuilder.orderBy("id", "desc").select();
    const groupedSchemas = lodash.groupBy(existingSchemas, "id");
    return Object.values(groupedSchemas).map((schemas) => {
      const sorted = semver.rsort(schemas.map((it) => it.version));
      return schemas.find((it) => it.version === sorted[0]);
    }).map((it) => ({
      ...lodash.omit(it, "schema"),
      ...JSON.parse(it.schema),
      entityFilter: it.entityFilter ? JSON.parse(it.entityFilter) : null
    }));
  }
  async insertFactSchema(schemaDefinition) {
    const { id, version, schema, entityFilter } = schemaDefinition;
    const existingSchemas = await this.db("fact_schemas").where({ id }).and.where({ version }).select();
    if (!existingSchemas || existingSchemas.length === 0) {
      await this.db("fact_schemas").insert({
        id,
        version,
        entityFilter: entityFilter ? JSON.stringify(entityFilter) : void 0,
        schema: JSON.stringify(schema)
      });
    }
  }
  async insertFacts({
    id,
    facts,
    lifecycle
  }) {
    if (facts.length === 0)
      return;
    const currentSchema = await this.getLatestSchema(id);
    const factRows = facts.map((it) => {
      return {
        id,
        version: currentSchema.version,
        entity: catalogModel.stringifyEntityRef(it.entity),
        facts: JSON.stringify(it.facts),
        ...it.timestamp && { timestamp: it.timestamp.toISO() }
      };
    });
    await this.db.transaction(async (tx) => {
      await tx.batchInsert("facts", factRows, this.CHUNK_SIZE);
      if (lifecycle && isTtl(lifecycle)) {
        const expiration = luxon.DateTime.now().minus(lifecycle.timeToLive);
        await this.deleteExpiredFactsByDate(tx, factRows, expiration);
      }
      if (lifecycle && isMaxItems(lifecycle)) {
        await this.deleteExpiredFactsByNumber(tx, factRows, lifecycle.maxItems);
      }
    });
  }
  async getLatestFactsByIds(ids, entityTriplet) {
    const results = await this.db("facts").where({ entity: entityTriplet }).and.whereIn("id", ids).join(this.db("facts").max("timestamp as maxTimestamp").column("id as subId").where({ entity: entityTriplet }).and.whereIn("id", ids).groupBy("id").as("subQ"), {
      "facts.id": "subQ.subId",
      "facts.timestamp": "subQ.maxTimestamp"
    });
    return this.dbFactRowsToTechInsightFacts(results);
  }
  async getFactsBetweenTimestampsByIds(ids, entityTriplet, startDateTime, endDateTime) {
    const results = await this.db("facts").where({ entity: entityTriplet }).and.whereIn("id", ids).and.whereBetween("timestamp", [
      startDateTime.toISO(),
      endDateTime.toISO()
    ]);
    return lodash.groupBy(results.map((it) => {
      const { namespace, kind, name } = catalogModel.parseEntityRef(it.entity);
      const timestamp = typeof it.timestamp === "string" ? luxon.DateTime.fromISO(it.timestamp) : luxon.DateTime.fromJSDate(it.timestamp);
      return {
        id: it.id,
        entity: { namespace, kind, name },
        timestamp,
        version: it.version,
        facts: JSON.parse(it.facts)
      };
    }), "id");
  }
  async getLatestSchema(id) {
    const existingSchemas = await this.db("fact_schemas").where({ id }).orderBy("id", "desc").select();
    if (existingSchemas.length < 1) {
      this.logger.warn(`No schema found for ${id}. `);
      throw new Error(`No schema found for ${id}. `);
    }
    const sorted = semver.rsort(existingSchemas.map((it) => it.version));
    return existingSchemas.find((it) => it.version === sorted[0]);
  }
  async deleteExpiredFactsByDate(tx, factRows, timestamp) {
    await tx("facts").whereIn(["id", "entity"], factRows.map((it) => [it.id, it.entity])).and.where("timestamp", "<", timestamp.toISO()).delete();
  }
  async deleteExpiredFactsByNumber(tx, factRows, maxItems) {
    const deletables = await tx("facts").whereIn(["id", "entity"], factRows.map((it) => [it.id, it.entity])).and.leftJoin((joinTable) => joinTable.select("*").from(this.db("facts").column({ fid: "id" }, { fentity: "entity" }, { ftimestamp: "timestamp" }).column(this.db.raw("row_number() over (partition by id, entity order by timestamp desc) as fact_rank")).as("ranks")).where("fact_rank", "<=", maxItems).as("filterjoin"), (joinClause) => {
      joinClause.on("filterjoin.fid", "facts.id").on("filterjoin.fentity", "facts.entity").on("filterjoin.ftimestamp", "facts.timestamp");
    }).whereNull("filterjoin.fid");
    await tx("facts").whereIn(["id", "entity", "timestamp"], deletables.map((it) => [it.id, it.entity, it.timestamp])).delete();
  }
  dbFactRowsToTechInsightFacts(rows) {
    return rows.reduce((acc, it) => {
      const { namespace, kind, name } = catalogModel.parseEntityRef(it.entity);
      const timestamp = typeof it.timestamp === "string" ? luxon.DateTime.fromISO(it.timestamp) : luxon.DateTime.fromJSDate(it.timestamp);
      return {
        ...acc,
        [it.id]: {
          id: it.id,
          entity: { namespace, kind, name },
          timestamp,
          version: it.version,
          facts: JSON.parse(it.facts)
        }
      };
    }, {});
  }
}

const migrationsDir = backendCommon.resolvePackagePath("@backstage/plugin-tech-insights-backend", "migrations");
const defaultOptions = {
  logger: backendCommon.getVoidLogger()
};
const initializePersistenceContext = async (knex, options = defaultOptions) => {
  await knex.migrate.latest({
    directory: migrationsDir
  });
  return {
    techInsightsStore: new TechInsightsDatabase(knex, options.logger)
  };
};

const buildTechInsightsContext = async (options) => {
  const {
    factRetrievers,
    factCheckerFactory,
    config,
    discovery,
    database,
    logger,
    scheduler,
    tokenManager
  } = options;
  const factRetrieverRegistry = new FactRetrieverRegistry(factRetrievers);
  const persistenceContext = await initializePersistenceContext(await database.getClient(), { logger });
  const factRetrieverEngine = await FactRetrieverEngine.create({
    scheduler,
    repository: persistenceContext.techInsightsStore,
    factRetrieverRegistry,
    factRetrieverContext: {
      config,
      discovery,
      logger,
      tokenManager
    }
  });
  await factRetrieverEngine.schedule();
  if (factCheckerFactory) {
    const factChecker = factCheckerFactory.construct(persistenceContext.techInsightsStore);
    return {
      persistenceContext,
      factChecker
    };
  }
  return {
    persistenceContext
  };
};

function createFactRetrieverRegistration(options) {
  const { cadence, factRetriever, lifecycle } = options;
  return {
    cadence,
    factRetriever,
    lifecycle
  };
}

const entityOwnershipFactRetriever = {
  id: "entityOwnershipFactRetriever",
  version: "0.0.1",
  entityFilter: [
    { kind: ["component", "domain", "system", "api", "resource", "template"] }
  ],
  schema: {
    hasOwner: {
      type: "boolean",
      description: "The spec.owner field is set"
    },
    hasGroupOwner: {
      type: "boolean",
      description: "The spec.owner field is set and refers to a group"
    }
  },
  handler: async ({
    discovery,
    entityFilter,
    tokenManager
  }) => {
    const { token } = await tokenManager.getToken();
    const catalogClient$1 = new catalogClient.CatalogClient({
      discoveryApi: discovery
    });
    const entities = await catalogClient$1.getEntities({ filter: entityFilter }, { token });
    return entities.items.map((entity) => {
      var _a, _b, _c;
      return {
        entity: {
          namespace: entity.metadata.namespace,
          kind: entity.kind,
          name: entity.metadata.name
        },
        facts: {
          hasOwner: Boolean((_a = entity.spec) == null ? void 0 : _a.owner),
          hasGroupOwner: Boolean(((_b = entity.spec) == null ? void 0 : _b.owner) && !((_c = entity.spec) == null ? void 0 : _c.owner).startsWith("user:"))
        }
      };
    });
  }
};

const entityMetadataFactRetriever = {
  id: "entityMetadataFactRetriever",
  version: "0.0.1",
  schema: {
    hasTitle: {
      type: "boolean",
      description: "The entity has a title in metadata"
    },
    hasDescription: {
      type: "boolean",
      description: "The entity has a description in metadata"
    },
    hasTags: {
      type: "boolean",
      description: "The entity has tags in metadata"
    }
  },
  handler: async ({
    discovery,
    entityFilter,
    tokenManager
  }) => {
    const { token } = await tokenManager.getToken();
    const catalogClient$1 = new catalogClient.CatalogClient({
      discoveryApi: discovery
    });
    const entities = await catalogClient$1.getEntities({ filter: entityFilter }, { token });
    return entities.items.map((entity) => {
      var _a, _b, _c;
      return {
        entity: {
          namespace: entity.metadata.namespace,
          kind: entity.kind,
          name: entity.metadata.name
        },
        facts: {
          hasTitle: Boolean((_a = entity.metadata) == null ? void 0 : _a.title),
          hasDescription: Boolean((_b = entity.metadata) == null ? void 0 : _b.description),
          hasTags: !isEmpty__default["default"]((_c = entity.metadata) == null ? void 0 : _c.tags)
        }
      };
    });
  }
};

const techdocsAnnotation = "backstage.io/techdocs-ref";
const techdocsAnnotationFactName = generateAnnotationFactName(techdocsAnnotation);
const techdocsFactRetriever = {
  id: "techdocsFactRetriever",
  version: "0.0.1",
  schema: {
    [techdocsAnnotationFactName]: {
      type: "boolean",
      description: "The entity has a title in metadata"
    }
  },
  handler: async ({
    discovery,
    entityFilter,
    tokenManager
  }) => {
    const { token } = await tokenManager.getToken();
    const catalogClient$1 = new catalogClient.CatalogClient({
      discoveryApi: discovery
    });
    const entities = await catalogClient$1.getEntities({ filter: entityFilter }, { token });
    return entities.items.map((entity) => {
      return {
        entity: {
          namespace: entity.metadata.namespace,
          kind: entity.kind,
          name: entity.metadata.name
        },
        facts: {
          [techdocsAnnotationFactName]: entityHasAnnotation(entity, techdocsAnnotation)
        }
      };
    });
  }
};

exports.buildTechInsightsContext = buildTechInsightsContext;
exports.createFactRetrieverRegistration = createFactRetrieverRegistration;
exports.createRouter = createRouter;
exports.entityMetadataFactRetriever = entityMetadataFactRetriever;
exports.entityOwnershipFactRetriever = entityOwnershipFactRetriever;
exports.techdocsFactRetriever = techdocsFactRetriever;
//# sourceMappingURL=index.cjs.js.map
