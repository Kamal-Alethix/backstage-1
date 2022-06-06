import { createApiRef, createRouteRef, createSubRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension, createComponentExtension, useApi, errorApiRef, useRouteRef, alertApiRef, useRouteRefParams } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { makeStyles, LinearProgress, Box, Typography, Tooltip, IconButton, TableContainer, Paper, Table as Table$1, TableBody, TableRow, TableCell, Link as Link$1 } from '@material-ui/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import { DateTime, Duration } from 'luxon';
import React, { useState, useRef, useCallback } from 'react';
import { StatusWarning, StatusAborted, StatusOK, StatusError, StatusRunning, StatusPending, InfoCard, StructuredMetadataTable, Link, WarningPanel, Table, Progress, Content, Breadcrumbs, MissingAnnotationEmptyState } from '@backstage/core-components';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { useEntity, useEntityPermission } from '@backstage/plugin-catalog-react';
import { getCompoundEntityRef } from '@backstage/catalog-model';
import { Routes, Route } from 'react-router';
import RetryIcon from '@material-ui/icons/Replay';
import JenkinsLogo from './assets/JenkinsLogo.svg';
import { jenkinsExecutePermission } from '@backstage/plugin-jenkins-common';
import { makeStyles as makeStyles$1 } from '@material-ui/core/styles';

const jenkinsApiRef = createApiRef({
  id: "plugin.jenkins.service2"
});
class JenkinsClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  async getProjects(options) {
    var _a;
    const { entity, filter } = options;
    const url = new URL(`${await this.discoveryApi.getBaseUrl("jenkins")}/v1/entity/${encodeURIComponent(entity.namespace)}/${encodeURIComponent(entity.kind)}/${encodeURIComponent(entity.name)}/projects`);
    if (filter.branch) {
      url.searchParams.append("branch", filter.branch);
    }
    const idToken = await this.getToken();
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        ...idToken && { Authorization: `Bearer ${idToken}` }
      }
    });
    return ((_a = (await response.json()).projects) == null ? void 0 : _a.map((p) => ({
      ...p,
      onRestartClick: () => {
        return this.retry({
          entity,
          jobFullName: p.fullName,
          buildNumber: String(p.lastBuild.number)
        });
      }
    }))) || [];
  }
  async getBuild(options) {
    const { entity, jobFullName, buildNumber } = options;
    const url = `${await this.discoveryApi.getBaseUrl("jenkins")}/v1/entity/${encodeURIComponent(entity.namespace)}/${encodeURIComponent(entity.kind)}/${encodeURIComponent(entity.name)}/job/${encodeURIComponent(jobFullName)}/${encodeURIComponent(buildNumber)}`;
    const idToken = await this.getToken();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...idToken && { Authorization: `Bearer ${idToken}` }
      }
    });
    return (await response.json()).build;
  }
  async retry(options) {
    const { entity, jobFullName, buildNumber } = options;
    const url = `${await this.discoveryApi.getBaseUrl("jenkins")}/v1/entity/${encodeURIComponent(entity.namespace)}/${encodeURIComponent(entity.kind)}/${encodeURIComponent(entity.name)}/job/${encodeURIComponent(jobFullName)}/${encodeURIComponent(buildNumber)}:rebuild`;
    const idToken = await this.getToken();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...idToken && { Authorization: `Bearer ${idToken}` }
      }
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
  }
  async getToken() {
    const { token } = await this.identityApi.getCredentials();
    return token;
  }
}

const rootRouteRef = createRouteRef({
  id: "jenkins"
});
const buildRouteRef = createSubRouteRef({
  id: "jenkins/builds",
  path: "/builds/:jobFullName/:buildNumber",
  parent: rootRouteRef
});
const jenkinsPlugin = createPlugin({
  id: "jenkins",
  apis: [
    createApiFactory({
      api: jenkinsApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => new JenkinsClient({ discoveryApi, identityApi })
    })
  ],
  routes: {
    entityContent: rootRouteRef
  }
});
const EntityJenkinsContent = jenkinsPlugin.provide(createRoutableExtension({
  name: "EntityJenkinsContent",
  component: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.Router),
  mountPoint: rootRouteRef
}));
const EntityLatestJenkinsRunCard = jenkinsPlugin.provide(createComponentExtension({
  name: "EntityLatestJenkinsRunCard",
  component: {
    lazy: () => import('./esm/index-57c60a51.esm.js').then((m) => m.LatestRunCard)
  }
}));

