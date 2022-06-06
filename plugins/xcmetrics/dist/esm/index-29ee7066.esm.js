import React, { useState, useEffect, useRef } from 'react';
import { Progress, TrendLine, Select, StatusAborted, StatusOK, StatusError, StatusWarning, EmptyState, ContentHeader, SupportButton, Table, InfoCard, StructuredMetadataTable, Page, Header, HeaderLabel, TabbedLayout, Content } from '@backstage/core-components';
import { useApi, useRouteRefParams } from '@backstage/core-plugin-api';
import { x as xcmetricsApiRef, b as buildsRouteRef } from './index-32152426.esm.js';
import '@backstage/errors';
import { Duration, DateTime } from 'luxon';
import useAsync from 'react-use/lib/useAsync';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles, Tooltip, Typography, Grid, useTheme, Chip, withStyles, createStyles, InputBase, IconButton, Button, Accordion as Accordion$1, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@material-ui/core';
import useMeasure from 'react-use/lib/useMeasure';
import upperFirst from 'lodash/upperFirst';
import FilterList from '@material-ui/icons/FilterList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as Tooltip$1, Legend, Bar } from 'recharts';
import CloseIcon from '@material-ui/icons/Close';

const sumField = (field, arr) => {
  return arr == null ? void 0 : arr.reduce((sum, current) => sum + field(current), 0);
};
const getValues = (field, arr) => {
  if (!(arr == null ? void 0 : arr.length)) {
    return void 0;
  }
  return arr.map((element) => field(element));
};

const getErrorRatios = (buildCounts) => {
  if (!(buildCounts == null ? void 0 : buildCounts.length)) {
    return void 0;
  }
  return buildCounts.map((counts) => counts.builds === 0 ? 0 : counts.errors / counts.builds);
};
const getAverageDuration = (buildTimes, field) => {
  if (!(buildTimes == null ? void 0 : buildTimes.length)) {
    return void 0;
  }
  return formatDuration(buildTimes.reduce((sum, current) => sum + field(current), 0) / buildTimes.length);
};

const formatDuration = (seconds) => {
  var _a;
  const duration = Duration.fromObject({
    seconds
  }).shiftTo("hours", "minutes", "seconds", "milliseconds");
  if (duration.hours + duration.minutes + duration.seconds === 0) {
    return `${Math.round(duration.milliseconds)} ms`;
  }
  const h = duration.hours ? `${duration.hours} h` : "";
  const m = duration.minutes ? `${duration.minutes} m` : "";
  const s = duration.hours < 12 ? `${(_a = duration.seconds) != null ? _a : 0} s` : "";
  return `${h} ${m} ${s}`;
};
const formatSecondsInterval = ([start, end]) => {
  return `${Math.round(start * 100) / 100} s - ${Math.round(end * 100) / 100} s`;
};
const formatTime = (timestamp) => {
  return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
};
const formatPercentage = (number) => {
  return `${Math.round(number * 100)} %`;
};
const formatStatus = (status) => upperFirst(status);

const classNames = (...args) => args.filter((c) => !!c).join(" ");
const cn = classNames;

