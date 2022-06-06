import { createRouteRef, createApiRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension, useApi, errorApiRef } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { SvgIcon, Card, CardHeader, CardContent, withStyles as withStyles$1, Paper, styled as styled$1, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { Avatar, Link, Page, Header, Content, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { PullRequestVoteStatus, PolicyType, PolicyEvaluationStatus } from '@backstage/plugin-azure-devops-common';
import { DateTime } from 'luxon';
import 'humanize-duration';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { makeStyles, withStyles, styled } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import useAsync from 'react-use/lib/useAsync';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import useInterval from 'react-use/lib/useInterval';

const AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION = "dev.azure.com/build-definition";
const AZURE_DEVOPS_PROJECT_ANNOTATION = "dev.azure.com/project";
const AZURE_DEVOPS_REPO_ANNOTATION = "dev.azure.com/project-repo";
const AZURE_DEVOPS_DEFAULT_TOP = 10;

const azurePullRequestDashboardRouteRef = createRouteRef({
  id: "azure-pull-request-dashboard"
});
const azurePipelinesEntityContentRouteRef = createRouteRef({
  id: "azure-pipelines-entity-content"
});
const azureGitTagsEntityContentRouteRef = createRouteRef({
  id: "azure-git-tags-entity-content"
});
const azurePullRequestsEntityContentRouteRef = createRouteRef({
  id: "azure-pull-requests-entity-content"
});

class AzureDevOpsClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  async getRepoBuilds(projectName, repoName, options) {
    const queryString = new URLSearchParams();
    if (options == null ? void 0 : options.top) {
      queryString.append("top", options.top.toString());
    }
    const urlSegment = `repo-builds/${encodeURIComponent(projectName)}/${encodeURIComponent(repoName)}?${queryString}`;
    const items = await this.get(urlSegment);
    return { items };
  }
  async getGitTags(projectName, repoName) {
    const urlSegment = `git-tags/${encodeURIComponent(projectName)}/${encodeURIComponent(repoName)}`;
    const items = await this.get(urlSegment);
    return { items };
  }
  async getPullRequests(projectName, repoName, options) {
    const queryString = new URLSearchParams();
    if (options == null ? void 0 : options.top) {
      queryString.append("top", options.top.toString());
    }
    if (options == null ? void 0 : options.status) {
      queryString.append("status", options.status.toString());
    }
    const urlSegment = `pull-requests/${encodeURIComponent(projectName)}/${encodeURIComponent(repoName)}?${queryString}`;
    const items = await this.get(urlSegment);
    return { items };
  }
  getDashboardPullRequests(projectName) {
    return this.get(`dashboard-pull-requests/${projectName}?top=100`);
  }
  getAllTeams() {
    return this.get("all-teams");
  }
  getUserTeamIds(userId) {
    return this.get(`users/${userId}/team-ids`);
  }
  async getBuildRuns(projectName, repoName, definitionName, options) {
    const queryString = new URLSearchParams();
    if (repoName) {
      queryString.append("repoName", repoName);
    }
    if (definitionName) {
      queryString.append("definitionName", definitionName);
    }
    if (options == null ? void 0 : options.top) {
      queryString.append("top", options.top.toString());
    }
    const urlSegment = `builds/${encodeURIComponent(projectName)}?${queryString}`;
    const items = await this.get(urlSegment);
    return { items };
  }
  async get(path) {
    const baseUrl = `${await this.discoveryApi.getBaseUrl("azure-devops")}/`;
    const url = new URL(path, baseUrl);
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url.toString(), {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {}
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }
}

const azureDevOpsApiRef = createApiRef({
  id: "plugin.azure-devops.service"
});

const isAzureDevOpsAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[AZURE_DEVOPS_REPO_ANNOTATION]);
};
const isAzurePipelinesAvailable = (entity) => {
  var _a, _b, _c;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[AZURE_DEVOPS_REPO_ANNOTATION]) || Boolean((_b = entity.metadata.annotations) == null ? void 0 : _b[AZURE_DEVOPS_PROJECT_ANNOTATION]) && Boolean((_c = entity.metadata.annotations) == null ? void 0 : _c[AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION]);
};
const azureDevOpsPlugin = createPlugin({
  id: "azureDevOps",
  apis: [
    createApiFactory({
      api: azureDevOpsApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => new AzureDevOpsClient({ discoveryApi, identityApi })
    })
  ]
});
const AzurePullRequestsPage = azureDevOpsPlugin.provide(createRoutableExtension({
  name: "AzurePullRequestsPage",
  component: () => import('./index-a478cf93.esm.js').then((m) => m.PullRequestsPage),
  mountPoint: azurePullRequestDashboardRouteRef
}));
const EntityAzurePipelinesContent = azureDevOpsPlugin.provide(createRoutableExtension({
  name: "EntityAzurePipelinesContent",
  component: () => import('./index-b07d578c.esm.js').then((m) => m.EntityPageAzurePipelines),
  mountPoint: azurePipelinesEntityContentRouteRef
}));
const EntityAzureGitTagsContent = azureDevOpsPlugin.provide(createRoutableExtension({
  name: "EntityAzureGitTagsContent",
  component: () => import('./index-47100e58.esm.js').then((m) => m.EntityPageAzureGitTags),
  mountPoint: azureGitTagsEntityContentRouteRef
}));
const EntityAzurePullRequestsContent = azureDevOpsPlugin.provide(createRoutableExtension({
  name: "EntityAzurePullRequestsContent",
  component: () => import('./index-8dbceb1f.esm.js').then((m) => m.EntityPageAzurePullRequests),
  mountPoint: azurePullRequestsEntityContentRouteRef
}));

