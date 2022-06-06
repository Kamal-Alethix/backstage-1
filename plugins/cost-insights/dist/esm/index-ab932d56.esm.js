import { createRouteRef, createPlugin, createRoutableExtension, useApi, configApiRef, createApiRef, identityApiRef } from '@backstage/core-plugin-api';
import React, { createContext, useState, useEffect, useContext, useReducer, forwardRef, useCallback, useMemo } from 'react';
import pluralize from 'pluralize';
import { makeStyles, createStyles, lighten, getLuminance, darken, emphasize, Backdrop, CircularProgress, FormControl, FormControlLabel, Checkbox, Typography, Box, RadioGroup, Radio, Collapse, TextField, ThemeProvider, createTheme, Container, Button, ButtonBase, Paper, Slide, Divider, useTheme, Tooltip as Tooltip$1, Tabs, Tab, Menu, MenuItem, MenuList, Badge, ListItemIcon, ListItemText, Dialog, IconButton, FormGroup } from '@material-ui/core';
import '@material-ui/icons/AccessTime';
import '@material-ui/icons/Check';
import '@material-ui/icons/Delete';
import classnames from 'classnames';
import MoneyIcon from '@material-ui/icons/MonetizationOn';
import ActionIcon from '@material-ui/icons/Whatshot';
import Settings from '@material-ui/icons/Settings';
import AccountTree from '@material-ui/icons/AccountTree';
import Storage from '@material-ui/icons/Storage';
import Search from '@material-ui/icons/Search';
import CloudQueue from '@material-ui/icons/CloudQueue';
import School from '@material-ui/icons/School';
import ViewHeadline from '@material-ui/icons/ViewHeadline';
import { Alert } from '@material-ui/lab';
import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';
import * as yup from 'yup';
import { DateTime, Duration as Duration$1 } from 'luxon';
import { parseEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Page, Header, Table, HeaderTabs, InfoCard, Lifecycle } from '@backstage/core-components';
import { ResponsiveContainer, BarChart as BarChart$1, Tooltip, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LensIcon from '@material-ui/icons/Lens';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import 'react-use/lib/useCopyToClipboard';
import '@material-ui/icons/AssignmentOutlined';
import '@material-ui/icons/AssignmentTurnedInOutlined';
import '@material-ui/icons/SentimentVeryDissatisfied';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import 'react-use/lib/useAsync';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import regression from 'regression';

const rootRouteRef = createRouteRef({
  id: "cost-insights"
});
const projectGrowthAlertRef = createRouteRef({
  id: "cost-insights:investigating-growth"
});
const unlabeledDataflowAlertRef = createRouteRef({
  id: "cost-insights:labeling-jobs"
});
const costInsightsPlugin = createPlugin({
  id: "cost-insights",
  featureFlags: [{ name: "cost-insights-currencies" }],
  routes: {
    root: rootRouteRef,
    growthAlerts: projectGrowthAlertRef,
    unlabeledDataflowAlerts: unlabeledDataflowAlertRef
  }
});
const CostInsightsPage = costInsightsPlugin.provide(createRoutableExtension({
  name: "CostInsightsPage",
  component: () => import('./index-240fdf67.esm.js').then((m) => m.CostInsightsPage),
  mountPoint: rootRouteRef
}));
const CostInsightsProjectGrowthInstructionsPage = costInsightsPlugin.provide(createRoutableExtension({
  name: "CostInsightsProjectGrowthInstructionsPage",
  component: () => import('./index-3ceb714e.esm.js').then((m) => m.ProjectGrowthInstructionsPage),
  mountPoint: projectGrowthAlertRef
}));
const CostInsightsLabelDataflowInstructionsPage = costInsightsPlugin.provide(createRoutableExtension({
  name: "CostInsightsLabelDataflowInstructionsPage",
  component: () => import('./index-37417942.esm.js').then((m) => m.LabelDataflowInstructionsPage),
  mountPoint: unlabeledDataflowAlertRef
}));

var Duration = /* @__PURE__ */ ((Duration2) => {
  Duration2["P7D"] = "P7D";
  Duration2["P30D"] = "P30D";
  Duration2["P90D"] = "P90D";
  Duration2["P3M"] = "P3M";
  return Duration2;
})(Duration || {});
const DEFAULT_DATE_FORMAT = "yyyy-LL-dd";

var AlertStatus = /* @__PURE__ */ ((AlertStatus2) => {
  AlertStatus2["Snoozed"] = "snoozed";
  AlertStatus2["Accepted"] = "accepted";
  AlertStatus2["Dismissed"] = "dismissed";
  return AlertStatus2;
})(AlertStatus || {});
var AlertDismissReason = /* @__PURE__ */ ((AlertDismissReason2) => {
  AlertDismissReason2["Other"] = "other";
  AlertDismissReason2["Resolved"] = "resolved";
  AlertDismissReason2["Expected"] = "expected";
  AlertDismissReason2["Seasonal"] = "seasonal";
  AlertDismissReason2["Migration"] = "migration";
  AlertDismissReason2["NotApplicable"] = "not-applicable";
  return AlertDismissReason2;
})(AlertDismissReason || {});
const AlertDismissOptions = [
  {
    reason: "resolved" /* Resolved */,
    label: "This action item is now resolved."
  },
  {
    reason: "seasonal" /* Seasonal */,
    label: "This is an expected increase at this time of year."
  },
  {
    reason: "migration" /* Migration */,
    label: "This increase is from a migration in process."
  },
  {
    reason: "expected" /* Expected */,
    label: "This is an expected increase due to our team\u2019s priorities."
  },
  {
    reason: "not-applicable" /* NotApplicable */,
    label: "This action item doesn\u2019t make sense for my team."
  },
  {
    reason: "other" /* Other */,
    label: "Other (please specify)"
  }
];
const AlertSnoozeOptions = [
  {
    duration: Duration.P7D,
    label: "1 Week"
  },
  {
    duration: Duration.P30D,
    label: "1 Month"
  },
  {
    duration: Duration.P90D,
    label: "1 Quarter"
  }
];
var DataKey = /* @__PURE__ */ ((DataKey2) => {
  DataKey2["Previous"] = "previous";
  DataKey2["Current"] = "current";
  DataKey2["Name"] = "name";
  return DataKey2;
})(DataKey || {});

const EngineerThreshold = 0.5;
var ChangeThreshold = /* @__PURE__ */ ((ChangeThreshold2) => {
  ChangeThreshold2[ChangeThreshold2["upper"] = 0.05] = "upper";
  ChangeThreshold2[ChangeThreshold2["lower"] = -0.05] = "lower";
  return ChangeThreshold2;
})(ChangeThreshold || {});
var GrowthType = /* @__PURE__ */ ((GrowthType2) => {
  GrowthType2[GrowthType2["Negligible"] = 0] = "Negligible";
  GrowthType2[GrowthType2["Savings"] = 1] = "Savings";
  GrowthType2[GrowthType2["Excess"] = 2] = "Excess";
  return GrowthType2;
})(GrowthType || {});

var CurrencyType = /* @__PURE__ */ ((CurrencyType2) => {
  CurrencyType2["USD"] = "USD";
  CurrencyType2["CarbonOffsetTons"] = "CARBON_OFFSET_TONS";
  CurrencyType2["Beers"] = "BEERS";
  CurrencyType2["IceCream"] = "PINTS_OF_ICE_CREAM";
  return CurrencyType2;
})(CurrencyType || {});

var IconType = /* @__PURE__ */ ((IconType2) => {
  IconType2["Compute"] = "compute";
  IconType2["Data"] = "data";
  IconType2["Database"] = "database";
  IconType2["Storage"] = "storage";
  IconType2["Search"] = "search";
  IconType2["ML"] = "ml";
  return IconType2;
})(IconType || {});

var DefaultNavigation = /* @__PURE__ */ ((DefaultNavigation2) => {
  DefaultNavigation2["CostOverviewCard"] = "cost-overview-card";
  DefaultNavigation2["AlertInsightsHeader"] = "alert-insights-header";
  return DefaultNavigation2;
})(DefaultNavigation || {});
const getDefaultNavigationItems = (alerts) => {
  const items = [
    {
      navigation: "cost-overview-card" /* CostOverviewCard */,
      icon: /* @__PURE__ */ React.createElement(MoneyIcon, null),
      title: "Cost Overview"
    }
  ];
  if (alerts > 0) {
    items.push({
      navigation: "alert-insights-header" /* AlertInsightsHeader */,
      icon: /* @__PURE__ */ React.createElement(ActionIcon, null),
      title: "Action Items"
    });
  }
  return items;
};
function getIcon(icon) {
  switch (icon) {
    case IconType.Compute:
      return /* @__PURE__ */ React.createElement(Settings, null);
    case IconType.Data:
      return /* @__PURE__ */ React.createElement(AccountTree, null);
    case IconType.Database:
      return /* @__PURE__ */ React.createElement(ViewHeadline, null);
    case IconType.Storage:
      return /* @__PURE__ */ React.createElement(Storage, null);
    case IconType.Search:
      return /* @__PURE__ */ React.createElement(Search, null);
    case IconType.ML:
      return /* @__PURE__ */ React.createElement(School, null);
    default:
      return /* @__PURE__ */ React.createElement(CloudQueue, null);
  }
}

function validateMetrics(metrics) {
  const defaults = metrics.filter((metric) => metric.default);
  if (defaults.length > 1) {
    throw new Error(`Only one default metric can be set at a time. Found ${defaults.length}`);
  }
}
function validateCurrencies(currencies) {
  const withoutKinds = currencies.filter((currency) => currency.kind === null);
  if (withoutKinds.length > 1) {
    throw new Error(`Only one currency can be without kind. Found ${withoutKinds.length}`);
  }
}

function notEmpty(value) {
  return !isNull(value) && !isUndefined(value);
}
function isUndefined(value) {
  return value === void 0;
}
function isNull(value) {
  return value === null;
}
function assertNever$7(x) {
  throw new Error(`Exhaustiveness check failed: ${x}`);
}
function assertAlways(argument) {
  if (argument === void 0) {
    throw new TypeError("Expected to always find a value but received undefined");
  }
  return argument;
}
function findAlways(collection, callback) {
  return assertAlways(collection.find(callback));
}
function findAnyKey(record) {
  return Object.keys(record != null ? record : {}).find((_) => true);
}

const rateOf = (cost, duration) => {
  switch (duration) {
    case Duration.P30D:
      return cost / 12;
    case Duration.P7D:
    case Duration.P90D:
    case Duration.P3M:
      return cost / 4;
    default:
      return assertNever$7(duration);
  }
};
const defaultCurrencies = [
  {
    kind: null,
    label: "Engineers \u{1F6E0}",
    unit: "engineer"
  },
  {
    kind: CurrencyType.USD,
    label: "US Dollars \u{1F4B5}",
    unit: "dollar",
    prefix: "$",
    rate: 1
  },
  {
    kind: CurrencyType.CarbonOffsetTons,
    label: "Carbon Offset Tons \u267B\uFE0F\u2696\uFE0Fs",
    unit: "carbon offset ton",
    rate: 3.5
  },
  {
    kind: CurrencyType.Beers,
    label: "Beers \u{1F37A}",
    unit: "beer",
    rate: 4.5
  },
  {
    kind: CurrencyType.IceCream,
    label: "Pints of Ice Cream \u{1F366}",
    unit: "ice cream pint",
    rate: 5.5
  }
];

const ConfigContext = createContext(void 0);
const defaultState = {
  metrics: [],
  products: [],
  icons: [],
  engineerCost: 0,
  currencies: defaultCurrencies
};
const ConfigProvider = ({ children }) => {
  const c = useApi(configApiRef);
  const [config, setConfig] = useState(defaultState);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    function getProducts() {
      const products = c.getConfig("costInsights.products");
      return products.keys().map((key) => ({
        kind: key,
        name: products.getString(`${key}.name`),
        aggregation: [0, 0]
      }));
    }
    function getMetrics() {
      const metrics = c.getOptionalConfig("costInsights.metrics");
      if (metrics) {
        return metrics.keys().map((key) => {
          var _a;
          return {
            kind: key,
            name: metrics.getString(`${key}.name`),
            default: (_a = metrics.getOptionalBoolean(`${key}.default`)) != null ? _a : false
          };
        });
      }
      return [];
    }
    function getCurrencies() {
      const currencies = c.getOptionalConfig("costInsights.currencies");
      if (currencies) {
        return currencies.keys().map((key) => ({
          label: currencies.getString(`${key}.label`),
          unit: currencies.getString(`${key}.unit`),
          kind: currencies.getOptionalString(`${key}.kind`) || null,
          prefix: currencies.getOptionalString(`${key}.prefix`),
          rate: currencies.getOptionalNumber(`${key}.rate`)
        }));
      }
      return defaultCurrencies;
    }
    function getIcons() {
      const products = c.getConfig("costInsights.products");
      const keys = products.keys();
      return keys.map((k) => ({
        kind: k,
        component: getIcon(products.getOptionalString(`${k}.icon`))
      }));
    }
    function getEngineerCost() {
      return c.getNumber("costInsights.engineerCost");
    }
    function getConfig() {
      const products = getProducts();
      const metrics = getMetrics();
      const engineerCost = getEngineerCost();
      const icons = getIcons();
      const currencies = getCurrencies();
      validateMetrics(metrics);
      validateCurrencies(currencies);
      setConfig((prevState) => ({
        ...prevState,
        metrics,
        products,
        engineerCost,
        icons,
        currencies
      }));
      setLoading(false);
    }
    getConfig();
  }, []);
  if (loading) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(ConfigContext.Provider, {
    value: config
  }, children);
};
function useConfig() {
  const config = useContext(ConfigContext);
  return config ? config : assertNever$6();
}
function assertNever$6() {
  throw new Error("Cannot use useConfig outside of ConfigProvider");
}

const CurrencyContext = React.createContext(void 0);
const CurrencyProvider = ({ children }) => {
  const config = useConfig();
  const currencies = config.currencies;
  const engineers = currencies.find((currency2) => currency2.kind === null);
  const [currency, setCurrency] = useState(engineers || currencies[0]);
  return /* @__PURE__ */ React.createElement(CurrencyContext.Provider, {
    value: { currency, setCurrency }
  }, children);
};
function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    assertNever$5();
  }
  return [context.currency, context.setCurrency];
}
function assertNever$5() {
  throw Error("Cannot use useCurrency outside of CurrencyProvider");
}