const TooltipContent = ({ buildId }) => {
  const client = useApi(xcmetricsApiRef);
  const { value, loading, error } = useAsync(async () => client.getBuild(buildId), []);
  if (error) {
    return /* @__PURE__ */ React.createElement("div", null, error.message);
  }
  if (loading || !(value == null ? void 0 : value.build)) {
    return /* @__PURE__ */ React.createElement(Progress, {
      style: { width: 100 }
    });
  }
  return /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("tbody", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "Started"), /* @__PURE__ */ React.createElement("td", null, new Date(value.build.startTimestamp).toLocaleString())), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "Duration"), /* @__PURE__ */ React.createElement("td", null, formatDuration(value.build.duration))), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", null, "Status"), /* @__PURE__ */ React.createElement("td", null, formatStatus(value.build.buildStatus)))));
};
const useStyles$9 = makeStyles((theme) => ({
  root: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    marginRight: ({ spacing }) => spacing,
    marginBottom: ({ spacing }) => spacing,
    backgroundColor: theme.palette.grey[600],
    "&:hover": {
      transform: "scale(1.2)"
    }
  },
  ...{
    succeeded: {
      backgroundColor: theme.palette.type === "light" ? theme.palette.success.light : theme.palette.success.main
    }
  },
  ...{
    failed: {
      backgroundColor: theme.palette.error[theme.palette.type]
    }
  },
  ...{
    stopped: {
      backgroundColor: theme.palette.warning[theme.palette.type]
    }
  }
}));
const StatusCell = (props) => {
  const classes = useStyles$9(props);
  const { buildStatus } = props;
  if (!buildStatus) {
    return /* @__PURE__ */ React.createElement("div", {
      className: classes.root
    });
  }
  return /* @__PURE__ */ React.createElement(Tooltip, {
    title: /* @__PURE__ */ React.createElement(TooltipContent, {
      buildId: buildStatus.id
    }),
    enterNextDelay: 500,
    arrow: true
  }, /* @__PURE__ */ React.createElement("div", {
    "data-testid": buildStatus.id,
    className: cn(classes.root, classes[buildStatus.buildStatus])
  }));
};

const CELL_SIZE = 12;
const CELL_MARGIN = 4;
const MAX_ROWS = 4;
const useStyles$8 = makeStyles((theme) => ({
  root: {
    marginTop: 8,
    display: "flex",
    flexWrap: "wrap",
    width: "100%"
  },
  loading: {
    animation: `$loadingOpacity 900ms ${theme.transitions.easing.easeInOut}`,
    animationIterationCount: "infinite"
  },
  "@keyframes loadingOpacity": {
    "0%": { opacity: 0.3 },
    "100%": { opacity: 0.8 }
  }
}));
const StatusMatrix = () => {
  const classes = useStyles$8();
  const [measureRef, { width: rootWidth }] = useMeasure();
  const client = useApi(xcmetricsApiRef);
  const {
    value: builds,
    loading,
    error
  } = useAsync(async () => client.getBuildStatuses(300), []);
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  const cols = Math.trunc(rootWidth / (CELL_SIZE + CELL_MARGIN)) || 1;
  return /* @__PURE__ */ React.createElement("div", {
    className: cn(classes.root, loading && classes.loading),
    ref: measureRef
  }, loading && [...new Array(cols * MAX_ROWS)].map((_, index) => {
    return /* @__PURE__ */ React.createElement(StatusCell, {
      key: index,
      size: CELL_SIZE,
      spacing: CELL_MARGIN
    });
  }), builds && builds.slice(0, cols * MAX_ROWS).map((buildStatus, index) => /* @__PURE__ */ React.createElement(StatusCell, {
    key: index,
    buildStatus,
    size: CELL_SIZE,
    spacing: CELL_MARGIN
  })));
};

const Trend = ({ data, title, color }) => {
  const emptyData = [0, 0];
  const max = Math.max(...data != null ? data : emptyData);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "overline"
  }, title), /* @__PURE__ */ React.createElement(TrendLine, {
    data: data != null ? data : emptyData,
    title,
    max,
    color: data && color
  }));
};

const DataValue = ({ field, value }) => {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "caption"
  }, field), /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle1"
  }, value != null ? value : "--"));
};
const DataValueGridItem = (props) => {
  var _a, _b, _c;
  return /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: (_a = props.xs) != null ? _a : 6,
    md: (_b = props.md) != null ? _b : 6,
    lg: (_c = props.lg) != null ? _c : 4
  }, /* @__PURE__ */ React.createElement(DataValue, {
    ...props
  }));
};

