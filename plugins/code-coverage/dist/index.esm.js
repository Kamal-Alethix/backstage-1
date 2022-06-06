import { stringifyEntityRef } from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, createRoutableExtension, useApi } from '@backstage/core-plugin-api';
import React, { useState, useEffect, Fragment } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles, Card, CardHeader, CardContent, Box, Typography, Paper, Modal, Tooltip as Tooltip$1 } from '@material-ui/core';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { Alert } from '@material-ui/lab';
import useAsync from 'react-use/lib/useAsync';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { Progress, ResponseErrorPanel, Table, Page, Content, ContentHeader, MissingAnnotationEmptyState } from '@backstage/core-components';
import { DateTime } from 'luxon';
import DescriptionIcon from '@material-ui/icons/Description';
import 'highlight.js/styles/atom-one-dark.css';
import highlight from 'highlight.js';

const codeCoverageApiRef = createApiRef({
  id: "plugin.code-coverage.service"
});
class CodeCoverageRestApi {
  constructor(discovery) {
    this.discovery = discovery;
    this.url = "";
  }
  async fetch(path, init) {
    var _a;
    if (!this.url) {
      this.url = await this.discovery.getBaseUrl("code-coverage");
    }
    const resp = await fetch(`${this.url}${path}`, init);
    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
    if ((_a = resp.headers.get("content-type")) == null ? void 0 : _a.includes("application/json")) {
      return await resp.json();
    }
    return await resp.text();
  }
  async getCoverageForEntity(entityName) {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    return await this.fetch(`/report?entity=${entity}`);
  }
  async getFileContentFromEntity(entityName, filePath) {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    return await this.fetch(`/file-content?entity=${entity}&path=${encodeURI(filePath)}`);
  }
  async getCoverageHistoryForEntity(entityName, limit) {
    const entity = encodeURIComponent(stringifyEntityRef(entityName));
    const hasValidLimit = limit && limit > 0;
    return await this.fetch(`/history?entity=${entity}${hasValidLimit ? `&limit=${encodeURIComponent(String(limit))}` : ""}`);
  }
}

const rootRouteRef = createRouteRef({
  id: "code-coverage"
});

const codeCoveragePlugin = createPlugin({
  id: "code-coverage",
  routes: {
    root: rootRouteRef
  },
  apis: [
    createApiFactory({
      api: codeCoverageApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new CodeCoverageRestApi(discoveryApi)
    })
  ]
});
const EntityCodeCoverageContent = codeCoveragePlugin.provide(createRoutableExtension({
  name: "EntityCodeCoverageContent",
  component: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.Router),
  mountPoint: rootRouteRef
}));

const useStyles$2 = makeStyles((theme) => ({
  trendDown: {
    color: theme.palette.status.warning
  },
  trendUp: {
    color: theme.palette.status.ok
  }
}));
const getTrendIcon = (trend, classes) => {
  switch (true) {
    case trend > 0:
      return /* @__PURE__ */ React.createElement(TrendingUpIcon, {
        className: classes.trendUp
      });
    case trend < 0:
      return /* @__PURE__ */ React.createElement(TrendingDownIcon, {
        className: classes.trendDown
      });
    case trend === 0:
    default:
      return /* @__PURE__ */ React.createElement(TrendingFlatIcon, null);
  }
};
function formatDateToHuman(timeStamp) {
  return DateTime.fromMillis(Number(timeStamp)).toLocaleString(DateTime.DATETIME_MED);
}
const CoverageHistoryChart = () => {
  const { entity } = useEntity();
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const {
    loading: loadingHistory,
    error: errorHistory,
    value: valueHistory
  } = useAsync(async () => await codeCoverageApi.getCoverageHistoryForEntity({
    kind: entity.kind,
    namespace: entity.metadata.namespace || "default",
    name: entity.metadata.name
  }));
  const classes = useStyles$2();
  if (loadingHistory) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (errorHistory) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error: errorHistory
    });
  } else if (!valueHistory) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "warning"
    }, "No history found.");
  }
  if (!valueHistory.history.length) {
    return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, {
      title: "History"
    }), /* @__PURE__ */ React.createElement(CardContent, null, "No coverage history found"));
  }
  const oldestCoverage = valueHistory.history[0];
  const [latestCoverage] = valueHistory.history.slice(-1);
  const getTrendForCoverage = (type) => {
    if (!oldestCoverage[type].percentage) {
      return 0;
    }
    return (latestCoverage[type].percentage - oldestCoverage[type].percentage) / oldestCoverage[type].percentage * 100;
  };
  const lineTrend = getTrendForCoverage("line");
  const branchTrend = getTrendForCoverage("branch");
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, {
    title: "History"
  }), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Box, {
    px: 6,
    display: "flex"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    mr: 4
  }, getTrendIcon(lineTrend, classes), /* @__PURE__ */ React.createElement(Typography, null, "Current line: ", latestCoverage.line.percentage, "%", /* @__PURE__ */ React.createElement("br", null), "(", Math.floor(lineTrend), "% change over ", valueHistory.history.length, " ", "builds)")), /* @__PURE__ */ React.createElement(Box, {
    display: "flex"
  }, getTrendIcon(branchTrend, classes), /* @__PURE__ */ React.createElement(Typography, null, "Current branch: ", latestCoverage.branch.percentage, "%", /* @__PURE__ */ React.createElement("br", null), "(", Math.floor(branchTrend), "% change over", " ", valueHistory.history.length, " builds)"))), /* @__PURE__ */ React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 300
  }, /* @__PURE__ */ React.createElement(LineChart, {
    data: valueHistory.history,
    margin: { right: 48, top: 32 }
  }, /* @__PURE__ */ React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /* @__PURE__ */ React.createElement(XAxis, {
    dataKey: "timestamp",
    tickFormatter: formatDateToHuman,
    reversed: true
  }), /* @__PURE__ */ React.createElement(YAxis, {
    dataKey: "line.percentage"
  }), /* @__PURE__ */ React.createElement(YAxis, {
    dataKey: "branch.percentage"
  }), /* @__PURE__ */ React.createElement(Tooltip, {
    labelFormatter: formatDateToHuman
  }), /* @__PURE__ */ React.createElement(Legend, null), /* @__PURE__ */ React.createElement(Line, {
    type: "monotone",
    dataKey: "branch.percentage",
    stroke: "#8884d8"
  }), /* @__PURE__ */ React.createElement(Line, {
    type: "monotone",
    dataKey: "line.percentage",
    stroke: "#82ca9d"
  })))));
};

