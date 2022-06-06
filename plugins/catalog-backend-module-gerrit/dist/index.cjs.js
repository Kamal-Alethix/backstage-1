'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var errors = require('@backstage/errors');
var pluginCatalogBackend = require('@backstage/plugin-catalog-backend');
var fetch = require('node-fetch');
var integration = require('@backstage/integration');
var uuid = require('uuid');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var uuid__namespace = /*#__PURE__*/_interopNamespace(uuid);

function readGerritConfig(id, config) {
  var _a;
  const branch = (_a = config.getOptionalString("branch")) != null ? _a : "master";
  const host = config.getString("host");
  const query = config.getString("query");
  return {
    branch,
    host,
    id,
    query
  };
}
function readGerritConfigs(config) {
  const configs = [];
  const providerConfigs = config.getOptionalConfig("catalog.providers.gerrit");
  if (!providerConfigs) {
    return configs;
  }
  for (const id of providerConfigs.keys()) {
    configs.push(readGerritConfig(id, providerConfigs.getConfig(id)));
  }
  return configs;
}

class GerritEntityProvider {
  static fromConfig(configRoot, options) {
    const providerConfigs = readGerritConfigs(configRoot);
    const integrations = integration.ScmIntegrations.fromConfig(configRoot).gerrit;
    const providers = [];
    providerConfigs.forEach((providerConfig) => {
      const integration = integrations.byHost(providerConfig.host);
      if (!integration) {
        throw new errors.InputError(`No gerrit integration found that matches host ${providerConfig.host}`);
      }
      providers.push(new GerritEntityProvider(providerConfig, integration, options.logger, options.schedule));
    });
    return providers;
  }
  constructor(config, integration, logger, schedule) {
    this.config = config;
    this.integration = integration;
    this.logger = logger.child({
      target: this.getProviderName()
    });
    this.scheduleFn = this.createScheduleFn(schedule);
  }
  getProviderName() {
    return `gerrit-provider:${this.config.id}`;
  }
  async connect(connection) {
    this.connection = connection;
    await this.scheduleFn();
  }
  createScheduleFn(schedule) {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: GerritEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid__namespace.v4()
          });
          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(error);
          }
        }
      });
    };
  }
  async refresh(logger) {
    if (!this.connection) {
      throw new Error("Gerrit discovery connection not initialized");
    }
    let response;
    const baseProjectApiUrl = integration.getGerritProjectsApiUrl(this.integration.config);
    const projectQueryUrl = `${baseProjectApiUrl}?${this.config.query}`;
    try {
      response = await fetch__default["default"](projectQueryUrl, {
        method: "GET",
        ...integration.getGerritRequestOptions(this.integration.config)
      });
    } catch (e) {
      throw new Error(`Failed to list Gerrit projects for query ${this.config.query}, ${e}`);
    }
    const gerritProjectsResponse = await integration.parseGerritJsonResponse(response);
    const projects = Object.keys(gerritProjectsResponse);
    const locations = projects.map((project) => this.createLocationSpec(project));
    await this.connection.applyMutation({
      type: "full",
      entities: locations.map((location) => ({
        locationKey: this.getProviderName(),
        entity: pluginCatalogBackend.locationSpecToLocationEntity({ location })
      }))
    });
    logger.info(`Found ${locations.length} locations.`);
  }
  createLocationSpec(project) {
    return {
      type: "url",
      target: `${this.integration.config.gitilesBaseUrl}/${project}/+/refs/heads/${this.config.branch}/catalog-info.yaml`,
      presence: "optional"
    };
  }
}

exports.GerritEntityProvider = GerritEntityProvider;
//# sourceMappingURL=index.cjs.js.map
