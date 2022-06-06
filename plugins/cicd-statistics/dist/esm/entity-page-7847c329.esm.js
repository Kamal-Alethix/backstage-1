import React, { useState, useEffect, useMemo, useCallback, useContext, Fragment } from 'react';
import { Accordion, AccordionSummary, Typography, AccordionDetails, Grid, ButtonGroup, Button, Tooltip as Tooltip$1, Zoom, FormControlLabel, Switch, makeStyles, Slider, Card, CardHeader, CardContent, FormControl, FormGroup, Box, LinearProgress } from '@material-ui/core';
import { Alert as Alert$1 } from '@material-ui/lab';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, useApp, errorApiRef } from '@backstage/core-plugin-api';
import { DateTime, Duration } from 'luxon';
import { throttle, groupBy, countBy, capitalize, debounce } from 'lodash';
import { cicdStatisticsApiRef, AbortError, statusTypes } from '../index.esm.js';
import { map } from 'already';
import { ReferenceArea, ResponsiveContainer, ComposedChart, Legend, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, Bar } from 'recharts';
import Alert from '@material-ui/lab/Alert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import humanizeDuration from 'humanize-duration';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import BarChartIcon from '@material-ui/icons/BarChart';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import useAsync from 'react-use/lib/useAsync';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

function useCicdStatisticsApi() {
  try {
    return useApi(cicdStatisticsApiRef);
  } catch (err) {
    return void 0;
  }
}

