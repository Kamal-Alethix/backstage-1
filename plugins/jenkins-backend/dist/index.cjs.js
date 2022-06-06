'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var catalogModel = require('@backstage/catalog-model');
var backendCommon = require('@backstage/backend-common');
var express = require('express');
var Router = require('express-promise-router');
var jenkins = require('jenkins');
var pluginPermissionCommon = require('@backstage/plugin-permission-common');
var pluginJenkinsCommon = require('@backstage/plugin-jenkins-common');
var errors = require('@backstage/errors');
var pluginAuthNode = require('@backstage/plugin-auth-node');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var jenkins__default = /*#__PURE__*/_interopDefaultLegacy(jenkins);

class JenkinsConfig {
  constructor(instances) {
    this.instances = instances;
  }
  static fromConfig(config) {
    var _a;
    const DEFAULT_JENKINS_NAME = "default";
    const jenkinsConfig = config.getConfig("jenkins");
    const namedInstanceConfig = ((_a = jenkinsConfig.getOptionalConfigArray("instances")) == null ? void 0 : _a.map((c) => ({
      name: c.getString("name"),
      baseUrl: c.getString("baseUrl"),
      username: c.getString("username"),
      apiKey: c.getString("apiKey"),
      crumbIssuer: c.getOptionalBoolean("crumbIssuer")
    }))) || [];
    const hasNamedDefault = namedInstanceConfig.some((x) => x.name === DEFAULT_JENKINS_NAME);
    const baseUrl = jenkinsConfig.getOptionalString("baseUrl");
    const username = jenkinsConfig.getOptionalString("username");
    const apiKey = jenkinsConfig.getOptionalString("apiKey");
    const crumbIssuer = jenkinsConfig.getOptionalBoolean("crumbIssuer");
    if (hasNamedDefault && (baseUrl || username || apiKey)) {
      throw new Error(`Found both a named jenkins instance with name ${DEFAULT_JENKINS_NAME} and top level baseUrl, username or apiKey config. Use only one style of config.`);
    }
    const unnamedNonePresent = !baseUrl && !username && !apiKey;
    const unnamedAllPresent = baseUrl && username && apiKey;
    if (!(unnamedAllPresent || unnamedNonePresent)) {
      throw new Error(`Found partial default jenkins config. All (or none) of baseUrl, username and apiKey must be provided.`);
    }
    if (unnamedAllPresent) {
      const unnamedInstanceConfig = [
        { name: DEFAULT_JENKINS_NAME, baseUrl, username, apiKey, crumbIssuer }
      ];
      return new JenkinsConfig([
        ...namedInstanceConfig,
        ...unnamedInstanceConfig
      ]);
    }
    return new JenkinsConfig(namedInstanceConfig);
  }
  getInstanceConfig(jenkinsName) {
    const DEFAULT_JENKINS_NAME = "default";
    if (!jenkinsName || jenkinsName === DEFAULT_JENKINS_NAME) {
      const instanceConfig2 = this.instances.find((c) => c.name === DEFAULT_JENKINS_NAME);
      if (!instanceConfig2) {
        throw new Error(`Couldn't find a default jenkins instance in the config. Either configure an instance with name ${DEFAULT_JENKINS_NAME} or add a prefix to your annotation value.`);
      }
      return instanceConfig2;
    }
    const instanceConfig = this.instances.find((c) => c.name === jenkinsName);
    if (!instanceConfig) {
      throw new Error(`Couldn't find a jenkins instance in the config with name ${jenkinsName}`);
    }
    return instanceConfig;
  }
}
const _DefaultJenkinsInfoProvider = class {
  constructor(config, catalog) {
    this.config = config;
    this.catalog = catalog;
  }
  static fromConfig(options) {
    return new _DefaultJenkinsInfoProvider(JenkinsConfig.fromConfig(options.config), options.catalog);
  }
  async getInstance(opt) {
    const entity = await this.catalog.getEntityByRef(opt.entityRef, {
      token: opt.backstageToken
    });
    if (!entity) {
      throw new Error(`Couldn't find entity with name: ${catalogModel.stringifyEntityRef(opt.entityRef)}`);
    }
    const jenkinsAndJobName = _DefaultJenkinsInfoProvider.getEntityAnnotationValue(entity);
    if (!jenkinsAndJobName) {
      throw new Error(`Couldn't find jenkins annotation (${_DefaultJenkinsInfoProvider.NEW_JENKINS_ANNOTATION}) on entity with name: ${catalogModel.stringifyEntityRef(opt.entityRef)}`);
    }
    let jobFullName;
    let jenkinsName;
    const splitIndex = jenkinsAndJobName.indexOf(":");
    if (splitIndex === -1) {
      jobFullName = jenkinsAndJobName;
    } else {
      jenkinsName = jenkinsAndJobName.substring(0, splitIndex);
      jobFullName = jenkinsAndJobName.substring(splitIndex + 1, jenkinsAndJobName.length);
    }
    const instanceConfig = this.config.getInstanceConfig(jenkinsName);
    const creds = Buffer.from(`${instanceConfig.username}:${instanceConfig.apiKey}`, "binary").toString("base64");
    return {
      baseUrl: instanceConfig.baseUrl,
      headers: {
        Authorization: `Basic ${creds}`
      },
      jobFullName,
      crumbIssuer: instanceConfig.crumbIssuer
    };
  }
  static getEntityAnnotationValue(entity) {
    var _a, _b;
    return ((_a = entity.metadata.annotations) == null ? void 0 : _a[_DefaultJenkinsInfoProvider.OLD_JENKINS_ANNOTATION]) || ((_b = entity.metadata.annotations) == null ? void 0 : _b[_DefaultJenkinsInfoProvider.NEW_JENKINS_ANNOTATION]);
  }
};
let DefaultJenkinsInfoProvider = _DefaultJenkinsInfoProvider;
DefaultJenkinsInfoProvider.OLD_JENKINS_ANNOTATION = "jenkins.io/github-folder";
DefaultJenkinsInfoProvider.NEW_JENKINS_ANNOTATION = "jenkins.io/job-full-name";

