import { ButtonGroup, Button, Box, Chip } from '@material-ui/core';
import { ResponseErrorPanel, Table, Link } from '@backstage/core-components';
import { PullRequestStatus } from '@backstage/plugin-azure-devops-common';
import React, { useState } from 'react';
import { c as azureDevOpsApiRef, d as AZURE_DEVOPS_DEFAULT_TOP, e as AzurePullRequestsIcon } from './index-00a5c1e5.esm.js';
import { DateTime } from 'luxon';
import { useEntity } from '@backstage/plugin-catalog-react';
import '@backstage/errors';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { u as useProjectRepoFromEntity } from './useProjectRepoFromEntity-c5be856f.esm.js';
import 'humanize-duration';
import '@material-ui/icons/DoneAll';
import '@material-ui/core/styles';
import '@material-ui/icons/Cancel';
import '@material-ui/icons/GroupWork';
import '@material-ui/icons/WatchLater';
import 'react-use/lib/useAsyncRetry';
import 'react-use/lib/useInterval';

function usePullRequests(entity, defaultLimit, requestedStatus) {
  const top = defaultLimit != null ? defaultLimit : AZURE_DEVOPS_DEFAULT_TOP;
  const status = requestedStatus != null ? requestedStatus : PullRequestStatus.Active;
  const options = {
    top,
    status
  };
  const api = useApi(azureDevOpsApiRef);
  const { project, repo } = useProjectRepoFromEntity(entity);
  const { value, loading, error } = useAsync(() => {
    return api.getPullRequests(project, repo, options);
  }, [api, project, repo, top, status]);
  return {
    items: value == null ? void 0 : value.items,
    loading,
    error
  };
}

const PullRequestStatusButtonGroup = ({
  status,
  setStatus
}) => {
  return /* @__PURE__ */ React.createElement(ButtonGroup, {
    "aria-label": "outlined button group"
  }, /* @__PURE__ */ React.createElement(Button, {
    color: status === PullRequestStatus.Active ? "primary" : "default",
    onClick: () => {
      setStatus(PullRequestStatus.Active);
    }
  }, "Active"), /* @__PURE__ */ React.createElement(Button, {
    color: status === PullRequestStatus.Completed ? "primary" : "default",
    onClick: () => {
      setStatus(PullRequestStatus.Completed);
    }
  }, "Completed"), /* @__PURE__ */ React.createElement(Button, {
    color: status === PullRequestStatus.Abandoned ? "primary" : "default",
    onClick: () => {
      setStatus(PullRequestStatus.Abandoned);
    }
  }, "Abandoned"));
};

const columns = [
  {
    title: "ID",
    field: "pullRequestId",
    highlight: false,
    width: "auto"
  },
  {
    title: "Title",
    field: "title",
    width: "auto",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Box, {
        display: "flex",
        alignItems: "center"
      }, /* @__PURE__ */ React.createElement(Link, {
        to: (_a = row.link) != null ? _a : ""
      }, row.title), row.isDraft && /* @__PURE__ */ React.createElement(Box, {
        paddingLeft: 1
      }, /* @__PURE__ */ React.createElement(Chip, {
        label: "Draft",
        variant: "outlined",
        color: "secondary",
        size: "small"
      })));
    }
  },
  {
    title: "Source",
    field: "sourceRefName",
    width: "auto"
  },
  {
    title: "Target",
    field: "targetRefName",
    width: "auto"
  },
  {
    title: "Created By",
    field: "createdBy",
    width: "auto"
  },
  {
    title: "Created",
    field: "creationDate",
    width: "auto",
    render: (row) => (row.creationDate ? DateTime.fromISO(row.creationDate) : DateTime.now()).toRelative()
  }
];
const PullRequestTable = ({ defaultLimit }) => {
  const [pullRequestStatusState, setPullRequestStatusState] = useState(PullRequestStatus.Active);
  const { entity } = useEntity();
  const { items, loading, error } = usePullRequests(entity, defaultLimit, pullRequestStatusState);
  if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  return /* @__PURE__ */ React.createElement(Table, {
    isLoading: loading,
    columns,
    options: {
      search: true,
      paging: true,
      pageSize: 5,
      showEmptyDataSourceMessage: !loading
    },
    title: /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(AzurePullRequestsIcon, {
      style: { fontSize: 30 }
    }), /* @__PURE__ */ React.createElement(Box, {
      mr: 1
    }), "Azure Repos - Pull Requests (", items ? items.length : 0, ")", /* @__PURE__ */ React.createElement(Box, {
      position: "absolute",
      right: 320,
      top: 20
    }, /* @__PURE__ */ React.createElement(PullRequestStatusButtonGroup, {
      status: pullRequestStatusState,
      setStatus: setPullRequestStatusState
    }))),
    data: items != null ? items : []
  });
};

const EntityPageAzurePullRequests = ({
  defaultLimit
}) => {
  return /* @__PURE__ */ React.createElement(PullRequestTable, {
    defaultLimit
  });
};

export { EntityPageAzurePullRequests };
//# sourceMappingURL=index-8dbceb1f.esm.js.map