const AzurePullRequestsIcon = (props) => /* @__PURE__ */ React.createElement(SvgIcon, {
  ...props,
  viewBox: "0 0 512 512"
}, /* @__PURE__ */ React.createElement("circle", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "32",
  cx: "128",
  cy: "416",
  r: "48"
}), /* @__PURE__ */ React.createElement("path", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "32",
  d: "M128 144v224M288 160l-64-64 64-64"
}), /* @__PURE__ */ React.createElement("circle", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "32",
  cx: "128",
  cy: "96",
  r: "48"
}), /* @__PURE__ */ React.createElement("circle", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "32",
  cx: "384",
  cy: "416",
  r: "48"
}), /* @__PURE__ */ React.createElement("path", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "32",
  d: "M240 96h84a60 60 0 0160 60v212"
}));

var FilterType = /* @__PURE__ */ ((FilterType2) => {
  FilterType2["All"] = "All";
  FilterType2["AssignedToUser"] = "AssignedToUser";
  FilterType2["AssignedToCurrentUser"] = "AssignedToCurrentUser";
  FilterType2["AssignedToTeam"] = "AssignedToTeam";
  FilterType2["AssignedToTeams"] = "AssignedToTeams";
  FilterType2["AssignedToCurrentUsersTeams"] = "AssignedToCurrentUsersTeams";
  FilterType2["CreatedByUser"] = "CreatedByUser";
  FilterType2["CreatedByCurrentUser"] = "CreatedByCurrentUser";
  FilterType2["CreatedByTeam"] = "CreatedByTeam";
  FilterType2["CreatedByTeams"] = "CreatedByTeams";
  FilterType2["CreatedByCurrentUsersTeams"] = "CreatedByCurrentUsersTeams";
  return FilterType2;
})(FilterType || {});

function createAllFilter() {
  return (_pullRequest) => true;
}

function arrayHas(arr, value) {
  return new Set(arr).has(value);
}
function stringArrayHas(arr, value, ignoreCase = false) {
  if (ignoreCase) {
    return arrayHas(arr.map((a) => a == null ? void 0 : a.toLocaleLowerCase("en-US")), value == null ? void 0 : value.toLocaleLowerCase("en-US"));
  }
  return arrayHas(arr, value);
}

function equalsIgnoreCase(str1, str2) {
  return str1.toLocaleLowerCase("en-US") === str2.toLocaleLowerCase("en-US");
}