const useStyles$1 = makeStyles((theme) => ({
  lineNumberCell: {
    color: `${theme.palette.grey[500]}`,
    fontSize: "90%",
    borderRight: `1px solid ${theme.palette.grey[500]}`,
    paddingRight: theme.spacing(1),
    textAlign: "right"
  },
  hitCountCell: {
    width: "50px",
    borderRight: `1px solid ${theme.palette.grey[500]}`,
    textAlign: "center",
    color: "white",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  countRoundedRectangle: {
    borderRadius: "45px",
    fontSize: "90%",
    padding: "1px 3px 1px 3px",
    width: "50px"
  },
  hitCountRoundedRectangle: {
    backgroundColor: `${theme.palette.success.main}`
  },
  notHitCountRoundedRectangle: {
    backgroundColor: `${theme.palette.error.main}`
  },
  codeLine: {
    paddingLeft: `${theme.spacing(1)}`,
    whiteSpace: "pre",
    fontSize: "90%"
  },
  hitCodeLine: {
    backgroundColor: `${theme.palette.success.main}`
  },
  notHitCodeLine: {
    backgroundColor: `${theme.palette.error.main}`
  }
}));
const CodeRow = ({
  lineNumber,
  lineContent,
  lineHits = null
}) => {
  const classes = useStyles$1();
  const hitCountRoundedRectangleClass = [classes.countRoundedRectangle];
  const lineContentClass = [classes.codeLine];
  let hitRoundedRectangle = null;
  if (lineHits !== null) {
    if (lineHits > 0) {
      hitCountRoundedRectangleClass.push(classes.hitCountRoundedRectangle);
      lineContentClass.push(classes.hitCodeLine);
    } else {
      hitCountRoundedRectangleClass.push(classes.notHitCountRoundedRectangle);
      lineContentClass.push(classes.notHitCodeLine);
    }
    hitRoundedRectangle = /* @__PURE__ */ React.createElement("div", {
      className: hitCountRoundedRectangleClass.join(" ")
    }, lineHits);
  }
  return /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", {
    className: classes.lineNumberCell
  }, lineNumber), /* @__PURE__ */ React.createElement("td", {
    className: classes.hitCountCell
  }, hitRoundedRectangle), /* @__PURE__ */ React.createElement("td", {
    className: lineContentClass.join(" "),
    dangerouslySetInnerHTML: { __html: lineContent }
  }));
};