function getDefaultPageFilters(groups) {
  return {
    group: groups.length ? groups[0].id : null,
    project: null,
    duration: Duration.P90D,
    metric: null
  };
}

const schema = yup.object().shape({
  group: yup.string().nullable(),
  project: yup.string().nullable()
}).required();
const stringify = (queryParams) => qs.stringify(queryParams, { strictNullHandling: true });
const parse = (queryString) => qs.parse(queryString, { ignoreQueryPrefix: true, strictNullHandling: true });
const validate = (queryString) => {
  return schema.validate(parse(queryString), {
    stripUnknown: true,
    strict: true
  });
};
const getInitialPageState = (groups, queryParams = {}) => {
  return {
    ...getDefaultPageFilters(groups),
    ...queryParams.project ? { project: queryParams.project } : {},
    ...queryParams.group ? { group: queryParams.group } : {}
  };
};
const getInitialProductState = (config) => config.products.map((product) => ({
  productType: product.kind,
  duration: Duration.P30D
}));

const costInsightsApiRef = createApiRef({
  id: "plugin.costinsights.service"
});

const DEFAULT_DURATION = Duration.P30D;
function inclusiveStartDateOf(duration, inclusiveEndDate) {
  switch (duration) {
    case Duration.P7D:
    case Duration.P30D:
    case Duration.P90D:
      return DateTime.fromISO(inclusiveEndDate).minus(Duration$1.fromISO(duration).plus(Duration$1.fromISO(duration))).toFormat(DEFAULT_DATE_FORMAT);
    case Duration.P3M:
      return DateTime.fromISO(inclusiveEndDate).startOf("quarter").minus(Duration$1.fromISO(duration).plus(Duration$1.fromISO(duration))).toFormat(DEFAULT_DATE_FORMAT);
    default:
      return assertNever$7(duration);
  }
}
function exclusiveEndDateOf(duration, inclusiveEndDate) {
  switch (duration) {
    case Duration.P7D:
    case Duration.P30D:
    case Duration.P90D:
      return DateTime.fromISO(inclusiveEndDate).plus({ days: 1 }).toFormat(DEFAULT_DATE_FORMAT);
    case Duration.P3M:
      return DateTime.fromISO(quarterEndDate(inclusiveEndDate)).plus({ days: 1 }).toFormat(DEFAULT_DATE_FORMAT);
    default:
      return assertNever$7(duration);
  }
}
function inclusiveEndDateOf(duration, inclusiveEndDate) {
  return DateTime.fromISO(exclusiveEndDateOf(duration, inclusiveEndDate)).minus({ days: 1 }).toFormat(DEFAULT_DATE_FORMAT);
}
function intervalsOf(duration, inclusiveEndDate, repeating = 2) {
  return `R${repeating}/${duration}/${exclusiveEndDateOf(duration, inclusiveEndDate)}`;
}
function quarterEndDate(inclusiveEndDate) {
  const endDate = DateTime.fromISO(inclusiveEndDate);
  const endOfQuarter = endDate.endOf("quarter").toFormat(DEFAULT_DATE_FORMAT);
  if (endOfQuarter === inclusiveEndDate) {
    return endDate.toFormat(DEFAULT_DATE_FORMAT);
  }
  return endDate.startOf("quarter").minus({ days: 1 }).toFormat(DEFAULT_DATE_FORMAT);
}

var DefaultLoadingAction = /* @__PURE__ */ ((DefaultLoadingAction2) => {
  DefaultLoadingAction2["UserGroups"] = "user-groups";
  DefaultLoadingAction2["LastCompleteBillingDate"] = "billing-date";
  DefaultLoadingAction2["CostInsightsInitial"] = "cost-insights-initial";
  DefaultLoadingAction2["CostInsightsPage"] = "cost-insights-page";
  DefaultLoadingAction2["CostInsightsProducts"] = "cost-insights-products";
  DefaultLoadingAction2["CostInsightsAlerts"] = "cost-insights-alerts";
  return DefaultLoadingAction2;
})(DefaultLoadingAction || {});
const INITIAL_LOADING_ACTIONS = [
  "user-groups" /* UserGroups */,
  "cost-insights-initial" /* CostInsightsInitial */,
  "cost-insights-products" /* CostInsightsProducts */
];
const getDefaultState = (loadingActions) => {
  return loadingActions.reduce((defaultState, action) => ({ ...defaultState, [action]: true }), {});
};
const getResetState = (loadingActions) => {
  return loadingActions.reduce((defaultState, action) => ({ ...defaultState, [action]: false }), {});
};
const getResetStateWithoutInitial = (loadingActions) => {
  return loadingActions.reduce((defaultState, action) => {
    const loadingActionState = INITIAL_LOADING_ACTIONS.includes(action) ? false : true;
    return { ...defaultState, [action]: loadingActionState };
  }, {});
};
const settledResponseOf = (responses) => {
  return responses.map((response) => response.status === "fulfilled" ? response.value : null);
};
const initialStatesOf = (products, responses) => {
  return products.map((product, index) => ({
    entity: responses[index],
    product,
    duration: DEFAULT_DURATION
  }));
};

const costInsightsLightTheme = {
  palette: {
    blue: "#509AF5",
    lightBlue: "#9BF0E1",
    darkBlue: "#4101F5",
    magenta: "#DC148C",
    yellow: "#FFC864",
    tooltip: {
      background: "#171717",
      color: "#DDD"
    },
    navigationText: "#b5b5b5",
    alertBackground: "rgba(219, 219, 219, 0.13)",
    dataViz: [
      "#509BF5",
      "#4B917D",
      "#FF6437",
      "#F573A0",
      "#F59B23",
      "#B49BC8",
      "#C39687",
      "#A0C3D2",
      "#FFC864",
      "#BABABA"
    ]
  }
};
const costInsightsDarkTheme = {
  palette: {
    blue: "#77b8f9",
    lightBlue: "#d8f9f4",
    darkBlue: "#b595fd",
    magenta: "#ee93cd",
    yellow: "#fff2da",
    tooltip: {
      background: "#EEE",
      color: "#424242"
    },
    navigationText: "#b5b5b5",
    alertBackground: "rgba(32, 32, 32, 0.13)",
    dataViz: [
      "#8accff",
      "#7bc2ac",
      "#ff9664",
      "#ffa5d1",
      "#ffcc57",
      "#e6ccfb",
      "#f7c7b7",
      "#d2f6ff",
      "#fffb94",
      "#ececec"
    ]
  }
};
function brighten(color, coefficient = 0.2) {
  return getLuminance(color) > 0.5 ? lighten(color, coefficient) : darken(color, coefficient);
}
const useCostOverviewStyles = (theme) => ({
  axis: {
    fill: theme.palette.text.primary
  },
  container: {
    height: 450,
    width: 1200
  },
  cartesianGrid: {
    stroke: theme.palette.textVerySubtle
  },
  chart: {
    margin: {
      right: 30,
      top: 16
    }
  },
  yAxis: {
    width: 75
  }
});
const useOverviewTabsStyles = makeStyles((theme) => ({
  default: {
    padding: theme.spacing(2),
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.secondary,
    textTransform: "uppercase"
  },
  selected: {
    color: theme.palette.text.primary
  }
}));
const useBarChartStyles = (theme) => ({
  axis: {
    fill: theme.palette.text.primary
  },
  barChart: {
    margin: {
      left: 16,
      right: 16
    }
  },
  cartesianGrid: {
    stroke: theme.palette.textVerySubtle
  },
  cursor: {
    fill: theme.palette.textVerySubtle,
    fillOpacity: 0.3
  },
  container: {
    height: 400,
    width: 1200
  },
  infoIcon: {
    marginLeft: 2,
    fontSize: "1.25em"
  },
  xAxis: {
    height: 50
  }
});
const useBarChartLayoutStyles = makeStyles((theme) => createStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column"
  },
  legend: {
    paddingBottom: theme.spacing(2)
  }
}));
const useBarChartStepperButtonStyles = makeStyles((theme) => createStyles({
  root: {
    ...theme.typography.button,
    boxSizing: "border-box",
    transition: theme.transitions.create(["background-color", "box-shadow", "border"], {
      duration: theme.transitions.duration.short
    }),
    borderRadius: "50%",
    padding: 0,
    width: 40,
    height: 40,
    boxShadow: theme.shadows[6],
    "&:active": {
      boxShadow: theme.shadows[12]
    },
    color: theme.palette.text.primary,
    backgroundColor: lighten(theme.palette.background.default, 0.1),
    "&:hover": {
      backgroundColor: lighten(theme.palette.background.default, 0.2),
      textDecoration: "none"
    }
  }
}));
const useBarChartLabelStyles = makeStyles((theme) => createStyles({
  foreignObject: {
    textAlign: "center"
  },
  label: {
    fontWeight: theme.typography.fontWeightBold,
    display: "block",
    textDecoration: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  infoIcon: {
    marginLeft: 2,
    fontSize: "1.25em"
  },
  button: {
    textTransform: "none",
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.fontSize
  }
}));
const useCostInsightsStyles = makeStyles((theme) => ({
  h6Subtle: {
    ...theme.typography.h6,
    fontWeight: "normal",
    color: theme.palette.textSubtle
  }
}));
const useCostInsightsTabsStyles = makeStyles((theme) => ({
  tabs: {
    borderBottom: `1px solid ${theme.palette.textVerySubtle}`,
    backgroundColor: brighten(theme.palette.background.default),
    padding: theme.spacing(0, 4)
  },
  tab: {
    minHeight: 68,
    minWidth: 180,
    padding: theme.spacing(1, 4),
    "&:hover": {
      color: "inherit",
      backgroundColor: "inherit"
    }
  },
  indicator: {
    backgroundColor: theme.palette.navigation.indicator,
    height: 4
  },
  tabLabel: {
    display: "flex",
    alignItems: "center"
  },
  tabLabelText: {
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightBold
  },
  menuItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: 180,
    padding: theme.spacing(2, 2)
  },
  menuItemSelected: {
    backgroundColor: lighten(theme.palette.background.default, 0.3)
  }
}));
makeStyles((theme) => createStyles({
  root: {
    paddingBottom: theme.spacing(2),
    borderRadius: "unset"
  },
  title: {
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: 1.5
  },
  action: {
    margin: 0
  }
}));
const useCostGrowthStyles = makeStyles((theme) => createStyles({
  excess: {
    color: theme.palette.status.error
  },
  savings: {
    color: theme.palette.status.ok
  },
  indicator: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  }
}));
const useCostGrowthLegendStyles = makeStyles((theme) => ({
  h5: {
    ...theme.typography.h5,
    fontWeight: 500,
    padding: 0
  },
  marker: {
    display: "inherit",
    marginRight: theme.spacing(1)
  },
  helpIcon: {
    display: "inherit"
  },
  title: {
    ...theme.typography.overline,
    fontWeight: 500,
    lineHeight: 0,
    marginRight: theme.spacing(1),
    color: theme.palette.textSubtle
  },
  tooltip: {
    display: "block",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.navigation.background
  },
  tooltipText: {
    color: theme.palette.background.default,
    fontSize: theme.typography.fontSize,
    lineHeight: 1.5
  }
}));
const useBarChartStepperStyles = makeStyles((theme) => createStyles({
  paper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    background: "transparent",
    padding: 8
  },
  step: {
    backgroundColor: theme.palette.action.disabled,
    borderRadius: "50%",
    width: 9,
    height: 9,
    margin: "0 2px"
  },
  stepActive: {
    backgroundColor: theme.palette.primary.main
  },
  steps: {
    display: "flex",
    flexDirection: "row"
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: "calc(50% - 60px)",
    zIndex: 100
  },
  nextButton: {
    position: "absolute",
    right: 0,
    top: "calc(50% - 60px)",
    zIndex: 100
  }
}));
const useNavigationStyles = makeStyles((theme) => createStyles({
  menuList: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.navigation.background,
    minWidth: 250
  },
  menuItem: {
    background: "transparent",
    border: 0,
    textTransform: "none",
    width: "100%",
    minHeight: theme.spacing(6),
    margin: theme.spacing(0.5, 2, 0.5, 0)
  },
  listItemIcon: {
    minWidth: 40
  },
  navigationIcon: {
    fill: theme.palette.navigationText
  },
  title: {
    whiteSpace: "nowrap",
    lineHeight: 1,
    color: theme.palette.navigationText,
    fontWeight: theme.typography.fontWeightBold
  }
}));
const useTooltipStyles = makeStyles((theme) => createStyles({
  tooltip: {
    backgroundColor: theme.palette.tooltip.background,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    color: theme.palette.tooltip.color,
    fontSize: theme.typography.fontSize,
    minWidth: 300
  },
  maxWidth: {
    maxWidth: 300
  },
  actions: {
    padding: theme.spacing(2)
  },
  header: {
    padding: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(2)
  },
  lensIcon: {
    fontSize: `.75rem`
  },
  divider: {
    backgroundColor: emphasize(theme.palette.divider, 1)
  },
  truncate: {
    maxWidth: 200,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  subtitle: {
    fontStyle: "italic"
  }
}));
const useAlertInsightsSectionStyles = makeStyles((theme) => createStyles({
  button: {
    backgroundColor: theme.palette.textVerySubtle,
    color: theme.palette.text.primary
  }
}));
const useSelectStyles = makeStyles((theme) => createStyles({
  select: {
    minWidth: 200,
    textAlign: "start",
    backgroundColor: theme.palette.background.paper
  },
  menuItem: {
    minWidth: 200,
    padding: theme.spacing(2),
    "&.compact": {
      padding: theme.spacing(1, 2)
    }
  }
}));
const useActionItemCardStyles = makeStyles((theme) => createStyles({
  card: {
    boxShadow: "none"
  },
  avatar: {
    backgroundColor: theme.palette.textVerySubtle,
    color: theme.palette.text.primary
  },
  root: {
    minHeight: 80,
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius
  },
  activeRoot: {
    cursor: "pointer",
    transition: theme.transitions.create("background", {
      duration: theme.transitions.duration.short
    }),
    "&:hover": {
      background: theme.palette.alertBackground
    }
  },
  action: {
    margin: 0
  },
  title: {
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightBold
  }
}));
const useProductInsightsCardStyles = makeStyles((theme) => createStyles({
  root: {
    padding: theme.spacing(2, 2, 2, 2.5)
  },
  action: {
    margin: 0
  }
}));
const useProductInsightsChartStyles = makeStyles((theme) => createStyles({
  indicator: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: "1.25rem"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}));
const useBackdropStyles = makeStyles((theme) => createStyles({
  root: {
    zIndex: theme.zIndex.modal
  }
}));
const useSubtleTypographyStyles = makeStyles((theme) => createStyles({
  root: {
    color: theme.palette.textSubtle
  }
}));
const useEntityDialogStyles = makeStyles((theme) => createStyles({
  dialogContent: {
    padding: 0
  },
  dialogTitle: {
    padding: 0
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 100
  },
  row: {
    fontSize: theme.typography.fontSize * 1.25
  },
  rowTotal: {
    fontWeight: theme.typography.fontWeightBold
  },
  colFirst: {
    paddingLeft: theme.spacing(2)
  },
  colLast: {
    paddingRight: theme.spacing(2)
  },
  column: {
    fontWeight: theme.typography.fontWeightBold
  },
  growth: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end"
  }
}));
const useAlertDialogStyles = makeStyles((theme) => createStyles({
  content: {
    padding: theme.spacing(0, 5, 2, 5)
  },
  actions: {
    padding: theme.spacing(2, 5)
  },
  radio: {
    margin: theme.spacing(-0.5, 0, -0.5, 0)
  },
  icon: {
    color: theme.palette.primary.dark,
    margin: theme.spacing(2.5, 2.5, 0, 0),
    padding: 0
  }
}));
const useAlertStatusSummaryButtonStyles = makeStyles(() => ({
  icon: {
    transform: "transform 5s"
  },
  clicked: {
    transform: "rotate(180deg)"
  }
}));