const _JenkinsApiImpl = class {
  constructor(permissionApi) {
    this.permissionApi = permissionApi;
  }
  async getProjects(jenkinsInfo, branch) {
    const client = await _JenkinsApiImpl.getClient(jenkinsInfo);
    const projects = [];
    if (branch) {
      const job = await client.job.get({
        name: `${jenkinsInfo.jobFullName}/${branch}`,
        tree: _JenkinsApiImpl.jobTreeSpec.replace(/\s/g, "")
      });
      projects.push(this.augmentProject(job));
    } else {
      const folder = await client.job.get({
        name: jenkinsInfo.jobFullName,
        tree: _JenkinsApiImpl.jobsTreeSpec.replace(/\s/g, "")
      });
      for (const jobDetails of folder.jobs) {
        if (jobDetails == null ? void 0 : jobDetails.jobs) ; else {
          projects.push(this.augmentProject(jobDetails));
        }
      }
    }
    return projects;
  }
  async getBuild(jenkinsInfo, jobFullName, buildNumber) {
    const client = await _JenkinsApiImpl.getClient(jenkinsInfo);
    const project = await client.job.get({
      name: jobFullName,
      depth: 1
    });
    const build = await client.build.get(jobFullName, buildNumber);
    const jobScmInfo = _JenkinsApiImpl.extractScmDetailsFromJob(project);
    return this.augmentBuild(build, jobScmInfo);
  }
  async buildProject(jenkinsInfo, jobFullName, resourceRef, options) {
    const client = await _JenkinsApiImpl.getClient(jenkinsInfo);
    if (this.permissionApi) {
      const response = await this.permissionApi.authorize([{ permission: pluginJenkinsCommon.jenkinsExecutePermission, resourceRef }], { token: options == null ? void 0 : options.token });
      const { result } = response[0];
      if (result === pluginPermissionCommon.AuthorizeResult.DENY) {
        throw new errors.NotAllowedError();
      }
    }
    await client.job.build(jobFullName);
  }
  static async getClient(jenkinsInfo) {
    return jenkins__default["default"]({
      baseUrl: jenkinsInfo.baseUrl,
      headers: jenkinsInfo.headers,
      promisify: true,
      crumbIssuer: jenkinsInfo.crumbIssuer
    });
  }
  augmentProject(project) {
    let status;
    if (project.inQueue) {
      status = "queued";
    } else if (!project.lastBuild) {
      status = "build not found";
    } else if (project.lastBuild.building) {
      status = "running";
    } else if (!project.lastBuild.result) {
      status = "unknown";
    } else {
      status = project.lastBuild.result;
    }
    const jobScmInfo = _JenkinsApiImpl.extractScmDetailsFromJob(project);
    return {
      ...project,
      lastBuild: project.lastBuild ? this.augmentBuild(project.lastBuild, jobScmInfo) : null,
      status
    };
  }
  augmentBuild(build, jobScmInfo) {
    const source = build.actions.filter((action) => (action == null ? void 0 : action._class) === "hudson.plugins.git.util.BuildData").map((action) => {
      const [first] = Object.values(action.buildsByBranchName);
      const branch = first.revision.branch[0];
      return {
        branchName: branch.name,
        commit: {
          hash: branch.SHA1.substring(0, 8)
        }
      };
    }).pop() || {};
    if (jobScmInfo) {
      source.url = jobScmInfo.url;
      source.displayName = jobScmInfo.displayName;
      source.author = jobScmInfo.author;
    }
    let status;
    if (build.building) {
      status = "running";
    } else if (!build.result) {
      status = "unknown";
    } else {
      status = build.result;
    }
    return {
      ...build,
      status,
      source,
      tests: this.getTestReport(build)
    };
  }
  static extractScmDetailsFromJob(project) {
    const scmInfo = project.actions.filter((action) => (action == null ? void 0 : action._class) === "jenkins.scm.api.metadata.ObjectMetadataAction").map((action) => {
      return {
        url: action == null ? void 0 : action.objectUrl,
        displayName: action == null ? void 0 : action.objectDisplayName
      };
    }).pop();
    if (!scmInfo) {
      return void 0;
    }
    const author = project.actions.filter((action) => (action == null ? void 0 : action._class) === "jenkins.scm.api.metadata.ContributorMetadataAction").map((action) => {
      return action.contributorDisplayName;
    }).pop();
    if (author) {
      scmInfo.author = author;
    }
    return scmInfo;
  }
  getTestReport(build) {
    return build.actions.filter((action) => (action == null ? void 0 : action._class) === "hudson.tasks.junit.TestResultAction").map((action) => {
      return {
        total: action.totalCount,
        passed: action.totalCount - action.failCount - action.skipCount,
        skipped: action.skipCount,
        failed: action.failCount,
        testUrl: `${build.url}${action.urlName}/`
      };
    }).pop();
  }
};
let JenkinsApiImpl = _JenkinsApiImpl;
JenkinsApiImpl.lastBuildTreeSpec = `lastBuild[
                    number,
                    url,
                    fullDisplayName,
                    displayName,
                    building,
                    result,
                    timestamp,
                    duration,
                    actions[
                      *[
                        *[
                          *[
                            *
                          ]
                        ]
                      ]
                    ]
                  ],`;
