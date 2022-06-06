'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var integration = require('@backstage/integration');
var pluginBitbucketCloudCommon = require('@backstage/plugin-bitbucket-cloud-common');
var pluginCatalogBackend = require('@backstage/plugin-catalog-backend');
var fetch = require('node-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

const defaultRepositoryParser = async function* defaultRepositoryParser2(options) {
  var _a;
  yield pluginCatalogBackend.processingResult.location({
    type: "url",
    target: options.target,
    presence: (_a = options.presence) != null ? _a : "optional"
  });
};

class BitbucketServerClient {
  constructor(options) {
    this.config = options.config;
  }
  async listProjects(options) {
    return this.pagedRequest(`${this.config.apiBaseUrl}/projects`, options);
  }
  async listRepositories(projectKey, options) {
    return this.pagedRequest(`${this.config.apiBaseUrl}/projects/${encodeURIComponent(projectKey)}/repos`, options);
  }
  async pagedRequest(endpoint, options) {
    const request = new URL(endpoint);
    for (const key in options) {
      if (options[key]) {
        request.searchParams.append(key, options[key].toString());
      }
    }
    const response = await fetch__default["default"](request.toString(), integration.getBitbucketRequestOptions(this.config));
    if (!response.ok) {
      throw new Error(`Unexpected response when fetching ${request.toString()}. Expected 200 but got ${response.status} - ${response.statusText}`);
    }
    return response.json();
  }
}
async function* paginated(request, options) {
  const opts = options || { start: 0 };
  let res;
  do {
    res = await request(opts);
    opts.start = res.nextPageStart;
    for (const item of res.values) {
      yield item;
    }
  } while (!res.isLastPage);
}

const DEFAULT_BRANCH = "master";
const DEFAULT_CATALOG_LOCATION = "/catalog-info.yaml";
class BitbucketDiscoveryProcessor {
  static fromConfig(config, options) {
    const integrations = integration.ScmIntegrations.fromConfig(config);
    return new BitbucketDiscoveryProcessor({
      ...options,
      integrations
    });
  }
  constructor(options) {
    this.integrations = options.integrations;
    this.parser = options.parser || defaultRepositoryParser;
    this.logger = options.logger;
  }
  getProcessorName() {
    return "BitbucketDiscoveryProcessor";
  }
  async readLocation(location, _optional, emit) {
    if (location.type !== "bitbucket-discovery") {
      return false;
    }
    const integration = this.integrations.bitbucket.byUrl(location.target);
    if (!integration) {
      throw new Error(`There is no Bitbucket integration that matches ${location.target}. Please add a configuration entry for it under integrations.bitbucket`);
    }
    const startTimestamp = Date.now();
    this.logger.info(`Reading ${integration.config.host} repositories from ${location.target}`);
    const processOptions = {
      emit,
      integration,
      location
    };
    const isBitbucketCloud = integration.config.host === "bitbucket.org";
    const { scanned, matches } = isBitbucketCloud ? await this.processCloudRepositories(processOptions) : await this.processOrganizationRepositories(processOptions);
    const duration = ((Date.now() - startTimestamp) / 1e3).toFixed(1);
    this.logger.debug(`Read ${scanned} ${integration.config.host} repositories (${matches} matching the pattern) in ${duration} seconds`);
    return true;
  }
  async processCloudRepositories(options) {
    const { location, integration, emit } = options;
    const client = pluginBitbucketCloudCommon.BitbucketCloudClient.fromConfig(integration.config);
    const { searchEnabled } = parseBitbucketCloudUrl(location.target);
    const result = searchEnabled ? await searchBitbucketCloudLocations(client, location.target) : await readBitbucketCloudLocations(client, location.target);
    for (const locationTarget of result.matches) {
      for await (const entity of this.parser({
        integration,
        target: locationTarget,
        presence: searchEnabled ? "required" : "optional",
        logger: this.logger
      })) {
        emit(entity);
      }
    }
    return {
      matches: result.matches.length,
      scanned: result.scanned
    };
  }
  async processOrganizationRepositories(options) {
    const { location, integration, emit } = options;
    const { catalogPath: requestedCatalogPath } = parseUrl(location.target);
    const catalogPath = requestedCatalogPath ? `/${requestedCatalogPath}` : DEFAULT_CATALOG_LOCATION;
    const client = new BitbucketServerClient({
      config: integration.config
    });
    const result = await readBitbucketOrg(client, location.target);
    for (const repository of result.matches) {
      for await (const entity of this.parser({
        integration,
        target: `${repository.links.self[0].href}${catalogPath}`,
        logger: this.logger
      })) {
        emit(entity);
      }
    }
    return {
      matches: result.matches.length,
      scanned: result.scanned
    };
  }
}
async function readBitbucketOrg(client, target) {
  const { projectSearchPath, repoSearchPath } = parseUrl(target);
  const projects = paginated((options) => client.listProjects(options));
  const result = {
    scanned: 0,
    matches: []
  };
  for await (const project of projects) {
    if (!projectSearchPath.test(project.key)) {
      continue;
    }
    const repositories = paginated((options) => client.listRepositories(project.key, options));
    for await (const repository of repositories) {
      result.scanned++;
      if (repoSearchPath.test(repository.slug)) {
        result.matches.push(repository);
      }
    }
  }
  return result;
}
async function searchBitbucketCloudLocations(client, target) {
  var _a, _b;
  const {
    workspacePath,
    catalogPath: requestedCatalogPath,
    projectSearchPath,
    repoSearchPath
  } = parseBitbucketCloudUrl(target);
  const result = {
    scanned: 0,
    matches: []
  };
  const catalogPath = requestedCatalogPath ? requestedCatalogPath : DEFAULT_CATALOG_LOCATION;
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
  const searchResults = client.searchCode(workspacePath, query, { fields }).iterateResults();
  for await (const searchResult of searchResults) {
    if (searchResult.path_matches.length === 0) {
      continue;
    }
    const repository = searchResult.file.commit.repository;
    if (!matchesPostFilters(repository, projectSearchPath, repoSearchPath)) {
      continue;
    }
    const repoUrl = repository.links.html.href;
    const branch = (_b = (_a = repository.mainbranch) == null ? void 0 : _a.name) != null ? _b : DEFAULT_BRANCH;
    const filePath = searchResult.file.path;
    const location = `${repoUrl}/src/${branch}/${filePath}`;
    result.matches.push(location);
  }
  return result;
}
async function readBitbucketCloudLocations(client, target) {
  const { catalogPath: requestedCatalogPath } = parseBitbucketCloudUrl(target);
  const catalogPath = requestedCatalogPath ? `/${requestedCatalogPath}` : DEFAULT_CATALOG_LOCATION;
  return readBitbucketCloud(client, target).then((result) => {
    const matches = result.matches.map((repository) => {
      var _a, _b;
      const branch = (_b = (_a = repository.mainbranch) == null ? void 0 : _a.name) != null ? _b : DEFAULT_BRANCH;
      return `${repository.links.html.href}/src/${branch}${catalogPath}`;
    });
    return {
      scanned: result.scanned,
      matches
    };
  });
}
async function readBitbucketCloud(client, target) {
  const {
    workspacePath,
    queryParam: q,
    projectSearchPath,
    repoSearchPath
  } = parseBitbucketCloudUrl(target);
  const repositories = client.listRepositoriesByWorkspace(workspacePath, { q }).iterateResults();
  const result = {
    scanned: 0,
    matches: []
  };
  for await (const repository of repositories) {
    result.scanned++;
    if (matchesPostFilters(repository, projectSearchPath, repoSearchPath)) {
      result.matches.push(repository);
    }
  }
  return result;
}
function matchesPostFilters(repository, projectSearchPath, repoSearchPath) {
  return (!projectSearchPath || projectSearchPath.test(repository.project.key)) && (!repoSearchPath || repoSearchPath.test(repository.slug));
}
function parseUrl(urlString) {
  const url = new URL(urlString);
  const indexOfProjectSegment = url.pathname.toLowerCase().indexOf("/projects/") + 1;
  const path = url.pathname.substr(indexOfProjectSegment).split("/");
  if (path.length > 3 && path[1].length && path[3].length) {
    return {
      projectSearchPath: escapeRegExp(decodeURIComponent(path[1])),
      repoSearchPath: escapeRegExp(decodeURIComponent(path[3])),
      catalogPath: decodeURIComponent(path.slice(4).join("/") + url.search)
    };
  }
  throw new Error(`Failed to parse ${urlString}`);
}
function readPathParameters(pathParts) {
  const vals = {};
  for (let i = 0; i + 1 < pathParts.length; i += 2) {
    vals[pathParts[i]] = decodeURIComponent(pathParts[i + 1]);
  }
  return new Map(Object.entries(vals));
}
function parseBitbucketCloudUrl(urlString) {
  var _a;
  const url = new URL(urlString);
  const pathMap = readPathParameters(url.pathname.substr(1).split("/"));
  const query = url.searchParams;
  if (!pathMap.has("workspaces")) {
    throw new Error(`Failed to parse workspace from ${urlString}`);
  }
  return {
    workspacePath: pathMap.get("workspaces"),
    projectSearchPath: pathMap.has("projects") ? escapeRegExp(pathMap.get("projects")) : void 0,
    repoSearchPath: pathMap.has("repos") ? escapeRegExp(pathMap.get("repos")) : void 0,
    catalogPath: query.get("catalogPath") || void 0,
    queryParam: query.get("q") || void 0,
    searchEnabled: ((_a = query.get("search")) == null ? void 0 : _a.toLowerCase()) === "true"
  };
}
function escapeRegExp(str) {
  return new RegExp(`^${str.replace(/\*/g, ".*")}$`);
}

exports.BitbucketDiscoveryProcessor = BitbucketDiscoveryProcessor;
//# sourceMappingURL=index.cjs.js.map
