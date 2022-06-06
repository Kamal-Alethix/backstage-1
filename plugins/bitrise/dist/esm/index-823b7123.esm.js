import qs from 'qs';
import { Interval, DateTime } from 'luxon';
import { pickBy, identity } from 'lodash';
import { createApiRef, createPlugin, createApiFactory, discoveryApiRef, createComponentExtension, useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import React, { useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Alert } from '@material-ui/lab';
import { CircularProgress, Tooltip, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, makeStyles, Dialog, DialogTitle, Chip, DialogContent, Button } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import CloudDownload from '@material-ui/icons/CloudDownload';
import LinkIcon from '@material-ui/icons/Link';
import { Progress, Table, Link, SubvalueCell, StatusWarning, StatusAborted, StatusRunning, StatusError, StatusOK, MissingAnnotationEmptyState, Page, Content, ContentHeader } from '@backstage/core-components';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles as makeStyles$1, createStyles } from '@material-ui/core/styles';

class BitriseClientApi {
  constructor(discoveryApi) {
    this.discoveryApi = discoveryApi;
  }
  async getArtifactDetails(appSlug, buildSlug, artifactSlug) {
    const baseUrl = await this.discoveryApi.getBaseUrl("proxy");
    const artifactResponse = await fetch(`${baseUrl}/bitrise/apps/${appSlug}/builds/${buildSlug}/artifacts/${artifactSlug}`);
    const data = await artifactResponse.json();
    return data.data;
  }
  async getBuildArtifacts(appSlug, buildSlug) {
    const baseUrl = await this.discoveryApi.getBaseUrl("proxy");
    const response = await fetch(`${baseUrl}/bitrise/apps/${appSlug}/builds/${buildSlug}/artifacts`);
    const data = await response.json();
    return data.data;
  }
  async getAppsPaginated(from) {
    var _a;
    const baseUrl = await this.discoveryApi.getBaseUrl("proxy");
    const appsResponse = await fetch(`${baseUrl}/bitrise/apps?next=${from}`);
    const appsData = await appsResponse.json();
    if ((_a = appsData.paging) == null ? void 0 : _a.next) {
      return appsData.data.concat(await this.getAppsPaginated(appsData.paging.next));
    }
    return appsData.data;
  }
  async getApps() {
    return await this.getAppsPaginated("");
  }
  async getApp(appName) {
    const apps = await this.getApps();
    return apps.find((app) => app.title === appName);
  }
  async getBuildWorkflows(appSlug) {
    const baseUrl = await this.discoveryApi.getBaseUrl("proxy");
    const response = await fetch(`${baseUrl}/bitrise/apps/${appSlug}/build-workflows`);
    const data = await response.json();
    return data.data;
  }
  async getBuilds(appSlug, params) {
    const baseUrl = await this.discoveryApi.getBaseUrl("proxy");
    let url = `${baseUrl}/bitrise/apps/${appSlug}/builds`;
    if (params) {
      url = `${url}?${qs.stringify(pickBy(params, identity))}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    const builds = data.data;
    return {
      data: builds.map((build) => {
        const duration = String(Math.round(Interval.fromDateTimes(DateTime.fromISO(build.started_on_worker_at), DateTime.fromISO(build.finished_at)).length("minutes")));
        return {
          id: build.build_number,
          source: build.commit_view_url,
          status: build.status,
          statusText: build.status_text,
          buildSlug: build.slug,
          message: `${build.branch}`,
          workflow: build.triggered_workflow,
          commitHash: `${build.commit_hash}`,
          triggerTime: build.triggered_at,
          duration: `${duration} minutes`,
          appSlug
        };
      }),
      paging: data.paging
    };
  }
}

const bitriseApiRef = createApiRef({
  id: "plugin.bitrise.service"
});
const bitrisePlugin = createPlugin({
  id: "bitrise",
  apis: [
    createApiFactory({
      api: bitriseApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => {
        return new BitriseClientApi(discoveryApi);
      }
    })
  ]
});

const EntityBitriseContent = bitrisePlugin.provide(createComponentExtension({
  name: "EntityBitriseContent",
  component: {
    lazy: () => import('./index-310935f5.esm.js').then((m) => m.BitriseBuildsComponent)
  }
}));

const useBitriseBuildWorkflows = (appName) => {
  var _a;
  const bitriseApi = useApi(bitriseApiRef);
  const app = useAsync(async () => bitriseApi.getApp(appName), [appName]);
  const workflows = useAsync(async () => {
    var _a2;
    if (!((_a2 = app.value) == null ? void 0 : _a2.slug)) {
      return [];
    }
    return bitriseApi.getBuildWorkflows(app.value.slug);
  }, [(_a = app.value) == null ? void 0 : _a.slug, bitriseApi]);
  return {
    loading: app.loading || workflows.loading,
    error: app.error || workflows.error,
    value: workflows.value
  };
};

const useBitriseBuilds = (appName, params) => {
  var _a;
  const bitriseApi = useApi(bitriseApiRef);
  const app = useAsync(async () => bitriseApi.getApp(appName), [appName]);
  const builds = useAsync(async () => {
    var _a2;
    if (!((_a2 = app.value) == null ? void 0 : _a2.slug)) {
      return { data: [] };
    }
    return bitriseApi.getBuilds(app.value.slug, params);
  }, [
    (_a = app.value) == null ? void 0 : _a.slug,
    bitriseApi,
    params.workflow,
    params.branch,
    params.limit,
    params.next
  ]);
  return {
    loading: app.loading || builds.loading,
    error: app.error || builds.error,
    value: builds.value
  };
};

var BitriseBuildResultStatus = /* @__PURE__ */ ((BitriseBuildResultStatus2) => {
  BitriseBuildResultStatus2[BitriseBuildResultStatus2["notFinished"] = 0] = "notFinished";
  BitriseBuildResultStatus2[BitriseBuildResultStatus2["successful"] = 1] = "successful";
  BitriseBuildResultStatus2[BitriseBuildResultStatus2["failed"] = 2] = "failed";
  BitriseBuildResultStatus2[BitriseBuildResultStatus2["abortedWithFailure"] = 3] = "abortedWithFailure";
  BitriseBuildResultStatus2[BitriseBuildResultStatus2["abortedWithSuccess"] = 4] = "abortedWithSuccess";
  return BitriseBuildResultStatus2;
})(BitriseBuildResultStatus || {});

const useBitriseArtifactDetails = (appSlug, buildSlug, artifactSlug) => {
  const bitriseApi = useApi(bitriseApiRef);
  return useAsync(() => bitriseApi.getArtifactDetails(appSlug, buildSlug, artifactSlug), [bitriseApi, appSlug, buildSlug, artifactSlug]);
};

const BitriseDownloadArtifactComponent = ({
  appSlug,
  buildSlug,
  artifactSlug
}) => {
  const { value, loading, error } = useBitriseArtifactDetails(appSlug, buildSlug, artifactSlug);
  if (loading) {
    return /* @__PURE__ */ React.createElement(CircularProgress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (!(value == null ? void 0 : value.public_install_page_url) && !(value == null ? void 0 : value.expiring_download_url)) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "warning"
    }, "Cannot be installed/downloaded.");
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, !!value.public_install_page_url && /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Install"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    href: value.public_install_page_url,
    target: "_blank",
    rel: "noopener"
  }, /* @__PURE__ */ React.createElement(LinkIcon, null))), !!value.expiring_download_url && /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Download"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    href: value.expiring_download_url,
    target: "_blank",
    rel: "noopener"
  }, /* @__PURE__ */ React.createElement(CloudDownload, null))));
};

const useBitriseArtifacts = (appSlug, buildSlug) => {
  const bitriseApi = useApi(bitriseApiRef);
  return useAsync(() => bitriseApi.getBuildArtifacts(appSlug, buildSlug), [bitriseApi, appSlug, buildSlug]);
};

const BitriseArtifactsComponent = (props) => {
  const { value, loading, error } = useBitriseArtifacts(props.build.appSlug, props.build.buildSlug);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  } else if (!value || !value.length) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "info"
    }, "No artifacts");
  }
  return /* @__PURE__ */ React.createElement(List, null, value.map((row) => /* @__PURE__ */ React.createElement(ListItem, {
    key: row.slug
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: row.title,
    secondary: row.artifact_type
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(BitriseDownloadArtifactComponent, {
    appSlug: props.build.appSlug,
    buildSlug: props.build.buildSlug,
    artifactSlug: row.slug
  })))));
};

const useStyles$1 = makeStyles({
  dialogContent: {
    paddingBottom: 16
  }
});
const BitriseBuildDetailsDialog = ({
  build
}) => {
  const classes = useStyles$1();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, {
    "data-testid": "btn",
    onClick: handleOpen
  }, /* @__PURE__ */ React.createElement(CloudDownload, null)), /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose: handleClose,
    "aria-labelledby": "alert-dialog-title",
    "aria-describedby": "alert-dialog-description"
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    id: "alert-dialog-title"
  }, `Download artifacts for build #${build.id}?`, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "close",
    edge: "end",
    onClick: handleClose
  }, /* @__PURE__ */ React.createElement(CloseIcon, null)), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Chip, {
    size: "small",
    label: build.message
  })), /* @__PURE__ */ React.createElement(DialogContent, {
    className: classes.dialogContent
  }, /* @__PURE__ */ React.createElement(BitriseArtifactsComponent, {
    build
  }))));
};

