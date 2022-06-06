'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var express = require('express');
var Router = require('express-promise-router');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

const migrationsDir = backendCommon.resolvePackagePath("@backstage/plugin-bazaar-backend", "migrations");
class DatabaseHandler {
  constructor(options) {
    this.columns = [
      "metadata.id",
      "metadata.entity_ref",
      "metadata.name",
      "metadata.description",
      "metadata.status",
      "metadata.updated_at",
      "metadata.community",
      "metadata.size",
      "metadata.start_date",
      "metadata.end_date",
      "metadata.responsible"
    ];
    this.database = options.database;
  }
  static async create(options) {
    const { database } = options;
    await database.migrate.latest({
      directory: migrationsDir
    });
    return new DatabaseHandler(options);
  }
  async getMembers(id) {
    return await this.database.select("*").from("members").where({ item_id: id });
  }
  async addMember(id, userId, picture) {
    await this.database.insert({
      item_id: id,
      user_id: userId,
      picture
    }).into("members");
  }
  async deleteMember(id, userId) {
    return await this.database("members").where({ item_id: id }).andWhere("user_id", userId).del();
  }
  async getMetadataById(id) {
    const coalesce = this.database.raw("coalesce(count(members.item_id), 0) as members_count");
    return await this.database("metadata").select([...this.columns, coalesce]).where({ "metadata.id": id }).groupBy(this.columns).leftJoin("members", "metadata.id", "=", "members.item_id");
  }
  async getMetadataByRef(entityRef) {
    const coalesce = this.database.raw("coalesce(count(members.item_id), 0) as members_count");
    return await this.database("metadata").select([...this.columns, coalesce]).where({ "metadata.entity_ref": entityRef }).groupBy(this.columns).leftJoin("members", "metadata.id", "=", "members.item_id");
  }
  async insertMetadata(bazaarProject) {
    const {
      name,
      entityRef,
      community,
      description,
      status,
      size,
      startDate,
      endDate,
      responsible
    } = bazaarProject;
    await this.database.insert({
      name,
      entity_ref: entityRef,
      community,
      description,
      status,
      updated_at: new Date().toISOString(),
      size,
      start_date: startDate,
      end_date: endDate,
      responsible
    }).into("metadata");
  }
  async updateMetadata(bazaarProject) {
    const {
      name,
      id,
      entityRef,
      community,
      description,
      status,
      size,
      startDate,
      endDate,
      responsible
    } = bazaarProject;
    return await this.database("metadata").where({ id }).update({
      name,
      entity_ref: entityRef,
      description,
      community,
      status,
      updated_at: new Date().toISOString(),
      size,
      start_date: startDate,
      end_date: endDate,
      responsible
    });
  }
  async deleteMetadata(id) {
    return await this.database("metadata").where({ id }).del();
  }
  async getProjects() {
    const coalesce = this.database.raw("coalesce(count(members.item_id), 0) as members_count");
    return await this.database("metadata").select([...this.columns, coalesce]).groupBy(this.columns).leftJoin("members", "metadata.id", "=", "members.item_id");
  }
}

async function createRouter(options) {
  const { logger, database } = options;
  const db = await database.getClient();
  const dbHandler = await DatabaseHandler.create({ database: db });
  logger.info("Initializing Bazaar backend");
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/projects/:id/members", async (request, response) => {
    const members = await dbHandler.getMembers(request.params.id);
    if (members == null ? void 0 : members.length) {
      response.json({ status: "ok", data: members });
    } else {
      response.json({ status: "ok", data: [] });
    }
  });
  router.put("/projects/:id/member/:userId", async (request, response) => {
    var _a;
    const { id, userId } = request.params;
    await dbHandler.addMember(parseInt(id, 10), userId, (_a = request.body) == null ? void 0 : _a.picture);
    response.json({ status: "ok" });
  });
  router.delete("/projects/:id/member/:userId", async (request, response) => {
    const { id, userId } = request.params;
    const count = await dbHandler.deleteMember(parseInt(id, 10), userId);
    if (count) {
      response.json({ status: "ok" });
    } else {
      response.status(404).json({ message: "Record not found" });
    }
  });
  router.get("/projects/:idOrRef", async (request, response) => {
    const idOrRef = decodeURIComponent(request.params.idOrRef);
    let data;
    if (/^-?\d+$/.test(idOrRef)) {
      data = await dbHandler.getMetadataById(parseInt(idOrRef, 10));
    } else {
      data = await dbHandler.getMetadataByRef(idOrRef);
    }
    response.json({ status: "ok", data });
  });
  router.get("/projects", async (_, response) => {
    const data = await dbHandler.getProjects();
    response.json({ status: "ok", data });
  });
  router.put("/projects", async (request, response) => {
    const bazaarProject = request.body;
    const count = await dbHandler.updateMetadata(bazaarProject);
    if (count) {
      response.json({ status: "ok" });
    }
  });
  router.post("/projects", async (request, response) => {
    const bazaarProject = request.body;
    await dbHandler.insertMetadata(bazaarProject);
    response.json({ status: "ok" });
  });
  router.delete("/projects/:id", async (request, response) => {
    const id = decodeURIComponent(request.params.id);
    const count = await dbHandler.deleteMetadata(parseInt(id, 10));
    if (count) {
      response.json({ status: "ok" });
    } else {
      response.status(404).json({ message: "Record not found" });
    }
  });
  router.use(backendCommon.errorHandler());
  return router;
}

exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