const useStyles$7 = makeStyles({
  spacingTop: {
    marginTop: 8
  },
  spacingVertical: {
    marginTop: 8,
    marginBottom: 8
  }
});
const DAYS_SELECT_ITEMS = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "30 days", value: 30 },
  { label: "60 days", value: 60 }
];
const OverviewTrends = () => {
  var _a, _b;
  const [days, setDays] = useState(14);
  const theme = useTheme();
  const classes = useStyles$7();
  const client = useApi(xcmetricsApiRef);
  const buildCountsResult = useAsync(async () => client.getBuildCounts(days), [days]);
  const buildTimesResult = useAsync(async () => client.getBuildTimes(days), [days]);
  if (buildCountsResult.loading && buildTimesResult.loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  const sumBuilds = sumField((b) => b.builds, buildCountsResult.value);
  const sumErrors = sumField((b) => b.errors, buildCountsResult.value);
  const errorRate = sumBuilds && sumErrors ? sumErrors / sumBuilds : void 0;
  const averageBuildDurationP50 = getAverageDuration(buildTimesResult.value, (b) => b.durationP50);
  const averageBuildDurationP95 = getAverageDuration(buildTimesResult.value, (b) => b.durationP95);
  const totalBuildTime = sumField((t) => t.totalDuration, buildTimesResult.value);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Select, {
    selected: days,
    items: DAYS_SELECT_ITEMS,
    label: "Trends for",
    onChange: (selection) => setDays(selection)
  }), buildCountsResult.error && /* @__PURE__ */ React.createElement(Alert, {
    severity: "error",
    className: classes.spacingVertical
  }, /* @__PURE__ */ React.createElement(AlertTitle, null, "Failed to fetch build counts"), (_a = buildCountsResult == null ? void 0 : buildCountsResult.error) == null ? void 0 : _a.message), buildTimesResult.error && /* @__PURE__ */ React.createElement(Alert, {
    severity: "error",
    className: classes.spacingVertical
  }, /* @__PURE__ */ React.createElement(AlertTitle, null, "Failed to fetch build times"), (_b = buildTimesResult == null ? void 0 : buildTimesResult.error) == null ? void 0 : _b.message), (!buildCountsResult.error || !buildTimesResult.error) && /* @__PURE__ */ React.createElement("div", {
    className: classes.spacingVertical
  }, /* @__PURE__ */ React.createElement(Trend, {
    title: "Build Time",
    color: theme.palette.secondary.main,
    data: getValues((e) => e.durationP50, buildTimesResult.value)
  }), /* @__PURE__ */ React.createElement(Trend, {
    title: "Error Rate",
    color: theme.palette.status.warning,
    data: getErrorRatios(buildCountsResult.value)
  }), /* @__PURE__ */ React.createElement(Trend, {
    title: "Build Count",
    color: theme.palette.primary.main,
    data: getValues((e) => e.builds, buildCountsResult.value)
  }), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "row",
    className: classes.spacingTop
  }, /* @__PURE__ */ React.createElement(DataValueGridItem, {
    field: "Build Count",
    value: sumBuilds
  }), /* @__PURE__ */ React.createElement(DataValueGridItem, {
    field: "Error Count",
    value: sumErrors
  }), /* @__PURE__ */ React.createElement(DataValueGridItem, {
    field: "Error Rate",
    value: errorRate && formatPercentage(errorRate)
  }), /* @__PURE__ */ React.createElement(DataValueGridItem, {
    field: "Avg. Build Time (P50)",
    value: averageBuildDurationP50
  }), /* @__PURE__ */ React.createElement(DataValueGridItem, {
    field: "Avg. Build Time (P95)",
    value: averageBuildDurationP95
  }), /* @__PURE__ */ React.createElement(DataValueGridItem, {
    field: "Total Build Time",
    value: totalBuildTime && formatDuration(totalBuildTime)
  }))));
};