const bitriseBaseUrl = `https://app.bitrise.io`;
const createBitriseBuildUrl = (buildSlug) => `${bitriseBaseUrl}/build/${buildSlug}#?tab=log`;
const renderBranch = (build) => {
  return /* @__PURE__ */ React.createElement(SubvalueCell, {
    value: build.message,
    subvalue: build.workflow
  });
};
const renderStatus = (build) => {
  switch (build.status) {
    case BitriseBuildResultStatus.successful: {
      return /* @__PURE__ */ React.createElement(StatusOK, null, build.statusText);
    }
    case BitriseBuildResultStatus.failed: {
      return /* @__PURE__ */ React.createElement(StatusError, null, build.statusText);
    }
    case BitriseBuildResultStatus.notFinished: {
      return /* @__PURE__ */ React.createElement(StatusRunning, null, build.statusText);
    }
    case BitriseBuildResultStatus.abortedWithSuccess:
    case BitriseBuildResultStatus.abortedWithFailure: {
      return /* @__PURE__ */ React.createElement(StatusAborted, null, build.statusText);
    }
    default: {
      return /* @__PURE__ */ React.createElement(StatusWarning, null, build.statusText);
    }
  }
};
const renderSource = (build) => {
  return build.source ? /* @__PURE__ */ React.createElement(Button, {
    href: build.source,
    target: "_blank",
    rel: "noreferrer",
    startIcon: /* @__PURE__ */ React.createElement(GitHubIcon, null)
  }, build.commitHash.substr(0, 6)) : null;
};
const renderId = (build) => {
  return /* @__PURE__ */ React.createElement(Link, {
    to: `${createBitriseBuildUrl(build.buildSlug)}`,
    target: "_blank",
    rel: "noreferrer"
  }, build.id);
};
const renderDownload = (build) => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, build.status === BitriseBuildResultStatus.successful && /* @__PURE__ */ React.createElement(BitriseBuildDetailsDialog, {
    build
  }));
};
const renderTriggerTime = (build) => {
  return /* @__PURE__ */ React.createElement(SubvalueCell, {
    value: DateTime.fromISO(build.triggerTime).toLocaleString(DateTime.DATETIME_MED),
    subvalue: build.status !== BitriseBuildResultStatus.notFinished && build.duration
  });
};
const renderErrors = (errors) => {
  return errors.map((err) => err ? /* @__PURE__ */ React.createElement(Alert, {
    severity: "error"
  }, err.message) : null);
};
const BitriseBuildsTable = ({
  appName,
  workflow,
  error
}) => {
  var _a, _b, _c;
  let selectedWorkflow = "";
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [{ page, next }, setPage] = React.useState({ page: 0 });
  const [selectedSearchTerm, setSelectedSearchTerm] = useState("");
  if (workflow) {
    selectedWorkflow = workflow;
  }
  const builds = useBitriseBuilds(appName, {
    workflow: selectedWorkflow.trim(),
    branch: selectedSearchTerm.trim(),
    limit: rowsPerPage,
    next
  });
  const columns = [
    {
      title: "ID",
      field: "id",
      highlight: true,
      render: (build) => renderId(build)
    },
    {
      title: "Branch",
      customFilterAndSearch: (query, row) => `${row.message} ${row.workflow}`.toLocaleUpperCase("en-US").includes(query.toLocaleUpperCase("en-US")),
      field: "message",
      width: "auto",
      highlight: true,
      render: (build) => renderBranch(build)
    },
    {
      title: "Status",
      field: "status",
      render: (build) => renderStatus(build)
    },
    {
      title: "Triggered",
      field: "triggered",
      render: (build) => renderTriggerTime(build)
    },
    {
      title: "Source",
      field: "source",
      render: (build) => renderSource(build)
    },
    {
      title: "Download",
      field: "download",
      render: (build) => renderDownload(build)
    }
  ];
  const handleChangePage = (newPage, nextId) => {
    if (nextId) {
      setPage({ page: newPage, next: nextId });
    }
  };
  const handleChangeRowsPerPage = (amount) => {
    setRowsPerPage(amount);
    setPage({ page: 0, next: void 0 });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderErrors([builds.error, error]), !builds.error && /* @__PURE__ */ React.createElement(Table, {
    isLoading: builds.loading,
    options: {
      search: true,
      searchAutoFocus: true,
      debounceInterval: 800,
      paging: true,
      showFirstLastPageButtons: false,
      pageSize: rowsPerPage,
      pageSizeOptions: [5, 10, 20, 50]
    },
    totalCount: ((_b = (_a = builds.value) == null ? void 0 : _a.paging) == null ? void 0 : _b.total_item_count) || 0,
    page,
    onPageChange: (pageIndex) => {
      var _a2, _b2;
      handleChangePage(pageIndex, (_b2 = (_a2 = builds.value) == null ? void 0 : _a2.paging) == null ? void 0 : _b2.next);
    },
    onRowsPerPageChange: handleChangeRowsPerPage,
    columns,
    data: ((_c = builds.value) == null ? void 0 : _c.data) || [],
    onSearchChange: (searchTerm) => setSelectedSearchTerm(searchTerm)
  }));
};