function useCicdStatistics(options) {
  const {
    entity,
    abortController,
    timeFrom,
    timeTo,
    filterStatus,
    filterType
  } = options;
  const [state, setState] = useState({
    loading: true
  });
  const cicdStatisticsApi = useCicdStatisticsApi();
  useEffect(() => {
    if (!cicdStatisticsApi) {
      setState({ error: new Error("No CI/CD Statistics API installed") });
      return () => {
      };
    }
    let mounted = true;
    let completed = false;
    const updateProgressImpl = (_count, _total, _started) => {
      if (!mounted || completed) {
        return;
      }
      if (Array.isArray(_count)) {
        setState({
          loading: true,
          steps: _count.map((step) => {
            var _a;
            return {
              title: step.title,
              progress: !step.total ? 0 : step.completed / step.total,
              progressBuffer: !step.total ? 0 : ((_a = step.started) != null ? _a : 0) / step.total
            };
          })
        });
      } else {
        const count = _count;
        const total = _total;
        const started = _started != null ? _started : 0;
        setState({
          loading: true,
          progress: !total ? 0 : count / total,
          progressBuffer: !total ? 0 : started / total
        });
      }
    };
    const updateProgress = throttle(updateProgressImpl, 200);
    const fetchOptions = {
      entity,
      updateProgress,
      abortSignal: abortController.signal,
      timeFrom,
      timeTo,
      filterStatus,
      filterType
    };
    (async () => {
      return cicdStatisticsApi.fetchBuilds(fetchOptions);
    })().then((builds) => {
      completed = true;
      if (mounted) {
        setState({
          value: builds
        });
      }
    }).catch((err) => {
      completed = true;
      if (mounted) {
        setState({
          error: abortController.signal.aborted ? new AbortError() : err
        });
      }
    });
    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [
    abortController,
    entity,
    timeFrom,
    timeTo,
    filterStatus,
    filterType,
    cicdStatisticsApi
  ]);
  return state;
}

function defaultFormatStageName(parentNames, stageName) {
  let name = stageName;
  parentNames.forEach((parentName) => {
    if (name.startsWith(parentName)) {
      const newName = name.slice(parentName.length).replace(/^[^\w\d]+/g, "");
      if (newName) {
        name = newName;
      }
    }
  });
  return name.replace(/((pulling|(running)) [^:/]*\/.*?):.*/g, "$1");
}
async function cleanupBuildTree(builds, opts) {
  const { formatStageName, lowerCase } = opts;
  const recurseStage = (stage, parentNames) => {
    var _a;
    const name = formatStageName(parentNames, lowerCase ? stage.name.toLocaleLowerCase("en-US") : stage.name);
    const ancestry = [...parentNames, name];
    return {
      ...stage,
      name,
      stages: (_a = stage.stages) == null ? void 0 : _a.map((subStage) => recurseStage(subStage, ancestry))
    };
  };
  return map(builds, { chunk: "idle" }, (build) => ({
    ...build,
    stages: build.stages.map((stage) => recurseStage(stage, []))
  }));
}

function useCicdConfiguration() {
  const cicdStatisticsApi = useCicdStatisticsApi();
  const { entity } = useEntity();
  const [state, setState] = useState({
    loading: true
  });
  useEffect(() => {
    if (!cicdStatisticsApi) {
      setState({ error: new Error("No CI/CD Statistics API installed") });
      return;
    }
    cicdStatisticsApi.getConfiguration({ entity }).then((configuration) => {
      const {
        availableStatuses = statusTypes,
        formatStageName = defaultFormatStageName,
        defaults = {}
      } = configuration;
      setState({
        value: {
          availableStatuses,
          formatStageName,
          defaults
        }
      });
    }).catch((error) => {
      setState({ error });
    });
  }, [cicdStatisticsApi, entity]);
  return state;
}

function average(values) {
  return !values.length ? 0 : Math.round(values.reduce((prev, cur) => prev + cur, 0) / values.length);
}
function getOrSetStage(stages, name) {
  const stage = stages.get(name);
  if (stage)
    return stage;
  const newStage = makeStage(name);
  stages.set(name, newStage);
  return newStage;
}
function makeStage(name) {
  return {
    analysis: {
      unknown: { avg: 0, med: 0, max: 0, min: 0 },
      enqueued: { avg: 0, med: 0, max: 0, min: 0 },
      scheduled: { avg: 0, med: 0, max: 0, min: 0 },
      running: { avg: 0, med: 0, max: 0, min: 0 },
      aborted: { avg: 0, med: 0, max: 0, min: 0 },
      succeeded: { avg: 0, med: 0, max: 0, min: 0 },
      failed: { avg: 0, med: 0, max: 0, min: 0 },
      stalled: { avg: 0, med: 0, max: 0, min: 0 },
      expired: { avg: 0, med: 0, max: 0, min: 0 }
    },
    combinedAnalysis: { avg: 0, med: 0, max: 0, min: 0 },
    statusSet: /* @__PURE__ */ new Set(),
    name,
    values: [],
    stages: /* @__PURE__ */ new Map()
  };
}
function startOfDay$1(date) {
  if (typeof date === "number") {
    return DateTime.fromMillis(date).startOf("day").toMillis();
  }
  return DateTime.fromJSDate(date).startOf("day").toMillis();
}
function sortTriggerReasons(reasons) {
  return reasons.sort((a, b) => {
    if (a === "manual")
      return -1;
    else if (b === "manual")
      return 1;
    else if (a === "scm")
      return -1;
    else if (b === "scm")
      return 1;
    else if (a === "other")
      return -1;
    else if (b === "other")
      return 1;
    return a.localeCompare(b);
  });
}
function sortStatuses(statuses) {
  return [
    ...statusTypes.filter((status) => statuses.includes(status)),
    ...statuses.filter((status) => !statusTypes.includes(status)).sort((a, b) => a.localeCompare(b))
  ];
}

function countBuildsPerDay(values) {
  const days = groupBy(values, (value) => startOfDay$1(value.__epoch));
  Object.entries(days).forEach(([_startOfDay, valuesThisDay]) => {
    const counts = Object.fromEntries(statusTypes.map((type) => [
      type,
      valuesThisDay.filter((value) => value[type] !== void 0).length
    ]).filter(([_type, count]) => count > 0).map(([type, count]) => [
      `${type} count`,
      count
    ]));
    Object.assign(valuesThisDay[0], counts);
  });
}

function getAnalysis(values, status) {
  var _a, _b, _c;
  const analysis = {
    max: 0,
    min: 0,
    avg: 0,
    med: 0
  };
  const definedValues = values.filter((value) => typeof value[status] !== "undefined").map((value) => value[status]).sort((a, b) => a - b);
  analysis.max = (_a = definedValues[definedValues.length - 1]) != null ? _a : 0;
  analysis.min = (_b = definedValues[0]) != null ? _b : 0;
  analysis.avg = definedValues.length === 0 ? 0 : definedValues.reduce((prev, cur) => prev + cur, 0) / values.length;
  analysis.med = (_c = definedValues[Math.ceil(definedValues.length / 2)]) != null ? _c : 0;
  return analysis;
}
function makeCombinedAnalysis(analysis, allDurations) {
  var _a;
  if (analysis.succeeded) {
    return analysis.succeeded;
  }
  const analysisValues = Object.values(analysis);
  const max = analysisValues.reduce((prev, cur) => Math.max(prev, cur.max), 0);
  const min = analysisValues.reduce((prev, cur) => Math.min(prev, cur.min), max);
  const avg = !allDurations.length ? 0 : allDurations.reduce((prev, cur) => prev + cur, 0) / allDurations.length;
  allDurations.sort((a, b) => a - b);
  const med = (_a = allDurations[Math.ceil(allDurations.length / 2)]) != null ? _a : 0;
  return {
    max,
    min,
    avg,
    med
  };
}

function finalizeStage(stage, options) {
  const { averageWidth, allEpochs } = options;
  const { values, analysis, combinedAnalysis } = stage;
  if (allEpochs.length > 0) {
    const valueEpochs = new Set(values.map((value) => value.__epoch));
    allEpochs.forEach((epoch) => {
      if (!valueEpochs.has(epoch)) {
        values.push({ __epoch: epoch });
      }
    });
  }
  values.sort((a, b) => a.__epoch - b.__epoch);
  countBuildsPerDay(values);
  const allDurations = [];
  statusTypes.forEach((status) => {
    analysis[status] = getAnalysis(values, status);
    const durationsIndexes = values.map((value) => value[status]).map((duration, index) => ({ index, duration })).filter(({ duration }) => typeof duration !== "undefined").map(({ index }) => index);
    const durationsDense = values.map((value) => value[status]).filter((duration) => typeof duration !== "undefined");
    durationsDense.forEach((dur) => allDurations.push(dur));
    const averages = durationsDense.map((_, i) => average(durationsDense.slice(Math.max(i - averageWidth, 0), Math.min(i + averageWidth, durationsDense.length))));
    averages.forEach((avg, index) => {
      const key = `${status} avg`;
      values[durationsIndexes[index]][key] = avg;
    });
  });
  Object.assign(combinedAnalysis, makeCombinedAnalysis(analysis, allDurations));
  stage.stages.forEach((subStage) => finalizeStage(subStage, options));
}

function dailySummary(builds) {
  const triggersDaily = countTriggersPerDay(builds);
  const statusesDaily = countStatusesPerDay(builds);
  const { triggerReasons } = triggersDaily;
  const { statuses } = statusesDaily;
  const reasonMap = new Map(triggersDaily.values.map((value) => [value.__epoch, value]));
  const statusMap = new Map(statusesDaily.values.map((value) => [value.__epoch, value]));
  const days = Object.keys(groupBy(builds, (value) => startOfDay$1(value.requestedAt))).map((epoch) => parseInt(epoch, 10)).sort();
  return {
    values: days.map((epoch) => ({
      __epoch: epoch,
      ...reasonMap.get(epoch),
      ...statusMap.get(epoch)
    })),
    triggerReasons,
    statuses
  };
}
function countTriggersPerDay(builds) {
  const days = groupBy(builds, (value) => startOfDay$1(value.requestedAt));
  const triggerReasons = sortTriggerReasons([
    ...new Set(builds.map(({ triggeredBy }) => triggeredBy).filter((v) => !!v))
  ]);
  const values = Object.entries(days).map(([epoch, buildsThisDay]) => {
    const datapoint = Object.fromEntries(triggerReasons.map((reason) => [
      reason,
      buildsThisDay.filter((build) => build.triggeredBy === reason).length
    ]).filter(([_type, count]) => count > 0));
    const value = Object.assign(datapoint, {
      __epoch: parseInt(epoch, 10)
    });
    return value;
  });
  return { triggerReasons, values };
}
function countStatusesPerDay(builds) {
  const days = groupBy(builds, (value) => startOfDay$1(value.requestedAt));
  const foundStatuses = /* @__PURE__ */ new Set();
  const values = Object.entries(days).map(([epoch, buildsThisDay]) => {
    const byStatus = countBy(buildsThisDay, "status");
    const value = {
      __epoch: parseInt(epoch, 10),
      ...byStatus
    };
    Object.keys(byStatus).forEach((status) => {
      foundStatuses.add(status);
    });
    return value;
  });
  return {
    statuses: sortStatuses([...foundStatuses]),
    values
  };
}

async function buildsToChartableStages(builds, options) {
  const { normalizeTimeRange } = options;
  const total = makeStage("Total");
  const recurseDown = (stageMap, stage, __epoch) => {
    var _a;
    const { name, status, duration } = stage;
    const subChartableStage = getOrSetStage(stageMap, name);
    subChartableStage.statusSet.add(status);
    subChartableStage.values.push({
      __epoch,
      [status]: duration,
      [`${status} avg`]: duration
    });
    (_a = stage.stages) == null ? void 0 : _a.forEach((subStage) => {
      recurseDown(subChartableStage.stages, subStage, __epoch);
    });
  };
  const stages = /* @__PURE__ */ new Map();
  await map(builds, { chunk: "idle" }, (build) => {
    var _a;
    const { duration, requestedAt, status } = build;
    const __epoch = requestedAt.getTime();
    total.statusSet.add(status);
    total.values.push({
      __epoch,
      [status]: duration,
      [`${status} avg`]: duration
    });
    (_a = build.stages) == null ? void 0 : _a.forEach((subStage) => {
      recurseDown(stages, subStage, __epoch);
    });
  });
  const allEpochs = normalizeTimeRange ? builds.map((build) => build.requestedAt.getTime()) : [];
  await map([...stages.values()], { chunk: "idle" }, (stage) => finalizeStage(stage, { allEpochs, averageWidth: 10 }));
  finalizeStage(total, { allEpochs, averageWidth: 10 });
  const daily = dailySummary(builds);
  const statuses = findStatuses(total, [...stages.values()]);
  return { daily, total, stages, statuses };
}
function findStatuses(total, stages) {
  const statuses = /* @__PURE__ */ new Set();
  const addStatuses = (set) => {
    set.forEach((status) => {
      statuses.add(status);
    });
  };
  addStatuses(total.statusSet);
  const recurse = (subStages) => {
    subStages.forEach((stage) => {
      addStatuses(stage.statusSet);
      recurse([...stage.stages.values()]);
    });
  };
  recurse(stages);
  return sortStatuses([...statuses]);
}

const context = React.createContext(void 0);
function ZoomProvider({ children }) {
  const [registeredSelectors, setRegisteredSelectors] = useState([]);
  const [selectState, setSelectState] = useState({});
  const [zoomState, setZoomState] = useState({});
  const registerSelection = useCallback((selector) => {
    setRegisteredSelectors((old) => [...old, selector]);
    return () => {
      setRegisteredSelectors((old) => old.filter((sel) => sel === selector));
    };
  }, [setRegisteredSelectors]);
  const callSelectors = useCallback((state) => {
    registeredSelectors.forEach((selector) => {
      selector(state);
    });
  }, [registeredSelectors]);
  const throttledCallSelectors = useMemo(() => throttle(callSelectors, 200), [callSelectors]);
  useEffect(() => {
    throttledCallSelectors({
      left: selectState.left,
      right: selectState.right
    });
  }, [selectState.left, selectState.right, throttledCallSelectors]);
  const resetZoom = useCallback(() => {
    setSelectState({});
    setZoomState({});
  }, [setSelectState, setZoomState]);
  const value = useMemo(() => ({
    registerSelection,
    setSelectState,
    zoomState,
    setZoomState,
    resetZoom
  }), [registerSelection, setSelectState, zoomState, setZoomState, resetZoom]);
  return /* @__PURE__ */ React.createElement(context.Provider, {
    value,
    children
  });
}
function useZoom() {
  const { zoomState, resetZoom } = useContext(context);
  const zoomFilterValues = useCallback((values) => {
    const { left, right } = zoomState;
    return left === void 0 || right === void 0 ? values : values.filter(({ __epoch }) => __epoch > left && __epoch < right);
  }, [zoomState]);
  return useMemo(() => ({
    resetZoom,
    zoomState,
    zoomFilterValues
  }), [resetZoom, zoomState, zoomFilterValues]);
}
function useZoomArea() {
  const [showSelection, setShowSelection] = useState(false);
  const [state, setState] = useState({});
  const { setSelectState, setZoomState, registerSelection } = useContext(context);
  const onMouseDown = useCallback((e) => {
    if (!(e == null ? void 0 : e.activeLabel))
      return;
    setSelectState({ left: e.activeLabel });
    setShowSelection(true);
  }, [setSelectState, setShowSelection]);
  const onMouseMove = useCallback((e) => {
    if (!(e == null ? void 0 : e.activeLabel))
      return;
    setSelectState((area) => {
      if (!area.left) {
        return area;
      }
      return { ...area, right: e.activeLabel };
    });
  }, [setSelectState]);
  const doZoom = useCallback(() => {
    setSelectState((old) => {
      const { left, right } = old;
      if (left === void 0 || right === void 0 || left === right) {
        setZoomState({});
      } else if (left < right) {
        setZoomState({ left, right });
      } else if (left > right) {
        setZoomState({ left: right, right: left });
      }
      return {};
    });
    setShowSelection(false);
  }, [setSelectState, setZoomState, setShowSelection]);
  const zoomProps = useMemo(() => ({
    onMouseDown,
    onMouseMove,
    onMouseUp: doZoom
  }), [onMouseDown, onMouseMove, doZoom]);
  useEffect(() => {
    if (!showSelection) {
      return void 0;
    }
    return registerSelection(setState);
  }, [registerSelection, setState, showSelection]);
  const getZoomArea = useCallback((props) => /* @__PURE__ */ React.createElement(Fragment, {
    key: "zoom-area"
  }, showSelection && state.left && state.right ? /* @__PURE__ */ React.createElement(ReferenceArea, {
    x1: state.left,
    x2: state.right,
    strokeOpacity: 0.5,
    ...props
  }) : null), [showSelection, state.left, state.right]);
  return {
    zoomProps,
    getZoomArea
  };
}

const infoText = { color: "InfoText" };
function pickElements(arr, num) {
  if (arr.length <= num) {
    return [...arr];
  }
  if (num < 2) {
    return [arr[arr.length / 2]];
  }
  const step = arr.length / (num - 1);
  return [
    ...Array.from(Array(num - 1)).map((_, index) => arr[Math.round(index * step)]),
    arr[arr.length - 1]
  ];
}
function formatDateShort(milliseconds) {
  if (milliseconds === "auto") {
    return "";
  }
  return DateTime.fromMillis(milliseconds).toLocaleString(DateTime.DATE_SHORT);
}
function formatDateTimeShort(milliseconds) {
  if (milliseconds === "auto") {
    return "";
  }
  return DateTime.fromMillis(milliseconds).toLocaleString(DateTime.DATETIME_SHORT);
}
function labelFormatter(epoch) {
  return /* @__PURE__ */ React.createElement("span", {
    style: infoText
  }, formatDateTimeShort(epoch));
}
function labelFormatterWithoutTime(epoch) {
  return /* @__PURE__ */ React.createElement("span", {
    style: infoText
  }, formatDateShort(epoch));
}
function tickFormatterX(epoch) {
  return formatDateShort(epoch);
}
function tickFormatterY(duration) {
  if (duration === 0) {
    return "0";
  } else if (duration < 500) {
    return `${duration} ms`;
  }
  return formatDuration(duration).replace(/second.*/, "sec").replace(/minute.*/, "min").replace(/hour.*/, "h").replace(/day.*/, "d").replace(/month.*/, "m").replace(/year.*/, "y");
}
function tooltipValueFormatter(durationOrCount, name) {
  return [
    /* @__PURE__ */ React.createElement("span", {
      style: infoText
    }, capitalize(name), ":", " ", name.endsWith(" count") ? durationOrCount : formatDuration(durationOrCount)),
    null
  ];
}
function formatDuration(millis) {
  let rest = Math.round(millis);
  const days = Math.floor(rest / (1e3 * 60 * 60 * 24));
  rest -= days * (1e3 * 60 * 60 * 24);
  const hours = Math.floor(rest / (1e3 * 60 * 60));
  rest -= hours * (1e3 * 60 * 60);
  const minutes = Math.floor(rest / (1e3 * 60));
  rest -= minutes * (1e3 * 60);
  const seconds = Math.floor(rest / 1e3);
  rest -= seconds * 1e3;
  const milliseconds = rest;
  if (!days && !hours && !minutes) {
    if (seconds < 1) {
      return `${milliseconds}ms`;
    } else if (seconds < 2) {
      return `${((milliseconds + seconds * 1e3) / 1e3).toFixed(1)}s`;
    }
  }
  const dur = Duration.fromObject({
    ...days && { days },
    ...hours && { hours },
    ...minutes && !days && { minutes },
    ...seconds && !days && !hours && { seconds }
  });
  return humanizeDuration(dur.toMillis(), { round: true });
}
function formatDurationFromSeconds(seconds) {
  return formatDuration(seconds * 1e3);
}

const statusColorMap = {
  unknown: "#3d01a4",
  enqueued: "#7ad1b9",
  scheduled: "#0391ce",
  running: "#f3f318",
  aborted: "#8600af",
  succeeded: "#66b032",
  failed: "#fe2712",
  stalled: "#fb9904",
  expired: "#a7194b"
};
const triggerColorMap = {
  scm: "#0391ce",
  manual: "#a7194b",
  internal: "#82ca9d",
  other: "#f3f318"
};
const fireColors = [
  ["5%", "#e19678"],
  ["30%", "#dfe178"],
  ["50%", "#82ca9d"],
  ["95%", "#82ca9d"]
];
const colorStroke = "#c0c0c0";
const colorStrokeAvg = "#788ee1";

const fullWidth = { width: "100%" };
const noUserSelect = { userSelect: "none" };
const transitionProps = { unmountOnExit: true };
function StageChart(props) {
  const { stage, ...chartOptions } = props;
  const {
    chartTypes,
    defaultCollapsed = 0,
    defaultHidden = 0,
    zeroYAxis = false
  } = chartOptions;
  const { zoomFilterValues } = useZoom();
  const { zoomProps, getZoomArea } = useZoomArea();
  const ticks = useMemo(() => pickElements(stage.values, 8).map((val) => val.__epoch), [stage.values]);
  const domainY = useMemo(() => [zeroYAxis ? 0 : "auto", "auto"], [zeroYAxis]);
  const statuses = useMemo(() => statusTypes.filter((status) => stage.statusSet.has(status)), [stage.statusSet]);
  const legendPayload = useMemo(() => statuses.map((status) => ({
    value: capitalize(status),
    type: "line",
    id: status,
    color: statusColorMap[status]
  })), [statuses]);
  const subStages = useMemo(() => new Map([...stage.stages.entries()].filter(([_name, subStage]) => subStage.combinedAnalysis.max > defaultHidden)), [stage.stages, defaultHidden]);
  const zoomFilteredValues = useMemo(() => zoomFilterValues(stage.values), [stage.values, zoomFilterValues]);
  return stage.combinedAnalysis.max < defaultHidden ? null : /* @__PURE__ */ React.createElement(Accordion, {
    defaultExpanded: stage.combinedAnalysis.max > defaultCollapsed,
    TransitionProps: transitionProps
  }, /* @__PURE__ */ React.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React.createElement(Typography, null, stage.name, " (med ", formatDuration(stage.combinedAnalysis.med), ", avg", " ", formatDuration(stage.combinedAnalysis.avg), ")")), /* @__PURE__ */ React.createElement(AccordionDetails, null, stage.values.length === 0 ? /* @__PURE__ */ React.createElement(Alert, {
    severity: "info"
  }, "No data") : /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "column"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    style: noUserSelect
  }, /* @__PURE__ */ React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 140
  }, /* @__PURE__ */ React.createElement(ComposedChart, {
    data: zoomFilteredValues,
    ...zoomProps
  }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", {
    id: "colorDur",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, fireColors.map(([percent, color]) => /* @__PURE__ */ React.createElement("stop", {
    key: percent,
    offset: percent,
    stopColor: color,
    stopOpacity: 0.8
  })))), statuses.length > 1 && /* @__PURE__ */ React.createElement(Legend, {
    payload: legendPayload
  }), /* @__PURE__ */ React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /* @__PURE__ */ React.createElement(XAxis, {
    dataKey: "__epoch",
    type: "category",
    ticks,
    tickFormatter: tickFormatterX
  }), /* @__PURE__ */ React.createElement(YAxis, {
    yAxisId: 1,
    tickFormatter: tickFormatterY,
    type: "number",
    tickCount: 5,
    name: "Duration",
    domain: domainY
  }), /* @__PURE__ */ React.createElement(YAxis, {
    yAxisId: 2,
    orientation: "right",
    type: "number",
    tickCount: 5,
    name: "Count"
  }), /* @__PURE__ */ React.createElement(Tooltip, {
    formatter: tooltipValueFormatter,
    labelFormatter
  }), statuses.reverse().map((status) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement(Fragment, {
      key: status
    }, !chartTypes[status].includes("duration") ? null : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Area, {
      isAnimationActive: false,
      yAxisId: 1,
      type: "monotone",
      dataKey: status,
      stackId: status,
      stroke: statuses.length > 1 ? statusColorMap[status] : colorStroke,
      fillOpacity: statuses.length > 1 ? 0.5 : 1,
      fill: statuses.length > 1 ? statusColorMap[status] : "url(#colorDur)",
      connectNulls: true
    }), /* @__PURE__ */ React.createElement(Line, {
      isAnimationActive: false,
      yAxisId: 1,
      type: "monotone",
      dataKey: `${status} avg`,
      stroke: statuses.length > 1 ? statusColorMap[status] : colorStrokeAvg,
      opacity: 0.8,
      strokeWidth: 2,
      dot: false,
      connectNulls: true
    })), !chartTypes[status].includes("count") ? null : /* @__PURE__ */ React.createElement(Bar, {
      isAnimationActive: false,
      yAxisId: 2,
      type: "monotone",
      dataKey: `${status} count`,
      stackId: "1",
      stroke: (_a = statusColorMap[status]) != null ? _a : "",
      fillOpacity: 0.5,
      fill: (_b = statusColorMap[status]) != null ? _b : ""
    }));
  }), getZoomArea({ yAxisId: 1 })))), subStages.size === 0 ? null : /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Accordion, {
    defaultExpanded: false,
    TransitionProps: transitionProps
  }, /* @__PURE__ */ React.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React.createElement(Typography, null, "Sub stages (", subStages.size, ")")), /* @__PURE__ */ React.createElement(AccordionDetails, null, /* @__PURE__ */ React.createElement("div", {
    style: fullWidth
  }, [...subStages.values()].map((subStage) => /* @__PURE__ */ React.createElement(StageChart, {
    key: subStage.name,
    ...chartOptions,
    stage: subStage
  })))))))));
}