const highlightLines = (fileExtension, lines) => {
  const formattedLines = [];
  let state;
  let fileformat = fileExtension;
  if (fileExtension === "m") {
    fileformat = "objectivec";
  }
  if (fileExtension === "tsx") {
    fileformat = "typescript";
  }
  if (fileExtension === "jsx") {
    fileformat = "javascript";
  }
  if (fileExtension === "kt") {
    fileformat = "kotlin";
  }
  lines.forEach((line) => {
    const result = highlight.highlight(fileformat, line, true, state);
    state = result.top;
    formattedLines.push(result.value);
  });
  return formattedLines;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "auto",
    top: "2em",
    width: "80%",
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "scroll"
  },
  coverageFileViewTable: {
    borderSpacing: "0px",
    width: "80%",
    marginTop: theme.spacing(2)
  }
}));
const FormattedLines = ({
  highlightedLines,
  lineHits
}) => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, highlightedLines.map((lineContent, idx) => {
    const line = idx + 1;
    return /* @__PURE__ */ React.createElement(CodeRow, {
      key: line,
      lineNumber: line,
      lineContent,
      lineHits: lineHits[line]
    });
  }));
};
const FileContent = ({ filename, coverage }) => {
  const { entity } = useEntity();
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const { loading, error, value } = useAsync(async () => await codeCoverageApi.getFileContentFromEntity({
    kind: entity.kind,
    namespace: entity.metadata.namespace || "default",
    name: entity.metadata.name
  }, filename), [entity]);
  const classes = useStyles();
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  if (!value) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "warning"
    }, "Unable to retrieve file content for ", filename);
  }
  const [language] = filename.split(".").slice(-1);
  const highlightedLines = highlightLines(language, value.split("\n"));
  const lineHits = Object.entries(coverage.lineHits).reduce((acc, next) => {
    acc[next[0]] = next[1];
    return acc;
  }, {});
  return /* @__PURE__ */ React.createElement(Paper, {
    variant: "outlined",
    className: classes.paper
  }, /* @__PURE__ */ React.createElement("table", {
    className: classes.coverageFileViewTable
  }, /* @__PURE__ */ React.createElement("tbody", null, /* @__PURE__ */ React.createElement(FormattedLines, {
    highlightedLines,
    lineHits
  }))));
};