JenkinsApiImpl.jobTreeSpec = `actions[*],
                   ${_JenkinsApiImpl.lastBuildTreeSpec}
                   jobs{0,1},
                   name,
                   fullName,
                   displayName,
                   fullDisplayName,
                   inQueue`;
JenkinsApiImpl.jobsTreeSpec = `jobs[
                   ${_JenkinsApiImpl.jobTreeSpec}
                 ]{0,50}`;

async function createRouter(options) {
  const { jenkinsInfoProvider, permissions, logger } = options;
  let permissionEvaluator;
  if (permissions && "authorizeConditional" in permissions) {
    permissionEvaluator = permissions;
  } else {
    logger.warn("PermissionAuthorizer is deprecated. Please use an instance of PermissionEvaluator instead of PermissionAuthorizer in PluginEnvironment#permissions");
    permissionEvaluator = permissions ? pluginPermissionCommon.toPermissionEvaluator(permissions) : void 0;
  }
  const jenkinsApi = new JenkinsApiImpl(permissionEvaluator);
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/v1/entity/:namespace/:kind/:name/projects", async (request, response) => {
    const { namespace, kind, name } = request.params;
    const token = pluginAuthNode.getBearerTokenFromAuthorizationHeader(request.header("authorization"));
    const branch = request.query.branch;
    let branchStr;
    if (branch === void 0) {
      branchStr = void 0;
    } else if (typeof branch === "string") {
      branchStr = branch;
    } else {
      response.status(400).send("Something was unexpected about the branch queryString");
      return;
    }
    const jenkinsInfo = await jenkinsInfoProvider.getInstance({
      entityRef: {
        kind,
        namespace,
        name
      },
      backstageToken: token
    });
    const projects = await jenkinsApi.getProjects(jenkinsInfo, branchStr);
    response.json({
      projects
    });
  });
  router.get("/v1/entity/:namespace/:kind/:name/job/:jobFullName/:buildNumber", async (request, response) => {
    const token = pluginAuthNode.getBearerTokenFromAuthorizationHeader(request.header("authorization"));
    const { namespace, kind, name, jobFullName, buildNumber } = request.params;
    const jenkinsInfo = await jenkinsInfoProvider.getInstance({
      entityRef: {
        kind,
        namespace,
        name
      },
      jobFullName,
      backstageToken: token
    });
    const build = await jenkinsApi.getBuild(jenkinsInfo, jobFullName, parseInt(buildNumber, 10));
    response.json({
      build
    });
  });
  router.post("/v1/entity/:namespace/:kind/:name/job/:jobFullName/:buildNumber::rebuild", async (request, response) => {
    const { namespace, kind, name, jobFullName } = request.params;
    const token = pluginAuthNode.getBearerTokenFromAuthorizationHeader(request.header("authorization"));
    const jenkinsInfo = await jenkinsInfoProvider.getInstance({
      entityRef: {
        kind,
        namespace,
        name
      },
      jobFullName,
      backstageToken: token
    });
    const resourceRef = catalogModel.stringifyEntityRef({ kind, namespace, name });
    await jenkinsApi.buildProject(jenkinsInfo, jobFullName, resourceRef, {
      token
    });
    response.json({});
  });
  router.use(backendCommon.errorHandler());
  return router;
}

exports.DefaultJenkinsInfoProvider = DefaultJenkinsInfoProvider;
exports.JenkinsConfig = JenkinsConfig;
exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