function StatusChart(props) {
  const { analysis } = props;
  const { zoomFilterValues } = useZoom();
  const { zoomProps, getZoomArea } = useZoomArea();
  const values = useMemo(() => {
    return analysis.daily.values.map((value) => {
      const totTriggers = analysis.daily.triggerReasons.reduce((prev, cur) => {
        var _a;
        return prev + ((_a = value[cur]) != null ? _a : 0);
      }, 0);
      if (!totTriggers) {
        return value;
      }
      return {
        ...value,
        ...Object.fromEntries(analysis.daily.triggerReasons.map((reason) => {
          var _a;
          return [
            reason,
            ((_a = value[reason]) != null ? _a : 0) / totTriggers
          ];
        }))
      };
    });
  }, [analysis.daily]);
  const triggerReasonLegendPayload = useMemo(() => analysis.daily.triggerReasons.map((reason) => {
    var _a;
    return {
      value: humanTriggerReason(reason),
      type: "line",
      id: reason,
      color: (_a = triggerColorMap[reason]) != null ? _a : ""
    };
  }), [analysis.daily.triggerReasons]);
  const statusesLegendPayload = useMemo(() => analysis.daily.statuses.map((status) => {
    var _a;
    return {
      value: capitalize(status),
      type: "line",
      id: status,
      color: (_a = statusColorMap[status]) != null ? _a : ""
    };
  }), [analysis.daily.statuses]);
  const legendPayload = useMemo(() => [
    ...triggerReasonLegendPayload,
    ...statusesLegendPayload
  ], [statusesLegendPayload, triggerReasonLegendPayload]);
  const tooltipFormatter = useMemo(() => {
    const reasonSet = new Set(analysis.daily.triggerReasons);
    return (percentOrCount, name) => {
      const label = reasonSet.has(name) ? humanTriggerReason(name) : capitalize(name);
      const valueText = reasonSet.has(name) ? `${(percentOrCount * 100).toFixed(0)}%` : percentOrCount;
      return [
        /* @__PURE__ */ React.createElement("span", null, label, ": ", valueText),
        null
      ];
    };
  }, [analysis.daily.triggerReasons]);
  const zoomFilteredValues = useMemo(() => zoomFilterValues(values), [values, zoomFilterValues]);
  const barSize = getBarSize(analysis.daily.values.length);
  return /* @__PURE__ */ React.createElement(Accordion, {
    defaultExpanded: analysis.daily.statuses.length > 1
  }, /* @__PURE__ */ React.createElement(AccordionSummary, {
    expandIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, null)
  }, /* @__PURE__ */ React.createElement(Typography, null, "Build count per status over build trigger reason")), /* @__PURE__ */ React.createElement(AccordionDetails, null, values.length === 0 ? /* @__PURE__ */ React.createElement(Alert, {
    severity: "info"
  }, "No data") : /* @__PURE__ */ React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 140
  }, /* @__PURE__ */ React.createElement(ComposedChart, {
    data: zoomFilteredValues,
    ...zoomProps
  }, /* @__PURE__ */ React.createElement(Legend, {
    payload: legendPayload
  }), /* @__PURE__ */ React.createElement(CartesianGrid, {
    strokeDasharray: "3 3"
  }), /* @__PURE__ */ React.createElement(XAxis, {
    dataKey: "__epoch",
    type: "category",
    tickFormatter: tickFormatterX
  }), /* @__PURE__ */ React.createElement(YAxis, {
    yAxisId: 1,
    type: "number",
    tickCount: 5,
    name: "Count"
  }), /* @__PURE__ */ React.createElement(YAxis, {
    yAxisId: 2,
    type: "number",
    name: "Triggers",
    hide: true
  }), /* @__PURE__ */ React.createElement(Tooltip, {
    labelFormatter: labelFormatterWithoutTime,
    formatter: tooltipFormatter
  }), triggerReasonLegendPayload.map((reason) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement(Fragment, {
      key: reason.id
    }, /* @__PURE__ */ React.createElement(Area, {
      isAnimationActive: false,
      type: "monotone",
      dataKey: reason.id,
      stackId: "triggers",
      yAxisId: 2,
      stroke: (_a = triggerColorMap[reason.id]) != null ? _a : "",
      fillOpacity: 0.5,
      fill: (_b = triggerColorMap[reason.id]) != null ? _b : ""
    }));
  }), [...analysis.daily.statuses].reverse().map((status) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement(Fragment, {
      key: status
    }, /* @__PURE__ */ React.createElement(Bar, {
      isAnimationActive: false,
      type: "monotone",
      barSize,
      dataKey: status,
      stackId: "statuses",
      yAxisId: 1,
      stroke: (_a = statusColorMap[status]) != null ? _a : "",
      fillOpacity: 0.8,
      fill: (_b = statusColorMap[status]) != null ? _b : ""
    }));
  }), getZoomArea({ yAxisId: 1 })))));
}
function humanTriggerReason(reason) {
  if (reason === "manual") {
    return "Triggered manually";
  } else if (reason === "scm") {
    return "Triggered by SCM";
  } else if (reason === "internal") {
    return "Triggered internally";
  } else if (reason === "other") {
    return "Triggered by another reason";
  }
  return `Triggered by ${reason}`;
}
function getBarSize(count) {
  if (count < 20) {
    return 10;
  } else if (count < 40) {
    return 8;
  }
  return 5;
}

