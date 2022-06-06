import React from 'react';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { i as isGithubDeploymentsAvailable, G as GITHUB_PROJECT_SLUG_ANNOTATION, a as GithubDeploymentsTable, g as githubDeploymentsApiRef } from './index-125bfbdc.esm.js';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ANNOTATION_SOURCE_LOCATION, ANNOTATION_LOCATION } from '@backstage/catalog-model';
import { MissingAnnotationEmptyState, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import '@backstage/integration-react';
import '@backstage/errors';
import '@octokit/graphql';
import '@material-ui/core';
import '@material-ui/icons/Sync';
import 'luxon';

const GithubDeploymentsComponent = ({
  projectSlug,
  last,
  lastStatuses,
  columns,
  host
}) => {
  const api = useApi(githubDeploymentsApiRef);
  const [owner, repo] = projectSlug.split("/");
  const {
    loading,
    value,
    error,
    retry: reload
  } = useAsyncRetry(async () => await api.listDeployments({
    host,
    owner,
    repo,
    last,
    lastStatuses
  }));
  if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  return /* @__PURE__ */ React.createElement(GithubDeploymentsTable, {
    deployments: value || [],
    isLoading: loading,
    reload,
    columns
  });
};
const GithubDeploymentsCard = (props) => {
  var _a, _b, _c;
  const { last, lastStatuses, columns } = props;
  const { entity } = useEntity();
  const [host] = [
    (_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[ANNOTATION_SOURCE_LOCATION],
    (_b = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _b[ANNOTATION_LOCATION]
  ].filter(Boolean);
  return !isGithubDeploymentsAvailable(entity) ? /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
    annotation: GITHUB_PROJECT_SLUG_ANNOTATION
  }) : /* @__PURE__ */ React.createElement(GithubDeploymentsComponent, {
    projectSlug: ((_c = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _c[GITHUB_PROJECT_SLUG_ANNOTATION]) || "",
    last: last || 10,
    lastStatuses: lastStatuses || 5,
    host,
    columns: columns || GithubDeploymentsTable.defaultDeploymentColumns
  });
};

export { GithubDeploymentsCard };
//# sourceMappingURL=GithubDeploymentsCard-489b944e.esm.js.map
