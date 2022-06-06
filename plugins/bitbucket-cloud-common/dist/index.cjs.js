'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fetch = require('cross-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

class WithPagination {
  constructor(createUrl, fetch) {
    this.createUrl = createUrl;
    this.fetch = fetch;
  }
  getPage(options) {
    const opts = { page: 1, pagelen: 100, ...options };
    const url = this.createUrl(opts);
    return this.fetch(url);
  }
  async *iteratePages(options) {
    const opts = { page: 1, pagelen: 100, ...options };
    let url = this.createUrl(opts);
    let res;
    do {
      res = await this.fetch(url);
      url = res.next ? new URL(res.next) : void 0;
      yield res;
    } while (url);
  }
  async *iterateResults(options) {
    var _a;
    const opts = { page: 1, pagelen: 100, ...options };
    let url = this.createUrl(opts);
    let res;
    do {
      res = await this.fetch(url);
      url = res.next ? new URL(res.next) : void 0;
      for (const item of (_a = res.values) != null ? _a : []) {
        yield item;
      }
    } while (url);
  }
}

class BitbucketCloudClient {
  constructor(config) {
    this.config = config;
  }
  static fromConfig(config) {
    return new BitbucketCloudClient(config);
  }
  searchCode(workspace, query, options) {
    const workspaceEnc = encodeURIComponent(workspace);
    return new WithPagination((paginationOptions) => this.createUrl(`/workspaces/${workspaceEnc}/search/code`, {
      ...paginationOptions,
      ...options,
      search_query: query
    }), (url) => this.getTypeMapped(url));
  }
  listRepositoriesByWorkspace(workspace, options) {
    const workspaceEnc = encodeURIComponent(workspace);
    return new WithPagination((paginationOptions) => this.createUrl(`/repositories/${workspaceEnc}`, {
      ...paginationOptions,
      ...options
    }), (url) => this.getTypeMapped(url));
  }
  createUrl(endpoint, options) {
    const request = new URL(this.config.apiBaseUrl + endpoint);
    for (const key in options) {
      if (options[key]) {
        request.searchParams.append(key, options[key].toString());
      }
    }
    return request;
  }
  async getTypeMapped(url) {
    return this.get(url).then((response) => response.json());
  }
  async get(url) {
    return this.request(new fetch.Request(url.toString(), { method: "GET" }));
  }
  async request(req) {
    return fetch__default["default"](req, { headers: this.getAuthHeaders() }).then((response) => {
      if (!response.ok) {
        throw new Error(`Unexpected response for ${req.method} ${req.url}. Expected 200 but got ${response.status} - ${response.statusText}`);
      }
      return response;
    });
  }
  getAuthHeaders() {
    const headers = {};
    if (this.config.username) {
      const buffer = Buffer.from(`${this.config.username}:${this.config.appPassword}`, "utf8");
      headers.Authorization = `Basic ${buffer.toString("base64")}`;
    }
    return headers;
  }
}

exports.Models = void 0;
((Models2) => {
  Models2.BaseCommitSummaryMarkupEnum = {
    Markdown: "markdown",
    Creole: "creole",
    Plaintext: "plaintext"
  };
  Models2.BranchMergeStrategiesEnum = {
    MergeCommit: "merge_commit",
    Squash: "squash",
    FastForward: "fast_forward"
  };
  Models2.CommitFileAttributesEnum = {
    Link: "link",
    Executable: "executable",
    Subrepository: "subrepository",
    Binary: "binary",
    Lfs: "lfs"
  };
  Models2.ParticipantRoleEnum = {
    Participant: "PARTICIPANT",
    Reviewer: "REVIEWER"
  };
  Models2.ParticipantStateEnum = {
    Approved: "approved",
    ChangesRequested: "changes_requested",
    Null: "null"
  };
  Models2.RepositoryForkPolicyEnum = {
    AllowForks: "allow_forks",
    NoPublicForks: "no_public_forks",
    NoForks: "no_forks"
  };
  Models2.RepositoryScmEnum = {
    Git: "git"
  };
})(exports.Models || (exports.Models = {}));

exports.BitbucketCloudClient = BitbucketCloudClient;
exports.WithPagination = WithPagination;
//# sourceMappingURL=index.cjs.js.map