function switchValue(value) {
  return typeof value === "object" ? value.value : value;
}
function switchText(value) {
  var _a;
  return typeof value === "object" ? (_a = value.text) != null ? _a : value.value : value;
}
function findParent(tagName, elem) {
  let node = elem;
  while (node.tagName !== tagName) {
    node = node.parentElement;
    if (!node) {
      throw new Error(`Couldn't find ${tagName} parent`);
    }
  }
  return node;
}
function ButtonSwitch(props) {
  const { values, vertical = false } = props;
  const onClick = useCallback((ev) => {
    const btn = findParent("BUTTON", ev.target);
    const index = [...btn.parentElement.children].findIndex((child) => child === btn);
    const value = switchValue(values[index]);
    if (props.multi) {
      props.onChange(props.selection.includes(value) ? props.selection.filter((val) => val !== value) : [...props.selection, value]);
    } else {
      props.onChange(value);
    }
  }, [values, props.selection, props.multi, props.onChange]);
  const hasSelection = (value) => {
    if (props.multi) {
      return props.selection.includes(value);
    }
    return props.selection === value;
  };
  const tooltipify = (value, elem) => typeof value === "object" && value.tooltip ? /* @__PURE__ */ React.createElement(Tooltip$1, {
    key: value.value,
    TransitionComponent: Zoom,
    title: value.tooltip,
    arrow: true
  }, elem) : elem;
  return /* @__PURE__ */ React.createElement(ButtonGroup, {
    disableElevation: true,
    orientation: vertical ? "vertical" : "horizontal",
    variant: "outlined",
    size: "small"
  }, values.map((value) => tooltipify(value, /* @__PURE__ */ React.createElement(Button, {
    key: switchValue(value),
    color: hasSelection(switchValue(value)) ? "primary" : "default",
    variant: hasSelection(switchValue(value)) ? "contained" : "outlined",
    onClick
  }, switchText(value)))));
}

