import { createApiRef, createRouteRef, createSubRouteRef, createPlugin, createApiFactory, googleAuthApiRef, createRoutableExtension, createComponentExtension, useApi, errorApiRef, useRouteRef } from '@backstage/core-plugin-api';
import React, { useState, useEffect } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Routes, Route } from 'react-router';
import { makeStyles, LinearProgress, Box, Typography, TableContainer, Paper, Table, TableBody, TableRow, TableCell, Link as Link$1, Tooltip, IconButton } from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import qs from 'qs';
import useAsync from 'react-use/lib/useAsync';
import { StatusPending, StatusError, StatusAborted, StatusOK, StatusRunning, WarningPanel, Breadcrumbs, Link, Table as Table$1, MissingAnnotationEmptyState, InfoCard, StructuredMetadataTable } from '@backstage/core-components';
import { useParams, Link as Link$2 } from 'react-router-dom';
import RetryIcon from '@material-ui/icons/Replay';
import GoogleIcon from '@material-ui/icons/CloudCircle';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import SyncIcon from '@material-ui/icons/Sync';
import { DateTime } from 'luxon';

const cloudbuildApiRef = createApiRef({
  id: "plugin.cloudbuild.service"
});

class CloudbuildClient {
  constructor(googleAuthApi) {
    this.googleAuthApi = googleAuthApi;
  }
  async reRunWorkflow({
    projectId,
    runId
  }) {
    await fetch(`https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/builds/${encodeURIComponent(runId)}:retry`, {
      headers: new Headers({
        Accept: "*/*",
        Authorization: `Bearer ${await this.getToken()}`
      })
    });
  }
  async listWorkflowRuns({
    projectId
  }) {
    const workflowRuns = await fetch(`https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/builds`, {
      headers: new Headers({
        Accept: "*/*",
        Authorization: `Bearer ${await this.getToken()}`
      })
    });
    const builds = await workflowRuns.json();
    return builds;
  }
  async getWorkflow({
    projectId,
    id
  }) {
    const workflow = await fetch(`https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/builds/${encodeURIComponent(id)}`, {
      headers: new Headers({
        Accept: "*/*",
        Authorization: `Bearer ${await this.getToken()}`
      })
    });
    const build = await workflow.json();
    return build;
  }
  async getWorkflowRun({
    projectId,
    id
  }) {
    const workflow = await fetch(`https://cloudbuild.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/builds/${encodeURIComponent(id)}`, {
      headers: new Headers({
        Accept: "*/*",
        Authorization: `Bearer ${await this.getToken()}`
      })
    });
    const build = await workflow.json();
    return build;
  }
  async getToken() {
    return this.googleAuthApi.getAccessToken("https://www.googleapis.com/auth/cloud-platform");
  }
}

const rootRouteRef = createRouteRef({
  id: "cloudbuild"
});
const buildRouteRef = createSubRouteRef({
  id: "cloudbuild/run",
  path: "/:id",
  parent: rootRouteRef
});

const cloudbuildPlugin = createPlugin({
  id: "cloudbuild",
  apis: [
    createApiFactory({
      api: cloudbuildApiRef,
      deps: { googleAuthApi: googleAuthApiRef },
      factory({ googleAuthApi }) {
        return new CloudbuildClient(googleAuthApi);
      }
    })
  ],
  routes: {
    entityContent: rootRouteRef
  }
});
const EntityCloudbuildContent = cloudbuildPlugin.provide(createRoutableExtension({
  name: "EntityCloudbuildContent",
  component: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.Router),
  mountPoint: rootRouteRef
}));
const EntityLatestCloudbuildRunCard = cloudbuildPlugin.provide(createComponentExtension({
  name: "EntityLatestCloudbuildRunCard",
  component: {
    lazy: () => import('./esm/index-26b4acd6.esm.js').then((m) => m.LatestWorkflowRunCard)
  }
}));
const EntityLatestCloudbuildsForBranchCard = cloudbuildPlugin.provide(createComponentExtension({
  name: "EntityLatestCloudbuildsForBranchCard",
  component: {
    lazy: () => import('./esm/index-26b4acd6.esm.js').then((m) => m.LatestWorkflowsForBranchCard)
  }
}));

