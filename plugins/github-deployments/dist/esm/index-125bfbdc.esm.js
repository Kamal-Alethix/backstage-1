import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { parseLocationRef } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import { graphql } from '@octokit/graphql';
import { createApiRef, createPlugin, createApiFactory, githubAuthApiRef, createComponentExtension } from '@backstage/core-plugin-api';
import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import { DateTime } from 'luxon';
import { StatusAborted, StatusError, StatusOK, StatusRunning, StatusPending, Link, Table } from '@backstage/core-components';

const getBaseUrl = (scmIntegrationsApi, host) => {
  if (host === void 0) {
    return "https://api.github.com";
  }
  const location = parseLocationRef(host);
  if (location.type !== "url") {
    return "https://api.github.com";
  }
  const config = scmIntegrationsApi.github.byUrl(location.target);
  if (!config) {
    throw new InputError(`No matching GitHub integration configuration for host ${new URL(location.target).hostname}, please check your integrations config`);
  }
  if (!config.config.apiBaseUrl) {
    throw new InputError(`No apiBaseUrl available for host ${new URL(location.target).hostname}, please check your integrations config`);
  }
  return config == null ? void 0 : config.config.apiBaseUrl;
};
const githubDeploymentsApiRef = createApiRef({
  id: "plugin.github-deployments.service"
});
const deploymentsQuery = `
query deployments($owner: String!, $repo: String!, $last: Int, $lastStatuses: Int) {
  repository(owner: $owner, name: $repo) {
    deployments(last: $last) {
      nodes {
        state
        environment
        updatedAt
        commit {
          abbreviatedOid
          commitUrl
        }
        statuses(last: $lastStatuses) {
          nodes {
            logUrl
          }
        }
        creator {
          login
        }
        repository {
          nameWithOwner
        }
        payload
      }
    }
  }
}
`;
class GithubDeploymentsApiClient {
  constructor(options) {
    this.githubAuthApi = options.githubAuthApi;
    this.scmIntegrationsApi = options.scmIntegrationsApi;
  }
  async listDeployments(params) {
    var _a, _b, _c;
    const baseUrl = getBaseUrl(this.scmIntegrationsApi, params.host);
    const token = await this.githubAuthApi.getAccessToken(["repo"]);
    const graphQLWithAuth = graphql.defaults({
      baseUrl,
      headers: {
        authorization: `token ${token}`
      }
    });
    const response = await graphQLWithAuth(deploymentsQuery, params);
    return ((_c = (_b = (_a = response.repository) == null ? void 0 : _a.deployments) == null ? void 0 : _b.nodes) == null ? void 0 : _c.reverse()) || [];
  }
}

const githubDeploymentsPlugin = createPlugin({
  id: "github-deployments",
  apis: [
    createApiFactory({
      api: githubDeploymentsApiRef,
      deps: {
        scmIntegrationsApi: scmIntegrationsApiRef,
        githubAuthApi: githubAuthApiRef
      },
      factory: ({ scmIntegrationsApi, githubAuthApi }) => new GithubDeploymentsApiClient({ scmIntegrationsApi, githubAuthApi })
    })
  ]
});
const EntityGithubDeploymentsCard = githubDeploymentsPlugin.provide(createComponentExtension({
  name: "EntityGithubDeploymentsCard",
  component: {
    lazy: () => import('./GithubDeploymentsCard-489b944e.esm.js').then((m) => m.GithubDeploymentsCard)
  }
}));

const GithubStateIndicator = (props) => {
  switch (props.state) {
    case "PENDING":
      return /* @__PURE__ */ React.createElement(StatusPending, null);
    case "IN_PROGRESS":
      return /* @__PURE__ */ React.createElement(StatusRunning, null);
    case "ACTIVE":
      return /* @__PURE__ */ React.createElement(StatusOK, null);
    case "ERROR":
    case "FAILURE":
      return /* @__PURE__ */ React.createElement(StatusError, null);
    default:
      return /* @__PURE__ */ React.createElement(StatusAborted, null);
  }
};
function createEnvironmentColumn() {
  return {
    title: "Environment",
    field: "environment",
    highlight: true
  };
}
function createStatusColumn() {
  return {
    title: "Status",
    render: (row) => /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(GithubStateIndicator, {
      state: row.state
    }), /* @__PURE__ */ React.createElement(Typography, {
      variant: "caption"
    }, row.state))
  };
}
function createCommitColumn() {
  return {
    title: "Commit",
    render: (row) => row.commit && /* @__PURE__ */ React.createElement(Link, {
      to: row.commit.commitUrl,
      target: "_blank",
      rel: "noopener"
    }, row.commit.abbreviatedOid)
  };
}
function createCreatorColumn() {
  return {
    title: "Creator",
    field: "creator.login"
  };
}
function createLastUpdatedColumn() {
  return {
    title: "Last Updated",
    render: (row) => /* @__PURE__ */ React.createElement(Box, null, DateTime.fromISO(row.updatedAt).toRelative({ locale: "en" }))
  };
}

var columnFactories = /*#__PURE__*/Object.freeze({
  __proto__: null,
  GithubStateIndicator: GithubStateIndicator,
  createEnvironmentColumn: createEnvironmentColumn,
  createStatusColumn: createStatusColumn,
  createCommitColumn: createCommitColumn,
  createCreatorColumn: createCreatorColumn,
  createLastUpdatedColumn: createLastUpdatedColumn
});

const defaultDeploymentColumns = [
  createEnvironmentColumn(),
  createStatusColumn(),
  createCommitColumn(),
  createCreatorColumn(),
  createLastUpdatedColumn()
];

const useStyles = makeStyles((theme) => ({
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
function GithubDeploymentsTable(props) {
  const { deployments, isLoading, reload, columns } = props;
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Table, {
    columns,
    options: { padding: "dense", paging: true, search: false, pageSize: 5 },
    title: "GitHub Deployments",
    data: deployments,
    isLoading,
    actions: [
      {
        icon: () => /* @__PURE__ */ React.createElement(SyncIcon, null),
        tooltip: "Reload",
        isFreeAction: true,
        onClick: () => reload()
      }
    ],
    emptyContent: /* @__PURE__ */ React.createElement("div", {
      className: classes.empty
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "body1"
    }, "No deployments found for this entity."))
  });
}
GithubDeploymentsTable.columns = columnFactories;
GithubDeploymentsTable.defaultDeploymentColumns = defaultDeploymentColumns;

const GITHUB_PROJECT_SLUG_ANNOTATION = "github.com/project-slug";
const isGithubDeploymentsAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[GITHUB_PROJECT_SLUG_ANNOTATION]);
};

export { EntityGithubDeploymentsCard as E, GITHUB_PROJECT_SLUG_ANNOTATION as G, GithubDeploymentsTable as a, githubDeploymentsPlugin as b, githubDeploymentsApiRef as g, isGithubDeploymentsAvailable as i };
//# sourceMappingURL=index-125bfbdc.esm.js.map