function Toggle({
  checked,
  setChecked,
  children
}) {
  const toggler = useCallback(() => {
    setChecked(!checked);
  }, [checked, setChecked]);
  return /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Switch, {
      checked,
      onChange: toggler
    }),
    label: children
  });
}

const useStyles$2 = makeStyles((theme) => ({
  label: {
    fontWeight: "normal",
    margin: theme.spacing(0)
  }
}), {
  name: "CicdStatisticsLabel"
});
function Label({ children }) {
  const classes = useStyles$2();
  return /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2",
    className: classes.label
  }, children);
}

const marks = [
  0,
  1,
  2,
  3,
  4,
  5,
  10,
  20,
  30,
  60,
  2 * 60,
  3 * 60,
  4 * 60,
  5 * 60,
  10 * 60,
  15 * 60,
  30 * 60,
  45 * 60,
  60 * 60
].map((value, index) => ({
  value: index,
  label: formatDurationFromSeconds(value),
  seconds: value
}));
function findMarkIndex(seconds) {
  if (marks[0].seconds > seconds) {
    return 0;
  } else if (marks[marks.length - 1].seconds < seconds) {
    return marks.length - 1;
  }
  for (let i = 0; i < marks.length - 1; ++i) {
    const a = marks[i];
    const b = marks[i + 1];
    if (seconds === a.seconds) {
      return i;
    } else if (seconds === b.seconds) {
      return i + 1;
    } else if (a.seconds < seconds && b.seconds > seconds) {
      return seconds - a.seconds < b.seconds - seconds ? i : i - 1;
    }
  }
  return 0;
}
function formatDurationFromIndex(index) {
  return formatDurationFromSeconds(marks[index].seconds);
}
function DurationSlider(props) {
  const { header, value, setValue } = props;
  const [curValue, setCurValue] = useState(value);
  const debouncedSetValue = useMemo(() => debounce(setValue, 1e3), [setValue]);
  const onChange = useCallback((_, index) => {
    const millis = marks[index].seconds * 1e3;
    setCurValue(millis);
    debouncedSetValue(millis);
  }, [debouncedSetValue]);
  const indexValue = useMemo(() => findMarkIndex(curValue / 1e3), [curValue]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Label, null, header, " ", formatDuration(curValue)), /* @__PURE__ */ React.createElement(Slider, {
    value: indexValue,
    min: 0,
    step: 1,
    max: marks.length - 1,
    marks: true,
    getAriaValueText: formatDurationFromIndex,
    valueLabelFormat: formatDurationFromIndex,
    onChange,
    valueLabelDisplay: "auto",
    "aria-labelledby": "slider-hide-limit"
  }));
}

