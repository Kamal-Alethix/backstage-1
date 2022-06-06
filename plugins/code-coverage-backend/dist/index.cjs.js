'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var express = require('express');
var Router = require('express-promise-router');
var xmlparser = require('express-xml-bodyparser');
var catalogClient = require('@backstage/catalog-client');
var backendCommon = require('@backstage/backend-common');
var errors = require('@backstage/errors');
var integration = require('@backstage/integration');
var catalogModel = require('@backstage/catalog-model');
var uuid = require('uuid');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var xmlparser__default = /*#__PURE__*/_interopDefaultLegacy(xmlparser);

const calculatePercentage = (available, covered) => {
  if (available === 0) {
    return 0;
  }
  return parseFloat((covered / available * 100).toFixed(2));
};
const aggregateCoverage = (c) => {
  let availableLine = 0;
  let coveredLine = 0;
  let availableBranch = 0;
  let coveredBranch = 0;
  c.files.forEach((f) => {
    availableLine += Object.keys(f.lineHits).length;
    coveredLine += Object.values(f.lineHits).filter((l) => l > 0).length;
    availableBranch += Object.keys(f.branchHits).map((b) => parseInt(b, 10)).map((b) => f.branchHits[b].available).filter(Boolean).reduce((acc, curr) => acc + curr, 0);
    coveredBranch += Object.keys(f.branchHits).map((b) => parseInt(b, 10)).map((b) => f.branchHits[b].covered).filter(Boolean).reduce((acc, curr) => acc + curr, 0);
  });
  return {
    timestamp: c.metadata.generationTime,
    branch: {
      available: availableBranch,
      covered: coveredBranch,
      missed: availableBranch - coveredBranch,
      percentage: calculatePercentage(availableBranch, coveredBranch)
    },
    line: {
      available: availableLine,
      covered: coveredLine,
      missed: availableLine - coveredLine,
      percentage: calculatePercentage(availableLine, coveredLine)
    }
  };
};
class CoverageUtils {
  constructor(scm, urlReader) {
    this.scm = scm;
    this.urlReader = urlReader;
  }
  async processCoveragePayload(entity, req) {
    var _a, _b, _c, _d, _e;
    const enforceScmFiles = ((_a = entity.metadata.annotations) == null ? void 0 : _a["backstage.io/code-coverage"]) === "scm-only" || false;
    let sourceLocation = void 0;
    let vcs = void 0;
    let scmFiles = [];
    if (enforceScmFiles) {
      try {
        const sl = catalogModel.getEntitySourceLocation(entity);
        sourceLocation = sl.target;
      } catch (e) {
      }
      if (!sourceLocation) {
        throw new errors.InputError(`No "backstage.io/source-location" annotation on entity ${catalogModel.stringifyEntityRef(entity)}`);
      }
      vcs = (_c = (_b = this.scm).byUrl) == null ? void 0 : _c.call(_b, sourceLocation);
      if (!vcs) {
        throw new errors.InputError(`Unable to determine SCM from ${sourceLocation}`);
      }
      const scmTree = await ((_e = (_d = this.urlReader).readTree) == null ? void 0 : _e.call(_d, sourceLocation));
      if (!scmTree) {
        throw new errors.NotFoundError(`Unable to read tree from ${sourceLocation}`);
      }
      scmFiles = (await scmTree.files()).map((f) => f.path);
    }
    const body = this.validateRequestBody(req);
    if (Object.keys(body).length === 0) {
      throw new errors.InputError("Unable to parse body");
    }
    return {
      sourceLocation,
      vcs,
      scmFiles,
      body
    };
  }
  async buildCoverage(entity, sourceLocation, vcs, files) {
    return {
      metadata: {
        vcs: {
          type: (vcs == null ? void 0 : vcs.type) || "unknown",
          location: sourceLocation || "unknown"
        },
        generationTime: Date.now()
      },
      entity: {
        name: entity.metadata.name,
        namespace: entity.metadata.namespace || "default",
        kind: entity.kind
      },
      files
    };
  }
  validateRequestBody(req) {
    const contentType = req.headers["content-type"];
    if (!contentType) {
      throw new errors.InputError("Content-Type missing");
    } else if (!contentType.match(/^text\/xml($|;)/)) {
      throw new errors.InputError("Illegal Content-Type");
    }
    const body = req.body;
    if (!body) {
      throw new errors.InputError("Missing request body");
    }
    return body;
  }
}