const JenkinsRunStatus = ({
  status
}) => {
  if (status === void 0)
    return null;
  switch (status.toLocaleLowerCase("en-US")) {
    case "queued":
    case "scheduled":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusPending, null), " Queued");
    case "running":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusRunning, null), " In progress");
    case "unstable":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusWarning, null), " Unstable");
    case "failure":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusError, null), " Failed");
    case "success":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusOK, null), " Completed");
    case "aborted":
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusAborted, null), " Aborted");
    default:
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusWarning, null), " ", status);
  }
};

var ErrorType = /* @__PURE__ */ ((ErrorType2) => {
  ErrorType2[ErrorType2["CONNECTION_ERROR"] = 0] = "CONNECTION_ERROR";
  ErrorType2[ErrorType2["NOT_FOUND"] = 1] = "NOT_FOUND";
  return ErrorType2;
})(ErrorType || {});
function useBuilds({ branch } = {}) {
  const { entity } = useEntity();
  const entityName = getCompoundEntityRef(entity);
  const api = useApi(jenkinsApiRef);
  const errorApi = useApi(errorApiRef);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState();
  const restartBuild = async (jobFullName, buildNumber) => {
    try {
      await api.retry({ entity: entityName, jobFullName, buildNumber });
    } catch (e) {
      errorApi.post(e);
    }
  };
  const {
    loading,
    value: projects,
    retry
  } = useAsyncRetry(async () => {
    try {
      const build = await api.getProjects({
        entity: getCompoundEntityRef(entity),
        filter: { branch }
      });
      setTotal(build.length);
      return build;
    } catch (e) {
      const errorType = e.notFound ? 1 /* NOT_FOUND */ : 0 /* CONNECTION_ERROR */;
      setError({ message: e.message, errorType });
      throw e;
    }
  }, [api, errorApi, entity, branch]);
  return [
    {
      page,
      pageSize,
      loading,
      projects,
      total,
      error
    },
    {
      setPage,
      setPageSize,
      restartBuild,
      retry
    }
  ];
}

const useStyles$1 = makeStyles({
  externalLinkIcon: {
    fontSize: "inherit",
    verticalAlign: "bottom"
  }
});
const WidgetContent = ({
  loading,
  latestRun
}) => {
  var _a;
  const classes = useStyles$1();
  if (loading || !latestRun)
    return /* @__PURE__ */ React.createElement(LinearProgress, null);
  const displayDate = DateTime.fromMillis(latestRun.lastBuild.timestamp).toRelative();
  const displayDuration = (latestRun.lastBuild.building ? "Running for " : "") + ((_a = DateTime.local().minus(Duration.fromMillis(latestRun.lastBuild.duration)).toRelative({ locale: "en" })) == null ? void 0 : _a.replace(" ago", ""));
  return /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
    metadata: {
      status: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(JenkinsRunStatus, {
        status: latestRun.lastBuild.status
      })),
      build: latestRun.fullDisplayName,
      "latest run": displayDate,
      duration: displayDuration,
      link: /* @__PURE__ */ React.createElement(Link, {
        to: latestRun.lastBuild.url
      }, "See more on Jenkins", " ", /* @__PURE__ */ React.createElement(ExternalLinkIcon, {
        className: classes.externalLinkIcon
      }))
    }
  });
};
const JenkinsApiErrorPanel = ({
  message,
  errorType
}) => {
  let title = void 0;
  if (errorType === ErrorType.CONNECTION_ERROR) {
    title = "Can't connect to Jenkins";
  } else if (errorType === ErrorType.NOT_FOUND) {
    title = "Can't find Jenkins project";
  }
  return /* @__PURE__ */ React.createElement(WarningPanel, {
    severity: "error",
    title,
    message
  });
};
const LatestRunCard = ({
  branch = "master",
  variant
}) => {
  const [{ projects, loading, error }] = useBuilds({ branch });
  const latestRun = projects == null ? void 0 : projects[0];
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: `Latest ${branch} build`,
    variant
  }, !error ? /* @__PURE__ */ React.createElement(WidgetContent, {
    loading,
    branch,
    latestRun
  }) : /* @__PURE__ */ React.createElement(JenkinsApiErrorPanel, {
    message: error.message,
    errorType: error.errorType
  }));
};

