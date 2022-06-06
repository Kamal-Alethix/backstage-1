'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var integration = require('@backstage/integration');
var pluginCatalogBackend = require('@backstage/plugin-catalog-backend');
var fetch = require('node-fetch');
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

const isCloud = (host) => host === "dev.azure.com";
const PAGE_SIZE = 1e3;
async function codeSearch(azureConfig, org, project, repo, path) {
  const searchBaseUrl = isCloud(azureConfig.host) ? "https://almsearch.dev.azure.com" : `https://${azureConfig.host}`;
  const searchUrl = `${searchBaseUrl}/${org}/${project}/_apis/search/codesearchresults?api-version=6.0-preview.1`;
  let items = [];
  let hasMorePages = true;
  do {
    const response = await fetch__default["default"](searchUrl, {
      ...integration.getAzureRequestOptions(azureConfig, {
        "Content-Type": "application/json"
      }),
      method: "POST",
      body: JSON.stringify({
        searchText: `path:${path} repo:${repo || "*"}`,
        $skip: items.length,
        $top: PAGE_SIZE
      })
    });
    if (response.status !== 200) {
      throw new Error(`Azure DevOps search failed with response status ${response.status}`);
    }
    const body = await response.json();
    items = [...items, ...body.results];
    hasMorePages = body.count > items.length;
  } while (hasMorePages);
  return items;
}

class AzureDevOpsDiscoveryProcessor {
  static fromConfig(config, options) {
    const integrations = integration.ScmIntegrations.fromConfig(config);
    return new AzureDevOpsDiscoveryProcessor({
      ...options,
      integrations
    });
  }
  constructor(options) {
    this.integrations = options.integrations;
    this.logger = options.logger;
  }
  getProcessorName() {
    return "AzureDevOpsDiscoveryProcessor";
  }
  async readLocation(location, _optional, emit) {
    var _a;
    if (location.type !== "azure-discovery") {
      return false;
    }
    const azureConfig = (_a = this.integrations.azure.byUrl(location.target)) == null ? void 0 : _a.config;
    if (!azureConfig) {
      throw new Error(`There is no Azure integration that matches ${location.target}. Please add a configuration entry for it under integrations.azure`);
    }
    const { baseUrl, org, project, repo, catalogPath } = parseUrl(location.target);
    this.logger.info(`Reading Azure DevOps repositories from ${location.target}`);
    const files = await codeSearch(azureConfig, org, project, repo, catalogPath);
    this.logger.debug(`Found ${files.length} files in Azure DevOps from ${location.target}.`);
    for (const file of files) {
      emit(pluginCatalogBackend.processingResult.location({
        type: "url",
        target: `${baseUrl}/${org}/${project}/_git/${file.repository.name}?path=${file.path}`,
        presence: "optional"
      }));
    }
    return true;
  }
}
function parseUrl(urlString) {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split("/");
  const catalogPath = url.searchParams.get("path") || "/catalog-info.yaml";
  if (path.length === 2 && path[0].length && path[1].length) {
    return {
      baseUrl: url.origin,
      org: decodeURIComponent(path[0]),
      project: decodeURIComponent(path[1]),
      repo: "",
      catalogPath
    };
  } else if (path.length === 4 && path[0].length && path[1].length && path[2].length && path[3].length) {
    return {
      baseUrl: url.origin,
      org: decodeURIComponent(path[0]),
      project: decodeURIComponent(path[1]),
      repo: decodeURIComponent(path[3]),
      catalogPath
    };
  }
  throw new Error(`Failed to parse ${urlString}`);
}

function readAzureDevOpsConfigs(config) {
  const configs = [];
  const providerConfigs = config.getOptionalConfig("catalog.providers.azureDevOps");
  if (!providerConfigs) {
    return configs;
  }
  for (const id of providerConfigs.keys()) {
    configs.push(readAzureDevOpsConfig(id, providerConfigs.getConfig(id)));
  }
  return configs;
}
function readAzureDevOpsConfig(id, config) {
  const organization = config.getString("organization");
  const project = config.getString("project");
  const host = config.getOptionalString("host") || "dev.azure.com";
  const repository = config.getOptionalString("repository") || "*";
  const path = config.getOptionalString("path") || "/catalog-info.yaml";
  return {
    id,
    host,
    organization,
    project,
    repository,
    path
  };
}

class AzureDevOpsEntityProvider {
  constructor(config, integration, logger, schedule) {
    this.config = config;
    this.integration = integration;
    this.logger = logger.child({
      target: this.getProviderName()
    });
    this.scheduleFn = this.createScheduleFn(schedule);
  }
  static fromConfig(configRoot, options) {
    const providerConfigs = readAzureDevOpsConfigs(configRoot);
    return providerConfigs.map((providerConfig) => {
      const integration$1 = integration.ScmIntegrations.fromConfig(configRoot).azure.byHost(providerConfig.host);
      if (!integration$1) {
        throw new Error(`There is no Azure integration for host ${providerConfig.host}. Please add a configuration entry for it under integrations.azure`);
      }
      return new AzureDevOpsEntityProvider(providerConfig, integration$1, options.logger, options.schedule);
    });
  }
  createScheduleFn(schedule) {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: AzureDevOpsEntityProvider.prototype.constructor.name,
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
  getProviderName() {
    return `AzureDevOpsEntityProvider:${this.config.id}`;
  }
  async connect(connection) {
    this.connection = connection;
    await this.scheduleFn();
  }
  async refresh(logger) {
    if (!this.connection) {
      throw new Error("Not initialized");
    }
    logger.info("Discovering Azure DevOps catalog files");
    const files = await codeSearch(this.integration.config, this.config.organization, this.config.project, this.config.repository, this.config.path);
    logger.info(`Discovered ${files.length} catalog files`);
    const locations = files.map((key) => this.createLocationSpec(key));
    await this.connection.applyMutation({
      type: "full",
      entities: locations.map((location) => {
        return {
          locationKey: this.getProviderName(),
          entity: pluginCatalogBackend.locationSpecToLocationEntity({ location })
        };
      })
    });
    logger.info(`Committed ${locations.length} locations for AzureDevOps catalog files`);
  }
  createLocationSpec(file) {
    return {
      type: "url",
      target: this.createObjectUrl(file),
      presence: "required"
    };
  }
  createObjectUrl(file) {
    const baseUrl = `https://${this.config.host}/${this.config.organization}/${this.config.project}`;
    return encodeURI(`${baseUrl}/_git/${file.repository.name}?path=${file.path}`);
  }
}

exports.AzureDevOpsDiscoveryProcessor = AzureDevOpsDiscoveryProcessor;
exports.AzureDevOpsEntityProvider = AzureDevOpsEntityProvider;
//# sourceMappingURL=index.cjs.js.map
