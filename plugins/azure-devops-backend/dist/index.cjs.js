'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginAzureDevopsCommon = require('@backstage/plugin-azure-devops-common');
var azureDevopsNodeApi = require('azure-devops-node-api');
var limiterFactory = require('p-limit');
var Router = require('express-promise-router');
var backendCommon = require('@backstage/backend-common');
var express = require('express');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var limiterFactory__default = /*#__PURE__*/_interopDefaultLegacy(limiterFactory);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);

function convertDashboardPullRequest(pullRequest, baseUrl, policies) {
  var _a;
  return {
    pullRequestId: pullRequest.pullRequestId,
    title: pullRequest.title,
    description: pullRequest.description,
    repository: convertRepository(pullRequest.repository),
    createdBy: convertCreatedBy(pullRequest.createdBy),
    hasAutoComplete: hasAutoComplete(pullRequest),
    policies,
    reviewers: convertReviewers(pullRequest.reviewers),
    creationDate: (_a = pullRequest.creationDate) == null ? void 0 : _a.toISOString(),
    status: pullRequest.status,
    isDraft: pullRequest.isDraft,
    link: getPullRequestLink(baseUrl, pullRequest)
  };
}
function getPullRequestLink(baseUrl, pullRequest) {
  var _a, _b, _c;
  const projectName = (_b = (_a = pullRequest.repository) == null ? void 0 : _a.project) == null ? void 0 : _b.name;
  const repoName = (_c = pullRequest.repository) == null ? void 0 : _c.name;
  const pullRequestId = pullRequest.pullRequestId;
  if (!projectName || !repoName || !pullRequestId) {
    return void 0;
  }
  const encodedProjectName = encodeURIComponent(projectName);
  const encodedRepoName = encodeURIComponent(repoName);
  return `${baseUrl}/${encodedProjectName}/_git/${encodedRepoName}/pullrequest/${pullRequestId}`;
}
function getAvatarUrl(identity) {
  var _a, _b, _c;
  return (_c = (_b = (_a = identity._links) == null ? void 0 : _a.avatar) == null ? void 0 : _b.href) != null ? _c : identity.imageUrl;
}
function getArtifactId(projectId, pullRequestId) {
  return `vstfs:///CodeReview/CodeReviewId/${projectId}/${pullRequestId}`;
}
function convertPolicy(policyEvaluationRecord) {
  var _a, _b, _c, _d, _e;
  const policyConfig = policyEvaluationRecord.configuration;
  const policyStatus = policyEvaluationRecord.status;
  if (!policyConfig) {
    return void 0;
  }
  if (!(policyConfig.isEnabled && !policyConfig.isDeleted && (policyConfig.isBlocking || ((_a = policyConfig.type) == null ? void 0 : _a.id) === pluginAzureDevopsCommon.PolicyType.Status) && policyStatus !== pluginAzureDevopsCommon.PolicyEvaluationStatus.Approved)) {
    return void 0;
  }
  const policyTypeId = (_b = policyConfig.type) == null ? void 0 : _b.id;
  if (!policyTypeId) {
    return void 0;
  }
  const policyType = {
    [pluginAzureDevopsCommon.PolicyTypeId.Build]: pluginAzureDevopsCommon.PolicyType.Build,
    [pluginAzureDevopsCommon.PolicyTypeId.Status]: pluginAzureDevopsCommon.PolicyType.Status,
    [pluginAzureDevopsCommon.PolicyTypeId.MinimumReviewers]: pluginAzureDevopsCommon.PolicyType.MinimumReviewers,
    [pluginAzureDevopsCommon.PolicyTypeId.Comments]: pluginAzureDevopsCommon.PolicyType.Comments,
    [pluginAzureDevopsCommon.PolicyTypeId.RequiredReviewers]: pluginAzureDevopsCommon.PolicyType.RequiredReviewers,
    [pluginAzureDevopsCommon.PolicyTypeId.MergeStrategy]: pluginAzureDevopsCommon.PolicyType.MergeStrategy
  }[policyTypeId];
  if (!policyType) {
    return void 0;
  }
  const policyConfigSettings = policyConfig.settings;
  let policyText = (_c = policyConfig.type) == null ? void 0 : _c.displayName;
  let policyLink;
  switch (policyType) {
    case pluginAzureDevopsCommon.PolicyType.Build: {
      const buildDisplayName = policyConfigSettings.displayName;
      if (buildDisplayName) {
        policyText += `: ${buildDisplayName}`;
      }
      const buildId = (_d = policyEvaluationRecord.context) == null ? void 0 : _d.buildId;
      const policyConfigUrl = policyConfig.url;
      if (buildId && policyConfigUrl) {
        policyLink = policyConfigUrl.replace(`_apis/policy/configurations/${policyConfig.id}`, `_build/results?buildId=${buildId}`);
      }
      if (!policyStatus) {
        break;
      }
      const buildExpired = Boolean(policyConfigSettings.isExpired);
      const buildPolicyStatus = (_e = {
        [pluginAzureDevopsCommon.PolicyEvaluationStatus.Queued]: buildExpired ? "expired" : "queued",
        [pluginAzureDevopsCommon.PolicyEvaluationStatus.Rejected]: "failed"
      }[policyStatus]) != null ? _e : pluginAzureDevopsCommon.PolicyEvaluationStatus[policyStatus].toLowerCase();
      policyText += ` (${buildPolicyStatus})`;
      break;
    }
    case pluginAzureDevopsCommon.PolicyType.Status: {
      const statusGenre = policyConfigSettings.statusGenre;
      const statusName = policyConfigSettings.statusGenre;
      if (statusName) {
        policyText += `: ${statusGenre}/${statusName}`;
      }
      break;
    }
    case pluginAzureDevopsCommon.PolicyType.MinimumReviewers: {
      const minimumApproverCount = policyConfigSettings.minimumApproverCount;
      policyText += ` (${minimumApproverCount})`;
      break;
    }
    case pluginAzureDevopsCommon.PolicyType.Comments:
      break;
    case pluginAzureDevopsCommon.PolicyType.RequiredReviewers:
      break;
    case pluginAzureDevopsCommon.PolicyType.MergeStrategy:
    default:
      return void 0;
  }
  return {
    id: policyConfig.id,
    type: policyType,
    status: policyStatus,
    text: policyText,
    link: policyLink
  };
}
function convertReviewer(identityRef) {
  var _a;
  if (!identityRef) {
    return void 0;
  }
  return {
    id: identityRef.id,
    displayName: identityRef.displayName,
    uniqueName: identityRef.uniqueName,
    imageUrl: getAvatarUrl(identityRef),
    isRequired: identityRef.isRequired,
    isContainer: identityRef.isContainer,
    voteStatus: (_a = identityRef.vote) != null ? _a : 0
  };
}
function convertReviewers(identityRefs) {
  if (!identityRefs) {
    return void 0;
  }
  return identityRefs.map(convertReviewer).filter((reviewer) => Boolean(reviewer));
}
function convertRepository(repository) {
  var _a;
  if (!repository) {
    return void 0;
  }
  return {
    id: repository.id,
    name: repository.name,
    url: (_a = repository.url) == null ? void 0 : _a.replace("_apis/git/repositories", "_git")
  };
}
function convertCreatedBy(identityRef) {
  if (!identityRef) {
    return void 0;
  }
  return {
    id: identityRef.id,
    displayName: identityRef.displayName,
    uniqueName: identityRef.uniqueName,
    imageUrl: getAvatarUrl(identityRef)
  };
}
function hasAutoComplete(pullRequest) {
  return pullRequest.isDraft !== true && !!pullRequest.completionOptions;
}