const JENKINS_ANNOTATION = "jenkins.io/job-full-name";
const LEGACY_JENKINS_ANNOTATION = "jenkins.io/github-folder";

const FailCount = ({ count }) => {
  if (count !== 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, count, " failed");
  }
  return null;
};
const SkippedCount = ({ count }) => {
  if (count !== 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, count, " skipped");
  }
  return null;
};
const FailSkippedWidget = ({
  skipped,
  failed
}) => {
  if (skipped === 0 && failed === 0) {
    return null;
  }
  if (skipped !== 0 && failed !== 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, " ", "(", /* @__PURE__ */ React.createElement(FailCount, {
      count: failed
    }), ", ", /* @__PURE__ */ React.createElement(SkippedCount, {
      count: skipped
    }), ")");
  }
  if (failed !== 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, " ", "(", /* @__PURE__ */ React.createElement(FailCount, {
      count: failed
    }), ")");
  }
  if (skipped !== 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, " ", "(", /* @__PURE__ */ React.createElement(SkippedCount, {
      count: skipped
    }), ")");
  }
  return null;
};
const generatedColumns = [
  {
    title: "Timestamp",
    defaultSort: "desc",
    hidden: true,
    field: "lastBuild.timestamp"
  },
  {
    title: "Build",
    field: "fullName",
    highlight: true,
    render: (row) => {
      const LinkWrapper = () => {
        var _a, _b;
        const routeLink = useRouteRef(buildRouteRef);
        if (!row.fullName || !((_a = row.lastBuild) == null ? void 0 : _a.number)) {
          return /* @__PURE__ */ React.createElement(React.Fragment, null, row.fullName || row.fullDisplayName || row.displayName || "Unknown");
        }
        return /* @__PURE__ */ React.createElement(Link, {
          to: routeLink({
            jobFullName: encodeURIComponent(row.fullName),
            buildNumber: String((_b = row.lastBuild) == null ? void 0 : _b.number)
          })
        }, row.fullDisplayName);
      };
      return /* @__PURE__ */ React.createElement(LinkWrapper, null);
    }
  },
  {
    title: "Source",
    field: "lastBuild.source.branchName",
    render: (row) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement(Link, {
        to: (_c = (_b = (_a = row.lastBuild) == null ? void 0 : _a.source) == null ? void 0 : _b.url) != null ? _c : ""
      }, (_e = (_d = row.lastBuild) == null ? void 0 : _d.source) == null ? void 0 : _e.branchName)), /* @__PURE__ */ React.createElement("p", null, (_h = (_g = (_f = row.lastBuild) == null ? void 0 : _f.source) == null ? void 0 : _g.commit) == null ? void 0 : _h.hash));
    }
  },
  {
    title: "Status",
    field: "status",
    render: (row) => {
      return /* @__PURE__ */ React.createElement(Box, {
        display: "flex",
        alignItems: "center"
      }, /* @__PURE__ */ React.createElement(JenkinsRunStatus, {
        status: row.status
      }));
    }
  },
  {
    title: "Tests",
    sorting: false,
    render: (row) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, ((_a = row.lastBuild) == null ? void 0 : _a.tests) && /* @__PURE__ */ React.createElement(Link, {
        to: (_c = (_b = row.lastBuild) == null ? void 0 : _b.tests.testUrl) != null ? _c : ""
      }, (_d = row.lastBuild) == null ? void 0 : _d.tests.passed, " / ", (_e = row.lastBuild) == null ? void 0 : _e.tests.total, " ", "passed", /* @__PURE__ */ React.createElement(FailSkippedWidget, {
        skipped: (_f = row.lastBuild) == null ? void 0 : _f.tests.skipped,
        failed: (_g = row.lastBuild) == null ? void 0 : _g.tests.failed
      })), !((_h = row.lastBuild) == null ? void 0 : _h.tests) && "n/a"));
    }
  },
  {
    title: "Actions",
    sorting: false,
    render: (row) => {
      const ActionWrapper = () => {
        const [isLoadingRebuild, setIsLoadingRebuild] = useState(false);
        const { allowed, loading } = useEntityPermission(jenkinsExecutePermission);
        const alertApi = useApi(alertApiRef);
        const onRebuild = async () => {
          if (row.onRestartClick) {
            setIsLoadingRebuild(true);
            try {
              await row.onRestartClick();
              alertApi.post({
                message: "Jenkins re-build has successfully executed",
                severity: "success"
              });
            } catch (e) {
              alertApi.post({
                message: `Jenkins re-build has failed. Error: ${e.message}`,
                severity: "error"
              });
            } finally {
              setIsLoadingRebuild(false);
            }
          }
        };
        return /* @__PURE__ */ React.createElement(Tooltip, {
          title: "Rerun build"
        }, /* @__PURE__ */ React.createElement(React.Fragment, null, isLoadingRebuild && /* @__PURE__ */ React.createElement(Progress, null), !isLoadingRebuild && /* @__PURE__ */ React.createElement(IconButton, {
          onClick: onRebuild,
          disabled: loading || !allowed
        }, /* @__PURE__ */ React.createElement(RetryIcon, null))));
      };
      return /* @__PURE__ */ React.createElement(ActionWrapper, null);
    },
    width: "10%"
  }
];
const CITableView = ({
  loading,
  pageSize,
  page,
  retry,
  projects,
  onChangePage,
  onChangePageSize,
  total
}) => {
  const projectsInPage = projects == null ? void 0 : projects.slice(page * pageSize, Math.min(projects.length, (page + 1) * pageSize));
  return /* @__PURE__ */ React.createElement(Table, {
    isLoading: loading,
    options: { paging: true, pageSize, padding: "dense" },
    totalCount: total,
    page,
    actions: [
      {
        icon: () => /* @__PURE__ */ React.createElement(RetryIcon, null),
        tooltip: "Refresh Data",
        isFreeAction: true,
        onClick: () => retry()
      }
    ],
    data: projectsInPage != null ? projectsInPage : [],
    onPageChange: onChangePage,
    onRowsPerPageChange: onChangePageSize,
    title: /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement("img", {
      src: JenkinsLogo,
      alt: "Jenkins logo",
      height: "50px"
    }), /* @__PURE__ */ React.createElement(Box, {
      mr: 2
    }), /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, "Projects")),
    columns: generatedColumns
  });
};
const CITable = () => {
  const [tableProps, { setPage, retry, setPageSize }] = useBuilds();
  return /* @__PURE__ */ React.createElement(CITableView, {
    ...tableProps,
    retry,
    onChangePageSize: setPageSize,
    onChangePage: setPage
  });
};