const LoadingContext = createContext(void 0);
function reducer(prevState, action) {
  return {
    ...prevState,
    ...action
  };
}
const LoadingProvider = ({ children }) => {
  const classes = useBackdropStyles();
  const actions = INITIAL_LOADING_ACTIONS;
  const [state, dispatch] = useReducer(reducer, getDefaultState(actions));
  const [isBackdropVisible, setBackdropVisible] = useState(false);
  useEffect(() => {
    function displayLoadingBackdrop() {
      setBackdropVisible(!state[DefaultLoadingAction.CostInsightsInitial] && Object.values(state).some((l) => l));
    }
    displayLoadingBackdrop();
  }, [state, setBackdropVisible]);
  return /* @__PURE__ */ React.createElement(LoadingContext.Provider, {
    value: { state, actions, dispatch }
  }, children, /* @__PURE__ */ React.createElement(Backdrop, {
    open: isBackdropVisible,
    classes
  }, /* @__PURE__ */ React.createElement(CircularProgress, null)));
};
function useLoading(mapLoadingToProps) {
  const context = useContext(LoadingContext);
  if (!context) {
    assertNever$4();
  }
  return mapLoadingToProps({
    state: context.state,
    actions: context.actions,
    dispatch: context.dispatch
  });
}
function assertNever$4() {
  throw Error("useLoading cannot be used outside of LoadingProvider");
}

const mapLoadingToProps$2 = ({
  dispatch
}) => ({
  dispatchLoadingGroups: (isLoading) => dispatch({ [DefaultLoadingAction.UserGroups]: isLoading })
});
const GroupsContext = React.createContext(void 0);
const GroupsProvider = ({ children }) => {
  const identityApi = useApi(identityApiRef);
  const client = useApi(costInsightsApiRef);
  const [error, setError] = useState(null);
  const { dispatchLoadingGroups } = useLoading(mapLoadingToProps$2);
  const [groups, setGroups] = useState(null);
  useEffect(() => {
    dispatchLoadingGroups(true);
    async function getUserGroups() {
      try {
        const { userEntityRef } = await identityApi.getBackstageIdentity();
        const { name: userId } = parseEntityRef(userEntityRef, {
          defaultKind: "User",
          defaultNamespace: DEFAULT_NAMESPACE
        });
        const g = await client.getUserGroups(userId);
        setGroups(g);
      } catch (e) {
        setError(e);
      } finally {
        dispatchLoadingGroups(false);
      }
    }
    getUserGroups();
  }, [client]);
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (!groups)
    return null;
  return /* @__PURE__ */ React.createElement(GroupsContext.Provider, {
    value: { groups }
  }, children);
};
function useGroups() {
  const context = useContext(GroupsContext);
  return context ? context.groups : assertNever$3();
}
function assertNever$3() {
  throw Error("Cannot use useGroups outside of GroupsProvider");
}

const FilterContext = React.createContext(void 0);
const FilterProvider = ({ children }) => {
  const config = useConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const groups = useGroups();
  const [error, setError] = useState(null);
  const [pageFilters, setPageFilters] = useState(null);
  const [productFilters, setProductFilters] = useState(null);
  useEffect(() => {
    async function setPageFiltersFromLocation() {
      var _a, _b;
      try {
        const queryParams = await validate(location.search);
        const defaultMetric = (_b = (_a = config.metrics.find((m) => m.default)) == null ? void 0 : _a.kind) != null ? _b : null;
        const initialPageState = getInitialPageState(groups, queryParams);
        const initialProductState = getInitialProductState(config);
        setProductFilters(initialProductState);
        setPageFilters({ ...initialPageState, metric: defaultMetric });
      } catch (e) {
        setError(e);
      }
    }
    setPageFiltersFromLocation();
  }, [groups]);
  useEffect(() => {
    function setLocationFromPageFilters(filters) {
      const queryString = stringify({
        group: filters.group,
        ...filters.project ? { project: filters.project } : {}
      });
      navigate({ ...location, search: `?${queryString}` });
    }
    if (pageFilters) {
      setLocationFromPageFilters(pageFilters);
    }
  }, [pageFilters]);
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (!pageFilters || !productFilters) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(FilterContext.Provider, {
    value: { pageFilters, productFilters, setPageFilters, setProductFilters }
  }, children);
};
function useFilters(mapFiltersToProps) {
  const context = useContext(FilterContext);
  return context ? mapFiltersToProps(context) : assertNever$2();
}
function assertNever$2() {
  throw Error("Cannot use useFilters outside of FilterProvider");
}

const ScrollContext = React.createContext(void 0);
const ScrollProvider = ({ children }) => {
  const [scroll, setScroll] = useState(null);
  return /* @__PURE__ */ React.createElement(ScrollContext.Provider, {
    value: { scroll, setScroll }
  }, children);
};
var ScrollType = /* @__PURE__ */ ((ScrollType2) => {
  ScrollType2["AlertSummary"] = "alert-status-summary";
  return ScrollType2;
})(ScrollType || {});
function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    assertNever$1();
  }
  return [context.scroll, context.setScroll];
}
function assertNever$1() {
  throw new Error(`Cannot use useScroll outside ScrollProvider`);
}

const mapLoadingToProps$1 = ({
  dispatch
}) => ({
  dispatchLoadingBillingDate: (isLoading) => dispatch({ [DefaultLoadingAction.LastCompleteBillingDate]: isLoading })
});
const BillingDateContext = React.createContext(void 0);
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const dateFormatSchema = yup.string().matches(dateRegex, {
  message: "Unsupported billing date format: ${value}. Date should be in YYYY-MM-DD format.",
  excludeEmptyString: true
});
const BillingDateProvider = ({ children }) => {
  const client = useApi(costInsightsApiRef);
  const [error, setError] = useState(null);
  const { dispatchLoadingBillingDate } = useLoading(mapLoadingToProps$1);
  const [lastCompleteBillingDate, setLastCompeteBillingDate] = useState(null);
  useEffect(() => {
    dispatchLoadingBillingDate(true);
    async function getLastCompleteBillingDate() {
      try {
        const d = await client.getLastCompleteBillingDate();
        const validDate = await dateFormatSchema.validate(d);
        if (validDate)
          setLastCompeteBillingDate(validDate);
      } catch (e) {
        setError(e);
      } finally {
        dispatchLoadingBillingDate(false);
      }
    }
    getLastCompleteBillingDate();
  }, [client]);
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (!lastCompleteBillingDate)
    return null;
  return /* @__PURE__ */ React.createElement(BillingDateContext.Provider, {
    value: {
      lastCompleteBillingDate
    }
  }, children);
};
function useLastCompleteBillingDate() {
  const context = useContext(BillingDateContext);
  return context ? context.lastCompleteBillingDate : assertNever();
}
function assertNever() {
  throw Error("Cannot use useLastCompleteBillingDate outside of BillingDateProvider");
}

const AlertAcceptForm = forwardRef(({ onSubmit, disableSubmit }, ref) => {
  const [checked, setChecked] = useState(false);
  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(null);
  };
  const onChecked = (_, isChecked) => {
    setChecked(isChecked);
    disableSubmit(!isChecked);
  };
  return /* @__PURE__ */ React.createElement("form", {
    ref,
    onSubmit: onFormSubmit
  }, /* @__PURE__ */ React.createElement(FormControl, {
    component: "fieldset",
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(FormControlLabel, {
    label: "My team can commit to making this change soon, or has already.",
    value: checked,
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      color: "primary",
      checked,
      onChange: onChecked
    })
  })));
});

const AlertSnoozeForm = forwardRef(({ onSubmit, disableSubmit }, ref) => {
  const classes = useAlertDialogStyles();
  const [duration, setDuration] = useState(Duration.P7D);
  useEffect(() => disableSubmit(false), [disableSubmit]);
  const onFormSubmit = (e) => {
    e.preventDefault();
    if (duration) {
      const repeatInterval = 1;
      const today = DateTime.now().toFormat(DEFAULT_DATE_FORMAT);
      onSubmit({
        intervals: intervalsOf(duration, today, repeatInterval)
      });
    }
  };
  const onSnoozeDurationChange = (_, value) => {
    setDuration(value);
  };
  return /* @__PURE__ */ React.createElement("form", {
    ref,
    onSubmit: onFormSubmit
  }, /* @__PURE__ */ React.createElement(FormControl, {
    component: "fieldset",
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    color: "textPrimary"
  }, /* @__PURE__ */ React.createElement("b", null, "For how long?")), /* @__PURE__ */ React.createElement(Box, {
    mb: 1
  }, /* @__PURE__ */ React.createElement(RadioGroup, {
    name: "snooze-alert-options",
    value: duration,
    onChange: onSnoozeDurationChange
  }, AlertSnoozeOptions.map((option) => /* @__PURE__ */ React.createElement(FormControlLabel, {
    key: `snooze-alert-option-${option.duration}`,
    label: option.label,
    value: option.duration,
    control: /* @__PURE__ */ React.createElement(Radio, {
      className: classes.radio
    })
  }))))));
});

const AlertDismissForm = forwardRef(({ onSubmit, disableSubmit }, ref) => {
  const classes = useAlertDialogStyles();
  const [other, setOther] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [reason, setReason] = useState(AlertDismissReason.Resolved);
  const onFormSubmit = (e) => {
    e.preventDefault();
    if (reason) {
      onSubmit({
        other,
        reason,
        feedback
      });
    }
  };
  const onReasonChange = (_, value) => {
    if (other) {
      setOther(null);
    }
    setReason(value);
  };
  const onOtherChange = (e) => {
    return e.target.value ? setOther(e.target.value) : setOther(null);
  };
  const onFeedbackChange = (e) => {
    return e.target.value ? setFeedback(e.target.value) : setFeedback(null);
  };
  useEffect(() => {
    function validateDismissForm() {
      if (reason === AlertDismissReason.Other) {
        if (other) {
          disableSubmit(false);
        } else {
          disableSubmit(true);
        }
      } else if (reason) {
        disableSubmit(false);
      } else {
        disableSubmit(true);
      }
    }
    validateDismissForm();
  }, [reason, other, disableSubmit]);
  return /* @__PURE__ */ React.createElement("form", {
    ref,
    onSubmit: onFormSubmit
  }, /* @__PURE__ */ React.createElement(FormControl, {
    component: "fieldset",
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    color: "textPrimary"
  }, /* @__PURE__ */ React.createElement("b", null, "Reason for dismissing?")), /* @__PURE__ */ React.createElement(Box, {
    mb: 1
  }, /* @__PURE__ */ React.createElement(RadioGroup, {
    name: "dismiss-alert-reasons",
    value: reason,
    onChange: onReasonChange
  }, AlertDismissOptions.map((option) => /* @__PURE__ */ React.createElement(FormControlLabel, {
    key: `dismiss-alert-option-${option.reason}`,
    label: option.label,
    value: option.reason,
    control: /* @__PURE__ */ React.createElement(Radio, {
      className: classes.radio
    })
  }))), /* @__PURE__ */ React.createElement(Collapse, {
    in: reason === AlertDismissReason.Other
  }, /* @__PURE__ */ React.createElement(Box, {
    ml: 4
  }, /* @__PURE__ */ React.createElement(TextField, {
    id: "dismiss-alert-option-other",
    variant: "outlined",
    multiline: true,
    fullWidth: true,
    rows: 4,
    value: other != null ? other : "",
    onChange: onOtherChange
  })))), /* @__PURE__ */ React.createElement(Typography, {
    gutterBottom: true
  }, /* @__PURE__ */ React.createElement("b", null, "Any other feedback you can provide?")), /* @__PURE__ */ React.createElement(TextField, {
    id: "dismiss-alert-feedback",
    variant: "outlined",
    multiline: true,
    rows: 4,
    fullWidth: true,
    value: feedback != null ? feedback : "",
    onChange: onFeedbackChange
  })));
});