const useStyles$1 = makeStyles((theme) => ({
  rootCard: {
    padding: theme.spacing(0, 0, 0, 0),
    margin: theme.spacing(0, 0, 2, 0)
  },
  updateButton: {
    margin: theme.spacing(1, 0, 0, 0)
  },
  header: {
    margin: theme.spacing(0, 0, 0, 0),
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold"
  },
  title: {
    margin: theme.spacing(3, 0, 1, 0),
    textTransform: "uppercase",
    fontSize: 12,
    fontWeight: "bold",
    "&:first-child": {
      margin: theme.spacing(1, 0, 1, 0)
    }
  },
  buttonDescription: {
    textTransform: "uppercase",
    margin: theme.spacing(1, 0, 0, 1)
  }
}), {
  name: "CicdStatistics"
});
function getDefaultChartFilter(cicdConfiguration) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const toDate = (_b = (_a = cicdConfiguration.defaults) == null ? void 0 : _a.timeTo) != null ? _b : new Date();
  return {
    fromDate: (_d = (_c = cicdConfiguration.defaults) == null ? void 0 : _c.timeFrom) != null ? _d : DateTime.fromJSDate(toDate).minus({ months: 1 }).toJSDate(),
    toDate,
    branch: (_f = (_e = cicdConfiguration.defaults) == null ? void 0 : _e.filterType) != null ? _f : "branch",
    status: (_h = (_g = cicdConfiguration.defaults) == null ? void 0 : _g.filterStatus) != null ? _h : cicdConfiguration.availableStatuses.filter((status) => status === "succeeded" || status === "failed")
  };
}
function isSameChartFilter(a, b) {
  return a.branch === b.branch && [...a.status].sort().join(" ") === [...b.status].sort().join(" ") && DateTime.fromJSDate(a.fromDate).hasSame(DateTime.fromJSDate(b.fromDate), "day") && DateTime.fromJSDate(a.toDate).hasSame(DateTime.fromJSDate(b.toDate), "day");
}
function getDefaultViewOptions(cicdConfiguration) {
  var _a, _b, _c, _d;
  return {
    lowercaseNames: (_b = (_a = cicdConfiguration.defaults) == null ? void 0 : _a.lowercaseNames) != null ? _b : false,
    normalizeTimeRange: (_d = (_c = cicdConfiguration.defaults) == null ? void 0 : _c.normalizeTimeRange) != null ? _d : true,
    collapsedLimit: 60 * 1e3,
    hideLimit: 20 * 1e3,
    chartTypes: {
      succeeded: ["duration"],
      failed: ["count"],
      enqueued: ["count"],
      scheduled: ["count"],
      running: ["count"],
      aborted: ["count"],
      stalled: ["count"],
      expired: ["count"],
      unknown: ["count"]
    }
  };
}
const branchValues = [
  "master",
  "branch",
  {
    value: "all",
    tooltip: "NOTE; If the build pipelines are very different between master and branch builds, viewing them combined might not result in a very useful chart"
  }
];
const chartTypeValues = [
  { value: "duration", text: /* @__PURE__ */ React.createElement(ShowChartIcon, null), tooltip: "Duration" },
  { value: "count", text: /* @__PURE__ */ React.createElement(BarChartIcon, null), tooltip: "Count per day" }
];
function ChartFilters(props) {
  var _a;
  const {
    analysis,
    cicdConfiguration,
    initialFetchFilter,
    currentFetchFilter,
    onChangeFetchFilter,
    updateFetchFilter,
    initialViewOptions,
    onChangeViewOptions
  } = props;
  const classes = useStyles$1();
  const [internalRef] = useState({ first: true });
  const [useNowAsToDate, setUseNowAsToDate] = useState(true);
  const [toDate, setToDate] = useState(initialFetchFilter.toDate);
  const [fromDate, setFromDate] = useState(initialFetchFilter.fromDate);
  const [branch, setBranch] = useState(initialFetchFilter.branch);
  const statusValues = cicdConfiguration.availableStatuses;
  const [selectedStatus, setSelectedStatus] = useState(initialFetchFilter.status);
  const [viewOptions, setViewOptions] = useState(initialViewOptions);
  const setLowercaseNames = useCallback((lowercaseNames) => {
    setViewOptions((old) => ({ ...old, lowercaseNames }));
  }, [setViewOptions]);
  const setNormalizeTimeRange = useCallback((normalizeTimeRange) => {
    setViewOptions((old) => ({ ...old, normalizeTimeRange }));
  }, [setViewOptions]);
  const setHideLimit = useCallback((value) => {
    setViewOptions((old) => ({ ...old, hideLimit: value }));
  }, [setViewOptions]);
  const setCollapseLimit = useCallback((value) => {
    setViewOptions((old) => ({ ...old, collapsedLimit: value }));
  }, [setViewOptions]);
  const setChartType = useCallback((statusType, chartTypes) => {
    setViewOptions((old) => ({
      ...old,
      chartTypes: { ...old.chartTypes, [statusType]: chartTypes }
    }));
  }, [setViewOptions]);
  const setChartTypeSpecific = useMemo(() => Object.fromEntries(statusTypes.map((status) => [
    status,
    (chartTypes) => setChartType(status, chartTypes)
  ])), [setChartType]);
  useEffect(() => {
    onChangeViewOptions(viewOptions);
  }, [onChangeViewOptions, viewOptions]);
  useEffect(() => {
    if (internalRef.first) {
      internalRef.first = false;
      return;
    }
    onChangeFetchFilter({
      toDate,
      fromDate,
      branch,
      status: selectedStatus
    });
  }, [
    internalRef,
    toDate,
    fromDate,
    branch,
    selectedStatus,
    onChangeFetchFilter
  ]);
  const toggleUseNowAsDate = useCallback(() => {
    setUseNowAsToDate(!useNowAsToDate);
    if (!DateTime.fromJSDate(toDate).hasSame(DateTime.now(), "day")) {
      setToDate(new Date());
    }
  }, [useNowAsToDate, toDate]);
  const hasFetchFilterChanges = useMemo(() => !currentFetchFilter || !isSameChartFilter({
    toDate,
    fromDate,
    branch,
    status: selectedStatus
  }, currentFetchFilter), [toDate, fromDate, branch, selectedStatus, currentFetchFilter]);
  const updateFilter = useCallback(() => {
    updateFetchFilter({
      toDate,
      fromDate,
      branch,
      status: selectedStatus
    });
  }, [toDate, fromDate, branch, selectedStatus, updateFetchFilter]);
  const inrefferedStatuses = (_a = analysis == null ? void 0 : analysis.statuses) != null ? _a : selectedStatus;
  return /* @__PURE__ */ React.createElement(MuiPickersUtilsProvider, {
    utils: LuxonUtils
  }, /* @__PURE__ */ React.createElement(Card, {
    className: classes.rootCard
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    action: /* @__PURE__ */ React.createElement(Button, {
      size: "small",
      color: "secondary",
      variant: "contained",
      onClick: updateFilter,
      disabled: !hasFetchFilterChanges
    }, "Update"),
    title: /* @__PURE__ */ React.createElement(Typography, {
      variant: "subtitle2",
      className: classes.header
    }, "Fetching options")
  }), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2",
    className: `${classes.title} ${classes.title}`
  }, "Date range"), /* @__PURE__ */ React.createElement(KeyboardDatePicker, {
    autoOk: true,
    variant: "inline",
    inputVariant: "outlined",
    label: "From date",
    format: "yyyy-MM-dd",
    value: fromDate,
    InputAdornmentProps: { position: "start" },
    onChange: (date) => {
      var _a2;
      return setFromDate((_a2 = date == null ? void 0 : date.toJSDate()) != null ? _a2 : new Date());
    }
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(FormControl, {
    component: "fieldset"
  }, /* @__PURE__ */ React.createElement(FormGroup, null, /* @__PURE__ */ React.createElement(FormControlLabel, {
    control: /* @__PURE__ */ React.createElement(Switch, {
      checked: useNowAsToDate,
      onChange: toggleUseNowAsDate
    }),
    label: /* @__PURE__ */ React.createElement(Label, null, "To today")
  }), useNowAsToDate ? null : /* @__PURE__ */ React.createElement(KeyboardDatePicker, {
    autoOk: true,
    variant: "inline",
    inputVariant: "outlined",
    label: "To date",
    format: "yyyy-MM-dd",
    value: toDate,
    InputAdornmentProps: { position: "start" },
    onChange: (date) => {
      var _a2;
      return setToDate((_a2 = date == null ? void 0 : date.toJSDate()) != null ? _a2 : new Date());
    }
  }))), /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2",
    className: `${classes.title} ${classes.title}`
  }, "Branch"), /* @__PURE__ */ React.createElement(ButtonSwitch, {
    values: branchValues,
    selection: branch,
    onChange: setBranch
  }), /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2",
    className: `${classes.title} ${classes.title}`
  }, "Status"), /* @__PURE__ */ React.createElement(ButtonSwitch, {
    values: statusValues,
    multi: true,
    vertical: true,
    selection: selectedStatus,
    onChange: setSelectedStatus
  }))), /* @__PURE__ */ React.createElement(Card, {
    className: classes.rootCard
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    title: /* @__PURE__ */ React.createElement(Typography, {
      variant: "subtitle2",
      className: classes.header
    }, "View options")
  }), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Toggle, {
    checked: viewOptions.lowercaseNames,
    setChecked: setLowercaseNames
  }, /* @__PURE__ */ React.createElement(Tooltip$1, {
    arrow: true,
    title: "Lowercasing names can reduce duplications when stage names have changed casing"
  }, /* @__PURE__ */ React.createElement(Label, null, "Lowercase names"))), /* @__PURE__ */ React.createElement(Toggle, {
    checked: viewOptions.normalizeTimeRange,
    setChecked: setNormalizeTimeRange
  }, /* @__PURE__ */ React.createElement(Tooltip$1, {
    arrow: true,
    title: "All charts will use the same x-axis. This reduces confusion when stages have been altered over time and only appear in a part of the time range."
  }, /* @__PURE__ */ React.createElement(Label, null, "Normalize time range"))), /* @__PURE__ */ React.createElement(DurationSlider, {
    header: "Hide under peak",
    value: viewOptions.hideLimit,
    setValue: setHideLimit
  }), /* @__PURE__ */ React.createElement(DurationSlider, {
    header: "Collapse under peak",
    value: viewOptions.collapsedLimit,
    setValue: setCollapseLimit
  }), /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle2",
    className: `${classes.title} ${classes.title}`
  }, "Chart styles"), inrefferedStatuses.map((status) => /* @__PURE__ */ React.createElement(Grid, {
    key: status,
    container: true,
    spacing: 0
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(ButtonSwitch, {
    values: chartTypeValues,
    selection: viewOptions.chartTypes[status],
    onChange: setChartTypeSpecific[status],
    multi: true
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    className: classes.buttonDescription
  }, /* @__PURE__ */ React.createElement("div", null, status)))))));
}