class AzureDevOpsApi {
  constructor(logger, webApi) {
    this.logger = logger;
    this.webApi = webApi;
  }
  async getGitRepository(projectName, repoName) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Calling Azure DevOps REST API, getting Repository ${repoName} for Project ${projectName}`);
    const client = await this.webApi.getGitApi();
    return client.getRepository(repoName, projectName);
  }
  async getBuildList(projectName, repoId, top) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Calling Azure DevOps REST API, getting up to ${top} Builds for Repository Id ${repoId} for Project ${projectName}`);
    const client = await this.webApi.getBuildApi();
    return client.getBuilds(projectName, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, top, void 0, void 0, void 0, void 0, void 0, void 0, repoId, "TfsGit");
  }
  async getRepoBuilds(projectName, repoName, top) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Calling Azure DevOps REST API, getting up to ${top} Builds for Repository ${repoName} for Project ${projectName}`);
    const gitRepository = await this.getGitRepository(projectName, repoName);
    const buildList = await this.getBuildList(projectName, gitRepository.id, top);
    const repoBuilds = buildList.map((build) => {
      return mappedRepoBuild(build);
    });
    return repoBuilds;
  }
  async getGitTags(projectName, repoName) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Calling Azure DevOps REST API, getting Git Tags for Repository ${repoName} for Project ${projectName}`);
    const gitRepository = await this.getGitRepository(projectName, repoName);
    const client = await this.webApi.getGitApi();
    const tagRefs = await client.getRefs(gitRepository.id, projectName, "tags", false, false, false, false, true);
    const linkBaseUrl = `${this.webApi.serverUrl}/${encodeURIComponent(projectName)}/_git/${encodeURIComponent(repoName)}?version=GT`;
    const commitBaseUrl = `${this.webApi.serverUrl}/${encodeURIComponent(projectName)}/_git/${encodeURIComponent(repoName)}/commit`;
    const gitTags = tagRefs.map((tagRef) => {
      return mappedGitTag(tagRef, linkBaseUrl, commitBaseUrl);
    });
    return gitTags;
  }
  async getPullRequests(projectName, repoName, options) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Calling Azure DevOps REST API, getting up to ${options.top} Pull Requests for Repository ${repoName} for Project ${projectName}`);
    const gitRepository = await this.getGitRepository(projectName, repoName);
    const client = await this.webApi.getGitApi();
    const searchCriteria = {
      status: options.status
    };
    const gitPullRequests = await client.getPullRequests(gitRepository.id, searchCriteria, projectName, void 0, void 0, options.top);
    const linkBaseUrl = `${this.webApi.serverUrl}/${encodeURIComponent(projectName)}/_git/${encodeURIComponent(repoName)}/pullrequest`;
    const pullRequests = gitPullRequests.map((gitPullRequest) => {
      return mappedPullRequest(gitPullRequest, linkBaseUrl);
    });
    return pullRequests;
  }
  async getDashboardPullRequests(projectName, options) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Getting dashboard pull requests for project '${projectName}'.`);
    const client = await this.webApi.getGitApi();
    const searchCriteria = {
      status: options.status
    };
    const gitPullRequests = await client.getPullRequestsByProject(projectName, searchCriteria, void 0, void 0, options.top);
    return Promise.all(gitPullRequests.map(async (gitPullRequest) => {
      var _a2, _b;
      const projectId = (_b = (_a2 = gitPullRequest.repository) == null ? void 0 : _a2.project) == null ? void 0 : _b.id;
      const prId = gitPullRequest.pullRequestId;
      let policies;
      if (projectId && prId) {
        policies = await this.getPullRequestPolicies(projectName, projectId, prId);
      }
      return convertDashboardPullRequest(gitPullRequest, this.webApi.serverUrl, policies);
    }));
  }
  async getPullRequestPolicies(projectName, projectId, pullRequestId) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Getting pull request policies for pull request id '${pullRequestId}'.`);
    const client = await this.webApi.getPolicyApi();
    const artifactId = getArtifactId(projectId, pullRequestId);
    const policyEvaluationRecords = await client.getPolicyEvaluations(projectName, artifactId);
    return policyEvaluationRecords.map(convertPolicy).filter((policy) => Boolean(policy));
  }
  async getAllTeams() {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug("Getting all teams.");
    const client = await this.webApi.getCoreApi();
    const webApiTeams = await client.getAllTeams();
    const teams = webApiTeams.map((team) => ({
      id: team.id,
      name: team.name,
      projectId: team.projectId,
      projectName: team.projectName
    }));
    return teams.sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
  }
  async getTeamMembers({
    projectId,
    teamId
  }) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Getting team member ids for team '${teamId}'.`);
    const client = await this.webApi.getCoreApi();
    const teamMembers = await client.getTeamMembersWithExtendedProperties(projectId, teamId);
    return teamMembers.map((teamMember) => {
      var _a2, _b, _c;
      return {
        id: (_a2 = teamMember.identity) == null ? void 0 : _a2.id,
        displayName: (_b = teamMember.identity) == null ? void 0 : _b.displayName,
        uniqueName: (_c = teamMember.identity) == null ? void 0 : _c.uniqueName
      };
    });
  }
  async getBuildDefinitions(projectName, definitionName) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Calling Azure DevOps REST API, getting Build Definitions for ${definitionName} in Project ${projectName}`);
    const client = await this.webApi.getBuildApi();
    return client.getDefinitions(projectName, definitionName);
  }
  async getBuilds(projectName, top, repoId, definitions) {
    var _a;
    (_a = this.logger) == null ? void 0 : _a.debug(`Calling Azure DevOps REST API, getting up to ${top} Builds for Repository Id ${repoId} for Project ${projectName}`);
    const client = await this.webApi.getBuildApi();
    return client.getBuilds(projectName, definitions, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, top, void 0, void 0, void 0, void 0, void 0, void 0, repoId, repoId ? "TfsGit" : void 0);
  }
  async getBuildRuns(projectName, top, repoName, definitionName) {
    let repoId;
    let definitions;
    if (repoName) {
      const gitRepository = await this.getGitRepository(projectName, repoName);
      repoId = gitRepository.id;
    }
    if (definitionName) {
      const buildDefinitions = await this.getBuildDefinitions(projectName, definitionName);
      definitions = buildDefinitions.map((bd) => bd.id).filter((bd) => Boolean(bd));
    }
    const builds = await this.getBuilds(projectName, top, repoId, definitions);
    const buildRuns = builds.map(mappedBuildRun);
    return buildRuns;
  }
}
function mappedRepoBuild(build) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  return {
    id: build.id,
    title: [(_a = build.definition) == null ? void 0 : _a.name, build.buildNumber].filter(Boolean).join(" - "),
    link: (_c = (_b = build._links) == null ? void 0 : _b.web.href) != null ? _c : "",
    status: (_d = build.status) != null ? _d : pluginAzureDevopsCommon.BuildStatus.None,
    result: (_e = build.result) != null ? _e : pluginAzureDevopsCommon.BuildResult.None,
    queueTime: (_f = build.queueTime) == null ? void 0 : _f.toISOString(),
    startTime: (_g = build.startTime) == null ? void 0 : _g.toISOString(),
    finishTime: (_h = build.finishTime) == null ? void 0 : _h.toISOString(),
    source: `${build.sourceBranch} (${(_i = build.sourceVersion) == null ? void 0 : _i.substr(0, 8)})`,
    uniqueName: (_k = (_j = build.requestedFor) == null ? void 0 : _j.uniqueName) != null ? _k : "N/A"
  };
}
function mappedGitTag(gitRef, linkBaseUrl, commitBaseUrl) {
  var _a, _b, _c, _d, _e, _f;
  return {
    objectId: gitRef.objectId,
    peeledObjectId: gitRef.peeledObjectId,
    name: (_a = gitRef.name) == null ? void 0 : _a.replace("refs/tags/", ""),
    createdBy: (_c = (_b = gitRef.creator) == null ? void 0 : _b.displayName) != null ? _c : "N/A",
    link: `${linkBaseUrl}${encodeURIComponent((_e = (_d = gitRef.name) == null ? void 0 : _d.replace("refs/tags/", "")) != null ? _e : "")}`,
    commitLink: `${commitBaseUrl}/${encodeURIComponent((_f = gitRef.peeledObjectId) != null ? _f : "")}`
  };
}
function mappedPullRequest(pullRequest, linkBaseUrl) {
  var _a, _b, _c, _d, _e, _f;
  return {
    pullRequestId: pullRequest.pullRequestId,
    repoName: (_a = pullRequest.repository) == null ? void 0 : _a.name,
    title: pullRequest.title,
    uniqueName: (_c = (_b = pullRequest.createdBy) == null ? void 0 : _b.uniqueName) != null ? _c : "N/A",
    createdBy: (_e = (_d = pullRequest.createdBy) == null ? void 0 : _d.displayName) != null ? _e : "N/A",
    creationDate: (_f = pullRequest.creationDate) == null ? void 0 : _f.toISOString(),
    sourceRefName: pullRequest.sourceRefName,
    targetRefName: pullRequest.targetRefName,
    status: pullRequest.status,
    isDraft: pullRequest.isDraft,
    link: `${linkBaseUrl}/${pullRequest.pullRequestId}`
  };
}
function mappedBuildRun(build) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  return {
    id: build.id,
    title: [(_a = build.definition) == null ? void 0 : _a.name, build.buildNumber].filter(Boolean).join(" - "),
    link: (_c = (_b = build._links) == null ? void 0 : _b.web.href) != null ? _c : "",
    status: (_d = build.status) != null ? _d : pluginAzureDevopsCommon.BuildStatus.None,
    result: (_e = build.result) != null ? _e : pluginAzureDevopsCommon.BuildResult.None,
    queueTime: (_f = build.queueTime) == null ? void 0 : _f.toISOString(),
    startTime: (_g = build.startTime) == null ? void 0 : _g.toISOString(),
    finishTime: (_h = build.finishTime) == null ? void 0 : _h.toISOString(),
    source: `${build.sourceBranch} (${(_i = build.sourceVersion) == null ? void 0 : _i.substr(0, 8)})`,
    uniqueName: (_k = (_j = build.requestedFor) == null ? void 0 : _j.uniqueName) != null ? _k : "N/A"
  };
}

class PullRequestsDashboardProvider {
  constructor(logger, azureDevOpsApi) {
    this.logger = logger;
    this.azureDevOpsApi = azureDevOpsApi;
    this.teams = /* @__PURE__ */ new Map();
    this.teamMembers = /* @__PURE__ */ new Map();
  }
  static async create(logger, azureDevOpsApi) {
    const provider = new PullRequestsDashboardProvider(logger, azureDevOpsApi);
    return provider;
  }
  async readTeams() {
    this.logger.info("Reading teams.");
    let teams = await this.azureDevOpsApi.getAllTeams();
    teams = teams.filter((team) => team.name && team.projectName ? team.name !== `${team.projectName} Team` : true);
    this.teams = /* @__PURE__ */ new Map();
    this.teamMembers = /* @__PURE__ */ new Map();
    const limiter = limiterFactory__default["default"](5);
    await Promise.all(teams.map((team) => limiter(async () => {
      const teamId = team.id;
      const projectId = team.projectId;
      if (teamId) {
        let teamMembers;
        if (projectId) {
          teamMembers = await this.azureDevOpsApi.getTeamMembers({
            projectId,
            teamId
          });
        }
        if (teamMembers) {
          team.members = teamMembers.reduce((arr, teamMember) => {
            var _a, _b;
            const teamMemberId = teamMember.id;
            if (teamMemberId) {
              arr.push(teamMemberId);
              const memberOf = [
                ...(_b = (_a = this.teamMembers.get(teamMemberId)) == null ? void 0 : _a.memberOf) != null ? _b : [],
                teamId
              ];
              this.teamMembers.set(teamMemberId, {
                ...teamMember,
                memberOf
              });
            }
            return arr;
          }, []);
          this.teams.set(teamId, team);
        }
      }
    })));
  }
  async getDashboardPullRequests(projectName, options) {
    const dashboardPullRequests = await this.azureDevOpsApi.getDashboardPullRequests(projectName, options);
    await this.getAllTeams();
    return dashboardPullRequests.map((pr) => {
      var _a, _b;
      if ((_a = pr.createdBy) == null ? void 0 : _a.id) {
        const teamIds = (_b = this.teamMembers.get(pr.createdBy.id)) == null ? void 0 : _b.memberOf;
        pr.createdBy.teamIds = teamIds;
        pr.createdBy.teamNames = teamIds == null ? void 0 : teamIds.map((teamId) => {
          var _a2, _b2;
          return (_b2 = (_a2 = this.teams.get(teamId)) == null ? void 0 : _a2.name) != null ? _b2 : "";
        });
      }
      return pr;
    });
  }
  async getUserTeamIds(email) {
    var _a, _b;
    await this.getAllTeams();
    return (_b = (_a = Array.from(this.teamMembers.values()).find((teamMember) => teamMember.uniqueName === email)) == null ? void 0 : _a.memberOf) != null ? _b : [];
  }
  async getAllTeams() {
    if (!this.teams.size) {
      await this.readTeams();
    }
    return Array.from(this.teams.values());
  }
}

const DEFAULT_TOP = 10;
async function createRouter(options) {
  const { logger } = options;
  const config = options.config.getConfig("azureDevOps");
  const token = config.getString("token");
  const host = config.getString("host");
  const organization = config.getString("organization");
  const authHandler = azureDevopsNodeApi.getPersonalAccessTokenHandler(token);
  const webApi = new azureDevopsNodeApi.WebApi(`https://${host}/${organization}`, authHandler);
  const azureDevOpsApi = options.azureDevOpsApi || new AzureDevOpsApi(logger, webApi);
  const pullRequestsDashboardProvider = await PullRequestsDashboardProvider.create(logger, azureDevOpsApi);
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  router.get("/repository/:projectName/:repoName", async (req, res) => {
    const { projectName, repoName } = req.params;
    const gitRepository = await azureDevOpsApi.getGitRepository(projectName, repoName);
    res.status(200).json(gitRepository);
  });
  router.get("/builds/:projectName/:repoId", async (req, res) => {
    const { projectName, repoId } = req.params;
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const buildList = await azureDevOpsApi.getBuildList(projectName, repoId, top);
    res.status(200).json(buildList);
  });
  router.get("/repo-builds/:projectName/:repoName", async (req, res) => {
    const { projectName, repoName } = req.params;
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const gitRepository = await azureDevOpsApi.getRepoBuilds(projectName, repoName, top);
    res.status(200).json(gitRepository);
  });
  router.get("/git-tags/:projectName/:repoName", async (req, res) => {
    const { projectName, repoName } = req.params;
    const gitTags = await azureDevOpsApi.getGitTags(projectName, repoName);
    res.status(200).json(gitTags);
  });
  router.get("/pull-requests/:projectName/:repoName", async (req, res) => {
    const { projectName, repoName } = req.params;
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const status = req.query.status ? Number(req.query.status) : pluginAzureDevopsCommon.PullRequestStatus.Active;
    const pullRequestOptions = {
      top,
      status
    };
    const gitPullRequest = await azureDevOpsApi.getPullRequests(projectName, repoName, pullRequestOptions);
    res.status(200).json(gitPullRequest);
  });
  router.get("/dashboard-pull-requests/:projectName", async (req, res) => {
    const { projectName } = req.params;
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const status = req.query.status ? Number(req.query.status) : pluginAzureDevopsCommon.PullRequestStatus.Active;
    const pullRequestOptions = {
      top,
      status
    };
    const pullRequests = await pullRequestsDashboardProvider.getDashboardPullRequests(projectName, pullRequestOptions);
    res.status(200).json(pullRequests);
  });
  router.get("/all-teams", async (_req, res) => {
    const allTeams = await pullRequestsDashboardProvider.getAllTeams();
    res.status(200).json(allTeams);
  });
  router.get("/build-definitions/:projectName/:definitionName", async (req, res) => {
    const { projectName, definitionName } = req.params;
    const buildDefinitionList = await azureDevOpsApi.getBuildDefinitions(projectName, definitionName);
    res.status(200).json(buildDefinitionList);
  });
  router.get("/builds/:projectName", async (req, res) => {
    var _a, _b;
    const { projectName } = req.params;
    const repoName = (_a = req.query.repoName) == null ? void 0 : _a.toString();
    const definitionName = (_b = req.query.definitionName) == null ? void 0 : _b.toString();
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const builds = await azureDevOpsApi.getBuildRuns(projectName, top, repoName, definitionName);
    res.status(200).json(builds);
  });
  router.get("/users/:userId/team-ids", async (req, res) => {
    const { userId } = req.params;
    const teamIds = await pullRequestsDashboardProvider.getUserTeamIds(userId);
    res.status(200).json(teamIds);
  });
  router.use(backendCommon.errorHandler());
  return router;
}

exports.AzureDevOpsApi = AzureDevOpsApi;
exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