const createAlertHandler = (status) => (alert) => alert.status === status;
const isAlertActive = (alert) => !hasProperty(alert, "status");
const isAlertSnoozed = createAlertHandler(AlertStatus.Snoozed);
const isAlertAccepted = createAlertHandler(AlertStatus.Accepted);
const isAlertDismissed = createAlertHandler(AlertStatus.Dismissed);
const createStatusHandler = (status) => (s) => s === status;
const isStatusSnoozed = createStatusHandler(AlertStatus.Snoozed);
const isStatusAccepted = createStatusHandler(AlertStatus.Accepted);
const isStatusDismissed = createStatusHandler(AlertStatus.Dismissed);
const createAlertEventHandler = (onEvent) => (alert) => hasProperty(alert, onEvent);
const isSnoozeEnabled = createAlertEventHandler("onSnoozed");
const isAcceptEnabled = createAlertEventHandler("onAccepted");
const isDismissEnabled = createAlertEventHandler("onDismissed");
const createFormEnabledHandler = (Form) => (alert) => {
  if (!alert)
    return false;
  if (alert[Form] === null)
    return false;
  switch (Form) {
    case "SnoozeForm":
      return isSnoozeEnabled(alert);
    case "AcceptForm":
      return isAcceptEnabled(alert);
    case "DismissForm":
      return isDismissEnabled(alert);
    default:
      return false;
  }
};
const isSnoozeFormEnabled = createFormEnabledHandler("SnoozeForm");
const isAcceptFormEnabled = createFormEnabledHandler("AcceptForm");
const isDismissFormEnabled = createFormEnabledHandler("DismissForm");
function formOf(alert, status) {
  var _a, _b, _c;
  switch (status) {
    case AlertStatus.Snoozed: {
      const SnoozeForm = (_a = alert == null ? void 0 : alert.SnoozeForm) != null ? _a : AlertSnoozeForm;
      return isSnoozeFormEnabled(alert) ? SnoozeForm : null;
    }
    case AlertStatus.Accepted: {
      const AcceptForm = (_b = alert == null ? void 0 : alert.AcceptForm) != null ? _b : AlertAcceptForm;
      return isAcceptFormEnabled(alert) ? AcceptForm : null;
    }
    case AlertStatus.Dismissed: {
      const DismissForm = (_c = alert == null ? void 0 : alert.DismissForm) != null ? _c : AlertDismissForm;
      return isDismissFormEnabled(alert) ? DismissForm : null;
    }
    default:
      return null;
  }
}
function choose$1(status, values, none) {
  switch (status) {
    case AlertStatus.Snoozed:
      return values[0];
    case AlertStatus.Accepted:
      return values[1];
    case AlertStatus.Dismissed:
      return values[2];
    default:
      return none;
  }
}
function hasProperty(alert, prop) {
  return prop in (alert != null ? alert : {});
}
const sumOfAllAlerts = (sum, alerts) => sum + alerts.length;

const CostInsightsThemeProvider = ({
  children
}) => {
  return /* @__PURE__ */ React.createElement(ThemeProvider, {
    theme: (theme) => createTheme({
      ...theme,
      palette: {
        ...theme.palette,
        ...theme.palette.type === "dark" ? costInsightsDarkTheme.palette : costInsightsLightTheme.palette
      }
    })
  }, children);
};

const useStyles$1 = makeStyles((theme) => ({
  root: {
    gridArea: "pageContent",
    padding: theme.spacing(4)
  }
}));
const AlertInstructionsLayout = ({
  title,
  children
}) => {
  const classes = useStyles$1();
  return /* @__PURE__ */ React.createElement(CostInsightsThemeProvider, null, /* @__PURE__ */ React.createElement(ConfigProvider, null, /* @__PURE__ */ React.createElement(CurrencyProvider, null, /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: "Cost Insights",
    pageTitleOverride: title,
    type: "Tool"
  }), /* @__PURE__ */ React.createElement(Container, {
    maxWidth: "md",
    disableGutters: true,
    className: classes.root
  }, /* @__PURE__ */ React.createElement(Box, {
    mb: 3
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "outlined",
    startIcon: /* @__PURE__ */ React.createElement(ChevronLeftIcon, null),
    href: "/cost-insights"
  }, "Back to Cost Insights")), children)))));
};

const BarChartLabel = ({
  x,
  y,
  height,
  width,
  details,
  children
}) => {
  const classes = useBarChartLabelStyles();
  const translateX = width * -0.5;
  return /* @__PURE__ */ React.createElement("foreignObject", {
    className: classes.foreignObject,
    style: { transform: `translateX(${translateX}px)` },
    x,
    y,
    height,
    width
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.label,
    gutterBottom: true
  }, children), details));
};

const BarChartTick = ({
  x,
  y,
  height,
  width,
  payload,
  visibleTicksCount,
  details
}) => {
  const gutterWidth = 5;
  const labelWidth = width / visibleTicksCount - gutterWidth * 2;
  return /* @__PURE__ */ React.createElement(BarChartLabel, {
    x,
    y,
    height,
    width: labelWidth,
    details
  }, !payload.value ? "Unlabeled" : payload.value);
};

const BarChartStepperButton = forwardRef(({
  name,
  children,
  ...buttonBaseProps
}, ref) => {
  const classes = useBarChartStepperButtonStyles();
  return /* @__PURE__ */ React.createElement(ButtonBase, {
    ref,
    classes,
    disableRipple: true,
    "data-testid": `bar-chart-stepper-button-${name}`,
    ...buttonBaseProps
  }, children);
});

const BarChartSteps = ({
  steps,
  activeStep,
  onClick
}) => {
  const classes = useBarChartStepperStyles();
  const handleOnClick = (index) => (event) => {
    event.preventDefault();
    onClick(index);
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.steps
  }, [...new Array(steps)].map((_, index) => /* @__PURE__ */ React.createElement(ButtonBase, {
    key: index,
    centerRipple: true,
    onClick: handleOnClick(index)
  }, /* @__PURE__ */ React.createElement("div", {
    "data-testid": "bar-chart-step",
    className: `${classes.step} ${index === activeStep ? classes.stepActive : ""}`
  }))));
};

const BarChartStepper = ({
  steps,
  disableScroll,
  onChange
}) => {
  const classes = useBarChartStepperStyles();
  const [activeStep, setActiveStep] = useState(0);
  const diff = steps % 10;
  const stepsRemaining = steps - activeStep <= diff ? diff : steps;
  const displayedStep = activeStep % 10;
  useEffect(() => {
    onChange(activeStep);
  }, [activeStep, onChange]);
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const handleClick = (index) => {
    setActiveStep((prevStep) => {
      const offset = index - prevStep % 10;
      return prevStep + offset;
    });
  };
  return /* @__PURE__ */ React.createElement(Paper, {
    "data-testid": "bar-chart-stepper",
    square: true,
    elevation: 0,
    className: classes.paper
  }, /* @__PURE__ */ React.createElement(Slide, {
    direction: "right",
    in: !disableScroll && activeStep !== 0,
    mountOnEnter: true,
    unmountOnExit: true
  }, /* @__PURE__ */ React.createElement(BarChartStepperButton, {
    name: "back",
    className: classes.backButton,
    onClick: handleBack
  }, /* @__PURE__ */ React.createElement(ChevronLeftIcon, null))), /* @__PURE__ */ React.createElement(BarChartSteps, {
    steps: Math.min(10, stepsRemaining),
    activeStep: displayedStep,
    onClick: handleClick
  }), /* @__PURE__ */ React.createElement(Slide, {
    direction: "left",
    in: !disableScroll && activeStep < steps - 1,
    mountOnEnter: true,
    unmountOnExit: true
  }, /* @__PURE__ */ React.createElement(BarChartStepperButton, {
    name: "next",
    className: classes.nextButton,
    onClick: handleNext
  }, /* @__PURE__ */ React.createElement(ChevronRightIcon, null))));
};

const BarChartTooltip = ({
  title,
  content,
  subtitle,
  topRight,
  actions,
  children
}) => {
  const classes = useTooltipStyles();
  const titleClassName = classnames(classes.truncate, {
    [classes.maxWidth]: topRight === void 0
  });
  return /* @__PURE__ */ React.createElement(Box, {
    className: classes.tooltip,
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    px: 2,
    pt: 2
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: titleClassName,
    variant: "h6"
  }, title), subtitle && /* @__PURE__ */ React.createElement(Typography, {
    className: classes.subtitle,
    variant: "subtitle1"
  }, subtitle)), topRight && /* @__PURE__ */ React.createElement(Box, {
    ml: 2
  }, topRight)), content && /* @__PURE__ */ React.createElement(Box, {
    px: 2,
    pt: 2,
    className: classes.maxWidth
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    paragraph: true
  }, content)), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    p: 2
  }, children), actions && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, {
    className: classes.divider,
    variant: "fullWidth"
  }), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    p: 2
  }, actions)));
};

const BarChartTooltipItem = ({ item }) => {
  const classes = useTooltipStyles();
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 25
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignContent: "center",
    marginRight: ".5em"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignItems: "center",
    marginRight: ".5em"
  }, /* @__PURE__ */ React.createElement(LensIcon, {
    className: classes.lensIcon,
    style: { fill: item.fill }
  })), /* @__PURE__ */ React.createElement(Typography, null, item.label)), /* @__PURE__ */ React.createElement(Typography, {
    display: "block"
  }, item.value));
};

const costFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});
const lengthyCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 2
});
const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});
const monthFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "long",
  year: "numeric"
});
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  day: "numeric",
  month: "short"
});
const monthOf = (date) => {
  return monthFormatter.format(Date.parse(date));
};
const quarterOf = (date) => {
  const d = DateTime.fromISO(date).isValid ? DateTime.fromISO(date) : DateTime.fromFormat(date, "yyyy-'Q'q");
  return d.toFormat("'Q'q yyyy");
};
function formatCurrency(amount, currency) {
  const n = Math.round(amount);
  const numString = numberFormatter.format(n);
  return currency ? `${numString} ${pluralize(currency, n)}` : numString;
}
function formatChange(change) {
  if (notEmpty(change.ratio)) {
    return formatPercent(Math.abs(change.ratio));
  }
  return change.amount >= 0 ? "\u221E" : "-\u221E";
}
function formatPercent(n) {
  if (isNaN(n) || Math.abs(n) < 0.01) {
    return "0%";
  }
  if (Math.abs(n) > 10) {
    return `>1000%`;
  }
  return `${(n * 100).toFixed(0)}%`;
}
function formatLastTwoLookaheadQuarters(inclusiveEndDate) {
  const start = DateTime.fromISO(inclusiveStartDateOf(Duration.P3M, inclusiveEndDate)).toFormat("'Q'q yyyy");
  const end = DateTime.fromISO(inclusiveEndDateOf(Duration.P3M, inclusiveEndDate)).toFormat("'Q'q yyyy");
  return `${start} vs ${end}`;
}
const formatRelativePeriod = (duration, date, isEndDate) => {
  const periodStart = isEndDate ? inclusiveStartDateOf(duration, date) : date;
  const periodEnd = isEndDate ? date : inclusiveEndDateOf(duration, date);
  const days = Duration$1.fromISO(duration).days;
  if (![periodStart, periodEnd].includes(date)) {
    throw new Error(`Invalid relative date ${date} for duration ${duration}`);
  }
  return date === periodStart ? `First ${days} Days` : `Last ${days} Days`;
};
function formatPeriod(duration, date, isEndDate) {
  switch (duration) {
    case Duration.P3M:
      return quarterOf(isEndDate ? inclusiveEndDateOf(duration, date) : inclusiveStartDateOf(duration, date));
    default:
      return formatRelativePeriod(duration, date, isEndDate);
  }
}

const aggregationSort = (a, b) => a.date.localeCompare(b.date);
const resourceSort = (a, b) => b.previous + b.current - (a.previous + a.current);
function totalAggregationSort(a, b) {
  var _a, _b, _c, _d;
  const [prevA, currA] = (_b = (_a = a.entity) == null ? void 0 : _a.aggregation) != null ? _b : [0, 0];
  const [prevB, currB] = (_d = (_c = b.entity) == null ? void 0 : _c.aggregation) != null ? _d : [0, 0];
  return prevB + currB - (prevA + currA);
}

function formatGraphValue(value, format) {
  if (format === "number") {
    return value.toLocaleString();
  }
  if (value < 1) {
    return lengthyCurrencyFormatter.format(value);
  }
  return currencyFormatter.format(value);
}
const overviewGraphTickFormatter = (millis) => typeof millis === "number" ? dateFormatter.format(millis) : millis;
const tooltipItemOf = (payload) => {
  const value = typeof payload.value === "number" ? currencyFormatter.format(payload.value) : payload.value;
  const fill = payload.fill;
  switch (payload.dataKey) {
    case DataKey.Current:
    case DataKey.Previous:
      return {
        label: payload.name,
        value,
        fill
      };
    default:
      return null;
  }
};
const resourceOf = (entity) => ({
  name: entity.id,
  previous: entity.aggregation[0],
  current: entity.aggregation[1]
});
const titleOf = (label) => {
  return label ? String(label) : "Unlabeled";
};
const isInvalid = ({ label, payload }) => {
  return label === void 0 || !payload || !payload.length;
};
const isLabeled = (data) => {
  return (data == null ? void 0 : data.activeLabel) && (data == null ? void 0 : data.activeLabel) !== "";
};
const isUnlabeled = (data) => {
  return (data == null ? void 0 : data.activeLabel) === "";
};

const defaultTooltip = ({
  label,
  payload = []
}) => {
  if (isInvalid({ label, payload }))
    return null;
  const title = titleOf(label);
  const items = payload.map(tooltipItemOf).filter(notEmpty);
  return /* @__PURE__ */ React.createElement(BarChartTooltip, {
    title
  }, items.map((item, index) => /* @__PURE__ */ React.createElement(BarChartTooltipItem, {
    key: `${item.label}-${index}`,
    item
  })));
};
const BarChart = ({
  resources,
  responsive = true,
  displayAmount = 6,
  options = {},
  tooltip = defaultTooltip,
  onClick,
  onMouseMove
}) => {
  const theme = useTheme();
  const styles = useBarChartStyles(theme);
  const [activeChart, setActiveChart] = useState(false);
  const [stepWindow, setStepWindow] = useState(() => [0, displayAmount]);
  const data = Object.assign({
    previousFill: theme.palette.lightBlue,
    currentFill: theme.palette.darkBlue,
    previousName: "Previous",
    currentName: "Current"
  }, options);
  const [stepStart, stepEnd] = stepWindow;
  const steps = Math.ceil(resources.length / displayAmount);
  const disableStepper = resources.length <= displayAmount;
  const sortedResources = resources.sort(resourceSort).slice(stepStart, stepEnd);
  const globalResourcesMax = resources.reduce((max, r) => Math.max(max, r.current, r.previous), 0);
  const onStepChange = useCallback((activeStep) => {
    const start = activeStep * displayAmount;
    const end = start + displayAmount;
    if (end > resources.length) {
      setStepWindow([start, resources.length]);
    } else {
      setStepWindow([start, end]);
    }
  }, [setStepWindow, resources, displayAmount]);
  return /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    onMouseLeave: () => setActiveChart(false),
    onMouseEnter: () => setActiveChart(true),
    "data-testid": "bar-chart-wrapper"
  }, /* @__PURE__ */ React.createElement(ResponsiveContainer, {
    height: styles.container.height,
    width: responsive ? "100%" : styles.container.width
  }, /* @__PURE__ */ React.createElement(BarChart$1, {
    style: { cursor: onClick ? "pointer" : null },
    onClick,
    onMouseMove,
    data: sortedResources,
    margin: styles.barChart.margin,
    barSize: 45,
    "data-testid": "bar-chart"
  }, tooltip && /* @__PURE__ */ React.createElement(Tooltip, {
    filterNull: true,
    cursor: styles.cursor,
    animationDuration: 100,
    content: tooltip
  }), /* @__PURE__ */ React.createElement(CartesianGrid, {
    vertical: false,
    stroke: styles.cartesianGrid.stroke
  }), /* @__PURE__ */ React.createElement(XAxis, {
    dataKey: DataKey.Name,
    tickLine: false,
    interval: 0,
    height: styles.xAxis.height,
    tick: BarChartTick
  }), /* @__PURE__ */ React.createElement(YAxis, {
    tickFormatter: currencyFormatter.format,
    domain: [() => 0, globalResourcesMax],
    tick: styles.axis
  }), /* @__PURE__ */ React.createElement(Bar, {
    dataKey: DataKey.Previous,
    name: data.previousName,
    fill: data.previousFill,
    isAnimationActive: false
  }), /* @__PURE__ */ React.createElement(Bar, {
    dataKey: DataKey.Current,
    name: data.currentName,
    fill: data.currentFill,
    isAnimationActive: false
  }))), !disableStepper && /* @__PURE__ */ React.createElement(BarChartStepper, {
    steps,
    disableScroll: !activeChart,
    onChange: onStepChange
  }));
};

