import { SvgIcon, Box, Typography } from '@material-ui/core';
import { BuildStatus, BuildResult } from '@backstage/plugin-azure-devops-common';
import { ResponseErrorPanel, Table, Link, StatusWarning, StatusAborted, StatusPending, StatusRunning, StatusError, StatusOK } from '@backstage/core-components';
import React from 'react';
import { DateTime, Interval } from 'luxon';
import humanizeDuration from 'humanize-duration';
import { A as AZURE_DEVOPS_REPO_ANNOTATION, a as AZURE_DEVOPS_PROJECT_ANNOTATION, b as AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION, c as azureDevOpsApiRef, d as AZURE_DEVOPS_DEFAULT_TOP } from './index-00a5c1e5.esm.js';
import '@backstage/errors';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { useEntity } from '@backstage/plugin-catalog-react';
import '@material-ui/icons/DoneAll';
import '@material-ui/core/styles';
import '@material-ui/icons/Cancel';
import '@material-ui/icons/GroupWork';
import '@material-ui/icons/WatchLater';
import 'react-use/lib/useAsyncRetry';
import 'react-use/lib/useInterval';

const getDurationFromDates = (startTime, finishTime) => {
  if (!startTime || !startTime && !finishTime) {
    return "";
  }
  const start = DateTime.fromISO(startTime);
  const finish = finishTime ? DateTime.fromISO(finishTime) : DateTime.now();
  const formatted = Interval.fromDateTimes(start, finish).toDuration().valueOf();
  const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: "shortEn",
    languages: {
      shortEn: {
        y: () => "y",
        mo: () => "mo",
        w: () => "w",
        d: () => "d",
        h: () => "h",
        m: () => "m",
        s: () => "s",
        ms: () => "ms"
      }
    }
  });
  return shortEnglishHumanizer(formatted, {
    largest: 2,
    round: true,
    spacer: ""
  });
};

function getAnnotationFromEntity(entity) {
  var _a, _b, _c;
  const annotation = (_a = entity.metadata.annotations) == null ? void 0 : _a[AZURE_DEVOPS_REPO_ANNOTATION];
  if (annotation) {
    const { project: project2, repo: repo2 } = getProjectRepo(annotation);
    const definition2 = void 0;
    return { project: project2, repo: repo2, definition: definition2 };
  }
  const project = (_b = entity.metadata.annotations) == null ? void 0 : _b[AZURE_DEVOPS_PROJECT_ANNOTATION];
  if (!project) {
    throw new Error("Value for annotation dev.azure.com/project was not found");
  }
  const definition = (_c = entity.metadata.annotations) == null ? void 0 : _c[AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION];
  if (!definition) {
    throw new Error("Value for annotation dev.azure.com/build-definition was not found");
  }
  const repo = void 0;
  return { project, repo, definition };
}
function getProjectRepo(annotation) {
  const [project, repo] = annotation.split("/");
  if (!project && !repo) {
    throw new Error("Value for annotation dev.azure.com/project-repo was not in the correct format: <project-name>/<repo-name>");
  }
  return { project, repo };
}

const AzurePipelinesIcon = (props) => /* @__PURE__ */ React.createElement(SvgIcon, {
  ...props,
  viewBox: "0 0 512 512"
}, /* @__PURE__ */ React.createElement("path", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "32",
  d: "M461.81 53.81a4.4 4.4 0 00-3.3-3.39c-54.38-13.3-180 34.09-248.13 102.17a294.9 294.9 0 00-33.09 39.08c-21-1.9-42-.3-59.88 7.5-50.49 22.2-65.18 80.18-69.28 105.07a9 9 0 009.8 10.4l81.07-8.9a180.29 180.29 0 001.1 18.3 18.15 18.15 0 005.3 11.09l31.39 31.39a18.15 18.15 0 0011.1 5.3 179.91 179.91 0 0018.19 1.1l-8.89 81a9 9 0 0010.39 9.79c24.9-4 83-18.69 105.07-69.17 7.8-17.9 9.4-38.79 7.6-59.69a293.91 293.91 0 0039.19-33.09c68.38-68 115.47-190.86 102.37-247.95zM298.66 213.67a42.7 42.7 0 1160.38 0 42.65 42.65 0 01-60.38 0z"
}), /* @__PURE__ */ React.createElement("path", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "32",
  d: "M109.64 352a45.06 45.06 0 00-26.35 12.84C65.67 382.52 64 448 64 448s65.52-1.67 83.15-19.31A44.73 44.73 0 00160 402.32"
}));