const migrationsDir = backendCommon.resolvePackagePath("@backstage/plugin-code-coverage-backend", "migrations");
class CodeCoverageDatabase {
  constructor(db) {
    this.db = db;
  }
  static async create(knex) {
    await knex.migrate.latest({
      directory: migrationsDir
    });
    return new CodeCoverageDatabase(knex);
  }
  async insertCodeCoverage(coverage) {
    const codeCoverageId = uuid.v4();
    const entity = catalogModel.stringifyEntityRef({
      kind: coverage.entity.kind,
      namespace: coverage.entity.namespace,
      name: coverage.entity.name
    });
    await this.db("code_coverage").insert({
      id: codeCoverageId,
      entity,
      coverage: JSON.stringify(coverage)
    });
    return { codeCoverageId };
  }
  async getCodeCoverage(entity) {
    const [result] = await this.db("code_coverage").where({ entity }).orderBy("index", "desc").limit(1).select();
    if (!result) {
      throw new errors.NotFoundError(`No coverage for entity '${JSON.stringify(entity)}' found`);
    }
    try {
      return JSON.parse(result.coverage);
    } catch (error) {
      throw new Error(`Failed to parse coverage for '${entity}', ${error}`);
    }
  }
  async getHistory(entity, limit) {
    const res = await this.db("code_coverage").where({ entity }).orderBy("index", "desc").limit(limit).select();
    const history = res.map((r) => JSON.parse(r.coverage)).map((c) => aggregateCoverage(c));
    const entityName = catalogModel.parseEntityRef(entity);
    return {
      entity: {
        name: entityName.name,
        kind: entityName.kind,
        namespace: entityName.namespace
      },
      history
    };
  }
}

class Cobertura {
  constructor(logger) {
    this.logger = logger;
    this.logger = logger;
  }
  convert(xml, scmFiles) {
    var _a, _b;
    const ppc = (_a = xml.coverage.packages) == null ? void 0 : _a.flatMap((p) => p.package).filter(Boolean).flatMap((p) => p.classes);
    const pc = (_b = xml.coverage.package) == null ? void 0 : _b.filter(Boolean).flatMap((p) => p.classes);
    const classes = [ppc, pc].flat().filter(Boolean).flatMap((c) => c.class).filter(Boolean);
    const jscov = [];
    classes.forEach((c) => {
      const packageAndFilename = c.$.filename;
      const lines = this.extractLines(c);
      const lineHits = {};
      const branchHits = {};
      lines.forEach((l) => {
        if (!lineHits[l.number]) {
          lineHits[l.number] = 0;
        }
        lineHits[l.number] += l.hits;
        if (l.branch && l["condition-coverage"]) {
          const bh = this.parseBranch(l["condition-coverage"]);
          if (bh) {
            branchHits[l.number] = bh;
          }
        }
      });
      const currentFile = scmFiles.map((f) => f.trimEnd()).find((f) => f.endsWith(packageAndFilename));
      this.logger.debug(`matched ${packageAndFilename} to ${currentFile}`);
      if (scmFiles.length === 0 || Object.keys(lineHits).length > 0 && currentFile) {
        jscov.push({
          filename: currentFile || packageAndFilename,
          branchHits,
          lineHits
        });
      }
    });
    return jscov;
  }
  parseBranch(condition) {
    const pattern = /[0-9\.]+\%\s\(([0-9]+)\/([0-9]+)\)/;
    const match = condition.match(pattern);
    if (!match) {
      return null;
    }
    const covered = parseInt(match[1], 10);
    const available = parseInt(match[2], 10);
    return {
      covered,
      missed: available - covered,
      available
    };
  }
  extractLines(clz) {
    var _a;
    const classLines = clz.lines.flatMap((l) => l.line);
    const methodLines = (_a = clz.methods) == null ? void 0 : _a.flatMap((m) => m.method).filter(Boolean).flatMap((m) => m.lines).filter(Boolean).flatMap((l) => l.line);
    const lines = [classLines, methodLines].flat().filter(Boolean);
    const lineHits = lines.map((l) => {
      return {
        number: parseInt(l.$.number, 10),
        hits: parseInt(l.$.hits, 10),
        "condition-coverage": l.$["condition-coverage"],
        branch: l.$.branch
      };
    });
    return lineHits;
  }
}

class Jacoco {
  constructor(logger) {
    this.logger = logger;
    this.logger = logger;
  }
  convert(xml, scmFiles) {
    const jscov = [];
    xml.report.package.forEach((r) => {
      const packageName = r.$.name;
      r.sourcefile.forEach((sf) => {
        const fileName = sf.$.name;
        const lines = this.extractLines(sf);
        const lineHits = {};
        const branchHits = {};
        lines.forEach((l) => {
          if (!lineHits[l.number]) {
            lineHits[l.number] = 0;
          }
          lineHits[l.number] += l.covered_instructions;
          const ab = l.covered_branches + l.missed_branches;
          if (ab > 0) {
            branchHits[l.number] = {
              covered: l.covered_branches,
              missed: l.missed_branches,
              available: ab
            };
          }
        });
        const packageAndFilename = `${packageName}/${fileName}`;
        const currentFile = scmFiles.map((f) => f.trimEnd()).find((f) => f.endsWith(packageAndFilename));
        this.logger.debug(`matched ${packageAndFilename} to ${currentFile}`);
        if (Object.keys(lineHits).length > 0 && currentFile) {
          jscov.push({
            filename: currentFile,
            branchHits,
            lineHits
          });
        }
      });
    });
    return jscov;
  }
  extractLines(sourcefile) {
    var _a;
    const parsed = [];
    (_a = sourcefile.line) == null ? void 0 : _a.forEach((l) => {
      parsed.push({
        number: parseInt(l.$.nr, 10),
        missed_instructions: parseInt(l.$.mi, 10),
        covered_instructions: parseInt(l.$.ci, 10),
        missed_branches: parseInt(l.$.mb, 10),
        covered_branches: parseInt(l.$.cb, 10)
      });
    });
    return parsed;
  }
}