const STATUS_ICONS = {
  succeeded: /* @__PURE__ */ React.createElement(StatusOK, null),
  failed: /* @__PURE__ */ React.createElement(StatusError, null),
  stopped: /* @__PURE__ */ React.createElement(StatusWarning, null)
};
const StatusIcon = ({ buildStatus }) => {
  var _a;
  return (_a = STATUS_ICONS[buildStatus]) != null ? _a : /* @__PURE__ */ React.createElement(StatusAborted, null);
};

const baseColumns = [
  {
    field: "buildStatus",
    render: (data) => /* @__PURE__ */ React.createElement(StatusIcon, {
      buildStatus: data.buildStatus
    })
  },
  {
    title: "Project",
    field: "projectName"
  },
  {
    title: "Schema",
    field: "schema"
  },
  {
    title: "Started",
    field: "startedAt",
    render: (data) => formatTime(data.startTimestamp),
    cellStyle: { whiteSpace: "nowrap" }
  },
  {
    title: "Duration",
    field: "duration",
    render: (data) => formatDuration(data.duration)
  },
  {
    title: "User",
    field: "userid"
  }
];
const isCi = {
  field: "isCI",
  render: (data) => data.isCi && /* @__PURE__ */ React.createElement(Chip, {
    label: "CI",
    size: "small"
  }),
  width: "10",
  sorting: false
};
const overviewColumns = [...baseColumns, isCi];
const buildPageColumns = [
  ...baseColumns,
  {
    title: "Host",
    field: "machineName"
  },
  {
    title: "Warnings",
    field: "warningCount"
  },
  {
    title: "Category",
    field: "category",
    render: (data) => /* @__PURE__ */ React.createElement(Chip, {
      label: data.category,
      size: "small"
    })
  },
  isCi
];

const Overview = () => {
  const client = useApi(xcmetricsApiRef);
  const {
    value: builds,
    loading,
    error
  } = useAsync(async () => client.getBuilds(), []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (!builds || !builds.length) {
    return /* @__PURE__ */ React.createElement(EmptyState, {
      missing: "data",
      title: "No builds to show",
      description: "There are no builds in XCMetrics yet"
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContentHeader, {
    title: "XCMetrics Dashboard"
  }, /* @__PURE__ */ React.createElement(SupportButton, null, "Dashboard for XCMetrics")), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    md: 8,
    lg: 8,
    xl: 9
  }, /* @__PURE__ */ React.createElement(Table, {
    options: {
      paging: false,
      search: false,
      sorting: false,
      draggable: false
    },
    data: builds,
    columns: overviewColumns,
    title: /* @__PURE__ */ React.createElement(React.Fragment, null, "Latest Builds", /* @__PURE__ */ React.createElement(StatusMatrix, null))
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    md: 4,
    lg: 4,
    xl: 3
  }, /* @__PURE__ */ React.createElement(InfoCard, null, /* @__PURE__ */ React.createElement(OverviewTrends, null)))));
};

const BootstrapInput = withStyles((theme) => createStyles({
  root: {
    margin: `${theme.spacing(1)} 0px`,
    maxWidth: 300,
    "label + &": {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: "Helvetica Neue",
    height: 25,
    "&:focus": {
      background: theme.palette.background.paper,
      borderRadius: 4
    }
  }
}))(InputBase);
const useStyles$6 = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column"
  }
});
const DatePicker = ({
  label,
  onDateChange,
  ...inputProps
}) => {
  const classes = useStyles$6();
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "button"
  }, label), /* @__PURE__ */ React.createElement(BootstrapInput, {
    inputProps: { "aria-label": label },
    type: "date",
    fullWidth: true,
    onChange: (event) => onDateChange == null ? void 0 : onDateChange(event.target.value),
    ...inputProps
  }));
};