const getBuildResultComponent = (result) => {
  switch (result) {
    case BuildResult.Succeeded:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusOK, null), " Succeeded");
    case BuildResult.PartiallySucceeded:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusWarning, null), " Partially Succeeded");
    case BuildResult.Failed:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusError, null), " Failed");
    case BuildResult.Canceled:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusAborted, null), " Canceled");
    case BuildResult.None:
    default:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusWarning, null), " Unknown");
  }
};
const getBuildStateComponent = (status, result) => {
  switch (status) {
    case BuildStatus.InProgress:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusRunning, null), " In Progress");
    case BuildStatus.Completed:
      return getBuildResultComponent(result);
    case BuildStatus.Cancelling:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusAborted, null), " Cancelling");
    case BuildStatus.Postponed:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusPending, null), " Postponed");
    case BuildStatus.NotStarted:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusAborted, null), " Not Started");
    case BuildStatus.None:
    default:
      return /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(StatusWarning, null), " Unknown");
  }
};
const columns = [
  {
    title: "ID",
    field: "id",
    highlight: false,
    width: "auto"
  },
  {
    title: "Build",
    field: "title",
    width: "auto",
    render: (row) => /* @__PURE__ */ React.createElement(Link, {
      to: row.link || ""
    }, row.title)
  },
  {
    title: "Source",
    field: "source",
    width: "auto"
  },
  {
    title: "State",
    width: "auto",
    render: (row) => /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Typography, {
      variant: "button"
    }, getBuildStateComponent(row.status, row.result)))
  },
  {
    title: "Duration",
    field: "queueTime",
    width: "auto",
    render: (row) => /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Typography, null, getDurationFromDates(row.startTime, row.finishTime)))
  },
  {
    title: "Age",
    field: "queueTime",
    width: "auto",
    render: (row) => (row.queueTime ? DateTime.fromISO(row.queueTime) : DateTime.now()).toRelative()
  }
];
const BuildTable = ({ items, loading, error }) => {
  if (error) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    }));
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
    }, /* @__PURE__ */ React.createElement(AzurePipelinesIcon, {
      style: { fontSize: 30 }
    }), /* @__PURE__ */ React.createElement(Box, {
      mr: 1
    }), "Azure Pipelines - Builds (", items ? items.length : 0, ")"),
    data: items != null ? items : []
  });
};

function useBuildRuns(projectName, defaultLimit, repoName, definitionName) {
  const top = defaultLimit != null ? defaultLimit : AZURE_DEVOPS_DEFAULT_TOP;
  const options = {
    top
  };
  const api = useApi(azureDevOpsApiRef);
  const { value, loading, error } = useAsync(() => {
    return api.getBuildRuns(projectName, repoName, definitionName, options);
  }, [api, projectName, repoName, definitionName]);
  return {
    items: value == null ? void 0 : value.items,
    loading,
    error
  };
}

const EntityPageAzurePipelines = ({
  defaultLimit
}) => {
  const { entity } = useEntity();
  const { project, repo, definition } = getAnnotationFromEntity(entity);
  const { items, loading, error } = useBuildRuns(project, defaultLimit, repo, definition);
  return /* @__PURE__ */ React.createElement(BuildTable, {
    items,
    loading,
    error
  });
};

export { EntityPageAzurePipelines };
//# sourceMappingURL=index-b07d578c.esm.js.map
