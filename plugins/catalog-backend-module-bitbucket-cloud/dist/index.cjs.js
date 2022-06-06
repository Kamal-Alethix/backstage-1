'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var integration = require('@backstage/integration');
var pluginBitbucketCloudCommon = require('@backstage/plugin-bitbucket-cloud-common');
var pluginCatalogBackend = require('@backstage/plugin-catalog-backend');
var uuid = require('uuid');

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

var uuid__namespace = /*#__PURE__*/_interopNamespace(uuid);

const DEFAULT_CATALOG_PATH = "/catalog-info.yaml";
const DEFAULT_PROVIDER_ID = "default";
function readProviderConfigs(config) {
  const providersConfig = config.getOptionalConfig("catalog.providers.bitbucketCloud");
  if (!providersConfig) {
    return [];
  }
  if (providersConfig.has("workspace")) {
    return [readProviderConfig(DEFAULT_PROVIDER_ID, providersConfig)];
  }
  return providersConfig.keys().map((id) => {
    const providerConfig = providersConfig.getConfig(id);
    return readProviderConfig(id, providerConfig);
  });
}
function readProviderConfig(id, config) {
  var _a;
  const workspace = config.getString("workspace");
  const catalogPath = (_a = config.getOptionalString("catalogPath")) != null ? _a : DEFAULT_CATALOG_PATH;
  const projectKeyPattern = config.getOptionalString("filters.projectKey");
  const repoSlugPattern = config.getOptionalString("filters.repoSlug");
  return {
    id,
    catalogPath,
    workspace,
    filters: {
      projectKey: projectKeyPattern ? compileRegExp(projectKeyPattern) : void 0,
      repoSlug: repoSlugPattern ? compileRegExp(repoSlugPattern) : void 0
    }
  };
}
function compileRegExp(pattern) {
  let fullLinePattern = pattern;
  if (!fullLinePattern.startsWith("^")) {
    fullLinePattern = `^${fullLinePattern}`;
  }
  if (!fullLinePattern.endsWith("$")) {
    fullLinePattern = `${fullLinePattern}$`;
  }
  return new RegExp(fullLinePattern);
}

const DEFAULT_BRANCH = "master";
class BitbucketCloudEntityProvider {
  static fromConfig(config, options) {
    const integrations = integration.ScmIntegrations.fromConfig(config);
    const integration$1 = integrations.bitbucketCloud.byHost("bitbucket.org");
    if (!integration$1) {
      throw new Error("No integration for bitbucket.org available");
    }
    return readProviderConfigs(config).map((providerConfig) => new BitbucketCloudEntityProvider(providerConfig, integration$1, options.logger, options.schedule));
  }
  constructor(config, integration, logger, schedule) {
    this.client = pluginBitbucketCloudCommon.BitbucketCloudClient.fromConfig(integration.config);
    this.config = config;
    this.logger = logger.child({
      target: this.getProviderName()
    });
    this.scheduleFn = this.createScheduleFn(schedule);
  }
  createScheduleFn(schedule) {
    return async () => {
      const taskId = this.getTaskId();
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: BitbucketCloudEntityProvider.prototype.constructor.name,
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
    return `bitbucketCloud-provider:${this.config.id}`;
  }
  getTaskId() {
    return `${this.getProviderName()}:refresh`;
  }
  async connect(connection) {
    this.connection = connection;
    await this.scheduleFn();
  }
  async refresh(logger) {
    if (!this.connection) {
      throw new Error("Not initialized");
    }
    logger.info("Discovering catalog files in Bitbucket Cloud repositories");
    const targets = await this.findCatalogFiles();
    const entities = targets.map(BitbucketCloudEntityProvider.toLocationSpec).map((location) => pluginCatalogBackend.locationSpecToLocationEntity({ location })).map((entity) => {
      return {
        locationKey: this.getProviderName(),
        entity
      };
    });
    await this.connection.applyMutation({
      type: "full",
      entities
    });
    logger.info(`Committed ${entities.length} Locations for catalog files in Bitbucket Cloud repositories`);
  }
  async findCatalogFiles() {
    const workspace = this.config.workspace;
    const catalogPath = this.config.catalogPath;
    const catalogFilename = catalogPath.substring(catalogPath.lastIndexOf("/") + 1);
    const fields = [
      "-values.content_matches",
      "+values.file.commit.repository.mainbranch.name",
      "+values.file.commit.repository.project.key",
      "+values.file.commit.repository.slug",
      "-values.*.links",
      "-values.*.*.links",
      "-values.*.*.*.links",
      "+values.file.commit.repository.links.html.href"
    ].join(",");
    const query = `"${catalogFilename}" path:${catalogPath}`;
    const searchResults = this.client.searchCode(workspace, query, { fields }).iterateResults();
    const result = [];
    for await (const searchResult of searchResults) {
      if (searchResult.path_matches.length === 0) {
        continue;
      }
      const repository = searchResult.file.commit.repository;
      if (this.matchesFilters(repository)) {
        result.push(BitbucketCloudEntityProvider.toUrl(repository, searchResult.file.path));
      }
    }
    return result;
  }
  matchesFilters(repository) {
    const filters = this.config.filters;
    return !filters || (!filters.projectKey || filters.projectKey.test(repository.project.key)) && (!filters.repoSlug || filters.repoSlug.test(repository.slug));
  }
  static toUrl(repository, filePath) {
    var _a, _b;
    const repoUrl = repository.links.html.href;
    const branch = (_b = (_a = repository.mainbranch) == null ? void 0 : _a.name) != null ? _b : DEFAULT_BRANCH;
    return `${repoUrl}/src/${branch}/${filePath}`;
  }
  static toLocationSpec(target) {
    return {
      type: "url",
      target,
      presence: "required"
    };
  }
}

exports.BitbucketCloudEntityProvider = BitbucketCloudEntityProvider;
//# sourceMappingURL=index.cjs.js.map