const stepProgressStyle = {
  marginTop: 6
};
const sentry = Symbol();
function useAsyncChain(parentState, fn, deps) {
  const childState = useAsync(async () => !parentState.value ? sentry : fn(parentState.value), [!parentState.error, !parentState.loading, parentState.value, ...deps]);
  if (!parentState.value) {
    return parentState;
  } else if (childState.value === sentry) {
    return { loading: true };
  }
  return childState;
}
function renderFallbacks(state, success) {
  if (state.loading) {
    return /* @__PURE__ */ React.createElement(ViewProgress, {
      state
    });
  } else if (state.error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, state.error.stack);
  }
  return success(state.value);
}
function ViewProgress({
  state
}) {
  var _a, _b;
  const { Progress } = useApp().getComponents();
  const stateAsSingleProgress = state;
  const stateAsStepProgress = state;
  if (!stateAsSingleProgress.progress && !stateAsSingleProgress.progressBuffer && !stateAsStepProgress.steps) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (stateAsSingleProgress.progress !== void 0) {
    return /* @__PURE__ */ React.createElement(Box, {
      sx: { width: "100%" }
    }, /* @__PURE__ */ React.createElement(LinearProgress, {
      variant: "buffer",
      value: ((_a = stateAsSingleProgress.progress) != null ? _a : 0) * 100,
      valueBuffer: ((_b = stateAsSingleProgress.progressBuffer) != null ? _b : 0) * 100
    }));
  }
  return /* @__PURE__ */ React.createElement(Box, {
    sx: { width: "100%" }
  }, /* @__PURE__ */ React.createElement(Timeline, null, stateAsStepProgress.steps.map((step, index) => {
    var _a2, _b2;
    return /* @__PURE__ */ React.createElement(TimelineItem, {
      key: index
    }, /* @__PURE__ */ React.createElement(TimelineOppositeContent, null, step.title), /* @__PURE__ */ React.createElement(TimelineSeparator, null, /* @__PURE__ */ React.createElement(TimelineDot, {
      color: getDotColor(step)
    }), index < stateAsStepProgress.steps.length - 1 ? /* @__PURE__ */ React.createElement(TimelineConnector, null) : null), /* @__PURE__ */ React.createElement(TimelineContent, null, !step.progress && !step.progressBuffer ? null : /* @__PURE__ */ React.createElement(LinearProgress, {
      style: stepProgressStyle,
      variant: "buffer",
      value: ((_a2 = step.progress) != null ? _a2 : 0) * 100,
      valueBuffer: ((_b2 = step.progressBuffer) != null ? _b2 : 0) * 100
    })));
  })));
}
function getDotColor(step) {
  var _a;
  const progress = (_a = step.progress) != null ? _a : 0;
  if (progress >= 1) {
    return "primary";
  } else if (progress > 0) {
    return "secondary";
  }
  return "grey";
}