function createAssignedToTeamFilter(filter) {
  return (pullRequest) => {
    var _a;
    const reviewerIds = (_a = pullRequest.reviewers) == null ? void 0 : _a.map((reviewer) => reviewer.id);
    if (!reviewerIds) {
      return false;
    }
    return stringArrayHas(reviewerIds, filter.teamId, true);
  };
}

function createAssignedToTeamsFilter(filter) {
  const teamIds = filter.teamIds;
  return (pullRequest) => {
    if (!teamIds) {
      return false;
    }
    return teamIds.some((teamId) => {
      return createAssignedToTeamFilter({
        type: FilterType.AssignedToTeam,
        teamId
      })(pullRequest);
    });
  };
}

function createAssignedToUserFilter(filter) {
  const email = filter.email;
  return (pullRequest) => {
    var _a;
    const uniqueNames = (_a = pullRequest.reviewers) == null ? void 0 : _a.map((reviewer) => reviewer.uniqueName);
    if (!email || !uniqueNames) {
      return false;
    }
    return stringArrayHas(uniqueNames, email, true);
  };
}

function createCreatedByTeamFilter(filter) {
  return (pullRequest) => {
    var _a, _b;
    const [createdByTeams, team] = "teamId" in filter ? [(_a = pullRequest.createdBy) == null ? void 0 : _a.teamIds, filter.teamId] : [(_b = pullRequest.createdBy) == null ? void 0 : _b.teamNames, filter.teamName];
    if (!createdByTeams) {
      return false;
    }
    return stringArrayHas(createdByTeams, team, true);
  };
}

function createCreatedByTeamsFilter(filter) {
  return (pullRequest) => {
    if ("teamNames" in filter) {
      const teamNames = filter.teamNames;
      if (!teamNames) {
        return false;
      }
      return teamNames.some((teamName) => {
        return createCreatedByTeamFilter({
          type: FilterType.CreatedByTeam,
          teamName
        })(pullRequest);
      });
    }
    const teamIds = filter.teamIds;
    if (!teamIds) {
      return false;
    }
    return teamIds.some((teamId) => {
      return createCreatedByTeamFilter({
        type: FilterType.CreatedByTeam,
        teamId
      })(pullRequest);
    });
  };
}

function createCreatedByUserFilter(filter) {
  const email = filter.email;
  return (pullRequest) => {
    var _a;
    const uniqueName = (_a = pullRequest.createdBy) == null ? void 0 : _a.uniqueName;
    if (!email || !uniqueName) {
      return false;
    }
    return equalsIgnoreCase(email, uniqueName);
  };
}

function createFilter(filters) {
  const mapFilter = (filter) => {
    switch (filter.type) {
      case FilterType.AssignedToUser:
      case FilterType.AssignedToCurrentUser:
        return createAssignedToUserFilter(filter);
      case FilterType.CreatedByUser:
      case FilterType.CreatedByCurrentUser:
        return createCreatedByUserFilter(filter);
      case FilterType.AssignedToTeam:
        return createAssignedToTeamFilter(filter);
      case FilterType.CreatedByTeam:
        return createCreatedByTeamFilter(filter);
      case FilterType.AssignedToTeams:
      case FilterType.AssignedToCurrentUsersTeams:
        return createAssignedToTeamsFilter(filter);
      case FilterType.CreatedByTeams:
      case FilterType.CreatedByCurrentUsersTeams:
        return createCreatedByTeamsFilter(filter);
      case FilterType.All:
        return createAllFilter();
      default:
        return (_) => false;
    }
  };
  if (Array.isArray(filters)) {
    if (filters.length === 1) {
      return mapFilter(filters[0]);
    }
    return (pullRequest) => filters.every((filter) => mapFilter(filter)(pullRequest));
  }
  return mapFilter(filters);
}