const makeRouter = async (options) => {
  const { config, logger, discovery, database, urlReader } = options;
  const codeCoverageDatabase = await CodeCoverageDatabase.create(await database.getClient());
  const codecovUrl = await discovery.getExternalBaseUrl("code-coverage");
  const catalogApi = new catalogClient.CatalogClient({ discoveryApi: discovery });
  const scm = integration.ScmIntegrations.fromConfig(config);
  const router = Router__default["default"]();
  router.use(xmlparser__default["default"]());
  router.use(express__default["default"].json());
  const utils = new CoverageUtils(scm, urlReader);
  router.get("/health", async (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  router.get("/report", async (req, res) => {
    const { entity } = req.query;
    const entityLookup = await catalogApi.getEntityByRef(entity);
    if (!entityLookup) {
      throw new errors.NotFoundError(`No entity found matching ${entity}`);
    }
    const stored = await codeCoverageDatabase.getCodeCoverage(entity);
    const aggregate = aggregateCoverage(stored);
    res.status(200).json({
      ...stored,
      aggregate: {
        line: aggregate.line,
        branch: aggregate.branch
      }
    });
  });
  router.get("/history", async (req, res) => {
    const { entity } = req.query;
    const entityLookup = await catalogApi.getEntityByRef(entity);
    if (!entityLookup) {
      throw new errors.NotFoundError(`No entity found matching ${entity}`);
    }
    const { limit } = req.query;
    const history = await codeCoverageDatabase.getHistory(entity, parseInt((limit == null ? void 0 : limit.toString()) || "10", 10));
    res.status(200).json(history);
  });
  router.get("/file-content", async (req, res) => {
    const { entity, path } = req.query;
    const entityLookup = await catalogApi.getEntityByRef(entity);
    if (!entityLookup) {
      throw new errors.NotFoundError(`No entity found matching ${entity}`);
    }
    if (!path) {
      throw new errors.InputError("Need path query parameter");
    }
    const sourceLocation = catalogModel.getEntitySourceLocation(entityLookup);
    if (!sourceLocation) {
      throw new errors.InputError(`No "backstage.io/source-location" annotation on entity ${entity}`);
    }
    const vcs = scm.byUrl(sourceLocation.target);
    if (!vcs) {
      throw new errors.InputError(`Unable to determine SCM from ${sourceLocation}`);
    }
    const scmTree = await urlReader.readTree(sourceLocation.target);
    const scmFile = (await scmTree.files()).find((f) => f.path === path);
    if (!scmFile) {
      res.status(404).json({
        message: "Couldn't find file in SCM",
        file: path,
        scm: vcs.title
      });
      return;
    }
    const content = await (scmFile == null ? void 0 : scmFile.content());
    if (!content) {
      res.status(400).json({
        message: "Couldn't process content of file in SCM",
        file: path,
        scm: vcs.title
      });
      return;
    }
    const data = content.toString();
    res.status(200).contentType("text/plain").send(data);
  });
  router.post("/report", async (req, res) => {
    const { entity, coverageType } = req.query;
    const entityLookup = await catalogApi.getEntityByRef(entity);
    if (!entityLookup) {
      throw new errors.NotFoundError(`No entity found matching ${entity}`);
    }
    let converter;
    if (!coverageType) {
      throw new errors.InputError("Need coverageType query parameter");
    } else if (coverageType === "jacoco") {
      converter = new Jacoco(logger);
    } else if (coverageType === "cobertura") {
      converter = new Cobertura(logger);
    } else {
      throw new errors.InputError(`Unsupported coverage type '${coverageType}`);
    }
    const { sourceLocation, vcs, scmFiles, body } = await utils.processCoveragePayload(entityLookup, req);
    const files = converter.convert(body, scmFiles);
    if (!files || files.length === 0) {
      throw new errors.InputError(`Unable to parse body as ${coverageType}`);
    }
    const coverage = await utils.buildCoverage(entityLookup, sourceLocation, vcs, files);
    await codeCoverageDatabase.insertCodeCoverage(coverage);
    res.status(201).json({
      links: [
        {
          rel: "coverage",
          href: `${codecovUrl}/report?entity=${entity}`
        }
      ]
    });
  });
  router.use(backendCommon.errorHandler());
  return router;
};
async function createRouter(options) {
  const logger = options.logger;
  logger.info("Initializing Code Coverage backend");
  return makeRouter(options);
}

exports.createRouter = createRouter;
exports.makeRouter = makeRouter;
//# sourceMappingURL=index.cjs.js.map