const CLOUDBUILD_ANNOTATION = "google.com/cloudbuild-project-slug";
const useProjectName = (entity) => {
  const { value, loading, error } = useAsync(async () => {
    var _a, _b;
    return (_b = (_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[CLOUDBUILD_ANNOTATION]) != null ? _b : "";
  });
  return { value, loading, error };
};

const WorkflowRunStatus = ({
  status
}) => {
  if (status === void 0)
    return null;
  switch (status.toLocaleLowerCase("en-US")) {
    case "queued":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusPending, null), " Queued");
    case "working":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusRunning, null), " In progress");
    case "success":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusOK, null), " Completed");
    case "cancelled":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusAborted, null), " Cancelled");
    case "failure":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusError, null), " Failed");
    default:
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusPending, null), " Pending");
  }
};

const useWorkflowRunsDetails = (projectId) => {
  const api = useApi(cloudbuildApiRef);
  const { id } = useParams();
  const details = useAsync(async () => {
    return projectId ? api.getWorkflowRun({
      projectId,
      id
    }) : Promise.reject("No projectId provided");
  }, [projectId, id]);
  return details;
};

const useStyles$1 = makeStyles((theme) => ({
  root: {
    maxWidth: 720,
    margin: theme.spacing(2)
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0)
  },
  table: {
    padding: theme.spacing(1)
  },
  accordionDetails: {
    padding: 0
  },
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: "-20px"
  },
  externalLinkIcon: {
    fontSize: "inherit",
    verticalAlign: "bottom"
  }
}));
const WorkflowRunDetails = ({ entity }) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const { value: projectName, loading, error } = useProjectName(entity);
  const [projectId] = (projectName != null ? projectName : "/").split("/");
  const details = useWorkflowRunsDetails(projectId);
  const classes = useStyles$1();
  if (error) {
    return /* @__PURE__ */ React.createElement(WarningPanel, {
      title: "Error:"
    }, "Failed to load build, ", error.message, ".");
  } else if (loading) {
    return /* @__PURE__ */ React.createElement(LinearProgress, null);
  } else if (((_a = details.value) == null ? void 0 : _a.logUrl) === void 0) {
    return /* @__PURE__ */ React.createElement(LinearProgress, null);
  }
  const serviceAccount = qs.parse(new URL((_b = details.value) == null ? void 0 : _b.logUrl).search, {
    ignoreQueryPrefix: true
  }).project;
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Box, {
    mb: 3
  }, /* @__PURE__ */ React.createElement(Breadcrumbs, {
    "aria-label": "breadcrumb"
  }, /* @__PURE__ */ React.createElement(Link, {
    to: ".."
  }, "Build history"), /* @__PURE__ */ React.createElement(Typography, null, "Build details"))), /* @__PURE__ */ React.createElement(TableContainer, {
    component: Paper,
    className: classes.table
  }, /* @__PURE__ */ React.createElement(Table, null, /* @__PURE__ */ React.createElement(TableBody, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Branch")), /* @__PURE__ */ React.createElement(TableCell, null, (_c = details.value) == null ? void 0 : _c.substitutions.BRANCH_NAME)), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Message")), /* @__PURE__ */ React.createElement(TableCell, null, (_d = details.value) == null ? void 0 : _d.substitutions.REPO_NAME)), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Commit ID")), /* @__PURE__ */ React.createElement(TableCell, null, (_e = details.value) == null ? void 0 : _e.substitutions.COMMIT_SHA)), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Status")), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(WorkflowRunStatus, {
    status: (_f = details.value) == null ? void 0 : _f.status
  }))), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Service Account")), /* @__PURE__ */ React.createElement(TableCell, null, `${serviceAccount}`, "@cloudbuild.gserviceaccount.com")), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Links")), /* @__PURE__ */ React.createElement(TableCell, null, ((_g = details.value) == null ? void 0 : _g.logUrl) && /* @__PURE__ */ React.createElement(Link$1, {
    target: "_blank",
    href: details.value.logUrl
  }, "Workflow runs on Google", " ", /* @__PURE__ */ React.createElement(ExternalLinkIcon, {
    className: classes.externalLinkIcon
  }))))))));
};

