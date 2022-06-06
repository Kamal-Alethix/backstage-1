'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var camelcaseKeys = require('camelcase-keys');
var fetch = require('node-fetch');
var express = require('express');
var Router = require('express-promise-router');
var backendCommon = require('@backstage/backend-common');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var camelcaseKeys__default = /*#__PURE__*/_interopDefaultLegacy(camelcaseKeys);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

const buildQuery = (obj) => {
  return Object.entries(obj).map((pair) => pair.map(encodeURIComponent).join("=")).join("&");
};

const baseUrl = "https://api.rollbar.com/api/1";
const buildUrl = (url) => `${baseUrl}${url}`;
class RollbarApi {
  constructor(accessToken, logger) {
    this.accessToken = accessToken;
    this.logger = logger;
  }
  async getAllProjects() {
    return this.get("/projects").then((projects) => projects.filter((p) => p.name));
  }
  async getProject(projectName) {
    return this.getForProject(`/project/:projectId`, projectName, false);
  }
  async getProjectItems(projectName) {
    return this.getForProject(`/items`, projectName, true);
  }
  async getTopActiveItems(projectName, options = {
    hours: 24,
    environment: "production"
  }) {
    return this.getForProject(`/reports/top_active_items?${buildQuery(options)}`, projectName);
  }
  async getOccuranceCounts(projectName, options = {
    environment: "production"
  }) {
    return this.getForProject(`/reports/occurrence_counts?${buildQuery(options)}`, projectName);
  }
  async getActivatedCounts(projectName, options = {
    environment: "production"
  }) {
    return this.getForProject(`/reports/activated_counts?${buildQuery(options)}`, projectName);
  }
  async getProjectAccessTokens(projectId) {
    return this.get(`/project/${projectId}/access_tokens`);
  }
  async get(url, accessToken) {
    const fullUrl = buildUrl(url);
    if (this.logger) {
      this.logger.info(`Calling Rollbar REST API, ${fullUrl}`);
    }
    return fetch__default["default"](fullUrl, getRequestHeaders(accessToken || this.accessToken || "")).then((response) => response.json()).then((json) => camelcaseKeys__default["default"](json == null ? void 0 : json.result, { deep: true }));
  }
  async getForProject(url, projectName, useProjectToken = true) {
    const project = await this.getProjectMetadata(projectName);
    const resolvedUrl = url.replace(":projectId", project.id.toString());
    return this.get(resolvedUrl, useProjectToken ? project.accessToken : "");
  }
  async getProjectMetadata(name) {
    const projectMap = await this.getProjectMap();
    const project = projectMap[name];
    if (!project) {
      throw Error(`Invalid project: '${name}'`);
    }
    if (!project.accessToken) {
      const tokens = await this.getProjectAccessTokens(project.id);
      const token = tokens.find((t) => t.scopes.includes("read"));
      project.accessToken = token ? token.accessToken : void 0;
    }
    if (!project.accessToken) {
      throw Error(`Could not find project read access token for '${name}'`);
    }
    return project;
  }
  async getProjectMap() {
    if (this.projectMap) {
      return this.projectMap;
    }
    const projects = await this.getAllProjects();
    this.projectMap = projects.reduce((accum, i) => {
      accum[i.name] = { id: i.id, name: i.name };
      return accum;
    }, {});
    return this.projectMap;
  }
}
function getRequestHeaders(token) {
  return {
    headers: {
      "X-Rollbar-Access-Token": `${token}`
    }
  };
}

async function createRouter(options) {
  const router = Router__default["default"]();
  const logger = options.logger.child({ plugin: "rollbar" });
  const config = options.config.getConfig("rollbar");
  const accessToken = !options.rollbarApi ? getRollbarAccountToken(config, logger) : "";
  if (options.rollbarApi || accessToken) {
    const rollbarApi = options.rollbarApi || new RollbarApi(accessToken, logger);
    router.use(express__default["default"].json());
    router.get("/projects", async (_req, res) => {
      const projects = await rollbarApi.getAllProjects();
      res.status(200).header("").send(projects);
    });
    router.get("/projects/:id", async (req, res) => {
      const { id } = req.params;
      const projects = await rollbarApi.getProject(id);
      res.status(200).send(projects);
    });
    router.get("/projects/:id/items", async (req, res) => {
      const { id } = req.params;
      const projects = await rollbarApi.getProjectItems(id);
      res.status(200).send(projects);
    });
    router.get("/projects/:id/top_active_items", async (req, res) => {
      const { id } = req.params;
      const query = req.query;
      const items = await rollbarApi.getTopActiveItems(id, query);
      res.status(200).send(items);
    });
    router.get("/projects/:id/occurance_counts", async (req, res) => {
      const { id } = req.params;
      const query = req.query;
      const items = await rollbarApi.getOccuranceCounts(id, query);
      res.status(200).send(items);
    });
    router.get("/projects/:id/activated_item_counts", async (req, res) => {
      const { id } = req.params;
      const query = req.query;
      const items = await rollbarApi.getActivatedCounts(id, query);
      res.status(200).send(items);
    });
  }
  router.use(backendCommon.errorHandler());
  return router;
}
function getRollbarAccountToken(config, logger) {
  const token = config.getOptionalString("accountToken") || process.env.ROLLBAR_ACCOUNT_TOKEN || "";
  if (!token) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("The rollbar.accountToken must be provided in config to start the API.");
    }
    logger.warn("Failed to initialize rollbar backend, set rollbar.accountToken in config to start the API.");
  }
  return token;
}

exports.RollbarApi = RollbarApi;
exports.createRouter = createRouter;
exports.getRequestHeaders = getRequestHeaders;
//# sourceMappingURL=index.cjs.js.map