const LegendItem = ({
  title,
  tooltipText,
  markerColor,
  children
}) => {
  const classes = useCostGrowthLegendStyles();
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, {
    minHeight: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }, markerColor && /* @__PURE__ */ React.createElement("div", {
    className: classes.marker
  }, /* @__PURE__ */ React.createElement(LensIcon, {
    style: { fontSize: "1em", fill: markerColor }
  })), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.title,
    variant: "overline"
  }, title), tooltipText && /* @__PURE__ */ React.createElement(Tooltip$1, {
    classes: { tooltip: classes.tooltip },
    title: /* @__PURE__ */ React.createElement(Typography, {
      className: classes.tooltipText
    }, tooltipText),
    placement: "top-start"
  }, /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "help",
    className: classes.helpIcon
  }, /* @__PURE__ */ React.createElement(HelpOutlineOutlinedIcon, {
    fontSize: "small"
  })))), /* @__PURE__ */ React.createElement(Box, {
    marginLeft: markerColor ? "1.5em" : 0
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.h5,
    variant: "h5"
  }, children)));
};

const BarChartLegend = ({
  costStart,
  costEnd,
  options = {},
  children
}) => {
  const theme = useTheme();
  const classes = useBarChartLayoutStyles();
  const data = Object.assign({
    previousName: "Previous",
    previousFill: theme.palette.lightBlue,
    currentName: "Current",
    currentFill: theme.palette.darkBlue
  }, options);
  return /* @__PURE__ */ React.createElement(Box, {
    className: classes.legend,
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(Box, {
    marginRight: 2
  }, /* @__PURE__ */ React.createElement(LegendItem, {
    title: data.previousName,
    markerColor: options.hideMarker ? void 0 : data.previousFill
  }, currencyFormatter.format(costStart))), /* @__PURE__ */ React.createElement(Box, {
    marginRight: 2
  }, /* @__PURE__ */ React.createElement(LegendItem, {
    title: data.currentName,
    markerColor: options.hideMarker ? void 0 : data.currentFill
  }, currencyFormatter.format(costEnd))), children);
};

function growthOf(change) {
  const exceedsEngineerThreshold = Math.abs(change.amount) >= EngineerThreshold;
  if (notEmpty(change.ratio)) {
    if (exceedsEngineerThreshold && change.ratio >= ChangeThreshold.upper) {
      return GrowthType.Excess;
    }
    if (exceedsEngineerThreshold && change.ratio <= ChangeThreshold.lower) {
      return GrowthType.Savings;
    }
  } else {
    if (exceedsEngineerThreshold && change.amount > 0)
      return GrowthType.Excess;
    if (exceedsEngineerThreshold && change.amount < 0)
      return GrowthType.Savings;
  }
  return GrowthType.Negligible;
}
function getComparedChange(dailyCost, metricData, duration, lastCompleteBillingDate) {
  var _a, _b;
  const dailyCostRatio = (_a = dailyCost.change) == null ? void 0 : _a.ratio;
  const metricDataRatio = (_b = metricData.change) == null ? void 0 : _b.ratio;
  const previousPeriodTotal = getPreviousPeriodTotalCost(dailyCost.aggregation, duration, lastCompleteBillingDate);
  if (!notEmpty(dailyCostRatio) || !notEmpty(metricDataRatio)) {
    return {
      amount: previousPeriodTotal
    };
  }
  return {
    ratio: dailyCostRatio - metricDataRatio,
    amount: previousPeriodTotal * (dailyCostRatio - metricDataRatio)
  };
}
function getPreviousPeriodTotalCost(aggregation, duration, inclusiveEndDate) {
  const luxonDuration = Duration$1.fromISO(duration);
  const startDate = inclusiveStartDateOf(duration, inclusiveEndDate);
  const nextPeriodStart = DateTime.fromISO(startDate).plus(luxonDuration);
  return aggregation.reduce((acc, costByDate) => {
    return DateTime.fromISO(costByDate.date) < nextPeriodStart ? acc + costByDate.amount : acc;
  }, 0);
}
function choose([savings, excess], change) {
  var _a;
  const isSavings = ((_a = change.ratio) != null ? _a : change.amount) <= 0;
  return isSavings ? savings : excess;
}

const vowels = {
  a: "A",
  e: "E",
  i: "I",
  o: "O",
  u: "U"
};
const indefiniteArticleOf = (articles, word) => {
  const firstChar = word.charAt(0).toLocaleLowerCase("en-US");
  return firstChar in vowels ? `${articles[1]} ${word}` : `${articles[0]} ${word}`;
};

const CostGrowth = ({ change, duration }) => {
  var _a, _b;
  const styles = useCostGrowthStyles();
  const { engineerCost } = useConfig();
  const [currency] = useCurrency();
  const amount = Math.abs(change.amount);
  const ratio = Math.abs((_a = change.ratio) != null ? _a : NaN);
  const rate = rateOf(engineerCost, duration);
  const engineers = amount / rate;
  const converted = amount / ((_b = currency.rate) != null ? _b : rate);
  const growth = notEmpty(change.ratio) ? growthOf({ ratio: change.ratio, amount: engineers }) : null;
  const classes = classnames({
    [styles.excess]: growth === GrowthType.Excess,
    [styles.savings]: growth === GrowthType.Savings
  });
  if (engineers < EngineerThreshold) {
    return /* @__PURE__ */ React.createElement("span", {
      className: classes
    }, "Negligible");
  }
  if (currency.kind === CurrencyType.USD) {
    if (isNaN(ratio)) {
      return /* @__PURE__ */ React.createElement("span", {
        className: classes
      }, "~", currency.prefix, formatCurrency(converted));
    }
    return /* @__PURE__ */ React.createElement("span", {
      className: classes
    }, formatPercent(ratio), " or ~", currency.prefix, formatCurrency(converted));
  }
  if (amount < 1) {
    return /* @__PURE__ */ React.createElement("span", {
      className: classes
    }, "less than ", indefiniteArticleOf(["a", "an"], currency.unit));
  }
  if (isNaN(ratio)) {
    return /* @__PURE__ */ React.createElement("span", {
      className: classes
    }, "~", formatCurrency(converted, currency.unit));
  }
  return /* @__PURE__ */ React.createElement("span", {
    className: classes
  }, formatPercent(ratio), " or ~", formatCurrency(converted, currency.unit));
};

const CostGrowthIndicator = ({
  change,
  formatter,
  className,
  ...props
}) => {
  const classes = useCostGrowthStyles();
  const growth = growthOf(change);
  const classNames = classnames(classes.indicator, className, {
    [classes.excess]: growth === GrowthType.Excess,
    [classes.savings]: growth === GrowthType.Savings
  });
  return /* @__PURE__ */ React.createElement(Typography, {
    className: classNames,
    component: "span",
    ...props
  }, formatter ? formatter(change) : change.ratio, growth === GrowthType.Excess && /* @__PURE__ */ React.createElement(ArrowDropUp, {
    "aria-label": "excess"
  }), growth === GrowthType.Savings && /* @__PURE__ */ React.createElement(ArrowDropDown, {
    "aria-label": "savings"
  }));
};

const mapFiltersToProps = ({ pageFilters, setPageFilters }) => ({
  ...pageFilters,
  setGroup: (group) => setPageFilters({
    ...pageFilters,
    group: group.id,
    project: null
  })
});
const mapLoadingToProps = ({ actions, dispatch }) => ({
  loadingActions: actions,
  dispatchReset: (loadingActions) => dispatch(getResetStateWithoutInitial(loadingActions))
});

const CostInsightsTabs = ({ groups }) => {
  const classes = useCostInsightsTabsStyles();
  const [index] = useState(0);
  const [groupMenuEl, setGroupMenuEl] = useState(null);
  const { group, setGroup } = useFilters(mapFiltersToProps);
  const { loadingActions, dispatchReset } = useLoading(mapLoadingToProps);
  const openGroupMenu = (e) => setGroupMenuEl(e.currentTarget);
  const closeGroupMenu = () => setGroupMenuEl(null);
  const updateGroupFilterAndCloseMenu = (g) => () => {
    dispatchReset(loadingActions);
    closeGroupMenu();
    setGroup(g);
  };
  const renderTabLabel = () => /* @__PURE__ */ React.createElement("div", {
    className: classes.tabLabel
  }, /* @__PURE__ */ React.createElement(Typography, {
    className: classes.tabLabelText,
    variant: "overline"
  }, `${groups.length} teams`), /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
    fontSize: "small"
  }));
  const hasAtLeastTwoGroups = groups.length >= 2;
  if (!hasAtLeastTwoGroups)
    return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Tabs, {
    className: `cost-insights-tabs ${classes.tabs}`,
    "data-testid": "cost-insights-tabs",
    classes: { indicator: classes.indicator },
    value: index
  }, /* @__PURE__ */ React.createElement(Tab, {
    className: classes.tab,
    "data-testid": "cost-insights-groups-tab",
    key: "cost-insights-groups-tab",
    label: renderTabLabel(),
    onClick: openGroupMenu,
    component: "button"
  })), /* @__PURE__ */ React.createElement(Menu, {
    id: "group-menu",
    "data-testid": "group-menu",
    className: classes.menu,
    getContentAnchorEl: null,
    anchorEl: groupMenuEl,
    keepMounted: true,
    open: Boolean(groupMenuEl),
    onClose: closeGroupMenu,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    }
  }, groups.map((g) => /* @__PURE__ */ React.createElement(MenuItem, {
    className: classes.menuItem,
    classes: { selected: classes.menuItemSelected },
    selected: g.id === group,
    key: g.id,
    "data-testid": g.id,
    onClick: updateGroupFilterAndCloseMenu(g)
  }, g.id))));
};

const useStyles = makeStyles((theme) => ({
  root: {
    gridArea: "pageContent"
  },
  header: {
    boxShadow: "none"
  },
  content: {
    padding: theme.spacing(4)
  }
}));
const CostInsightsLayout = ({
  groups,
  children
}) => {
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React.createElement(Header, {
    style: { boxShadow: "none" },
    title: "Cost Insights",
    pageTitleOverride: "Cost Insights",
    type: "Tool"
  }), /* @__PURE__ */ React.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React.createElement(CostInsightsTabs, {
    groups
  }), /* @__PURE__ */ React.createElement("div", {
    className: classes.content
  }, children)));
};