const groupByPath = (files) => {
  const acc = {};
  files.forEach((file) => {
    const filename = file.filename;
    if (!file.filename)
      return;
    const pathArray = filename == null ? void 0 : filename.split("/").filter((el) => el !== "");
    if (pathArray) {
      if (!acc.hasOwnProperty(pathArray[0])) {
        acc[pathArray[0]] = [];
      }
      acc[pathArray[0]].push(file);
    }
  });
  return acc;
};
const removeVisitedPathGroup = (files, pathGroup) => {
  return files.map((file) => {
    var _a;
    return {
      ...file,
      filename: file.filename ? file.filename.substring(((_a = file.filename) == null ? void 0 : _a.indexOf(pathGroup)) + pathGroup.length + 1) : file.filename
    };
  });
};
const buildFileStructure = (row) => {
  const dataGroupedByPath = groupByPath(row.files);
  row.files = Object.keys(dataGroupedByPath).map((pathGroup) => {
    return buildFileStructure({
      path: pathGroup,
      files: dataGroupedByPath.hasOwnProperty("files") ? removeVisitedPathGroup(dataGroupedByPath.files, pathGroup) : removeVisitedPathGroup(dataGroupedByPath[pathGroup], pathGroup),
      coverage: dataGroupedByPath[pathGroup].reduce((acc, cur) => acc + cur.coverage, 0) / dataGroupedByPath[pathGroup].length,
      missing: dataGroupedByPath[pathGroup].reduce((acc, cur) => acc + cur.missing, 0),
      tracked: dataGroupedByPath[pathGroup].reduce((acc, cur) => acc + cur.tracked, 0)
    });
  });
  return row;
};
const formatInitialData = (value) => {
  return buildFileStructure({
    path: "",
    coverage: value.aggregate.line.percentage,
    missing: value.aggregate.line.missed,
    tracked: value.aggregate.line.available,
    files: value.files.map((fc) => {
      return {
        path: "",
        filename: fc.filename,
        coverage: Math.floor(Object.values(fc.lineHits).filter((hits) => hits > 0).length / Object.values(fc.lineHits).length * 100),
        missing: Object.values(fc.lineHits).filter((hits) => !hits).length,
        tracked: Object.values(fc.lineHits).length
      };
    })
  });
};
const getObjectsAtPath = (curData, path) => {
  var _a;
  let data = curData == null ? void 0 : curData.files;
  for (const fragment of path) {
    data = (_a = data == null ? void 0 : data.find((d) => d.path === fragment)) == null ? void 0 : _a.files;
  }
  return data;
};
const FileExplorer = () => {
  const { entity } = useEntity();
  const [curData, setCurData] = useState();
  const [tableData, setTableData] = useState();
  const [curPath, setCurPath] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [curFile, setCurFile] = useState("");
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const { loading, error, value } = useAsync(async () => await codeCoverageApi.getCoverageForEntity({
    kind: entity.kind,
    namespace: entity.metadata.namespace || "default",
    name: entity.metadata.name
  }));
  useEffect(() => {
    if (!value)
      return;
    const data = formatInitialData(value);
    setCurData(data);
    if (data.files)
      setTableData(data.files);
  }, [value]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  if (!value) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "warning"
    }, "No code coverage found for $", entity);
  }
  const moveDownIntoPath = (path) => {
    const nextPathData = tableData.find((d) => d.path === path);
    if (nextPathData && nextPathData.files) {
      setTableData(nextPathData.files);
    }
  };
  const moveUpIntoPath = (idx) => {
    const path = curPath.split("/").slice(0, idx + 1);
    setCurPath(path.join("/"));
    setTableData(getObjectsAtPath(curData, path.slice(1)));
  };
  const columns = [
    {
      title: "Path",
      type: "string",
      field: "path",
      render: (row) => {
        var _a;
        if ((_a = row.files) == null ? void 0 : _a.length) {
          return /* @__PURE__ */ React.createElement("div", {
            role: "button",
            tabIndex: row.tableData.id,
            style: { color: "lightblue", cursor: "pointer" },
            onKeyDown: () => {
              setCurPath(`${curPath}/${row.path}`);
              moveDownIntoPath(row.path);
            },
            onClick: () => {
              setCurPath(`${curPath}/${row.path}`);
              moveDownIntoPath(row.path);
            }
          }, row.path);
        }
        return /* @__PURE__ */ React.createElement(Box, {
          display: "flex",
          alignItems: "center"
        }, row.path, /* @__PURE__ */ React.createElement(Tooltip$1, {
          title: "View file content"
        }, /* @__PURE__ */ React.createElement(DescriptionIcon, {
          fontSize: "small",
          style: { color: "lightblue", cursor: "pointer" },
          onClick: () => {
            setCurFile(`${curPath.slice(1)}/${row.path}`);
            setModalOpen(true);
          }
        })));
      }
    },
    {
      title: "Coverage",
      type: "numeric",
      field: "coverage",
      render: (row) => `${row.coverage.toFixed(2)}%`
    },
    {
      title: "Missing lines",
      type: "numeric",
      field: "missing"
    },
    {
      title: "Tracked lines",
      type: "numeric",
      field: "tracked"
    }
  ];
  const pathArray = curPath.split("/");
  const lastPathElementIndex = pathArray.length - 1;
  const fileCoverage = value.files.find((f) => f.filename.endsWith(curFile));
  if (!fileCoverage) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, {
    title: "Explore Files"
  }), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Box, {
    mb: 2,
    display: "flex"
  }, pathArray.map((pathElement, idx) => /* @__PURE__ */ React.createElement(Fragment, {
    key: pathElement || "root"
  }, /* @__PURE__ */ React.createElement("div", {
    role: "button",
    tabIndex: idx,
    style: {
      color: `${idx !== lastPathElementIndex && "lightblue"}`,
      cursor: `${idx !== lastPathElementIndex && "pointer"}`
    },
    onKeyDown: () => moveUpIntoPath(idx),
    onClick: () => moveUpIntoPath(idx)
  }, pathElement || "root"), /* @__PURE__ */ React.createElement("div", null, "\xA0/\xA0")))), /* @__PURE__ */ React.createElement(Table, {
    emptyContent: /* @__PURE__ */ React.createElement(React.Fragment, null, "No files found"),
    data: tableData || [],
    columns
  }), /* @__PURE__ */ React.createElement(Modal, {
    open: modalOpen,
    onClick: (event) => event.stopPropagation(),
    onClose: () => setModalOpen(false),
    style: { overflow: "scroll" }
  }, /* @__PURE__ */ React.createElement(FileContent, {
    filename: curFile,
    coverage: fileCoverage
  }))));
};

const CodeCoveragePage = () => {
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "Code coverage"
  }), /* @__PURE__ */ React.createElement(CoverageHistoryChart, null), /* @__PURE__ */ React.createElement(FileExplorer, null)));
};

const isCodeCoverageAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a["backstage.io/code-coverage"]);
};
const Router = () => {
  const { entity } = useEntity();
  if (!isCodeCoverageAvailable(entity)) {
    return /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
      annotation: "backstage.io/code-coverage"
    });
  }
  return /* @__PURE__ */ React.createElement(CodeCoveragePage, null);
};

var Router$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isCodeCoverageAvailable: isCodeCoverageAvailable,
  Router: Router
});

export { EntityCodeCoverageContent, Router, codeCoveragePlugin, isCodeCoverageAvailable, isCodeCoverageAvailable as isPluginApplicableToEntity };
//# sourceMappingURL=index.esm.js.map