function reviewerFilter(reviewer) {
  return reviewer.voteStatus === PullRequestVoteStatus.NoVote ? !!reviewer.isRequired : !reviewer.isContainer;
}
function arrayExtract(arr, filter) {
  const extractedValues = [];
  for (let i = 0; i - extractedValues.length < arr.length; i++) {
    const offsetIndex = i - extractedValues.length;
    const value = arr[offsetIndex];
    if (filter(value)) {
      arr.splice(offsetIndex, 1);
      extractedValues.push(value);
    }
  }
  return extractedValues;
}
function getPullRequestGroups(pullRequests, configs) {
  if (!pullRequests) {
    return void 0;
  }
  const remainingPullRequests = [...pullRequests];
  const pullRequestGroups = [];
  configs.forEach(({ title, filter: configFilter, simplified }) => {
    const groupPullRequests = arrayExtract(remainingPullRequests, configFilter);
    pullRequestGroups.push({
      title,
      pullRequests: groupPullRequests,
      simplified
    });
  });
  return pullRequestGroups;
}
function getPullRequestGroupConfigs(columnConfigs, filterProcessor) {
  return columnConfigs.map((columnConfig) => {
    const filters = filterProcessor(columnConfig.filters);
    return {
      title: columnConfig.title,
      filter: createFilter(filters),
      simplified: columnConfig.simplified
    };
  });
}

const useStyles$1 = makeStyles((theme) => ({
  root: (props) => ({
    color: props.hasAutoComplete ? theme.palette.success.main : theme.palette.grey[400]
  })
}));
const AutoCompleteIcon = (props) => {
  const classes = useStyles$1(props);
  return /* @__PURE__ */ React.createElement(DoneAllIcon, {
    className: classes.root
  });
};

const PolicyRequiredIcon = withStyles((theme) => ({
  root: {
    color: theme.palette.info.main
  }
}), { name: "PolicyRequiredIcon" })(WatchLaterIcon);
const PolicyIssueIcon = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main
  }
}), { name: "PolicyIssueIcon" })(CancelIcon);
const PolicyInProgressIcon = withStyles((theme) => ({
  root: {
    color: theme.palette.info.main
  }
}), { name: "PolicyInProgressIcon" })(GroupWorkIcon);
function getPolicyIcon(policy) {
  switch (policy.type) {
    case PolicyType.Build:
      switch (policy.status) {
        case PolicyEvaluationStatus.Running:
          return /* @__PURE__ */ React.createElement(PolicyInProgressIcon, null);
        case PolicyEvaluationStatus.Rejected:
          return /* @__PURE__ */ React.createElement(PolicyIssueIcon, null);
        case PolicyEvaluationStatus.Queued:
          return /* @__PURE__ */ React.createElement(PolicyRequiredIcon, null);
        default:
          return null;
      }
    case PolicyType.MinimumReviewers:
    case PolicyType.RequiredReviewers:
      return /* @__PURE__ */ React.createElement(PolicyRequiredIcon, null);
    case PolicyType.Status:
    case PolicyType.Comments:
      return /* @__PURE__ */ React.createElement(PolicyIssueIcon, null);
    default:
      return null;
  }
}
const PullRequestCardPolicyContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap"
});
const PullRequestCardPolicy = ({
  policy
}) => /* @__PURE__ */ React.createElement(PullRequestCardPolicyContainer, null, getPolicyIcon(policy), " ", /* @__PURE__ */ React.createElement("span", null, policy.text));

const PullRequestCardPolicies = ({
  policies,
  className
}) => /* @__PURE__ */ React.createElement("div", {
  className
}, policies.map((policy) => /* @__PURE__ */ React.createElement(PullRequestCardPolicy, {
  key: policy.id,
  policy
})));

const PullRequestCardReviewer = ({
  reviewer
}) => /* @__PURE__ */ React.createElement(Avatar, {
  displayName: reviewer.displayName,
  picture: reviewer.imageUrl,
  customStyles: {
    width: "2.5rem",
    height: "2.5rem",
    fontSize: "1rem",
    border: "0.3rem solid silver"
  }
});