const NavigationMenuItem = ({ navigation, icon, title }) => {
  const classes = useNavigationStyles();
  const [, setScroll] = useScroll();
  return /* @__PURE__ */ React.createElement(MenuItem, {
    button: true,
    "data-testid": `menu-item-${navigation}`,
    className: classes.menuItem,
    onClick: () => setScroll(navigation)
  }, /* @__PURE__ */ React.createElement(ListItemIcon, {
    className: classes.listItemIcon
  }, icon), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(Typography, {
      className: classes.title
    }, title)
  }));
};
const CostInsightsNavigation = React.memo(({ alerts, products }) => {
  var _a;
  const classes = useNavigationStyles();
  const { icons } = useConfig();
  const [isOpen, setOpen] = useState(false);
  const defaultNavigationItems = getDefaultNavigationItems(alerts);
  const productNavigationItems = (_a = products == null ? void 0 : products.map((product) => ({
    title: product.name,
    navigation: product.kind,
    icon: findAlways(icons, (i) => i.kind === product.kind).component
  }))) != null ? _a : [];
  useEffect(function toggleProductMenuItems() {
    if (products == null ? void 0 : products.length) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [products]);
  return /* @__PURE__ */ React.createElement(MenuList, {
    className: classes.menuList
  }, defaultNavigationItems.map((item) => /* @__PURE__ */ React.createElement(NavigationMenuItem, {
    key: `navigation-menu-item-${item.navigation}`,
    navigation: item.navigation,
    title: item.title,
    icon: item.navigation === DefaultNavigation.AlertInsightsHeader ? /* @__PURE__ */ React.createElement(Badge, {
      badgeContent: alerts,
      color: "secondary"
    }, React.cloneElement(item.icon, {
      className: classes.navigationIcon
    })) : React.cloneElement(item.icon, {
      className: classes.navigationIcon
    })
  })), /* @__PURE__ */ React.createElement(Collapse, {
    in: isOpen,
    timeout: 850
  }, productNavigationItems.map((item) => /* @__PURE__ */ React.createElement(NavigationMenuItem, {
    key: `navigation-menu-item-${item.navigation}`,
    navigation: item.navigation,
    icon: React.cloneElement(item.icon, {
      className: classes.navigationIcon
    }),
    title: item.title
  }))));
});

function createRenderer(col, classes) {
  return function render(rowData) {
    const row = rowData;
    const rowStyles = classnames(classes.row, {
      [classes.rowTotal]: row.id === "total",
      [classes.colFirst]: col === "label",
      [classes.colLast]: col === "change"
    });
    switch (col) {
      case "previous":
      case "current":
        return /* @__PURE__ */ React.createElement(Typography, {
          className: rowStyles
        }, costFormatter.format(row[col]));
      case "change":
        return /* @__PURE__ */ React.createElement(CostGrowthIndicator, {
          className: rowStyles,
          change: row.change,
          formatter: formatChange
        });
      default:
        return /* @__PURE__ */ React.createElement(Typography, {
          className: rowStyles
        }, row.label);
    }
  };
}
function createSorter(field) {
  return function rowSort(data1, data2) {
    const a = data1;
    const b = data2;
    if (a.id === "total")
      return 1;
    if (b.id === "total")
      return 1;
    if (field === "label")
      return a.label.localeCompare(b.label);
    if (field === "change") {
      if (formatChange(a[field]) === "\u221E" || formatChange(b[field]) === "-\u221E")
        return 1;
      if (formatChange(a[field]) === "-\u221E" || formatChange(b[field]) === "\u221E")
        return -1;
      return a[field].ratio - b[field].ratio;
    }
    return b.previous + b.current - (a.previous + a.current);
  };
}
const ProductEntityTable = ({
  entityLabel,
  entity,
  options
}) => {
  const classes = useEntityDialogStyles();
  const entities = entity.entities[entityLabel];
  const data = Object.assign({
    previousName: "Previous",
    currentName: "Current"
  }, options);
  const firstColClasses = classnames(classes.column, classes.colFirst);
  const lastColClasses = classnames(classes.column, classes.colLast);
  const columns = [
    {
      field: "label",
      title: /* @__PURE__ */ React.createElement(Typography, {
        className: firstColClasses
      }, entityLabel),
      render: createRenderer("label", classes),
      customSort: createSorter("label"),
      width: "33.33%"
    },
    {
      field: "previous",
      title: /* @__PURE__ */ React.createElement(Typography, {
        className: classes.column
      }, data.previousName),
      align: "right",
      render: createRenderer("previous", classes),
      customSort: createSorter("previous")
    },
    {
      field: "current",
      title: /* @__PURE__ */ React.createElement(Typography, {
        className: classes.column
      }, data.currentName),
      align: "right",
      render: createRenderer("current", classes),
      customSort: createSorter("current")
    },
    {
      field: "change",
      title: /* @__PURE__ */ React.createElement(Typography, {
        className: lastColClasses
      }, "Change"),
      align: "right",
      render: createRenderer("change", classes),
      customSort: createSorter("change")
    }
  ];
  const rowData = entities.map((e) => ({
    id: e.id || "Unknown",
    label: e.id || "Unknown",
    previous: e.aggregation[0],
    current: e.aggregation[1],
    change: e.change
  })).concat({
    id: "total",
    label: "Total",
    previous: entity.aggregation[0],
    current: entity.aggregation[1],
    change: entity.change
  }).sort(createSorter());
  return /* @__PURE__ */ React.createElement(Table, {
    columns,
    data: rowData,
    title: entity.id || "Unlabeled",
    options: {
      paging: false,
      search: false,
      hideFilterIcons: true
    }
  });
};

const ProductEntityDialog = ({
  open,
  entity,
  options = {},
  onClose
}) => {
  const classes = useEntityDialogStyles();
  const labels = Object.keys(entity.entities);
  const [selectedLabel, setSelectedLabel] = useState(findAlways(labels, (_) => true));
  const tabs = labels.map((label, index) => ({
    id: index.toString(),
    label: `Breakdown by ${label}`
  }));
  return /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose,
    scroll: "body",
    fullWidth: true,
    maxWidth: "lg"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.closeButton,
    onClick: onClose
  }, /* @__PURE__ */ React.createElement(CloseIcon, null)), /* @__PURE__ */ React.createElement(HeaderTabs, {
    tabs,
    onChange: (index) => setSelectedLabel(labels[index])
  }), /* @__PURE__ */ React.createElement(ProductEntityTable, {
    entityLabel: selectedLabel,
    entity,
    options
  }));
};

const ProductInsightsChart = ({
  billingDate,
  entity,
  duration
}) => {
  const classes = useProductInsightsChartStyles();
  const layoutClasses = useBarChartLayoutStyles();
  const entities = useMemo(() => {
    var _a;
    const entityLabel = assertAlways(findAnyKey(entity.entities));
    return (_a = entity.entities[entityLabel]) != null ? _a : [];
  }, [entity]);
  const [activeLabel, setActive] = useState();
  const [selectLabel, setSelected] = useState();
  const isSelected = useMemo(() => !isUndefined(selectLabel), [selectLabel]);
  const isClickable = useMemo(() => {
    var _a, _b;
    const breakdowns = Object.keys((_b = (_a = entities.find((e) => e.id === activeLabel)) == null ? void 0 : _a.entities) != null ? _b : {});
    return breakdowns.length > 0;
  }, [entities, activeLabel]);
  const costStart = entity.aggregation[0];
  const costEnd = entity.aggregation[1];
  const resources = entities.map(resourceOf);
  const options = {
    previousName: formatPeriod(duration, billingDate, false),
    currentName: formatPeriod(duration, billingDate, true)
  };
  const onMouseMove = (data) => {
    if (isLabeled(data)) {
      setActive(data.activeLabel);
    } else if (isUnlabeled(data)) {
      setActive(null);
    } else {
      setActive(void 0);
    }
  };
  const onClick = (data) => {
    if (isLabeled(data)) {
      setSelected(data.activeLabel);
    } else if (isUnlabeled(data)) {
      setSelected(null);
    } else {
      setSelected(void 0);
    }
  };
  const renderProductInsightsTooltip = ({
    label,
    payload = []
  }) => {
    if (isInvalid({ label, payload }))
      return null;
    const id = label === "" ? null : label;
    const title = titleOf(label);
    const items = payload.map(tooltipItemOf).filter(notEmpty);
    const activeEntity = findAlways(entities, (e) => e.id === id);
    const breakdowns = Object.keys(activeEntity.entities);
    if (breakdowns.length) {
      const subtitle = breakdowns.map((b) => pluralize(b, activeEntity.entities[b].length, true)).join(", ");
      return /* @__PURE__ */ React.createElement(BarChartTooltip, {
        title,
        subtitle,
        topRight: !!activeEntity.change.ratio && /* @__PURE__ */ React.createElement(CostGrowthIndicator, {
          formatter: formatChange,
          change: activeEntity.change,
          className: classes.indicator
        }),
        actions: /* @__PURE__ */ React.createElement(Box, {
          className: classes.actions
        }, /* @__PURE__ */ React.createElement(FullScreenIcon, null), /* @__PURE__ */ React.createElement(Typography, null, "Click for breakdown"))
      }, items.map((item, index) => /* @__PURE__ */ React.createElement(BarChartTooltipItem, {
        key: `${item.label}-${index}`,
        item
      })));
    }
    return /* @__PURE__ */ React.createElement(BarChartTooltip, {
      title,
      topRight: !!activeEntity.change.ratio && /* @__PURE__ */ React.createElement(CostGrowthIndicator, {
        formatter: formatChange,
        change: activeEntity.change,
        className: classes.indicator
      }),
      content: id ? null : "This product has costs that are not labeled and therefore can't be attributed to a specific entity."
    }, items.map((item, index) => /* @__PURE__ */ React.createElement(BarChartTooltipItem, {
      key: `${item.label}-${index}`,
      item
    })));
  };
  const barChartProps = isClickable ? { onClick } : {};
  return /* @__PURE__ */ React.createElement(Box, {
    className: layoutClasses.wrapper
  }, /* @__PURE__ */ React.createElement(BarChartLegend, {
    costStart,
    costEnd,
    options
  }, /* @__PURE__ */ React.createElement(LegendItem, {
    title: choose(["Cost Savings", "Cost Excess"], entity.change)
  }, /* @__PURE__ */ React.createElement(CostGrowth, {
    change: entity.change,
    duration
  }))), /* @__PURE__ */ React.createElement(BarChart, {
    resources,
    tooltip: renderProductInsightsTooltip,
    onMouseMove,
    options,
    ...barChartProps
  }), isSelected && entities.length && /* @__PURE__ */ React.createElement(ProductEntityDialog, {
    open: isSelected,
    onClose: () => setSelected(void 0),
    entity: findAlways(entities, (e) => e.id === selectLabel),
    options
  }));
};

const ProjectGrowthAlertChart = ({
  alert
}) => {
  const classes = useBarChartLayoutStyles();
  const costStart = alert.aggregation[0];
  const costEnd = alert.aggregation[1];
  const resourceData = alert.products.map(resourceOf);
  const options = {
    previousName: DateTime.fromFormat(alert.periodStart, "yyyy-'Q'q").toFormat("'Q'q yyyy"),
    currentName: DateTime.fromFormat(alert.periodEnd, "yyyy-'Q'q").toFormat("'Q'q yyyy")
  };
  return /* @__PURE__ */ React.createElement(Box, {
    className: classes.wrapper
  }, /* @__PURE__ */ React.createElement(BarChartLegend, {
    costStart,
    costEnd,
    options
  }, /* @__PURE__ */ React.createElement(LegendItem, {
    title: "Cost Growth"
  }, /* @__PURE__ */ React.createElement(CostGrowth, {
    change: alert.change,
    duration: Duration.P3M
  }))), /* @__PURE__ */ React.createElement(BarChart, {
    resources: resourceData,
    options
  }));
};

const ProjectGrowthAlertCard = ({ alert }) => {
  const subheader = `
    ${pluralize("product", alert.products.length, true)}${alert.products.length > 1 ? ", sorted by cost" : ""}`;
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: `Project growth for ${alert.project}`,
    subheader
  }, /* @__PURE__ */ React.createElement(ProjectGrowthAlertChart, {
    alert
  }));
};

class ProjectGrowthAlert {
  constructor(data) {
    this.data = data;
  }
  get url() {
    return "/cost-insights/investigating-growth";
  }
  get title() {
    return `Investigate cost growth in project ${this.data.project}`;
  }
  get subtitle() {
    return "Cost growth outpacing business growth is unsustainable long-term.";
  }
  get element() {
    return /* @__PURE__ */ React.createElement(ProjectGrowthAlertCard, {
      alert: this.data
    });
  }
}

const UnlabeledDataflowAlertCard = ({
  alert
}) => {
  const classes = useBarChartLayoutStyles();
  const projects = pluralize("project", alert.projects.length, true);
  const subheader = `
    Showing costs from ${projects} with unlabeled Dataflow jobs in the last 30 days.
  `;
  const options = {
    previousName: "Unlabeled Cost",
    currentName: "Labeled Cost"
  };
  const resources = alert.projects.map((project) => ({
    name: project.id,
    previous: project.unlabeledCost,
    current: project.labeledCost
  }));
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "Label Dataflow",
    subheader
  }, /* @__PURE__ */ React.createElement(Box, {
    className: classes.wrapper
  }, /* @__PURE__ */ React.createElement(BarChartLegend, {
    costStart: alert.unlabeledCost,
    costEnd: alert.labeledCost,
    options
  }), /* @__PURE__ */ React.createElement(BarChart, {
    resources,
    options
  })));
};

class UnlabeledDataflowAlert {
  constructor(data) {
    this.data = data;
  }
  get url() {
    return "/cost-insights/labeling-jobs";
  }
  get title() {
    return "Add labels to workflows";
  }
  get subtitle() {
    return "Labels show in billing data, enabling cost insights for each workflow.";
  }
  get element() {
    return /* @__PURE__ */ React.createElement(UnlabeledDataflowAlertCard, {
      alert: this.data
    });
  }
}

const today = DateTime.now().toFormat(DEFAULT_DATE_FORMAT);
const ProjectGrowthInstructionsPage = () => {
  const alertData = {
    project: "example-project",
    periodStart: "Q1 2020",
    periodEnd: "Q2 2020",
    aggregation: [6e4, 12e4],
    change: {
      ratio: 1,
      amount: 6e4
    },
    products: [
      {
        id: "Compute Engine",
        aggregation: [58e3, 118e3]
      },
      {
        id: "Cloud Dataflow",
        aggregation: [1200, 1500]
      },
      {
        id: "Cloud Storage",
        aggregation: [800, 500]
      }
    ]
  };
  const projectGrowthAlert = new ProjectGrowthAlert(alertData);
  const product = {
    kind: "ComputeEngine",
    name: "Compute Engine"
  };
  const entity = {
    id: "example-id",
    aggregation: [2e4, 6e4],
    change: {
      ratio: 3,
      amount: 4e4
    },
    entities: {
      service: [
        {
          id: "service-one",
          aggregation: [18200, 58500],
          entities: {},
          change: { ratio: 2.21, amount: 40300 }
        },
        {
          id: "service-two",
          aggregation: [1200, 1300],
          entities: {},
          change: { ratio: 0.083, amount: 100 }
        },
        {
          id: "service-three",
          aggregation: [600, 200],
          entities: {},
          change: { ratio: -0.666, amount: -400 }
        }
      ]
    }
  };
  return /* @__PURE__ */ React.createElement(AlertInstructionsLayout, {
    title: "Investigating Growth"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h1"
  }, "Investigating cloud cost growth"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Cost Insights shows an alert when costs for a particular billing entity, such as a GCP project, have grown at a rate faster than our alerting threshold. The responsible team should follow this guide to decide whether this warrants further investigation."), /* @__PURE__ */ React.createElement(Box, {
    mt: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h3"
  }, "Is the growth expected?"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "The first question to ask is whether growth is expected. Perhaps a new product has been deployed, or additional regions added for reliability."), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Many services increase cost linearly with load. Has the demand increased? This may happen as you open new markets, or run marketing offers. Costs should be compared against a business metric, such as daily users, to normalize natural increases from business growth."), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Seasonal variance may also cause cost growth; yearly campaigns, an increase in demand during certain times of year."), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Cloud costs will often go up before they go down, in the case of migrations. Teams moving to new infrastructure may run in both the old and new environment during the migration.")), /* @__PURE__ */ React.createElement(Box, {
    mt: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h3"
  }, "Is the growth significant?"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Next, evaluate whether the growth is significant. This helps avoid premature optimization, where cost in engineering time is more than would be saved from the optimization over a reasonable time frame."), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "We recommend reframing the cost growth itself in terms of engineering time. How much engineering time, for an ", /* @__PURE__ */ React.createElement("i", null, "average"), " fully-loaded engineer cost at the company, is being overspent each month? Compare this to expected engineering time for optimization to decide whether the optimization is worthwhile.")), /* @__PURE__ */ React.createElement(Box, {
    mt: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h3"
  }, "Identifying which cloud product contributed most"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "For projects meeting the alert threshold, Cost Insights shows a cost comparison of cloud products over the examined time period:"), /* @__PURE__ */ React.createElement(Box, {
    mt: 2,
    mb: 2
  }, projectGrowthAlert.element), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "This allows you to quickly see which cloud products contributed to the growth in cloud costs.")), /* @__PURE__ */ React.createElement(Box, {
    mt: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h3"
  }, "Identifying the responsible workload"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "After identifying the cloud product, use the corresponding product panel in Cost Insights to find a particular workload (or ", /* @__PURE__ */ React.createElement("i", null, "entity"), ") that has grown in cost:"), /* @__PURE__ */ React.createElement(Box, {
    mt: 2,
    mb: 2
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    title: product.name,
    subheader: "3 entities, sorted by cost"
  }, /* @__PURE__ */ React.createElement(ProductInsightsChart, {
    billingDate: today,
    duration: Duration.P3M,
    entity
  }))), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "From here, you can dig into commit history or deployment logs to find probable causes of an unexpected spike in cost.")), /* @__PURE__ */ React.createElement(Box, {
    mt: 4
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h3"
  }, "Optimizing the workload"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Workload optimization varies between cloud products, but there are a few general optimization areas to consider:"), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "Retention"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Is the workload or storage necessary? Truly idle or unused resources can be cleaned up for immediate cost savings. For storage, how long do we need the data? Many cloud products support retention policies to automatically delete data after a certain time period."), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "Efficiency"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Is the workload using cloud resources efficiently? For compute resources, do the utilization metrics look reasonable? Autoscaling infrastructure, such as Kubernetes, can run workloads more efficiently without compromising reliability."), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "Lifecycle"), /* @__PURE__ */ React.createElement(Typography, {
    paragraph: true
  }, "Is the workload using an optimal pricing model? Some cloud products offer better pricing for data that is accessed less frequently.")));
};

