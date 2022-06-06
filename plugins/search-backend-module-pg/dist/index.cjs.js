'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var pluginSearchBackendNode = require('@backstage/plugin-search-backend-node');

async function queryPostgresMajorVersion(knex) {
  if (knex.client.config.client !== "pg") {
    throw new Error("Can't resolve version, not a postgres database");
  }
  const { rows } = await knex.raw("SHOW server_version_num");
  const [result] = rows;
  const version = +result.server_version_num;
  const majorVersion = Math.floor(version / 1e4);
  return majorVersion;
}

const migrationsDir = backendCommon.resolvePackagePath("@backstage/plugin-search-backend-module-pg", "migrations");
class DatabaseDocumentStore {
  constructor(db) {
    this.db = db;
  }
  static async create(knex) {
    try {
      const majorVersion = await queryPostgresMajorVersion(knex);
      if (majorVersion < 12) {
        throw new Error(`The PgSearchEngine requires at least postgres version 12 (but is running on ${majorVersion})`);
      }
    } catch {
      throw new Error("The PgSearchEngine is only supported when using a postgres database (>=12.x)");
    }
    await knex.migrate.latest({
      directory: migrationsDir
    });
    return new DatabaseDocumentStore(knex);
  }
  static async supported(knex) {
    try {
      const majorVersion = await queryPostgresMajorVersion(knex);
      return majorVersion >= 12;
    } catch {
      return false;
    }
  }
  async transaction(fn) {
    return await this.db.transaction(fn);
  }
  async getTransaction() {
    return this.db.transaction();
  }
  async prepareInsert(tx) {
    await tx.raw("CREATE TEMP TABLE documents_to_insert (type text NOT NULL, document jsonb NOT NULL, hash bytea NOT NULL GENERATED ALWAYS AS (sha256(replace(document::text || type, '\\', '\\\\')::bytea)) STORED) ON COMMIT DROP");
  }
  async completeInsert(tx, type) {
    await tx.insert(tx("documents_to_insert").select("type", "document", "hash")).into(tx.raw("documents (type, document, hash)")).onConflict("hash").ignore();
    await tx("documents").where({ type }).whereNotIn("hash", tx("documents_to_insert").select("hash")).delete();
  }
  async insertDocuments(tx, type, documents) {
    await tx("documents_to_insert").insert(documents.map((document) => ({
      type,
      document
    })));
  }
  async query(tx, { types, pgTerm, fields, offset, limit }) {
    const query = tx("documents");
    if (pgTerm) {
      query.from(tx.raw("documents, to_tsquery('english', ?) query", pgTerm)).whereRaw("query @@ body");
    } else {
      query.from("documents");
    }
    if (types) {
      query.whereIn("type", types);
    }
    if (fields) {
      Object.keys(fields).forEach((key) => {
        const value = fields[key];
        const valueArray = Array.isArray(value) ? value : [value];
        const valueCompare = valueArray.map((v) => ({ [key]: v })).map((v) => JSON.stringify(v));
        query.whereRaw(`(${valueCompare.map(() => "document @> ?").join(" OR ")})`, valueCompare);
      });
    }
    query.select("type", "document");
    if (pgTerm) {
      query.select(tx.raw('ts_rank_cd(body, query) AS "rank"')).orderBy("rank", "desc");
    } else {
      query.select(tx.raw("1 as rank"));
    }
    return await query.offset(offset).limit(limit);
  }
}

class PgSearchEngineIndexer extends pluginSearchBackendNode.BatchSearchEngineIndexer {
  constructor(options) {
    super({ batchSize: options.batchSize });
    this.store = options.databaseStore;
    this.type = options.type;
  }
  async initialize() {
    this.tx = await this.store.getTransaction();
    try {
      await this.store.prepareInsert(this.tx);
    } catch (e) {
      this.tx.rollback(e);
      throw e;
    }
  }
  async index(documents) {
    try {
      await this.store.insertDocuments(this.tx, this.type, documents);
    } catch (e) {
      this.tx.rollback(e);
      throw e;
    }
  }
  async finalize() {
    try {
      await this.store.completeInsert(this.tx, this.type);
      this.tx.commit();
    } catch (e) {
      this.tx.rollback(e);
      throw e;
    }
  }
}

class PgSearchEngine {
  constructor(databaseStore) {
    this.databaseStore = databaseStore;
  }
  static async from(options) {
    return new PgSearchEngine(await DatabaseDocumentStore.create(await options.database.getClient()));
  }
  static async supported(database) {
    return await DatabaseDocumentStore.supported(await database.getClient());
  }
  translator(query) {
    const pageSize = 25;
    const { page } = decodePageCursor(query.pageCursor);
    const offset = page * pageSize;
    const limit = pageSize + 1;
    return {
      pgQuery: {
        pgTerm: query.term.split(/\s/).map((p) => p.replace(/[\0()|&:*!]/g, "").trim()).filter((p) => p !== "").map((p) => `(${JSON.stringify(p)} | ${JSON.stringify(p)}:*)`).join("&"),
        fields: query.filters,
        types: query.types,
        offset,
        limit
      },
      pageSize
    };
  }
  setTranslator(translator) {
    this.translator = translator;
  }
  async getIndexer(type) {
    return new PgSearchEngineIndexer({
      batchSize: 1e3,
      type,
      databaseStore: this.databaseStore
    });
  }
  async query(query) {
    const { pgQuery, pageSize } = this.translator(query);
    const rows = await this.databaseStore.transaction(async (tx) => this.databaseStore.query(tx, pgQuery));
    const { page } = decodePageCursor(query.pageCursor);
    const hasNextPage = rows.length > pageSize;
    const hasPreviousPage = page > 0;
    const pageRows = rows.slice(0, pageSize);
    const nextPageCursor = hasNextPage ? encodePageCursor({ page: page + 1 }) : void 0;
    const previousPageCursor = hasPreviousPage ? encodePageCursor({ page: page - 1 }) : void 0;
    const results = pageRows.map(({ type, document }) => ({
      type,
      document
    }));
    return { results, nextPageCursor, previousPageCursor };
  }
}
function decodePageCursor(pageCursor) {
  if (!pageCursor) {
    return { page: 0 };
  }
  return {
    page: Number(Buffer.from(pageCursor, "base64").toString("utf-8"))
  };
}
function encodePageCursor({ page }) {
  return Buffer.from(`${page}`, "utf-8").toString("base64");
}

exports.DatabaseDocumentStore = DatabaseDocumentStore;
exports.PgSearchEngine = PgSearchEngine;
//# sourceMappingURL=index.cjs.js.map
