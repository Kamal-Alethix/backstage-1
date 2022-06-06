'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var integration = require('@backstage/integration');
var pluginCatalogBackend = require('@backstage/plugin-catalog-backend');
var fetch = require('node-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

class GitLabClient {
  constructor(options) {
    this.config = options.config;
    this.logger = options.logger;
  }
  isSelfManaged() {
    return this.config.host !== "gitlab.com";
  }
  async listProjects(options) {
    if (options == null ? void 0 : options.group) {
      return this.pagedRequest(`/groups/${encodeURIComponent(options == null ? void 0 : options.group)}/projects`, {
        ...options,
        include_subgroups: true
      });
    }
    return this.pagedRequest(`/projects`, options);
  }
  async hasFile(projectPath, branch, filePath) {
    const endpoint = `/projects/${encodeURIComponent(projectPath)}/repository/files/${encodeURIComponent(filePath)}`;
    const request = new URL(`${this.config.apiBaseUrl}${endpoint}`);
    request.searchParams.append("ref", branch);
    const response = await fetch__default["default"](request.toString(), {
      headers: integration.getGitLabRequestOptions(this.config).headers,
      method: "HEAD"
    });
    if (!response.ok) {
      if (response.status >= 500) {
        this.logger.debug(`Unexpected response when fetching ${request.toString()}. Expected 200 but got ${response.status} - ${response.statusText}`);
      }
      return false;
    }
    return true;
  }
  async pagedRequest(endpoint, options) {
    const request = new URL(`${this.config.apiBaseUrl}${endpoint}`);
    for (const key in options) {
      if (options[key]) {
        request.searchParams.append(key, options[key].toString());
      }
    }
    this.logger.debug(`Fetching: ${request.toString()}`);
    const response = await fetch__default["default"](request.toString(), integration.getGitLabRequestOptions(this.config));
    if (!response.ok) {
      throw new Error(`Unexpected response when fetching ${request.toString()}. Expected 200 but got ${response.status} - ${response.statusText}`);
    }
    return response.json().then((items) => {
      const nextPage = response.headers.get("x-next-page");
      return {
        items,
        nextPage: nextPage ? Number(nextPage) : null
      };
    });
  }
}
async function* paginated(request, options) {
  let res;
  do {
    res = await request(options);
    options.page = res.nextPage;
    for (const item of res.items) {
      yield item;
    }
  } while (res.nextPage);
}

class GitLabDiscoveryProcessor {
  static fromConfig(config, options) {
    const integrations = integration.ScmIntegrations.fromConfig(config);
    const pluginCache = backendCommon.CacheManager.fromConfig(config).forPlugin("gitlab-discovery");
    return new GitLabDiscoveryProcessor({
      ...options,
      integrations,
      pluginCache
    });
  }
  constructor(options) {
    this.integrations = options.integrations;
    this.cache = options.pluginCache.getClient();
    this.logger = options.logger;
    this.skipReposWithoutExactFileMatch = options.skipReposWithoutExactFileMatch || false;
  }
  getProcessorName() {
    return "GitLabDiscoveryProcessor";
  }
  async readLocation(location, _optional, emit) {
    if (location.type !== "gitlab-discovery") {
      return false;
    }
    const { group, host, branch, catalogPath } = parseUrl(location.target);
    const integration = this.integrations.gitlab.byUrl(`https://${host}`);
    if (!integration) {
      throw new Error(`There is no GitLab integration that matches ${host}. Please add a configuration entry for it under integrations.gitlab`);
    }
    const client = new GitLabClient({
      config: integration.config,
      logger: this.logger
    });
    const startTimestamp = Date.now();
    this.logger.debug(`Reading GitLab projects from ${location.target}`);
    const projects = paginated((options) => client.listProjects(options), {
      group,
      last_activity_after: await this.updateLastActivity(),
      page: 1
    });
    const res = {
      scanned: 0,
      matches: []
    };
    for await (const project of projects) {
      res.scanned++;
      if (project.archived) {
        continue;
      }
      if (branch === "*" && project.default_branch === void 0) {
        continue;
      }
      if (this.skipReposWithoutExactFileMatch) {
        const project_branch = branch === "*" ? project.default_branch : branch;
        const projectHasFile = await client.hasFile(project.path_with_namespace, project_branch, catalogPath);
        if (!projectHasFile) {
          continue;
        }
      }
      res.matches.push(project);
    }
    for (const project of res.matches) {
      const project_branch = branch === "*" ? project.default_branch : branch;
      emit(pluginCatalogBackend.processingResult.location({
        type: "url",
        target: `${project.web_url}/-/blob/${project_branch}/${catalogPath}`,
        presence: "optional"
      }));
    }
    const duration = ((Date.now() - startTimestamp) / 1e3).toFixed(1);
    this.logger.debug(`Read ${res.scanned} GitLab repositories in ${duration} seconds`);
    return true;
  }
  async updateLastActivity() {
    const cacheKey = `processors/${this.getProcessorName()}/last-activity`;
    const lastActivity = await this.cache.get(cacheKey);
    await this.cache.set(cacheKey, new Date().toISOString());
    return lastActivity;
  }
}
function parseUrl(urlString) {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split("/");
  const blobIndex = path.findIndex((p) => p === "blob");
  if (blobIndex !== -1 && path.length > blobIndex + 2) {
    const group = blobIndex > 0 ? path.slice(0, blobIndex).join("/") : void 0;
    return {
      group,
      host: url.host,
      branch: decodeURIComponent(path[blobIndex + 1]),
      catalogPath: decodeURIComponent(path.slice(blobIndex + 2).join("/"))
    };
  }
  throw new Error(`Failed to parse ${urlString}`);
}

exports.GitLabDiscoveryProcessor = GitLabDiscoveryProcessor;
//# sourceMappingURL=index.cjs.js.map