const KubernetesMigrationBarChartLegend = ({
  currentProduct,
  comparedProduct,
  change,
  startDate
}) => {
  const theme = useTheme();
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(Box, {
    marginRight: 2
  }, /* @__PURE__ */ React.createElement(LegendItem, {
    title: monthOf(startDate),
    markerColor: theme.palette.magenta
  }, currentProduct)), /* @__PURE__ */ React.createElement(Box, {
    marginRight: 2
  }, /* @__PURE__ */ React.createElement(LegendItem, {
    title: "Estimated Cost",
    markerColor: theme.palette.yellow
  }, comparedProduct)), /* @__PURE__ */ React.createElement(LegendItem, {
    title: "Total Savings"
  }, /* @__PURE__ */ React.createElement(CostGrowth, {
    change,
    duration: Duration.P30D
  })));
};

const KubernetesMigrationBarChart = ({
  currentProduct,
  comparedProduct,
  services
}) => {
  const theme = useTheme();
  const options = {
    previousFill: theme.palette.magenta,
    currentFill: theme.palette.yellow,
    previousName: comparedProduct,
    currentName: currentProduct
  };
  const resources = services.map((service) => ({
    name: service.id,
    previous: service.aggregation[0],
    current: service.aggregation[1]
  }));
  return /* @__PURE__ */ React.createElement(BarChart, {
    resources,
    options
  });
};

const KubernetesMigrationAlertCard = ({
  data,
  title,
  subheader,
  currentProduct,
  comparedProduct
}) => {
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title,
    subheader
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, {
    paddingY: 1
  }, /* @__PURE__ */ React.createElement(KubernetesMigrationBarChartLegend, {
    startDate: data.startDate,
    change: data.change,
    currentProduct,
    comparedProduct
  })), /* @__PURE__ */ React.createElement(Box, {
    paddingY: 1
  }, /* @__PURE__ */ React.createElement(KubernetesMigrationBarChart, {
    services: data.services,
    currentProduct,
    comparedProduct
  }))));
};

const KubernetesMigrationDismissForm = forwardRef(({ onSubmit, disableSubmit, alert }, ref) => {
  const [services, setServices] = useState(alert.data.services);
  const onFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ services });
  };
  const onCheckboxChange = (e, checked) => {
    if (checked) {
      const service = findAlways(alert.data.services, (s) => s.id === e.target.value);
      setServices((prevServices) => prevServices.concat(service));
    } else {
      setServices((prevServices) => prevServices.filter((p) => p.id !== e.target.value));
    }
  };
  useEffect(() => {
    if (services.length) {
      disableSubmit(false);
    } else {
      disableSubmit(true);
    }
  }, [services, disableSubmit]);
  return /* @__PURE__ */ React.createElement("form", {
    ref,
    onSubmit: onFormSubmit
  }, /* @__PURE__ */ React.createElement(FormControl, {
    component: "fieldset",
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    color: "textPrimary"
  }, /* @__PURE__ */ React.createElement("b", null, "Or choose which services to dismiss this alert for.")), /* @__PURE__ */ React.createElement(FormGroup, null, alert.data.services.map((service, index) => /* @__PURE__ */ React.createElement(FormControlLabel, {
    key: `example-option-${index}`,
    label: service.id,
    value: service.id,
    control: /* @__PURE__ */ React.createElement(Checkbox, {
      color: "primary",
      checked: services.some((p) => p.id === service.id),
      onChange: onCheckboxChange
    })
  })))));
});

class KubernetesMigrationAlert {
  constructor(api, data) {
    this.subtitle = "Services running on Kubernetes are estimated to save 50% or more compared to Compute Engine.";
    this.AcceptForm = null;
    this.DismissForm = KubernetesMigrationDismissForm;
    this.api = api;
    this.data = data;
  }
  get title() {
    return /* @__PURE__ */ React.createElement("span", null, "Consider migrating", " ", pluralize("service", this.data.services.length, true), " to Kubernetes", " ", /* @__PURE__ */ React.createElement(Lifecycle, {
      shorthand: true
    }));
  }
  get element() {
    const subheader = `${pluralize("Service", this.data.services.length, true)}, sorted by cost`;
    return /* @__PURE__ */ React.createElement(KubernetesMigrationAlertCard, {
      data: this.data,
      title: "Migrate to Kubernetes",
      subheader,
      currentProduct: "Compute Engine",
      comparedProduct: "Kubernetes"
    });
  }
  async onDismissed(options) {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise((resolve) => setTimeout(resolve, 750, [
      ...alerts.filter((a) => a.title !== this.title),
      {
        title: this.title,
        subtitle: this.subtitle,
        status: AlertStatus.Dismissed
      }
    ]));
  }
  async onSnoozed(options) {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise((resolve) => setTimeout(resolve, 750, [
      ...alerts.filter((a) => a.title !== this.title),
      {
        title: this.title,
        subtitle: this.subtitle,
        status: AlertStatus.Snoozed
      }
    ]));
  }
  async onAccepted(options) {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise((resolve) => setTimeout(resolve, 750, [
      ...alerts.filter((a) => a.title !== this.title),
      {
        title: this.title,
        subtitle: this.subtitle,
        status: AlertStatus.Accepted
      }
    ]));
  }
}

const createMockProduct = (callback) => {
  const defaultProduct = {
    kind: "compute-engine",
    name: "Compute Engine"
  };
  if (typeof callback === "function") {
    return callback({ ...defaultProduct });
  }
  return { ...defaultProduct };
};
const MockProductTypes = {
  "compute-engine": "Compute Engine",
  "cloud-dataflow": "Cloud Dataflow",
  "cloud-storage": "Cloud Storage",
  "big-query": "Big Query",
  "big-table": "BigTable",
  "cloud-pub-sub": "Cloud Pub/Sub"
};
const MockProducts = Object.keys(MockProductTypes).map((productType) => createMockProduct(() => ({
  kind: productType,
  name: MockProductTypes[productType]
})));
findAlways(MockProducts, (p) => p.kind === "compute-engine");
findAlways(MockProducts, (p) => p.kind === "cloud-dataflow");
findAlways(MockProducts, (p) => p.kind === "cloud-storage");
findAlways(MockProducts, (p) => p.kind === "big-query");
findAlways(MockProducts, (p) => p.kind === "big-table");

Object.keys(MockProductTypes).map((productType) => ({ duration: Duration.P30D, productType }));

const MockDefaultLoadingActions = [
  DefaultLoadingAction.UserGroups,
  DefaultLoadingAction.CostInsightsInitial,
  DefaultLoadingAction.CostInsightsPage
].concat(MockProducts.map((product) => product.kind));
getDefaultState(MockDefaultLoadingActions);

const MockBigQueryInsights = {
  id: "bigQuery",
  aggregation: [1e4, 3e4],
  change: {
    ratio: 3,
    amount: 2e4
  },
  entities: {
    dataset: [
      {
        id: "dataset-a",
        aggregation: [5e3, 1e4],
        change: {
          ratio: 1,
          amount: 5e3
        },
        entities: {}
      },
      {
        id: "dataset-b",
        aggregation: [5e3, 1e4],
        change: {
          ratio: 1,
          amount: 5e3
        },
        entities: {}
      },
      {
        id: "dataset-c",
        aggregation: [0, 1e4],
        change: {
          amount: 1e4
        },
        entities: {}
      }
    ]
  }
};
const MockCloudDataflowInsights = {
  id: "cloudDataflow",
  aggregation: [1e5, 158e3],
  change: {
    ratio: 0.58,
    amount: 58e3
  },
  entities: {
    pipeline: [
      {
        id: null,
        aggregation: [1e4, 12e3],
        change: {
          ratio: 0.2,
          amount: 2e3
        },
        entities: {
          SKU: [
            {
              id: "Mock SKU A",
              aggregation: [3e3, 4e3],
              change: {
                ratio: 0.333333,
                amount: 1e3
              },
              entities: {}
            },
            {
              id: "Mock SKU B",
              aggregation: [7e3, 8e3],
              change: {
                ratio: 0.14285714,
                amount: 1e3
              },
              entities: {}
            }
          ]
        }
      },
      {
        id: "pipeline-a",
        aggregation: [6e4, 7e4],
        change: {
          ratio: 0.16666666666666666,
          amount: 1e4
        },
        entities: {
          SKU: [
            {
              id: "Mock SKU A",
              aggregation: [2e4, 15e3],
              change: {
                ratio: -0.25,
                amount: -5e3
              },
              entities: {}
            },
            {
              id: "Mock SKU B",
              aggregation: [3e4, 35e3],
              change: {
                ratio: -0.16666666666666666,
                amount: -5e3
              },
              entities: {}
            },
            {
              id: "Mock SKU C",
              aggregation: [1e4, 2e4],
              change: {
                ratio: 1,
                amount: 1e4
              },
              entities: {}
            }
          ]
        }
      },
      {
        id: "pipeline-b",
        aggregation: [12e3, 8e3],
        change: {
          ratio: -0.33333,
          amount: -4e3
        },
        entities: {
          SKU: [
            {
              id: "Mock SKU A",
              aggregation: [4e3, 4e3],
              change: {
                ratio: 0,
                amount: 0
              },
              entities: {}
            },
            {
              id: "Mock SKU B",
              aggregation: [8e3, 4e3],
              change: {
                ratio: -0.5,
                amount: -4e3
              },
              entities: {}
            }
          ]
        }
      },
      {
        id: "pipeline-c",
        aggregation: [0, 1e4],
        change: {
          amount: 1e4
        },
        entities: {}
      }
    ]
  }
};
const MockCloudStorageInsights = {
  id: "cloudStorage",
  aggregation: [45e3, 45e3],
  change: {
    ratio: 0,
    amount: 0
  },
  entities: {
    bucket: [
      {
        id: "bucket-a",
        aggregation: [15e3, 2e4],
        change: {
          ratio: 0.333,
          amount: 5e3
        },
        entities: {
          SKU: [
            {
              id: "Mock SKU A",
              aggregation: [1e4, 11e3],
              change: {
                ratio: 0.1,
                amount: 1e3
              },
              entities: {}
            },
            {
              id: "Mock SKU B",
              aggregation: [2e3, 5e3],
              change: {
                ratio: 1.5,
                amount: 3e3
              },
              entities: {}
            },
            {
              id: "Mock SKU C",
              aggregation: [3e3, 4e3],
              change: {
                ratio: 0.3333,
                amount: 1e3
              },
              entities: {}
            }
          ]
        }
      },
      {
        id: "bucket-b",
        aggregation: [3e4, 25e3],
        change: {
          ratio: -0.16666,
          amount: -5e3
        },
        entities: {
          SKU: [
            {
              id: "Mock SKU A",
              aggregation: [12e3, 13e3],
              change: {
                ratio: 0.08333333333333333,
                amount: 1e3
              },
              entities: {}
            },
            {
              id: "Mock SKU B",
              aggregation: [16e3, 12e3],
              change: {
                ratio: -0.25,
                amount: -4e3
              },
              entities: {}
            },
            {
              id: "Mock SKU C",
              aggregation: [2e3, 0],
              change: {
                amount: -2e3
              },
              entities: {}
            }
          ]
        }
      },
      {
        id: "bucket-c",
        aggregation: [0, 0],
        change: {
          amount: 0
        },
        entities: {}
      }
    ]
  }
};
const MockComputeEngineInsights = {
  id: "computeEngine",
  aggregation: [8e4, 9e4],
  change: {
    ratio: 0.125,
    amount: 1e4
  },
  entities: {
    service: [
      {
        id: "service-a",
        aggregation: [2e4, 1e4],
        change: {
          ratio: -0.5,
          amount: -1e4
        },
        entities: {
          SKU: [
            {
              id: "Mock SKU A",
              aggregation: [4e3, 2e3],
              change: {
                ratio: -0.5,
                amount: -2e3
              },
              entities: {}
            },
            {
              id: "Mock SKU B",
              aggregation: [7e3, 6e3],
              change: {
                ratio: -0.14285714285714285,
                amount: -1e3
              },
              entities: {}
            },
            {
              id: "Mock SKU C",
              aggregation: [9e3, 2e3],
              change: {
                ratio: -0.7777777777777778,
                amount: -7e3
              },
              entities: {}
            }
          ],
          deployment: [
            {
              id: "Compute Engine",
              aggregation: [7e3, 6e3],
              change: {
                ratio: -0.5,
                amount: -2e3
              },
              entities: {}
            },
            {
              id: "Kubernetes",
              aggregation: [4e3, 2e3],
              change: {
                ratio: -0.14285714285714285,
                amount: -1e3
              },
              entities: {}
            }
          ]
        }
      },
      {
        id: "service-b",
        aggregation: [1e4, 2e4],
        change: {
          ratio: 1,
          amount: 1e4
        },
        entities: {
          SKU: [
            {
              id: "Mock SKU A",
              aggregation: [1e3, 2e3],
              change: {
                ratio: 1,
                amount: 1e3
              },
              entities: {}
            },
            {
              id: "Mock SKU B",
              aggregation: [4e3, 8e3],
              change: {
                ratio: 1,
                amount: 4e3
              },
              entities: {}
            },
            {
              id: "Mock SKU C",
              aggregation: [5e3, 1e4],
              change: {
                ratio: 1,
                amount: 5e3
              },
              entities: {}
            }
          ],
          deployment: [
            {
              id: "Compute Engine",
              aggregation: [7e3, 6e3],
              change: {
                ratio: -0.5,
                amount: -2e3
              },
              entities: {}
            },
            {
              id: "Kubernetes",
              aggregation: [4e3, 2e3],
              change: {
                ratio: -0.14285714285714285,
                amount: -1e3
              },
              entities: {}
            }
          ]
        }
      },
      {
        id: "service-c",
        aggregation: [0, 1e4],
        change: {
          amount: 1e4
        },
        entities: {}
      }
    ]
  }
};
const MockEventsInsights = {
  id: "events",
  aggregation: [2e4, 1e4],
  change: {
    ratio: -0.5,
    amount: -1e4
  },
  entities: {
    event: [
      {
        id: "event-a",
        aggregation: [15e3, 7e3],
        change: {
          ratio: -0.53333333333,
          amount: -8e3
        },
        entities: {
          product: [
            {
              id: "Mock Product A",
              aggregation: [5e3, 2e3],
              change: {
                ratio: -0.6,
                amount: -3e3
              },
              entities: {}
            },
            {
              id: "Mock Product B",
              aggregation: [7e3, 2500],
              change: {
                ratio: -0.64285714285,
                amount: -4500
              },
              entities: {}
            },
            {
              id: "Mock Product C",
              aggregation: [3e3, 2500],
              change: {
                ratio: -0.16666666666,
                amount: -500
              },
              entities: {}
            }
          ]
        }
      },
      {
        id: "event-b",
        aggregation: [5e3, 3e3],
        change: {
          ratio: -0.4,
          amount: -2e3
        },
        entities: {
          product: [
            {
              id: "Mock Product A",
              aggregation: [2e3, 1e3],
              change: {
                ratio: -0.5,
                amount: -1e3
              },
              entities: {}
            },
            {
              id: "Mock Product B",
              aggregation: [1e3, 1500],
              change: {
                ratio: 0.5,
                amount: 500
              },
              entities: {}
            },
            {
              id: "Mock Product C",
              aggregation: [2e3, 500],
              change: {
                ratio: -0.75,
                amount: -1500
              },
              entities: {}
            }
          ]
        }
      }
    ]
  }
};