const PullRequestCardReviewersContainer = styled("div")({
  "& > *": {
    marginTop: 4,
    marginBottom: 4
  }
});
const PullRequestCardReviewers = ({
  reviewers
}) => /* @__PURE__ */ React.createElement(PullRequestCardReviewersContainer, null, reviewers.filter(reviewerFilter).map((reviewer) => /* @__PURE__ */ React.createElement(PullRequestCardReviewer, {
  key: reviewer.id,
  reviewer
})));

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.type === "dark" ? theme.palette.grey[700] : theme.palette.common.white
  },
  cardHeaderSimplified: {
    paddingBottom: theme.spacing(2)
  },
  cardHeaderAction: {
    display: "flex",
    alignSelf: "center",
    margin: 0
  },
  content: {
    display: "flex",
    flexDirection: "row"
  },
  policies: {
    flex: 1
  }
}), { name: "PullRequestCard" });
const PullRequestCard = ({
  pullRequest,
  simplified
}) => {
  var _a, _b, _c, _d, _e, _f;
  const title = /* @__PURE__ */ React.createElement(Link, {
    to: (_a = pullRequest.link) != null ? _a : "",
    title: pullRequest.description
  }, pullRequest.title);
  const repoLink = /* @__PURE__ */ React.createElement(Link, {
    to: (_c = (_b = pullRequest.repository) == null ? void 0 : _b.url) != null ? _c : "",
    color: "inherit"
  }, (_d = pullRequest.repository) == null ? void 0 : _d.name);
  const creationDate = pullRequest.creationDate ? DateTime.fromISO(pullRequest.creationDate).toRelative() : void 0;
  const subheader = /* @__PURE__ */ React.createElement("span", null, repoLink, " \xB7 ", creationDate);
  const avatar = /* @__PURE__ */ React.createElement(Avatar, {
    displayName: (_e = pullRequest.createdBy) == null ? void 0 : _e.displayName,
    picture: (_f = pullRequest.createdBy) == null ? void 0 : _f.imageUrl,
    customStyles: { width: "2.5rem", height: "2.5rem", fontSize: "1rem" }
  });
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Card, {
    classes: { root: classes.card },
    "data-pull-request-id": pullRequest.pullRequestId
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    avatar,
    title,
    subheader,
    action: /* @__PURE__ */ React.createElement(AutoCompleteIcon, {
      hasAutoComplete: pullRequest.hasAutoComplete
    }),
    classes: {
      ...simplified && { root: classes.cardHeaderSimplified },
      action: classes.cardHeaderAction
    }
  }), !simplified && /* @__PURE__ */ React.createElement(CardContent, {
    className: classes.content
  }, pullRequest.policies && /* @__PURE__ */ React.createElement(PullRequestCardPolicies, {
    policies: pullRequest.policies,
    className: classes.policies
  }), pullRequest.reviewers && /* @__PURE__ */ React.createElement(PullRequestCardReviewers, {
    reviewers: pullRequest.reviewers
  })));
};

const ColumnPaper = withStyles$1((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.type === "dark" ? theme.palette.grey[800] : theme.palette.grey[300],
    height: "100%"
  }
}))(Paper);
const ColumnTitleDiv = styled$1("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2)
}));
const PullRequestCardContainer = styled$1("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  "& > *": {
    marginBottom: theme.spacing(2)
  },
  "& > :last-of-type": {
    marginBottom: 0
  }
}));
const PullRequestGridColumn = ({
  pullRequestGroup
}) => {
  const columnTitle = /* @__PURE__ */ React.createElement(ColumnTitleDiv, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, pullRequestGroup.title));
  const pullRequests = /* @__PURE__ */ React.createElement(PullRequestCardContainer, null, pullRequestGroup.pullRequests.map((pullRequest) => /* @__PURE__ */ React.createElement(PullRequestCard, {
    key: pullRequest.pullRequestId,
    pullRequest,
    simplified: pullRequestGroup.simplified
  })));
  return /* @__PURE__ */ React.createElement(ColumnPaper, null, columnTitle, pullRequests);
};

const GridDiv = styled$1("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  "& > *": {
    marginRight: theme.spacing(2)
  },
  "& > :last-of-type": {
    marginRight: 0
  }
}));
const PullRequestGrid = ({
  pullRequestGroups
}) => {
  return /* @__PURE__ */ React.createElement(GridDiv, null, pullRequestGroups.map((pullRequestGroup, index) => /* @__PURE__ */ React.createElement(PullRequestGridColumn, {
    key: index,
    pullRequestGroup
  })));
};