const toSelectItems = (strings) => {
  return strings.map((str) => ({ label: str, value: str }));
};
const useStyles$5 = makeStyles((theme) => ({
  filtersContent: {
    padding: theme.spacing(2, 2, 2, 2.5)
  }
}));
const BuildListFilter = ({
  onFilterChange,
  initialValues
}) => {
  const client = useApi(xcmetricsApiRef);
  const classes = useStyles$5();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  useEffect(() => onFilterChange(values), [onFilterChange, values]);
  const numFilters = Object.keys(values).reduce((sum, key) => {
    const filtersKey = key;
    return sum + Number(values[filtersKey] !== initialValues[filtersKey]);
  }, 0);
  const title = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => setOpen(!open),
    "aria-label": `${open ? "hide" : "show"} filters`
  }, /* @__PURE__ */ React.createElement(FilterList, null)), "Filters (", numFilters, ")", !!numFilters && /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    onClick: () => setValues(initialValues)
  }, "Clear all"));
  const statusItems = [
    { label: "All", value: "all" },
    { label: "Succeeded", value: "succeeded" },
    { label: "Failed", value: "failed" },
    { label: "Stopped", value: "stopped" }
  ];
  const { value: projects, loading } = useAsync(async () => {
    return client.getProjects();
  }, []);
  const content = /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "row",
    className: classes.filtersContent
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    sm: 6,
    md: 4,
    lg: 2
  }, /* @__PURE__ */ React.createElement(DatePicker, {
    label: "From",
    value: values.from,
    onDateChange: (date) => setValues({ ...values, from: date })
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    sm: 6,
    md: 4,
    lg: 2
  }, /* @__PURE__ */ React.createElement(DatePicker, {
    label: "To",
    value: values.to,
    onDateChange: (date) => setValues({ ...values, to: date })
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    sm: 6,
    md: 4,
    lg: 2
  }, /* @__PURE__ */ React.createElement(Select, {
    label: "Status",
    items: statusItems,
    selected: !values.buildStatus ? "all" : values.buildStatus,
    onChange: (selection) => {
      const buildStatus = selection === "all" ? void 0 : selection;
      setValues({ ...values, buildStatus });
    }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    sm: 6,
    md: 4,
    lg: 2
  }, loading ? /* @__PURE__ */ React.createElement(Select, {
    label: "Project",
    placeholder: "Loading..",
    items: [],
    onChange: () => void 0
  }) : /* @__PURE__ */ React.createElement(Select, {
    label: "Project",
    items: toSelectItems(["All"].concat(projects != null ? projects : [])),
    selected: values.project ? values.project : "All",
    onChange: (selection) => setValues({
      ...values,
      project: selection === "All" ? void 0 : selection
    })
  })));
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title,
    titleTypographyProps: { variant: "h6" },
    divider: open,
    noPadding: true,
    variant: "gridItem"
  }, open && content);
};

const useStyles$4 = makeStyles((theme) => createStyles({
  heading: {
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    color: theme.palette.text.secondary
  }
}));
const Accordion = (props) => {
  var _a;
  const classes = useStyles$4();
  return /* @__PURE__ */ React.createElement(Accordion$1, {
    disabled: props.disabled,
    TransitionProps: { unmountOnExit: (_a = props.unmountOnExit) != null ? _a : false }
  }, /* @__PURE__ */ React.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, null),
    "aria-controls": `${props.id}-content`,
    id: `${props.id}-header`
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.heading
  }, props.heading), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.secondaryHeading
  }, props.secondaryHeading)), /* @__PURE__ */ React.createElement(AccordionDetails, null, props.children));
};