const useAsyncPolling = (pollingFn, interval) => {
  const isPolling = useRef(false);
  const startPolling = async () => {
    if (isPolling.current === true)
      return;
    isPolling.current = true;
    while (isPolling.current === true) {
      await pollingFn();
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  };
  const stopPolling = () => {
    isPolling.current = false;
  };
  return { startPolling, stopPolling };
};

const INTERVAL_AMOUNT = 1500;
function useBuildWithSteps({
  jobFullName,
  buildNumber
}) {
  const api = useApi(jenkinsApiRef);
  const errorApi = useApi(errorApiRef);
  const { entity } = useEntity();
  const getBuildWithSteps = useCallback(async () => {
    try {
      const entityName = await getCompoundEntityRef(entity);
      return api.getBuild({ entity: entityName, jobFullName, buildNumber });
    } catch (e) {
      errorApi.post(e);
      return Promise.reject(e);
    }
  }, [buildNumber, jobFullName, entity, api, errorApi]);
  const { loading, value, retry } = useAsyncRetry(() => getBuildWithSteps(), [getBuildWithSteps]);
  const { startPolling, stopPolling } = useAsyncPolling(getBuildWithSteps, INTERVAL_AMOUNT);
  return [
    { loading, value, retry },
    {
      getBuildWithSteps,
      startPolling,
      stopPolling
    }
  ];
}

const useStyles = makeStyles$1((theme) => ({
  root: {
    maxWidth: 720
  },
  table: {
    padding: theme.spacing(1)
  },
  externalLinkIcon: {
    fontSize: "inherit",
    verticalAlign: "bottom"
  }
}));
const BuildWithStepsView = () => {
  var _a, _b, _c, _d, _e, _f;
  const { jobFullName, buildNumber } = useRouteRefParams(buildRouteRef);
  const classes = useStyles();
  const [{ value }] = useBuildWithSteps({ jobFullName, buildNumber });
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Breadcrumbs, {
    "aria-label": "breadcrumb"
  }, /* @__PURE__ */ React.createElement(Link, {
    to: "../../.."
  }, "Projects"), /* @__PURE__ */ React.createElement(Typography, null, "Run")), /* @__PURE__ */ React.createElement(Box, {
    m: 2
  }), /* @__PURE__ */ React.createElement(TableContainer, {
    component: Paper,
    className: classes.table
  }, /* @__PURE__ */ React.createElement(Table$1, null, /* @__PURE__ */ React.createElement(TableBody, null, /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Branch")), /* @__PURE__ */ React.createElement(TableCell, null, (_a = value == null ? void 0 : value.source) == null ? void 0 : _a.branchName)), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Message")), /* @__PURE__ */ React.createElement(TableCell, null, (_b = value == null ? void 0 : value.source) == null ? void 0 : _b.displayName)), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Commit ID")), /* @__PURE__ */ React.createElement(TableCell, null, (_d = (_c = value == null ? void 0 : value.source) == null ? void 0 : _c.commit) == null ? void 0 : _d.hash)), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Status")), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(JenkinsRunStatus, {
    status: value == null ? void 0 : value.status
  }))), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Author")), /* @__PURE__ */ React.createElement(TableCell, null, (_e = value == null ? void 0 : value.source) == null ? void 0 : _e.author)), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "Jenkins")), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Link$1, {
    target: "_blank",
    href: value == null ? void 0 : value.url
  }, "View on Jenkins", " ", /* @__PURE__ */ React.createElement(ExternalLinkIcon, {
    className: classes.externalLinkIcon
  })))), /* @__PURE__ */ React.createElement(TableRow, null, /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Typography, {
    noWrap: true
  }, "GitHub")), /* @__PURE__ */ React.createElement(TableCell, null, /* @__PURE__ */ React.createElement(Link$1, {
    target: "_blank",
    href: (_f = value == null ? void 0 : value.source) == null ? void 0 : _f.url
  }, "View on GitHub", " ", /* @__PURE__ */ React.createElement(ExternalLinkIcon, {
    className: classes.externalLinkIcon
  }))))))));
};
const Page = () => /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(BuildWithStepsView, null));

const isJenkinsAvailable = (entity) => {
  var _a, _b;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[JENKINS_ANNOTATION]) || Boolean((_b = entity.metadata.annotations) == null ? void 0 : _b[LEGACY_JENKINS_ANNOTATION]);
};
const Router = (_props) => {
  const { entity } = useEntity();
  if (!isJenkinsAvailable(entity)) {
    return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
      annotation: JENKINS_ANNOTATION
    });
  }
  return /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    element: /* @__PURE__ */ React.createElement(CITable, null)
  }), /* @__PURE__ */ React.createElement(Route, {
    path: `/${buildRouteRef.path}`,
    element: /* @__PURE__ */ React.createElement(Page, null)
  }));
};

var Router$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isJenkinsAvailable: isJenkinsAvailable,
  Router: Router
});

export { EntityJenkinsContent, EntityLatestJenkinsRunCard, JENKINS_ANNOTATION, JenkinsClient, LEGACY_JENKINS_ANNOTATION, LatestRunCard, Router, isJenkinsAvailable, isJenkinsAvailable as isPluginApplicableToEntity, jenkinsApiRef, jenkinsPlugin, jenkinsPlugin as plugin };
//# sourceMappingURL=index.esm.js.map