const MockConfigProvider = ({
  children,
  ...context
}) => {
  const defaultContext = {
    metrics: [],
    products: [],
    icons: [],
    engineerCost: 0,
    currencies: []
  };
  return /* @__PURE__ */ React.createElement(ConfigContext.Provider, {
    value: { ...defaultContext, ...context }
  }, children);
};
const MockCurrencyProvider = ({
  children,
  ...context
}) => {
  const defaultContext = {
    currency: {
      kind: null,
      label: "Engineers \u{1F6E0}",
      unit: "engineer"
    },
    setCurrency: jest.fn()
  };
  return /* @__PURE__ */ React.createElement(CurrencyContext.Provider, {
    value: { ...defaultContext, ...context }
  }, children);
};

function parseIntervals(intervals) {
  const match = intervals.match(/\/(?<duration>P\d+[DM])\/(?<date>\d{4}-\d{2}-\d{2})/);
  if (Object.keys((match == null ? void 0 : match.groups) || {}).length !== 2) {
    throw new Error(`Invalid intervals: ${intervals}`);
  }
  const { duration, date } = match.groups;
  return {
    duration,
    endDate: date
  };
}
function aggregationFor(intervals, baseline) {
  const { duration, endDate } = parseIntervals(intervals);
  const inclusiveEndDate = inclusiveEndDateOf(duration, endDate);
  const days = DateTime.fromISO(endDate).diff(DateTime.fromISO(inclusiveStartDateOf(duration, inclusiveEndDate)), "days").days;
  function nextDelta() {
    const varianceFromBaseline = 0.15;
    const positiveTrendChance = 0.55;
    const normalization = positiveTrendChance - 1;
    return baseline * (Math.random() + normalization) * varianceFromBaseline;
  }
  return [...Array(days).keys()].reduce((values, i) => {
    const last = values.length ? values[values.length - 1].amount : baseline;
    const date = DateTime.fromISO(inclusiveStartDateOf(duration, inclusiveEndDate)).plus({ days: i }).toFormat(DEFAULT_DATE_FORMAT);
    const amount = Math.max(0, last + nextDelta());
    values.push({
      date,
      amount
    });
    return values;
  }, []);
}
function changeOf(aggregation) {
  const firstAmount = aggregation.length ? aggregation[0].amount : 0;
  const lastAmount = aggregation.length ? aggregation[aggregation.length - 1].amount : 0;
  if (!firstAmount || !lastAmount) {
    return {
      amount: lastAmount - firstAmount
    };
  }
  return {
    ratio: (lastAmount - firstAmount) / firstAmount,
    amount: lastAmount - firstAmount
  };
}
function trendlineOf(aggregation) {
  const data = aggregation.map((a) => [
    Date.parse(a.date) / 1e3,
    a.amount
  ]);
  const result = regression.linear(data, { precision: 5 });
  return {
    slope: result.equation[0],
    intercept: result.equation[1]
  };
}
function entityOf(product) {
  switch (product) {
    case "computeEngine":
      return MockComputeEngineInsights;
    case "cloudDataflow":
      return MockCloudDataflowInsights;
    case "cloudStorage":
      return MockCloudStorageInsights;
    case "bigQuery":
      return MockBigQueryInsights;
    case "events":
      return MockEventsInsights;
    default:
      throw new Error(`Cannot get insights for ${product}. Make sure product matches product property in app-info.yaml`);
  }
}
const getGroupedProducts = (intervals) => [
  {
    id: "Cloud Dataflow",
    aggregation: aggregationFor(intervals, 1700)
  },
  {
    id: "Compute Engine",
    aggregation: aggregationFor(intervals, 350)
  },
  {
    id: "Cloud Storage",
    aggregation: aggregationFor(intervals, 1300)
  },
  {
    id: "BigQuery",
    aggregation: aggregationFor(intervals, 2e3)
  },
  {
    id: "Cloud SQL",
    aggregation: aggregationFor(intervals, 750)
  },
  {
    id: "Cloud Spanner",
    aggregation: aggregationFor(intervals, 50)
  },
  {
    id: "Cloud Pub/Sub",
    aggregation: aggregationFor(intervals, 1e3)
  },
  {
    id: "Cloud Bigtable",
    aggregation: aggregationFor(intervals, 250)
  }
];
const getGroupedProjects = (intervals) => [
  {
    id: "project-a",
    aggregation: aggregationFor(intervals, 1700)
  },
  {
    id: "project-b",
    aggregation: aggregationFor(intervals, 350)
  },
  {
    id: "project-c",
    aggregation: aggregationFor(intervals, 1300)
  }
];

class ExampleCostInsightsClient {
  request(_, res) {
    return new Promise((resolve) => setTimeout(resolve, 0, res));
  }
  getLastCompleteBillingDate() {
    return Promise.resolve(DateTime.now().minus({ days: 1 }).toFormat(DEFAULT_DATE_FORMAT));
  }
  async getUserGroups(userId) {
    const groups = await this.request({ userId }, [
      { id: "pied-piper" }
    ]);
    return groups;
  }
  async getGroupProjects(group) {
    const projects = await this.request({ group }, [
      { id: "project-a" },
      { id: "project-b" },
      { id: "project-c" }
    ]);
    return projects;
  }
  async getDailyMetricData(metric, intervals) {
    const aggregation = aggregationFor(intervals, 1e5).map((entry) => ({
      ...entry,
      amount: Math.round(entry.amount)
    }));
    const cost = await this.request({ metric, intervals }, {
      format: "number",
      aggregation,
      change: changeOf(aggregation),
      trendline: trendlineOf(aggregation)
    });
    return cost;
  }
  async getGroupDailyCost(group, intervals) {
    const aggregation = aggregationFor(intervals, 8e3);
    const groupDailyCost = await this.request({ group, intervals }, {
      aggregation,
      change: changeOf(aggregation),
      trendline: trendlineOf(aggregation),
      groupedCosts: {
        product: getGroupedProducts(intervals),
        project: getGroupedProjects(intervals)
      }
    });
    return groupDailyCost;
  }
  async getProjectDailyCost(project, intervals) {
    const aggregation = aggregationFor(intervals, 1500);
    const projectDailyCost = await this.request({ project, intervals }, {
      id: "project-a",
      aggregation,
      change: changeOf(aggregation),
      trendline: trendlineOf(aggregation),
      groupedCosts: {
        product: getGroupedProducts(intervals)
      }
    });
    return projectDailyCost;
  }
  async getProductInsights(options) {
    const productInsights = await this.request(options, entityOf(options.product));
    return productInsights;
  }
  async getAlerts(group) {
    const projectGrowthData = {
      project: "example-project",
      periodStart: "2020-Q2",
      periodEnd: "2020-Q3",
      aggregation: [6e4, 12e4],
      change: {
        ratio: 1,
        amount: 6e4
      },
      products: [
        { id: "Compute Engine", aggregation: [58e3, 118e3] },
        { id: "Cloud Dataflow", aggregation: [1200, 1500] },
        { id: "Cloud Storage", aggregation: [800, 500] }
      ]
    };
    const unlabeledDataflowData = {
      periodStart: "2020-09-01",
      periodEnd: "2020-09-30",
      labeledCost: 6200,
      unlabeledCost: 7e3,
      projects: [
        {
          id: "example-project-1",
          unlabeledCost: 5e3,
          labeledCost: 3e3
        },
        {
          id: "example-project-2",
          unlabeledCost: 2e3,
          labeledCost: 3200
        }
      ]
    };
    const today = DateTime.now();
    const alerts = await this.request({ group }, [
      new ProjectGrowthAlert(projectGrowthData),
      new UnlabeledDataflowAlert(unlabeledDataflowData),
      new KubernetesMigrationAlert(this, {
        startDate: today.minus({ days: 30 }).toFormat(DEFAULT_DATE_FORMAT),
        endDate: today.toFormat(DEFAULT_DATE_FORMAT),
        change: {
          ratio: 0,
          amount: 0
        },
        services: [
          {
            id: "service-a",
            aggregation: [2e4, 1e4],
            change: {
              ratio: -0.5,
              amount: -1e4
            },
            entities: {}
          },
          {
            id: "service-b",
            aggregation: [3e4, 15e3],
            change: {
              ratio: -0.5,
              amount: -15e3
            },
            entities: {}
          }
        ]
      })
    ]);
    return alerts;
  }
}

export { getResetState as $, AlertStatus as A, overviewGraphTickFormatter as B, CostGrowth as C, DefaultNavigation as D, formatGraphValue as E, isInvalid as F, DEFAULT_DATE_FORMAT as G, BarChartTooltip as H, BarChartTooltipItem as I, getPreviousPeriodTotalCost as J, formatPeriod as K, LegendItem as L, BarChartLegend as M, Duration as N, formatLastTwoLookaheadQuarters as O, useOverviewTabsStyles as P, useConfig as Q, useProductInsightsCardStyles as R, ScrollType as S, findAnyKey as T, ProductInsightsChart as U, costInsightsApiRef as V, intervalsOf as W, DEFAULT_DURATION as X, settledResponseOf as Y, initialStatesOf as Z, totalAggregationSort as _, useScroll as a, getResetStateWithoutInitial as a0, useSubtleTypographyStyles as a1, useGroups as a2, useCurrency as a3, isAlertActive as a4, isAlertSnoozed as a5, isAlertAccepted as a6, isAlertDismissed as a7, CostInsightsLayout as a8, CostInsightsNavigation as a9, ChangeThreshold as aA, GrowthType as aB, CurrencyType as aC, IconType as aD, CostInsightsThemeProvider as aa, ConfigProvider as ab, LoadingProvider as ac, GroupsProvider as ad, BillingDateProvider as ae, FilterProvider as af, ScrollProvider as ag, CurrencyProvider as ah, ProjectGrowthInstructionsPage as ai, AlertInstructionsLayout as aj, costInsightsPlugin as ak, CostInsightsPage as al, CostInsightsProjectGrowthInstructionsPage as am, CostInsightsLabelDataflowInstructionsPage as an, ExampleCostInsightsClient as ao, BarChart as ap, CostGrowthIndicator as aq, MockConfigProvider as ar, MockCurrencyProvider as as, ProjectGrowthAlert as at, UnlabeledDataflowAlert as au, AlertDismissReason as av, AlertDismissOptions as aw, AlertSnoozeOptions as ax, DataKey as ay, EngineerThreshold as az, useAlertDialogStyles as b, choose$1 as c, useAlertStatusSummaryButtonStyles as d, useCostInsightsStyles as e, formOf as f, useAlertInsightsSectionStyles as g, isAcceptEnabled as h, isSnoozeEnabled as i, isDismissEnabled as j, useLoading as k, isStatusSnoozed as l, isStatusAccepted as m, isStatusDismissed as n, DefaultLoadingAction as o, useSelectStyles as p, findAlways as q, useFilters as r, sumOfAllAlerts as s, useLastCompleteBillingDate as t, useActionItemCardStyles as u, getComparedChange as v, formatChange as w, choose as x, useCostOverviewStyles as y, aggregationSort as z };
//# sourceMappingURL=index-ab932d56.esm.js.map