const EMPTY_HEIGHT = 100;
const useStyles$3 = makeStyles((theme) => createStyles({
  toolTip: {
    backgroundColor: theme.palette.background.paper,
    opacity: 0.8,
    padding: 8
  }
}));
const TargetToolTip = ({ active, payload, label }) => {
  const classes = useStyles$3();
  if (active && payload && payload.length === 2) {
    const buildTime = payload[0].value[1] - payload[0].value[0];
    const compileTime = payload[1].value[1] - payload[1].value[0];
    return /* @__PURE__ */ React.createElement("div", {
      className: classes.toolTip
    }, `${label}: ${formatSecondsInterval(payload[0].value)}`, /* @__PURE__ */ React.createElement("br", null), buildTime > 0 && `Compile time: ${formatPercentage(compileTime / buildTime)}`);
  }
  return null;
};
const getTimelineData = (targets) => {
  const min = targets[0].startTimestampMicroseconds;
  return targets.filter((target) => target.fetchedFromCache === false).map((target) => ({
    name: target.name,
    buildTime: [
      target.startTimestampMicroseconds - min,
      target.endTimestampMicroseconds - min
    ],
    compileTime: [
      target.startTimestampMicroseconds - min,
      target.compilationEndTimestampMicroseconds - min
    ]
  }));
};
const BuildTimeline = ({
  targets,
  height,
  width
}) => {
  const theme = useTheme();
  if (!targets.length)
    return /* @__PURE__ */ React.createElement("p", null, "No Targets");
  const data = getTimelineData(targets);
  return /* @__PURE__ */ React.createElement(ResponsiveContainer, {
    height,
    width,
    minHeight: EMPTY_HEIGHT + targets.length * 5
  }, /* @__PURE__ */ React.createElement(BarChart, {
    layout: "vertical",
    data,
    maxBarSize: 10,
    barGap: 0
  }, /* @__PURE__ */ React.createElement(CartesianGrid, {
    strokeDasharray: "2 2"
  }), /* @__PURE__ */ React.createElement(XAxis, {
    type: "number",
    domain: [0, "dataMax"]
  }), /* @__PURE__ */ React.createElement(YAxis, {
    type: "category",
    dataKey: "name",
    padding: { top: 0, bottom: 0 }
  }), /* @__PURE__ */ React.createElement(Tooltip$1, {
    content: /* @__PURE__ */ React.createElement(TargetToolTip, null)
  }), /* @__PURE__ */ React.createElement(Legend, null), /* @__PURE__ */ React.createElement(Bar, {
    dataKey: "buildTime",
    fill: theme.palette.grey[400],
    minPointSize: 1
  }), /* @__PURE__ */ React.createElement(Bar, {
    dataKey: "compileTime",
    fill: theme.palette.primary.main
  })));
};

const useStyles$2 = makeStyles((theme) => createStyles({
  pre: {
    whiteSpace: "pre-line",
    wordBreak: "break-all"
  },
  expandable: {
    cursor: "pointer"
  },
  fullPre: {
    whiteSpace: "pre-wrap"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));
const PreformattedText = ({
  text,
  maxChars,
  expandable,
  title
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles$2();
  const handleKeyUp = (event) => {
    if (expandable && event.key === "Enter") {
      setOpen(true);
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    role: expandable ? "button" : void 0,
    onClick: () => expandable && setOpen(true),
    onKeyUp: handleKeyUp,
    tabIndex: expandable ? 0 : void 0
  }, /* @__PURE__ */ React.createElement("pre", {
    className: cn(classes.pre, expandable && classes.expandable)
  }, text.slice(0, maxChars - 1).trim(), text.length > maxChars - 1 && "\u2026")), expandable && /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose: () => setOpen(false),
    "aria-labelledby": "dialog-title",
    "aria-describedby": "dialog-description",
    maxWidth: "xl",
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(DialogTitle, {
    id: "dialog-title"
  }, title, /* @__PURE__ */ React.createElement(IconButton, {
    "aria-label": "close",
    className: classes.closeButton,
    onClick: () => setOpen(false)
  }, /* @__PURE__ */ React.createElement(CloseIcon, null))), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement("pre", {
    className: classes.fullPre
  }, text)), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    onClick: () => setOpen(false)
  }, "Close"))));
};