const POLLING_INTERVAL = 1e4;
function useDashboardPullRequests(project, pollingInterval = POLLING_INTERVAL) {
  const api = useApi(azureDevOpsApiRef);
  const errorApi = useApi(errorApiRef);
  const getDashboardPullRequests = useCallback(async () => {
    if (!project) {
      return Promise.reject(new Error("Missing project name"));
    }
    try {
      return await api.getDashboardPullRequests(project);
    } catch (error2) {
      if (error2 instanceof Error) {
        errorApi.post(error2);
      }
      return Promise.reject(error2);
    }
  }, [project, api, errorApi]);
  const {
    value: pullRequests,
    loading,
    error,
    retry
  } = useAsyncRetry(() => getDashboardPullRequests(), [getDashboardPullRequests]);
  useInterval(() => retry(), pollingInterval);
  return {
    pullRequests,
    loading,
    error
  };
}

function useUserEmail() {
  var _a;
  const identityApi = useApi(identityApiRef);
  const state = useAsync(() => identityApi.getProfileInfo(), [identityApi]);
  return (_a = state.value) == null ? void 0 : _a.email;
}

function useUserTeamIds(userId) {
  const api = useApi(azureDevOpsApiRef);
  const {
    value: teamIds,
    loading,
    error
  } = useAsync(() => {
    return userId ? api.getUserTeamIds(userId) : Promise.resolve(void 0);
  }, [api]);
  return {
    teamIds,
    loading,
    error
  };
}

function useFilterProcessor() {
  const userEmail = useUserEmail();
  const { teamIds } = useUserTeamIds(userEmail);
  return (filters) => {
    for (const filter of filters) {
      switch (filter.type) {
        case FilterType.AssignedToCurrentUser:
        case FilterType.CreatedByCurrentUser:
          filter.email = userEmail;
          break;
        case FilterType.AssignedToCurrentUsersTeams:
        case FilterType.CreatedByCurrentUsersTeams:
          filter.teamIds = teamIds;
          break;
      }
    }
    return filters;
  };
}

const PullRequestsPageContent = ({
  pullRequestGroups,
  loading,
  error
}) => {
  if (loading && (!pullRequestGroups || pullRequestGroups.length <= 0)) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  return /* @__PURE__ */ React.createElement(PullRequestGrid, {
    pullRequestGroups: pullRequestGroups != null ? pullRequestGroups : []
  });
};
const DEFAULT_COLUMN_CONFIGS = [
  {
    title: "Created by me",
    filters: [{ type: FilterType.CreatedByCurrentUser }],
    simplified: false
  },
  {
    title: "Other PRs",
    filters: [{ type: FilterType.All }],
    simplified: true
  }
];
const PullRequestsPage = ({
  projectName,
  pollingInterval,
  defaultColumnConfigs
}) => {
  const { pullRequests, loading, error } = useDashboardPullRequests(projectName, pollingInterval);
  const [columnConfigs] = useState(defaultColumnConfigs != null ? defaultColumnConfigs : DEFAULT_COLUMN_CONFIGS);
  const filterProcessor = useFilterProcessor();
  const pullRequestGroupConfigs = getPullRequestGroupConfigs(columnConfigs, filterProcessor);
  const pullRequestGroups = getPullRequestGroups(pullRequests, pullRequestGroupConfigs);
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Azure Pull Requests"
  }), /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(PullRequestsPageContent, {
    pullRequestGroups,
    loading,
    error
  })));
};

export { AZURE_DEVOPS_REPO_ANNOTATION as A, EntityAzurePipelinesContent as E, FilterType as F, PullRequestsPage as P, AZURE_DEVOPS_PROJECT_ANNOTATION as a, AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION as b, azureDevOpsApiRef as c, AZURE_DEVOPS_DEFAULT_TOP as d, AzurePullRequestsIcon as e, azureDevOpsPlugin as f, EntityAzureGitTagsContent as g, EntityAzurePullRequestsContent as h, isAzureDevOpsAvailable as i, isAzurePipelinesAvailable as j, AzurePullRequestsPage as k };
//# sourceMappingURL=index-00a5c1e5.esm.js.map