const useStyles = makeStyles$1((theme) => createStyles({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));
const renderItems = (items) => {
  return items.map((item) => {
    return /* @__PURE__ */ React.createElement(MenuItem, {
      value: item.value,
      key: item.label
    }, item.label);
  });
};
const SelectComponent = ({
  value,
  items,
  label,
  onChange
}) => {
  const classes = useStyles();
  const handleChange = (event) => {
    const val = event.target.value;
    onChange(val);
  };
  return /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined",
    className: classes.formControl,
    disabled: items.length === 0
  }, /* @__PURE__ */ React.createElement(InputLabel, null, label), /* @__PURE__ */ React.createElement(Select, {
    label,
    value,
    onChange: handleChange
  }, renderItems(items)));
};

const BITRISE_APP_ANNOTATION = "bitrise.io/app";
const isBitriseAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[BITRISE_APP_ANNOTATION]);
};
const BitriseBuildsComponent = () => {
  var _a;
  const { entity } = useEntity();
  const appName = (_a = entity.metadata.annotations) == null ? void 0 : _a[BITRISE_APP_ANNOTATION];
  const [selectedWorkflow, setSelectedWorkflow] = useState(" ");
  const workflows = useBitriseBuildWorkflows(appName);
  const onSelectedWorkflowChanged = (workflow) => {
    setSelectedWorkflow(workflow);
  };
  const getSelectionItems = (items) => {
    const noWorkflowSpecified = { label: "All workflows", value: " " };
    return items.value ? [
      noWorkflowSpecified,
      ...items.value.map((item) => {
        return { label: item, value: item };
      })
    ] : [];
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, !appName ? /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
    annotation: BITRISE_APP_ANNOTATION
  }) : /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Content, {
    noPadding: true
  }, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: appName
  }, /* @__PURE__ */ React.createElement(SelectComponent, {
    value: selectedWorkflow,
    onChange: (workflow) => onSelectedWorkflowChanged(workflow),
    label: "Workflow",
    items: getSelectionItems(workflows)
  })), /* @__PURE__ */ React.createElement(BitriseBuildsTable, {
    appName,
    workflow: selectedWorkflow,
    error: workflows.error
  }))));
};

export { BitriseBuildsComponent as B, EntityBitriseContent as E, BITRISE_APP_ANNOTATION as a, bitrisePlugin as b, isBitriseAvailable as i };
//# sourceMappingURL=index-823b7123.esm.js.map