const useStyles$1 = makeStyles((theme) => createStyles({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));
const BuildDetails = ({
  buildData: { build, targets, xcode },
  showId
}) => {
  var _a, _b;
  const classes = useStyles$1();
  const client = useApi(xcmetricsApiRef);
  const hostResult = useAsync(async () => client.getBuildHost(build.id), [build.id]);
  const errorsResult = useAsync(async () => client.getBuildErrors(build.id), [build.id]);
  const warningsResult = useAsync(async () => client.getBuildWarnings(build.id), [build.id]);
  const metadataResult = useAsync(async () => client.getBuildMetadata(build.id), [build.id]);
  const buildDetails = {
    project: build.projectName,
    schema: build.schema,
    category: build.category,
    userId: build.userid,
    "started at": formatTime(build.startTimestamp),
    "ended at": formatTime(build.endTimestamp),
    duration: formatDuration(build.duration),
    status: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatusIcon, {
      buildStatus: build.buildStatus
    }), formatStatus(build.buildStatus)),
    xcode: xcode ? `${xcode.version} (${xcode.buildNumber})` : "Unknown",
    CI: build.isCi
  };
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    item: true,
    direction: "row"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 4
  }, /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
    metadata: showId === false ? buildDetails : { id: build.id, ...buildDetails }
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 8
  }, /* @__PURE__ */ React.createElement(Accordion, {
    id: "buildHost",
    heading: "Host",
    secondaryHeading: build.machineName
  }, hostResult.loading && /* @__PURE__ */ React.createElement(Progress, null), !hostResult.loading && hostResult.value && /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
    metadata: hostResult.value
  })), /* @__PURE__ */ React.createElement(Accordion, {
    id: "buildErrors",
    heading: "Errors",
    secondaryHeading: build.errorCount,
    disabled: build.errorCount === 0
  }, /* @__PURE__ */ React.createElement("div", null, errorsResult.loading && /* @__PURE__ */ React.createElement(Progress, null), !errorsResult.loading && ((_a = errorsResult.value) == null ? void 0 : _a.map((error, idx) => /* @__PURE__ */ React.createElement("div", {
    key: error.id
  }, /* @__PURE__ */ React.createElement(PreformattedText, {
    title: "Error Details",
    text: error.detail,
    maxChars: 190,
    expandable: true
  }), idx !== errorsResult.value.length - 1 && /* @__PURE__ */ React.createElement(Divider, {
    className: classes.divider
  })))))), /* @__PURE__ */ React.createElement(Accordion, {
    id: "buildWarnings",
    heading: "Warnings",
    secondaryHeading: build.warningCount,
    disabled: build.warningCount === 0
  }, /* @__PURE__ */ React.createElement("div", null, warningsResult.loading && /* @__PURE__ */ React.createElement(Progress, null), !warningsResult.loading && ((_b = warningsResult.value) == null ? void 0 : _b.map((warning, idx) => {
    var _a2;
    return /* @__PURE__ */ React.createElement("div", {
      key: warning.id
    }, /* @__PURE__ */ React.createElement(PreformattedText, {
      title: "Warning Details",
      text: (_a2 = warning.detail) != null ? _a2 : warning.title,
      maxChars: 190,
      expandable: true
    }), idx !== warningsResult.value.length - 1 && /* @__PURE__ */ React.createElement(Divider, {
      className: classes.divider
    }));
  })))), /* @__PURE__ */ React.createElement(Accordion, {
    id: "buildMetadata",
    heading: "Metadata",
    disabled: !metadataResult.loading && !metadataResult.value
  }, metadataResult.loading && /* @__PURE__ */ React.createElement(Progress, null), !metadataResult.loading && metadataResult.value && /* @__PURE__ */ React.createElement(StructuredMetadataTable, {
    metadata: metadataResult.value
  })), /* @__PURE__ */ React.createElement(Accordion, {
    id: "buildTimeline",
    heading: "Timeline",
    unmountOnExit: true
  }, /* @__PURE__ */ React.createElement(BuildTimeline, {
    targets
  }))));
};
const withRequest = (Component) => ({ buildId, ...props }) => {
  const client = useApi(xcmetricsApiRef);
  const {
    value: buildResponse,
    loading,
    error
  } = useAsync(async () => client.getBuild(buildId), []);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (!buildResponse) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Could not load build ", buildId);
  }
  return /* @__PURE__ */ React.createElement(Component, {
    ...props,
    buildData: buildResponse
  });
};