function useWorkflowRuns({ projectId }) {
  const api = useApi(cloudbuildApiRef);
  const errorApi = useApi(errorApiRef);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const {
    loading,
    value: runs,
    retry,
    error
  } = useAsyncRetry(async () => {
    return api.listWorkflowRuns({
      projectId
    }).then((workflowRunsData) => {
      setTotal(workflowRunsData.builds.length);
      return workflowRunsData.builds.map((run) => ({
        message: run.substitutions.REPO_NAME,
        id: run.id,
        rerun: async () => {
          try {
            await api.reRunWorkflow({
              projectId,
              runId: run.id
            });
          } catch (e) {
            errorApi.post(e);
          }
        },
        substitutions: run.substitutions,
        source: {
          branchName: run.substitutions.REPO_NAME,
          commit: {
            hash: run.substitutions.COMMIT_SHA,
            url: run.substitutions.REPO_NAME
          }
        },
        status: run.status,
        url: run.logUrl,
        googleUrl: run.logUrl,
        createTime: run.createTime
      }));
    });
  }, [page, pageSize, projectId]);
  return [
    {
      page,
      pageSize,
      loading,
      runs,
      projectName: `${projectId}`,
      total,
      error
    },
    {
      runs,
      setPage,
      setPageSize,
      retry
    }
  ];
}

const generatedColumns = [
  {
    title: "Status",
    width: "150px",
    render: (row) => /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(WorkflowRunStatus, {
      status: row.status
    }))
  },
  {
    title: "Build",
    field: "id",
    type: "numeric",
    width: "150px",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Typography, {
        variant: "body2",
        noWrap: true
      }, (_a = row.id) == null ? void 0 : _a.substring(0, 8));
    }
  },
  {
    title: "Source",
    field: "source",
    highlight: true,
    width: "200px",
    render: (row) => {
      const LinkWrapper = () => {
        const routeLink = useRouteRef(buildRouteRef);
        return /* @__PURE__ */ React.createElement(Link$1, {
          component: Link$2,
          "data-testid": "cell-source",
          to: routeLink({ id: row.id })
        }, row.message);
      };
      return /* @__PURE__ */ React.createElement(LinkWrapper, null);
    }
  },
  {
    title: "Ref",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Typography, {
        variant: "body2",
        noWrap: true
      }, (_a = row.substitutions) == null ? void 0 : _a.BRANCH_NAME);
    }
  },
  {
    title: "Commit",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Typography, {
        variant: "body2",
        noWrap: true
      }, (_a = row.substitutions) == null ? void 0 : _a.SHORT_SHA);
    }
  },
  {
    title: "Created",
    render: (row) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Typography, {
        "data-testid": "cell-created",
        variant: "body2",
        noWrap: true
      }, DateTime.fromISO((_a = row.createTime) != null ? _a : DateTime.now().toISO()).toFormat("dd-MM-yyyy hh:mm:ss"));
    }
  },
  {
    title: "Actions",
    render: (row) => /* @__PURE__ */ React.createElement(Tooltip, {
      title: "Rerun workflow"
    }, /* @__PURE__ */ React.createElement(IconButton, {
      "data-testid": "action-rerun",
      onClick: row.rerun
    }, /* @__PURE__ */ React.createElement(RetryIcon, null))),
    width: "10%"
  }
];
const WorkflowRunsTableView = ({
  projectName,
  loading,
  pageSize,
  page,
  retry,
  runs,
  onChangePage,
  onChangePageSize,
  total
}) => {
  return /* @__PURE__ */ React.createElement(Table$1, {
    isLoading: loading,
    options: { paging: true, pageSize, padding: "dense" },
    totalCount: total,
    page,
    actions: [
      {
        icon: () => /* @__PURE__ */ React.createElement(SyncIcon, null),
        tooltip: "Reload workflow runs",
        isFreeAction: true,
        onClick: () => retry()
      }
    ],
    data: runs != null ? runs : [],
    onPageChange: onChangePage,
    onRowsPerPageChange: onChangePageSize,
    style: { width: "100%" },
    title: /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(GoogleIcon, null), /* @__PURE__ */ React.createElement(Box, {
      mr: 1
    }), /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, projectName)),
    columns: generatedColumns
  });
};
const WorkflowRunsTable = ({ entity }) => {
  const { value: projectName, loading } = useProjectName(entity);
  const [projectId] = (projectName != null ? projectName : "/").split("/");
  const [tableProps, { retry, setPage, setPageSize }] = useWorkflowRuns({
    projectId
  });
  return /* @__PURE__ */ React.createElement(WorkflowRunsTableView, {
    ...tableProps,
    loading: loading || tableProps.loading,
    retry,
    onChangePageSize: setPageSize,
    onChangePage: setPage
  });
};

const isCloudbuildAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[CLOUDBUILD_ANNOTATION]);
};
const Router = () => {
  const { entity } = useEntity();
  if (!isCloudbuildAvailable(entity)) {
    return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
      annotation: CLOUDBUILD_ANNOTATION
    });
  }
  return /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    element: /* @__PURE__ */ React.createElement(WorkflowRunsTable, {
      entity
    })
  }), /* @__PURE__ */ React.createElement(Route, {
    path: `${buildRouteRef.path}`,
    element: /* @__PURE__ */ React.createElement(WorkflowRunDetails, {
      entity
    })
  }));
};

var Router$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isCloudbuildAvailable: isCloudbuildAvailable,
  Router: Router
});

const useStyles = makeStyles({
  externalLinkIcon: {
    fontSize: "inherit",
    verticalAlign: "bottom"
  }
});
const WidgetContent = ({
  error,
  loading,
  lastRun,
  branch
}) => {
  var _a;
  const classes = useStyles();
  if (error)
    return /* @__PURE__ */ React.createElement(WarningPanel, null, "Couldn't fetch latest ", branch, " run");
  if (loading)
    return /* @__PURE__ */ React.createElement(LinearProgress, null);
  return /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
    metadata: {
      status: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(WorkflowRunStatus, {
        status: lastRun.status
      })),
      message: lastRun.message,
      url: /* @__PURE__ */ React.createElement(Link, {
        to: (_a = lastRun.googleUrl) != null ? _a : ""
      }, "See more on Google", " ", /* @__PURE__ */ React.createElement(ExternalLinkIcon, {
        className: classes.externalLinkIcon
      }))
    }
  });
};
const LatestWorkflowRunCard = ({
  branch = "master"
}) => {
  var _a, _b;
  const { entity } = useEntity();
  const errorApi = useApi(errorApiRef);
  const projectId = ((_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[CLOUDBUILD_ANNOTATION]) || "";
  const [{ runs, loading, error }] = useWorkflowRuns({
    projectId
  });
  const lastRun = (_b = runs == null ? void 0 : runs[0]) != null ? _b : {};
  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: `Last ${branch} build`
  }, /* @__PURE__ */ React.createElement(WidgetContent, {
    error,
    loading,
    branch,
    lastRun
  }));
};
const LatestWorkflowsForBranchCard = ({
  branch = "master"
}) => {
  const { entity } = useEntity();
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: `Last ${branch} build`
  }, /* @__PURE__ */ React.createElement(WorkflowRunsTable, {
    entity
  }));
};

export { CLOUDBUILD_ANNOTATION, CloudbuildClient, EntityCloudbuildContent, EntityLatestCloudbuildRunCard, EntityLatestCloudbuildsForBranchCard, LatestWorkflowRunCard, LatestWorkflowsForBranchCard, Router, cloudbuildApiRef, cloudbuildPlugin, isCloudbuildAvailable, isCloudbuildAvailable as isPluginApplicableToEntity, cloudbuildPlugin as plugin };
//# sourceMappingURL=index.esm.js.map