function sortFilterStatusType(statuses) {
  const statusSet = new Set(statuses);
  const sorted = ["all", ...statusTypes].filter((status) => {
    if (statusSet.has(status)) {
      statusSet.delete(status);
      return true;
    }
    return false;
  });
  return [...sorted, ...statusSet];
}

function EntityPageCicdCharts() {
  const state = useCicdConfiguration();
  return renderFallbacks(state, (value) => /* @__PURE__ */ React.createElement(ZoomProvider, null, /* @__PURE__ */ React.createElement(CicdCharts, {
    cicdConfiguration: value
  })));
}
const useStyles = makeStyles((theme) => ({
  pane: {
    padding: theme.spacing(1, 1, 1, 1)
  }
}), {
  name: "CicdStatisticsView"
});
function startOfDay(date) {
  return DateTime.fromJSDate(date).startOf("day").toJSDate();
}
function endOfDay(date) {
  return DateTime.fromJSDate(date).endOf("day").toJSDate();
}
function cleanChartFilter(filter) {
  return {
    ...filter,
    status: sortFilterStatusType(filter.status)
  };
}
function CicdCharts(props) {
  const { cicdConfiguration } = props;
  const errorApi = useApi(errorApiRef);
  const { entity } = useEntity();
  const classes = useStyles();
  const { resetZoom } = useZoom();
  const [chartFilter, setChartFilter] = useState(getDefaultChartFilter(cicdConfiguration));
  const [fetchedChartData, setFetchedChartData] = useState({
    abortController: null,
    chartFilter
  });
  const [viewOptions, setViewOptions] = useState(getDefaultViewOptions(cicdConfiguration));
  const fetchStatisticsOptions = useMemo(() => {
    const abortController = new AbortController();
    fetchedChartData.abortController = abortController;
    return {
      abortController,
      entity,
      timeFrom: startOfDay(fetchedChartData.chartFilter.fromDate),
      timeTo: endOfDay(fetchedChartData.chartFilter.toDate),
      filterStatus: fetchedChartData.chartFilter.status,
      filterType: fetchedChartData.chartFilter.branch
    };
  }, [entity, fetchedChartData]);
  const statisticsState = useCicdStatistics(fetchStatisticsOptions);
  const updateFilter = useCallback(() => {
    var _a;
    (_a = fetchedChartData.abortController) == null ? void 0 : _a.abort();
    setFetchedChartData({ abortController: null, chartFilter });
  }, [fetchedChartData, setFetchedChartData, chartFilter]);
  const chartableStagesState = useAsyncChain(statisticsState, async (value) => buildsToChartableStages(await cleanupBuildTree(value.builds, {
    formatStageName: cicdConfiguration.formatStageName,
    lowerCase: viewOptions.lowercaseNames
  }), { normalizeTimeRange: viewOptions.normalizeTimeRange }), [statisticsState, cicdConfiguration, viewOptions]);
  useEffect(() => {
    resetZoom();
  }, [resetZoom, statisticsState.value]);
  const onFilterChange = useCallback((filter) => {
    setChartFilter(cleanChartFilter(filter));
  }, []);
  const onViewOptionsChange = useCallback((options) => {
    setViewOptions(options);
  }, [setViewOptions]);
  useEffect(() => {
    var _a;
    if (!chartableStagesState.error || ((_a = chartableStagesState.error) == null ? void 0 : _a.name) === "AbortError") {
      return;
    }
    errorApi.post(chartableStagesState.error);
  }, [errorApi, chartableStagesState.error]);
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    lg: 2,
    className: classes.pane
  }, /* @__PURE__ */ React.createElement(ChartFilters, {
    analysis: chartableStagesState.value,
    cicdConfiguration,
    initialFetchFilter: chartFilter,
    currentFetchFilter: fetchedChartData.chartFilter,
    onChangeFetchFilter: onFilterChange,
    updateFetchFilter: updateFilter,
    initialViewOptions: viewOptions,
    onChangeViewOptions: onViewOptionsChange
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12,
    lg: 10,
    className: classes.pane
  }, renderFallbacks(chartableStagesState, (chartableStages) => {
    var _a, _b, _c, _d, _e;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, chartableStages.stages.size > 0 ? null : /* @__PURE__ */ React.createElement(Alert$1, {
      severity: "info"
    }, "No data"), !((_b = (_a = statisticsState.value) == null ? void 0 : _a.builds) == null ? void 0 : _b.length) || !((_e = (_d = (_c = chartableStagesState.value) == null ? void 0 : _c.daily) == null ? void 0 : _d.values) == null ? void 0 : _e.length) ? null : /* @__PURE__ */ React.createElement(StatusChart, {
      analysis: chartableStagesState.value
    }), /* @__PURE__ */ React.createElement(StageChart, {
      stage: chartableStages.total,
      defaultCollapsed: 0,
      defaultHidden: viewOptions.hideLimit,
      chartTypes: viewOptions.chartTypes
    }), [...chartableStages.stages.entries()].map(([name, stage]) => /* @__PURE__ */ React.createElement(StageChart, {
      key: name,
      stage,
      defaultCollapsed: viewOptions.collapsedLimit,
      defaultHidden: viewOptions.hideLimit,
      chartTypes: viewOptions.chartTypes
    })));
  })));
}

export { EntityPageCicdCharts };
//# sourceMappingURL=entity-page-7847c329.esm.js.map