const useStyles = makeStyles((theme) => createStyles({
  detailPanel: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper
  }
}));
const BuildList = () => {
  const classes = useStyles();
  const client = useApi(xcmetricsApiRef);
  const tableRef = useRef();
  const initialFilters = {
    from: DateTime.now().minus({ years: 1 }).toISODate(),
    to: DateTime.now().toISODate()
  };
  const [filters, setFilters] = useState(initialFilters);
  const handleFilterChange = (values) => {
    var _a;
    setFilters(values);
    (_a = tableRef.current) == null ? void 0 : _a.onQueryChange();
  };
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 3,
    direction: "column"
  }, /* @__PURE__ */ React.createElement(BuildListFilter, {
    onFilterChange: handleFilterChange,
    initialValues: initialFilters
  }), /* @__PURE__ */ React.createElement(Table, {
    title: "Builds",
    columns: buildPageColumns,
    options: { paging: true, sorting: false, search: false, pageSize: 10 },
    tableRef,
    data: (query) => {
      return new Promise((resolve, reject) => {
        if (!query)
          return;
        client.getFilteredBuilds(filters, query.page + 1, query.pageSize).then((result) => {
          resolve({
            data: result.items,
            page: result.metadata.page - 1,
            totalCount: result.metadata.total
          });
        }).catch((reason) => reject(reason));
      });
    },
    detailPanel: (rowData) => {
      const BuildDetailsWithRequest = withRequest(BuildDetails);
      return /* @__PURE__ */ React.createElement("div", {
        className: classes.detailPanel
      }, /* @__PURE__ */ React.createElement(BuildDetailsWithRequest, {
        buildId: rowData.rowData.id
      }));
    }
  }));
};

const BuildsPage = () => {
  var _a;
  const { "*": buildId } = (_a = useRouteRefParams(buildsRouteRef)) != null ? _a : { "*": "" };
  if (buildId) {
    const BuildDetailsWithRequest = withRequest(BuildDetails);
    return /* @__PURE__ */ React.createElement(InfoCard, {
      title: "Build Details",
      subheader: buildId
    }, /* @__PURE__ */ React.createElement(BuildDetailsWithRequest, {
      buildId,
      showId: false
    }));
  }
  return /* @__PURE__ */ React.createElement(BuildList, null);
};

const TABS = [
  {
    path: "/",
    title: "Overview",
    component: /* @__PURE__ */ React.createElement(Overview, null)
  },
  {
    path: buildsRouteRef.path,
    title: "Builds",
    component: /* @__PURE__ */ React.createElement(BuildsPage, null)
  }
];
const XcmetricsLayout = () => /* @__PURE__ */ React.createElement(Page, {
  themeId: "tool"
}, /* @__PURE__ */ React.createElement(Header, {
  title: "XCMetrics",
  subtitle: "Dashboard"
}, /* @__PURE__ */ React.createElement(HeaderLabel, {
  label: "Owner",
  value: "Spotify"
}), /* @__PURE__ */ React.createElement(HeaderLabel, {
  label: "Lifecycle",
  value: "Alpha"
})), /* @__PURE__ */ React.createElement(TabbedLayout, null, TABS.map((tab) => /* @__PURE__ */ React.createElement(TabbedLayout.Route, {
  key: tab.path,
  path: tab.path,
  title: tab.title
}, /* @__PURE__ */ React.createElement(Content, null, tab.component)))));

export { XcmetricsLayout };
//# sourceMappingURL=index-29ee7066.esm.js.map
