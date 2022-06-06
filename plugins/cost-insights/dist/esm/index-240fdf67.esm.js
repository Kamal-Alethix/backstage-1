import React, { Fragment, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, Paper, Avatar, Divider, Box, Tooltip, IconButton, Badge, Dialog, DialogContent, Typography, capitalize, DialogActions, Button, Collapse, Grid, Snackbar, FormControl, InputLabel, Select, MenuItem, Container, useTheme, emphasize, CardContent, Tabs, Tab, CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { u as useActionItemCardStyles, a as useScroll, A as AlertStatus, S as ScrollType, b as useAlertDialogStyles, c as choose, f as formOf, d as useAlertStatusSummaryButtonStyles, e as useCostInsightsStyles, D as DefaultNavigation, g as useAlertInsightsSectionStyles, i as isSnoozeEnabled, h as isAcceptEnabled, j as isDismissEnabled, k as useLoading, l as isStatusSnoozed, m as isStatusAccepted, n as isStatusDismissed, s as sumOfAllAlerts, o as DefaultLoadingAction, p as useSelectStyles, q as findAlways, r as useFilters, t as useLastCompleteBillingDate, v as getComparedChange, L as LegendItem, w as formatChange, x as choose$1, C as CostGrowth, y as useCostOverviewStyles, z as aggregationSort, B as overviewGraphTickFormatter, E as formatGraphValue, F as isInvalid, G as DEFAULT_DATE_FORMAT, H as BarChartTooltip, I as BarChartTooltipItem, J as getPreviousPeriodTotalCost, K as formatPeriod, M as BarChartLegend, N as Duration, O as formatLastTwoLookaheadQuarters, P as useOverviewTabsStyles, Q as useConfig, R as useProductInsightsCardStyles, T as findAnyKey, U as ProductInsightsChart, V as costInsightsApiRef, W as intervalsOf, X as DEFAULT_DURATION, Y as settledResponseOf, Z as initialStatesOf, _ as totalAggregationSort, $ as getResetState, a0 as getResetStateWithoutInitial, a1 as useSubtleTypographyStyles, a2 as useGroups, a3 as useCurrency, a4 as isAlertActive, a5 as isAlertSnoozed, a6 as isAlertAccepted, a7 as isAlertDismissed, a8 as CostInsightsLayout, a9 as CostInsightsNavigation, aa as CostInsightsThemeProvider, ab as ConfigProvider, ac as LoadingProvider, ad as GroupsProvider, ae as BillingDateProvider, af as FilterProvider, ag as ScrollProvider, ah as CurrencyProvider } from './index-ab932d56.esm.js';
import SnoozeIcon from '@material-ui/icons/AccessTime';
import AcceptIcon from '@material-ui/icons/Check';
import DismissIcon from '@material-ui/icons/Delete';
import classnames from 'classnames';
import pluralize from 'pluralize';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useLocation } from 'react-router-dom';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import useAsync from 'react-use/lib/useAsync';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { DateTime } from 'luxon';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Area, Line, Tooltip as Tooltip$1, AreaChart } from 'recharts';
import '@material-ui/icons/ChevronLeft';
import '@material-ui/icons/ChevronRight';
import '@material-ui/icons/Lens';
import '@material-ui/icons/HelpOutlineOutlined';
import '@material-ui/icons/ArrowDropUp';
import '@material-ui/icons/ArrowDropDown';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import { InfoCard, Progress } from '@backstage/core-components';
import '@material-ui/icons/MonetizationOn';
import '@material-ui/icons/Whatshot';
import '@material-ui/icons/Settings';
import '@material-ui/icons/AccountTree';
import '@material-ui/icons/Storage';
import '@material-ui/icons/Search';
import '@material-ui/icons/CloudQueue';
import '@material-ui/icons/School';
import '@material-ui/icons/ViewHeadline';
import '@material-ui/lab';
import 'qs';
import 'yup';
import '@backstage/catalog-model';
import 'regression';

const ActionItemCard = ({
  alert,
  avatar,
  number,
  disableScroll = false
}) => {
  const classes = useActionItemCardStyles();
  const rootClasses = classnames(classes.root, {
    [classes.activeRoot]: !disableScroll
  });
  const [, setScroll] = useScroll();
  const onActionItemClick = () => {
    if (!disableScroll && number) {
      setScroll(`alert-${number}`);
    }
  };
  return /* @__PURE__ */ React.createElement(Card, {
    className: classes.card,
    raised: false,
    onClick: onActionItemClick
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    classes: {
      root: rootClasses,
      action: classes.action,
      title: classes.title
    },
    title: alert.title,
    subheader: alert.subtitle,
    avatar
  }));
};

const AlertStatusButton = ({
  title,
  amount,
  icon,
  onClick,
  ...buttonProps
}) => /* @__PURE__ */ React.createElement(Tooltip, {
  title
}, /* @__PURE__ */ React.createElement(IconButton, {
  onClick,
  role: "button",
  "aria-hidden": false,
  ...buttonProps
}, /* @__PURE__ */ React.createElement(Badge, {
  badgeContent: amount
}, icon)));
const ActionItems = ({
  active,
  snoozed,
  accepted,
  dismissed
}) => {
  const classes = useActionItemCardStyles();
  const [, setScroll] = useScroll();
  const isSnoozedButtonDisplayed = !!snoozed.length;
  const isAcceptedButtonDisplayed = !!accepted.length;
  const isDismissedButtonDisplayed = !!dismissed.length;
  const isStatusButtonGroupDisplayed = !!active.length;
  const onStatusButtonClick = () => setScroll(ScrollType.AlertSummary);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Paper, null, active.map((alert, index) => /* @__PURE__ */ React.createElement(Fragment, {
    key: `alert-${index}`
  }, /* @__PURE__ */ React.createElement(ActionItemCard, {
    alert,
    number: index + 1,
    avatar: /* @__PURE__ */ React.createElement(Avatar, {
      className: classes.avatar
    }, index + 1)
  }), index < active.length - 1 && /* @__PURE__ */ React.createElement(Divider, null)))), isStatusButtonGroupDisplayed && /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "flex-end",
    mt: 2
  }, isAcceptedButtonDisplayed && /* @__PURE__ */ React.createElement(AlertStatusButton, {
    title: "Accepted",
    "aria-label": AlertStatus.Accepted,
    icon: /* @__PURE__ */ React.createElement(AcceptIcon, null),
    amount: accepted.length,
    onClick: onStatusButtonClick
  }), isSnoozedButtonDisplayed && /* @__PURE__ */ React.createElement(AlertStatusButton, {
    title: "Snoozed",
    "aria-label": AlertStatus.Snoozed,
    amount: snoozed.length,
    icon: /* @__PURE__ */ React.createElement(SnoozeIcon, null),
    onClick: onStatusButtonClick
  }), isDismissedButtonDisplayed && /* @__PURE__ */ React.createElement(AlertStatusButton, {
    title: "Dismissed",
    "aria-label": AlertStatus.Dismissed,
    icon: /* @__PURE__ */ React.createElement(DismissIcon, null),
    amount: dismissed.length,
    onClick: onStatusButtonClick
  })));
};

const DEFAULT_FORM_ID = "alert-form";
const AlertDialog = ({
  open,
  group,
  alert,
  status,
  onClose,
  onSubmit
}) => {
  const classes = useAlertDialogStyles();
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const formRef = useRef(null);
  useEffect(() => {
    setSubmitDisabled(open);
  }, [open]);
  function disableSubmit(isDisabled) {
    setSubmitDisabled(isDisabled);
  }
  function onDialogClose() {
    onClose();
    setSubmitDisabled(true);
  }
  const [action, actioned] = choose(status, [
    ["snooze", "snoozed"],
    ["accept", "accepted"],
    ["dismiss", "dismissed"]
  ], ["", ""]);
  const TransitionProps = {
    mountOnEnter: true,
    unmountOnExit: true,
    onEntered() {
      if (formRef.current) {
        formRef.current.id = DEFAULT_FORM_ID;
      }
    }
  };
  const Form = formOf(alert, status);
  return /* @__PURE__ */ React.createElement(Dialog, {
    open,
    onClose: onDialogClose,
    scroll: "body",
    maxWidth: "lg",
    TransitionProps
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    className: classes.icon,
    disableRipple: true,
    "aria-label": "Close",
    onClick: onDialogClose
  }, /* @__PURE__ */ React.createElement(CloseIcon, null))), /* @__PURE__ */ React.createElement(DialogContent, {
    className: classes.content
  }, /* @__PURE__ */ React.createElement(Box, {
    mb: 1.5
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, /* @__PURE__ */ React.createElement("b", null, capitalize(action), " this action item?")), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6",
    color: "textSecondary"
  }, /* @__PURE__ */ React.createElement("b", null, "This action item will be ", actioned, " for all of ", group, "."))), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    bgcolor: "alertBackground",
    p: 2,
    mb: 1.5,
    borderRadius: 4
  }, /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement("b", null, alert == null ? void 0 : alert.title)), /* @__PURE__ */ React.createElement(Typography, {
    color: "textSecondary"
  }, alert == null ? void 0 : alert.subtitle)), Form && /* @__PURE__ */ React.createElement(Form, {
    ref: formRef,
    alert,
    onSubmit,
    disableSubmit
  })), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(DialogActions, {
    className: classes.actions,
    disableSpacing: true
  }, Form ? /* @__PURE__ */ React.createElement(Button, {
    type: "submit",
    color: "primary",
    variant: "contained",
    "aria-label": action,
    form: DEFAULT_FORM_ID,
    disabled: isSubmitDisabled
  }, capitalize(action)) : /* @__PURE__ */ React.createElement(Button, {
    type: "button",
    color: "primary",
    variant: "contained",
    "aria-label": action,
    onClick: () => onSubmit(null)
  }, capitalize(action))));
};

const AlertGroup = ({ alerts, status, title, icon }) => {
  const classes = useActionItemCardStyles();
  return /* @__PURE__ */ React.createElement(Box, {
    p: 1
  }, alerts.map((alert, index) => /* @__PURE__ */ React.createElement(Fragment, {
    key: `alert-${status}-${index}`
  }, /* @__PURE__ */ React.createElement(ActionItemCard, {
    disableScroll: true,
    alert,
    avatar: /* @__PURE__ */ React.createElement(Tooltip, {
      title
    }, /* @__PURE__ */ React.createElement(Avatar, {
      className: classes.avatar
    }, icon))
  }), index < alerts.length - 1 && /* @__PURE__ */ React.createElement(Divider, null))));
};
const AlertStatusSummary = ({
  open,
  snoozed,
  accepted,
  dismissed
}) => {
  const isSnoozedListDisplayed = !!snoozed.length;
  const isAcceptedListDisplayed = !!accepted.length;
  const isDismissedListDisplayed = !!dismissed.length;
  return /* @__PURE__ */ React.createElement(Collapse, {
    in: open
  }, isAcceptedListDisplayed && /* @__PURE__ */ React.createElement(AlertGroup, {
    title: "Accepted",
    alerts: accepted,
    status: AlertStatus.Accepted,
    icon: /* @__PURE__ */ React.createElement(AcceptIcon, {
      role: "img",
      "aria-hidden": false,
      "aria-label": AlertStatus.Accepted
    })
  }), isSnoozedListDisplayed && /* @__PURE__ */ React.createElement(AlertGroup, {
    title: "Snoozed",
    alerts: snoozed,
    status: AlertStatus.Snoozed,
    icon: /* @__PURE__ */ React.createElement(SnoozeIcon, {
      role: "img",
      "aria-hidden": false,
      "aria-label": AlertStatus.Snoozed
    })
  }), isDismissedListDisplayed && /* @__PURE__ */ React.createElement(AlertGroup, {
    title: "Dismissed",
    alerts: dismissed,
    status: AlertStatus.Dismissed,
    icon: /* @__PURE__ */ React.createElement(DismissIcon, {
      role: "img",
      "aria-hidden": false,
      "aria-label": AlertStatus.Dismissed
    })
  }));
};

const AlertStatusSummaryButton = ({
  children,
  onClick
}) => {
  const classes = useAlertStatusSummaryButtonStyles();
  const [clicked, setClicked] = useState(false);
  const iconClassName = classnames(classes.icon, {
    [classes.clicked]: clicked
  });
  const handleOnClick = (e) => {
    setClicked((prevClicked) => !prevClicked);
    onClick(e);
  };
  return /* @__PURE__ */ React.createElement(Button, {
    variant: "text",
    color: "primary",
    disableElevation: true,
    "aria-label": "expand",
    endIcon: /* @__PURE__ */ React.createElement(ExpandMoreIcon, {
      className: iconClassName
    }),
    onClick: handleOnClick
  }, children);
};

const ScrollAnchor = ({
  id,
  left = 0,
  top = -20,
  block = "start",
  inline = "nearest",
  behavior = "smooth"
}) => {
  const divRef = useRef(null);
  const [scroll, setScroll] = useScroll();
  useEffect(() => {
    function scrollIntoView() {
      if (divRef.current && scroll === id) {
        divRef.current.scrollIntoView({
          block,
          inline,
          behavior
        });
        setScroll(null);
      }
    }
    scrollIntoView();
  }, [scroll, setScroll, id, behavior, block, inline]);
  return /* @__PURE__ */ React.createElement("div", {
    ref: divRef,
    style: { position: "absolute", height: 0, width: 0, top, left },
    "data-testid": `scroll-test-${id}`
  });
};

const AlertInsightsHeader = ({
  title,
  subtitle
}) => {
  const classes = useCostInsightsStyles();
  return /* @__PURE__ */ React.createElement(Box, {
    mb: 6,
    position: "relative"
  }, /* @__PURE__ */ React.createElement(ScrollAnchor, {
    id: DefaultNavigation.AlertInsightsHeader
  }), /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4",
    align: "center"
  }, title, " ", /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "direct-hit"
  }, "\u{1F3AF}")), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.h6Subtle,
    align: "center",
    gutterBottom: true
  }, subtitle));
};

const AlertInsightsSectionHeader = ({
  alert,
  number
}) => {
  const classes = useAlertInsightsSectionStyles();
  const isViewInstructionsButtonDisplayed = !!alert.url;
  return /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    mb: 3,
    textAlign: "left"
  }, /* @__PURE__ */ React.createElement(ScrollAnchor, {
    id: `alert-${number}`
  }), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 2,
    justifyContent: "space-between",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Box, {
    mr: 2
  }, /* @__PURE__ */ React.createElement(Avatar, {
    className: classes.button
  }, number)), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, alert.title), /* @__PURE__ */ React.createElement(Typography, {
    gutterBottom: true
  }, alert.subtitle)))), isViewInstructionsButtonDisplayed && /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "text",
    color: "primary",
    href: alert.url
  }, alert.buttonText || "View Instructions"))));
};

const AlertInsightsSection = ({
  alert,
  number,
  onSnooze,
  onAccept,
  onDismiss
}) => {
  const isSnoozeButtonDisplayed = isSnoozeEnabled(alert);
  const isAcceptButtonDisplayed = isAcceptEnabled(alert);
  const isDismissButtonDisplayed = isDismissEnabled(alert);
  const isButtonGroupDisplayed = isSnoozeButtonDisplayed || isAcceptButtonDisplayed || isDismissButtonDisplayed;
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column",
    mb: 6
  }, /* @__PURE__ */ React.createElement(AlertInsightsSectionHeader, {
    alert,
    number
  }), isButtonGroupDisplayed && /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    alignItems: "center",
    mb: 4
  }, isAcceptButtonDisplayed && /* @__PURE__ */ React.createElement(Box, {
    mr: 1
  }, /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    variant: "contained",
    "aria-label": "accept",
    onClick: () => onAccept(alert),
    startIcon: /* @__PURE__ */ React.createElement(AcceptIcon, null)
  }, "Accept")), isSnoozeButtonDisplayed && /* @__PURE__ */ React.createElement(Box, {
    mr: 1
  }, /* @__PURE__ */ React.createElement(Button, {
    color: "default",
    variant: "outlined",
    "aria-label": "snooze",
    disableElevation: true,
    onClick: () => onSnooze(alert),
    startIcon: /* @__PURE__ */ React.createElement(SnoozeIcon, null)
  }, "Snooze")), isDismissButtonDisplayed && /* @__PURE__ */ React.createElement(Button, {
    color: "secondary",
    variant: "outlined",
    "aria-label": "dismiss",
    disableElevation: true,
    onClick: () => onDismiss(alert),
    startIcon: /* @__PURE__ */ React.createElement(DismissIcon, null)
  }, "Dismiss")), alert.element);
};

const mapLoadingToAlerts = ({ dispatch }) => (isLoading) => dispatch({ [DefaultLoadingAction.CostInsightsAlerts]: isLoading });
const AlertInsights = ({
  group,
  active,
  snoozed,
  accepted,
  dismissed,
  onChange
}) => {
  const [scroll] = useScroll();
  const [alert, setAlert] = useState(null);
  const dispatchLoadingAlerts = useLoading(mapLoadingToAlerts);
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(void 0);
  const [error, setError] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    var _a, _b, _c;
    async function callAlertHook(options2, callback) {
      setAlert(null);
      setStatus(null);
      setData(void 0);
      setDialogOpen(false);
      dispatchLoadingAlerts(true);
      try {
        const alerts = await callback(options2);
        onChange(alerts);
      } catch (e) {
        setError(e);
      } finally {
        dispatchLoadingAlerts(false);
      }
    }
    const options = { data, group };
    const onSnoozed = (_a = alert == null ? void 0 : alert.onSnoozed) == null ? void 0 : _a.bind(alert);
    const onAccepted = (_b = alert == null ? void 0 : alert.onAccepted) == null ? void 0 : _b.bind(alert);
    const onDismissed = (_c = alert == null ? void 0 : alert.onDismissed) == null ? void 0 : _c.bind(alert);
    if (data !== void 0) {
      if (isStatusSnoozed(status) && onSnoozed) {
        callAlertHook(options, onSnoozed);
      } else if (isStatusAccepted(status) && onAccepted) {
        callAlertHook(options, onAccepted);
      } else if (isStatusDismissed(status) && onDismissed) {
        callAlertHook(options, onDismissed);
      }
    }
  }, [group, data, alert, status, onChange, dispatchLoadingAlerts]);
  useEffect(() => {
    if (scroll === ScrollType.AlertSummary) {
      setSummaryOpen(true);
    }
  }, [scroll]);
  useEffect(() => {
    setDialogOpen(!!status);
  }, [status]);
  useEffect(() => {
    setSnackbarOpen(!!error);
  }, [error]);
  function onSnooze(alertToSnooze) {
    setAlert(alertToSnooze);
    setStatus(AlertStatus.Snoozed);
  }
  function onAccept(alertToAccept) {
    setAlert(alertToAccept);
    setStatus(AlertStatus.Accepted);
  }
  function onDismiss(alertToDismiss) {
    setAlert(alertToDismiss);
    setStatus(AlertStatus.Dismissed);
  }
  function onSnackbarClose() {
    setError(null);
  }
  function onDialogClose() {
    setAlert(null);
    setStatus(null);
  }
  function onDialogFormSubmit(formData) {
    setData(formData);
  }
  function onSummaryButtonClick() {
    setSummaryOpen((prevOpen) => !prevOpen);
  }
  const total = [accepted, snoozed, dismissed].reduce(sumOfAllAlerts, 0);
  const isAlertStatusSummaryDisplayed = !!total;
  const isAlertInsightSectionDisplayed = !!active.length;
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "column",
    spacing: 2
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(AlertInsightsHeader, {
    title: "Your team's action items",
    subtitle: isAlertInsightSectionDisplayed ? "This section outlines suggested action items your team can address to improve cloud costs." : "All of your team's action items are hidden. Maybe it's time to give them another look?"
  })), isAlertInsightSectionDisplayed && /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    container: true,
    direction: "column",
    spacing: 4
  }, active.map((activeAlert, index) => /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    key: `alert-insights-section-${index}`
  }, /* @__PURE__ */ React.createElement(AlertInsightsSection, {
    alert: activeAlert,
    number: index + 1,
    onSnooze,
    onAccept,
    onDismiss
  })))), isAlertStatusSummaryDisplayed && /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Box, {
    position: "relative",
    display: "flex",
    justifyContent: "flex-end"
  }, /* @__PURE__ */ React.createElement(ScrollAnchor, {
    id: ScrollType.AlertSummary
  }), /* @__PURE__ */ React.createElement(AlertStatusSummaryButton, {
    onClick: onSummaryButtonClick
  }, pluralize("Hidden Action Item", total))), /* @__PURE__ */ React.createElement(AlertStatusSummary, {
    open: isSummaryOpen,
    snoozed,
    accepted,
    dismissed
  })), /* @__PURE__ */ React.createElement(AlertDialog, {
    group,
    open: isDialogOpen,
    alert,
    status,
    onClose: onDialogClose,
    onSubmit: onDialogFormSubmit
  }), /* @__PURE__ */ React.createElement(Snackbar, {
    open: isSnackbarOpen,
    autoHideDuration: 6e3,
    anchorOrigin: { vertical: "top", horizontal: "center" },
    onClose: onSnackbarClose
  }, /* @__PURE__ */ React.createElement(Alert, {
    onClose: onSnackbarClose,
    severity: "error"
  }, error == null ? void 0 : error.message)));
};

const ClipboardMessage = {
  default: "Copy URL to clipboard",
  success: "Copied!",
  error: "Couldn't copy to clipboard"
};
const CopyUrlToClipboard = () => {
  const location = useLocation();
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const origin = window.location.origin;
  const pathname = location.pathname;
  const search = location.search;
  const url = `${origin}${pathname}${search}`;
  useEffect(() => {
    if (state.error) {
      setCopied(false);
    } else if (state.value) {
      setCopied(true);
      setTimeout(setCopied, 1500, false);
    }
  }, [state]);
  let text = ClipboardMessage.default;
  let Icon = AssignmentOutlinedIcon;
  if (state.error) {
    text = ClipboardMessage.error;
    Icon = SentimentVeryDissatisfiedIcon;
  } else if (copied) {
    text = ClipboardMessage.success;
    Icon = AssignmentTurnedInOutlinedIcon;
  }
  return /* @__PURE__ */ React.createElement(Tooltip, {
    title: text,
    arrow: true
  }, /* @__PURE__ */ React.createElement(IconButton, {
    onClick: () => copyToClipboard(url)
  }, /* @__PURE__ */ React.createElement(Icon, null)));
};

function useDisplayName() {
  var _a;
  const identityApi = useApi(identityApiRef);
  const state = useAsync(() => identityApi.getProfileInfo(), [identityApi]);
  return state.loading ? "" : ((_a = state.value) == null ? void 0 : _a.displayName) || "Mysterious Stranger";
}
const CostInsightsHeaderNoData = ({
  owner,
  groups
}) => {
  const displayName = useDisplayName();
  const classes = useCostInsightsStyles();
  const hasMultipleGroups = groups.length > 1;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4",
    align: "center",
    gutterBottom: true
  }, /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "flushed-face"
  }, "\u{1F633}"), " ", "Well this is awkward"), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.h6Subtle,
    align: "center",
    gutterBottom: true
  }, /* @__PURE__ */ React.createElement("b", null, "Hey, ", displayName, "!"), " ", /* @__PURE__ */ React.createElement("b", null, owner), " doesn't seem to have any cloud costs."), hasMultipleGroups && /* @__PURE__ */ React.createElement(Typography, {
    align: "center",
    gutterBottom: true
  }, "Maybe we picked the wrong team, choose another from the menu above?"));
};
const CostInsightsHeaderAlerts = ({
  owner,
  alerts
}) => {
  const displayName = useDisplayName();
  const classes = useCostInsightsStyles();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4",
    align: "center",
    gutterBottom: true
  }, /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "magnifying-glass"
  }, "\u{1F50E}"), " ", "You have ", alerts, " thing", alerts > 1 && "s", " to look into"), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.h6Subtle,
    align: "center",
    gutterBottom: true
  }, /* @__PURE__ */ React.createElement("b", null, "Hey, ", displayName, "!"), " We've identified", " ", alerts > 1 ? "a few things " : "one thing ", /* @__PURE__ */ React.createElement("b", null, owner), " should look into next."));
};
const CostInsightsHeaderNoAlerts = ({ owner }) => {
  const displayName = useDisplayName();
  const classes = useCostInsightsStyles();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4",
    gutterBottom: true,
    align: "center"
  }, /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "thumbs-up"
  }, "\u{1F44D}"), " ", "Your team is doing great"), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.h6Subtle,
    align: "center",
    gutterBottom: true
  }, /* @__PURE__ */ React.createElement("b", null, "Hey, ", displayName, "!"), " ", /* @__PURE__ */ React.createElement("b", null, owner), " is doing well. No major changes this month."));
};
const CostInsightsHeaderNoGroups = () => {
  const displayName = useDisplayName();
  const classes = useCostInsightsStyles();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4",
    align: "center",
    gutterBottom: true
  }, /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "flushed-face"
  }, "\u{1F633}"), " ", "Well this is awkward"), /* @__PURE__ */ React.createElement(Typography, {
    className: classes.h6Subtle,
    align: "center",
    gutterBottom: true
  }, /* @__PURE__ */ React.createElement("b", null, "Hey, ", displayName, "!"), " It doesn't look like you belong to any teams."));
};
const CostInsightsHeader = (props) => {
  if (!props.hasCostData) {
    return /* @__PURE__ */ React.createElement(CostInsightsHeaderNoData, {
      ...props
    });
  }
  if (props.alerts) {
    return /* @__PURE__ */ React.createElement(CostInsightsHeaderAlerts, {
      ...props
    });
  }
  return /* @__PURE__ */ React.createElement(CostInsightsHeaderNoAlerts, {
    ...props
  });
};

const NULL_VALUE = "engineers";
const CurrencySelect = ({
  currency,
  currencies,
  onSelect
}) => {
  const classes = useSelectStyles();
  const getOption = (value) => {
    const kind = value === NULL_VALUE ? null : value;
    return findAlways(currencies, (c) => c.kind === kind);
  };
  const handleOnChange = (e) => {
    const option = getOption(e.target.value);
    onSelect(option);
  };
  const renderValue = (value) => {
    const option = getOption(value);
    return /* @__PURE__ */ React.createElement("b", null, option.label);
  };
  return /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined"
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    shrink: true
  }, "Convert to:"), /* @__PURE__ */ React.createElement(Select, {
    className: classes.select,
    variant: "outlined",
    labelWidth: 100,
    onChange: handleOnChange,
    value: currency.kind || NULL_VALUE,
    renderValue
  }, currencies.map((c) => /* @__PURE__ */ React.createElement(MenuItem, {
    className: classes.menuItem,
    key: c.kind || NULL_VALUE,
    value: c.kind || NULL_VALUE
  }, /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": c.label
  }, c.label)))));
};

const WhyCostsMatter = () => {
  return /* @__PURE__ */ React.createElement(Box, {
    mt: 10,
    mb: 4
  }, /* @__PURE__ */ React.createElement(Container, {
    maxWidth: "md"
  }, /* @__PURE__ */ React.createElement(Box, {
    mt: 2,
    mb: 2
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5",
    align: "center",
    gutterBottom: true
  }, "Why cloud costs matter")), /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    alignContent: "space-around",
    spacing: 3,
    wrap: "nowrap"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Sustainability", " ", /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "globe"
  }, "\u{1F30E}")), /* @__PURE__ */ React.createElement(Typography, null, "Reducing cloud usage improves our carbon footprint.")), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Divider, {
    orientation: "vertical"
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Revenue", " ", /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "money-with-wings"
  }, "\u{1F4B8}")), /* @__PURE__ */ React.createElement(Typography, null, "Keeping cloud costs well-tuned prevents infrastructure from eating into revenue.")), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Divider, {
    orientation: "vertical"
  })), /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h6"
  }, "Innovation", " ", /* @__PURE__ */ React.createElement("span", {
    role: "img",
    "aria-label": "medal"
  }, "\u{1F947}")), /* @__PURE__ */ React.createElement(Typography, null, "The more we save, the more we can reinvest in speed and innovation.")))));
};

function trendFrom(trendline, date) {
  return trendline.slope * (date / 1e3) + trendline.intercept;
}
function groupByDate(acc, entry) {
  return { ...acc, [entry.date]: entry.amount };
}
function toMaxCost(acc, entry) {
  return acc.dailyCost > entry.dailyCost ? acc : entry;
}
function toDataMax(metric, data) {
  return data.reduce(toMaxCost).dailyCost / Math.abs(data[0].trend) * data[0][metric];
}

const mapFiltersToProps = ({
  pageFilters,
  setPageFilters
}) => ({
  ...pageFilters,
  project: pageFilters.project || "all",
  setDuration: (duration) => setPageFilters({
    ...pageFilters,
    duration
  }),
  setProject: (project) => setPageFilters({
    ...pageFilters,
    project: project === "all" ? null : project
  }),
  setMetric: (metric) => setPageFilters({
    ...pageFilters,
    metric
  })
});

const CostOverviewLegend = ({
  dailyCostData,
  metric,
  metricData
}) => {
  const theme = useTheme();
  const { duration } = useFilters(mapFiltersToProps);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const comparedChange = metricData ? getComparedChange(dailyCostData, metricData, duration, lastCompleteBillingDate) : null;
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row"
  }, dailyCostData.change && /* @__PURE__ */ React.createElement(Box, {
    mr: 2
  }, /* @__PURE__ */ React.createElement(LegendItem, {
    title: "Cost Trend",
    markerColor: theme.palette.blue
  }, formatChange(dailyCostData.change))), metricData && metric && comparedChange && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, {
    mr: 2
  }, /* @__PURE__ */ React.createElement(LegendItem, {
    title: `${metric.name} Trend`,
    markerColor: theme.palette.magenta
  }, formatChange(metricData.change))), /* @__PURE__ */ React.createElement(LegendItem, {
    title: choose$1(["Your Savings", "Your Excess"], comparedChange)
  }, /* @__PURE__ */ React.createElement(CostGrowth, {
    change: comparedChange,
    duration
  }))));
};

const CostOverviewChart = ({
  dailyCostData,
  metric,
  metricData,
  responsive = true
}) => {
  var _a, _b, _c;
  const theme = useTheme();
  const styles = useCostOverviewStyles(theme);
  const data = {
    dailyCost: {
      dataKey: "dailyCost",
      name: `Daily Cost`,
      format: "currency",
      data: dailyCostData
    },
    metric: {
      dataKey: (_a = metric == null ? void 0 : metric.kind) != null ? _a : "Unknown",
      name: (_b = metric == null ? void 0 : metric.name) != null ? _b : "Unknown",
      format: (_c = metricData == null ? void 0 : metricData.format) != null ? _c : "number",
      data: metricData
    }
  };
  const metricsByDate = data.metric.data ? data.metric.data.aggregation.reduce(groupByDate, {}) : {};
  const chartData = data.dailyCost.data.aggregation.slice().sort(aggregationSort).map((entry) => ({
    date: Date.parse(entry.date),
    trend: trendFrom(data.dailyCost.data.trendline, Date.parse(entry.date)),
    dailyCost: entry.amount,
    ...metric && data.metric.data ? { [data.metric.dataKey]: metricsByDate[`${entry.date}`] } : {}
  }));
  const tooltipRenderer = ({
    label,
    payload = []
  }) => {
    if (isInvalid({ label, payload }))
      return null;
    const dataKeys = [data.dailyCost.dataKey, data.metric.dataKey];
    const date = typeof label === "number" ? DateTime.fromMillis(label) : DateTime.fromISO(label);
    const title = date.toUTC().toFormat(DEFAULT_DATE_FORMAT);
    const items = payload.filter((p) => dataKeys.includes(p.dataKey)).map((p) => ({
      label: p.dataKey === data.dailyCost.dataKey ? data.dailyCost.name : data.metric.name,
      value: p.dataKey === data.dailyCost.dataKey ? formatGraphValue(p.value, data.dailyCost.format) : formatGraphValue(p.value, data.metric.format),
      fill: p.dataKey === data.dailyCost.dataKey ? theme.palette.blue : theme.palette.magenta
    }));
    return /* @__PURE__ */ React.createElement(BarChartTooltip, {
      title
    }, items.map((item, index) => /* @__PURE__ */ React.createElement(BarChartTooltipItem, {
      key: `${item.label}-${index}`,
      item
    })));
  };
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(CostOverviewLegend, {
    dailyCostData,
    metric,
    metricData
  }), /* @__PURE__ */ React.createElement(ResponsiveContainer, {
    width: responsive ? "100%" : styles.container.width,
    height: styles.container.height,
    className: "cost-overview-chart"
  }, /* @__PURE__ */ React.createElement(ComposedChart, {
    margin: styles.chart.margin,
    data: chartData
  }, /* @__PURE__ */ React.createElement(CartesianGrid, {
    stroke: styles.cartesianGrid.stroke
  }), /* @__PURE__ */ React.createElement(XAxis, {
    dataKey: "date",
    domain: ["dataMin", "dataMax"],
    tickFormatter: overviewGraphTickFormatter,
    tickCount: 6,
    type: "number",
    stroke: styles.axis.fill
  }), /* @__PURE__ */ React.createElement(YAxis, {
    domain: [() => 0, "dataMax"],
    tick: { fill: styles.axis.fill },
    tickFormatter: formatGraphValue,
    width: styles.yAxis.width,
    yAxisId: data.dailyCost.dataKey
  }), metric && /* @__PURE__ */ React.createElement(YAxis, {
    hide: true,
    domain: [() => 0, toDataMax(data.metric.dataKey, chartData)],
    width: styles.yAxis.width,
    yAxisId: data.metric.dataKey
  }), /* @__PURE__ */ React.createElement(Area, {
    dataKey: data.dailyCost.dataKey,
    isAnimationActive: false,
    fill: theme.palette.blue,
    fillOpacity: 0.4,
    stroke: "none",
    yAxisId: data.dailyCost.dataKey
  }), /* @__PURE__ */ React.createElement(Line, {
    activeDot: false,
    dataKey: "trend",
    dot: false,
    isAnimationActive: false,
    label: false,
    strokeWidth: 2,
    stroke: theme.palette.blue,
    yAxisId: data.dailyCost.dataKey
  }), metric && /* @__PURE__ */ React.createElement(Line, {
    dataKey: data.metric.dataKey,
    dot: false,
    isAnimationActive: false,
    label: false,
    strokeWidth: 2,
    stroke: theme.palette.magenta,
    yAxisId: data.metric.dataKey
  }), /* @__PURE__ */ React.createElement(Tooltip$1, {
    content: tooltipRenderer,
    animationDuration: 100
  }))));
};

const aggregationSum = (aggregation) => aggregation.reduce((total, curAgg) => total + curAgg.amount, 0);

const LOW_COST_THRESHOLD = 0.1;
const CostOverviewBreakdownChart = ({
  costBreakdown
}) => {
  const theme = useTheme();
  const classes = useCostOverviewStyles(theme);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const { duration } = useFilters(mapFiltersToProps);
  const [isExpanded, setExpanded] = useState(false);
  if (!costBreakdown) {
    return null;
  }
  const flattenedAggregation = costBreakdown.map((cost) => cost.aggregation).flat();
  const totalCost = aggregationSum(flattenedAggregation);
  const previousPeriodTotal = getPreviousPeriodTotalCost(flattenedAggregation, duration, lastCompleteBillingDate);
  const currentPeriodTotal = totalCost - previousPeriodTotal;
  const canExpand = costBreakdown.length >= 8;
  const otherCategoryIds = [];
  const breakdownsByDate = costBreakdown.reduce((breakdownByDate, breakdown) => {
    const breakdownTotal = aggregationSum(breakdown.aggregation);
    const isOtherCategory = canExpand && breakdownTotal < totalCost * LOW_COST_THRESHOLD;
    const updatedBreakdownByDate = { ...breakdownByDate };
    if (isOtherCategory) {
      otherCategoryIds.push(breakdown.id);
    }
    breakdown.aggregation.forEach((curAggregation) => {
      const costsForDate = updatedBreakdownByDate[curAggregation.date] || {};
      updatedBreakdownByDate[curAggregation.date] = {
        ...costsForDate,
        [breakdown.id]: (costsForDate[breakdown.id] || 0) + curAggregation.amount
      };
    });
    return updatedBreakdownByDate;
  }, {});
  const chartData = Object.keys(breakdownsByDate).map((date) => {
    const costsForDate = Object.keys(breakdownsByDate[date]).reduce((dateCosts, breakdown) => {
      const cost = breakdownsByDate[date][breakdown];
      const breakdownCost = !isExpanded && otherCategoryIds.includes(breakdown) ? { Other: (dateCosts.Other || 0) + cost } : { [breakdown]: cost };
      return { ...dateCosts, ...breakdownCost };
    }, {});
    return {
      ...costsForDate,
      date: Date.parse(date)
    };
  });
  const sortedBreakdowns = costBreakdown.sort((a, b) => aggregationSum(a.aggregation) - aggregationSum(b.aggregation));
  const renderAreas = () => {
    const separatedBreakdowns = sortedBreakdowns.filter((breakdown) => breakdown.id !== "Other" && !otherCategoryIds.includes(breakdown.id)).map((breakdown) => breakdown.id);
    const breakdownsToDisplay = isExpanded ? sortedBreakdowns.map((breakdown) => breakdown.id) : ["Other", ...separatedBreakdowns];
    return breakdownsToDisplay.map((breakdown, i) => {
      const color = theme.palette.dataViz[(breakdownsToDisplay.length - 1 - i) % (theme.palette.dataViz.length - 1)];
      return /* @__PURE__ */ React.createElement(Area, {
        key: breakdown,
        dataKey: breakdown,
        isAnimationActive: false,
        stackId: "1",
        stroke: color,
        fill: color,
        onClick: () => setExpanded(true),
        style: {
          cursor: breakdown === "Other" && !isExpanded ? "pointer" : null
        }
      });
    });
  };
  const tooltipRenderer = ({
    label,
    payload = []
  }) => {
    if (isInvalid({ label, payload }))
      return null;
    const date = typeof label === "number" ? DateTime.fromMillis(label) : DateTime.fromISO(label);
    const dateTitle = date.toUTC().toFormat(DEFAULT_DATE_FORMAT);
    const items = payload.map((p) => ({
      label: p.dataKey,
      value: formatGraphValue(p.value),
      fill: p.fill
    }));
    const expandText = /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Divider, {
      style: {
        backgroundColor: emphasize(theme.palette.divider, 1),
        margin: "10px 0"
      }
    }), /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(FullScreenIcon, null), /* @__PURE__ */ React.createElement(Typography, null, "Click to expand")));
    return /* @__PURE__ */ React.createElement(BarChartTooltip, {
      title: dateTitle
    }, items.reverse().map((item, index) => /* @__PURE__ */ React.createElement(BarChartTooltipItem, {
      key: `${item.label}-${index}`,
      item
    })), canExpand && !isExpanded ? expandText : null);
  };
  const options = {
    previousName: formatPeriod(duration, lastCompleteBillingDate, false),
    currentName: formatPeriod(duration, lastCompleteBillingDate, true),
    hideMarker: true
  };
  return /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row"
  }, /* @__PURE__ */ React.createElement(BarChartLegend, {
    costStart: previousPeriodTotal,
    costEnd: currentPeriodTotal,
    options
  })), /* @__PURE__ */ React.createElement(ResponsiveContainer, {
    width: classes.container.width,
    height: classes.container.height
  }, /* @__PURE__ */ React.createElement(AreaChart, {
    data: chartData,
    margin: {
      top: 16,
      right: 30,
      bottom: 40
    }
  }, /* @__PURE__ */ React.createElement(CartesianGrid, {
    stroke: classes.cartesianGrid.stroke
  }), /* @__PURE__ */ React.createElement(XAxis, {
    dataKey: "date",
    domain: ["dataMin", "dataMax"],
    tickFormatter: overviewGraphTickFormatter,
    tickCount: 6,
    type: "number",
    stroke: classes.axis.fill
  }), /* @__PURE__ */ React.createElement(YAxis, {
    domain: [() => 0, "dataMax"],
    tick: { fill: classes.axis.fill },
    tickFormatter: formatGraphValue,
    width: classes.yAxis.width
  }), renderAreas(), /* @__PURE__ */ React.createElement(Tooltip$1, {
    content: tooltipRenderer,
    animationDuration: 100
  }))));
};

const CostOverviewHeader = ({
  title,
  subtitle,
  children
}) => /* @__PURE__ */ React.createElement(Box, {
  mt: 2,
  ml: 1,
  mb: 1,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
}, /* @__PURE__ */ React.createElement(Box, {
  minHeight: 40,
  paddingRight: 5
}, /* @__PURE__ */ React.createElement(Typography, {
  variant: "h5",
  gutterBottom: true
}, title), !!subtitle && /* @__PURE__ */ React.createElement(Typography, {
  variant: "subtitle2",
  color: "textSecondary",
  component: "div"
}, subtitle)), /* @__PURE__ */ React.createElement(Box, {
  minHeight: 40,
  maxHeight: 60,
  display: "flex"
}, children));

const MetricSelect = ({
  metric,
  metrics,
  onSelect
}) => {
  const classes = useSelectStyles();
  function onChange(e) {
    if (e.target.value === "none") {
      onSelect(null);
    } else {
      onSelect(e.target.value);
    }
  }
  return /* @__PURE__ */ React.createElement(FormControl, {
    variant: "outlined"
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    shrink: true,
    id: "metric-select-label"
  }, "Compare to:"), /* @__PURE__ */ React.createElement(Select, {
    id: "metric-select",
    labelId: "metric-select-label",
    labelWidth: 100,
    className: classes.select,
    value: metric != null ? metric : "none",
    onChange
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    className: classes.menuItem,
    key: "none",
    value: "none"
  }, /* @__PURE__ */ React.createElement("em", null, "None")), metrics.map((m) => /* @__PURE__ */ React.createElement(MenuItem, {
    className: classes.menuItem,
    key: m.kind,
    value: m.kind
  }, /* @__PURE__ */ React.createElement("b", null, m.name)))));
};

function getDefaultOptions(lastCompleteBillingDate) {
  return [
    {
      value: Duration.P90D,
      label: "Past 6 Months"
    },
    {
      value: Duration.P30D,
      label: "Past 60 Days"
    },
    {
      value: Duration.P3M,
      label: formatLastTwoLookaheadQuarters(lastCompleteBillingDate)
    }
  ];
}
const PeriodSelect = ({
  duration,
  onSelect,
  options
}) => {
  const classes = useSelectStyles();
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const optionsOrDefault = options != null ? options : getDefaultOptions(lastCompleteBillingDate);
  const handleOnChange = (e) => {
    onSelect(e.target.value);
  };
  const renderValue = (value) => {
    const option = findAlways(optionsOrDefault, (o) => o.value === value);
    return /* @__PURE__ */ React.createElement("b", null, option.label);
  };
  return /* @__PURE__ */ React.createElement(Select, {
    className: classes.select,
    variant: "outlined",
    onChange: handleOnChange,
    value: duration,
    renderValue,
    "data-testid": "period-select"
  }, optionsOrDefault.map((option) => /* @__PURE__ */ React.createElement(MenuItem, {
    className: classes.menuItem,
    key: option.value,
    value: option.value,
    "data-testid": `period-select-option-${option.value}`
  }, option.label)));
};

const CostOverviewCard = ({
  dailyCostData,
  metricData
}) => {
  var _a;
  const theme = useTheme();
  const styles = useOverviewTabsStyles(theme);
  const config = useConfig();
  const [tabIndex, setTabIndex] = useState(0);
  const { setDuration, setProject, setMetric, ...filters } = useFilters(mapFiltersToProps);
  useEffect(() => {
    var _a2;
    const lastIndex = Object.keys((_a2 = dailyCostData.groupedCosts) != null ? _a2 : {}).length;
    if (tabIndex > lastIndex) {
      setTabIndex(0);
    }
  }, [dailyCostData, tabIndex, setTabIndex]);
  const metric = filters.metric ? findAlways(config.metrics, (m) => m.kind === filters.metric) : null;
  const breakdownTabs = Object.keys((_a = dailyCostData.groupedCosts) != null ? _a : {}).map((key) => ({
    id: key,
    label: `Breakdown by ${key}`,
    title: `Cloud Cost By ${capitalize(key)}`
  }));
  const tabs = [
    { id: "overview", label: "Total cost", title: "Cloud Cost" }
  ].concat(breakdownTabs);
  const safeTabIndex = tabIndex > tabs.length - 1 ? 0 : tabIndex;
  const OverviewTabs = () => {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Tabs, {
      indicatorColor: "primary",
      onChange: (_, index) => setTabIndex(index),
      value: safeTabIndex
    }, tabs.map((tab, index) => /* @__PURE__ */ React.createElement(Tab, {
      className: styles.default,
      label: tab.label,
      key: tab.id,
      value: index,
      classes: { selected: styles.selected }
    }))));
  };
  const showMetricSelect = config.metrics.length && safeTabIndex === 0;
  return /* @__PURE__ */ React.createElement(Card, {
    style: { position: "relative", overflow: "visible" }
  }, /* @__PURE__ */ React.createElement(ScrollAnchor, {
    id: DefaultNavigation.CostOverviewCard
  }), /* @__PURE__ */ React.createElement(CardContent, null, dailyCostData.groupedCosts && /* @__PURE__ */ React.createElement(OverviewTabs, null), /* @__PURE__ */ React.createElement(CostOverviewHeader, {
    title: tabs[safeTabIndex].title
  }, /* @__PURE__ */ React.createElement(PeriodSelect, {
    duration: filters.duration,
    onSelect: setDuration
  })), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(Box, {
    ml: 2,
    my: 1,
    display: "flex",
    flexDirection: "column"
  }, safeTabIndex === 0 ? /* @__PURE__ */ React.createElement(CostOverviewChart, {
    dailyCostData,
    metric,
    metricData
  }) : /* @__PURE__ */ React.createElement(CostOverviewBreakdownChart, {
    costBreakdown: dailyCostData.groupedCosts[tabs[safeTabIndex].id]
  })), /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
  }, showMetricSelect && /* @__PURE__ */ React.createElement(MetricSelect, {
    metric: filters.metric,
    metrics: config.metrics,
    onSelect: setMetric
  }))));
};

const mapLoadingToProps$2 = ({ dispatch }) => (isLoading) => dispatch({ [DefaultLoadingAction.CostInsightsProducts]: isLoading });
const ProductInsightsCard = ({
  initialState,
  product,
  onSelectAsync
}) => {
  const classes = useProductInsightsCardStyles();
  const mountedRef = useRef(false);
  const [error, setError] = useState(null);
  const dispatchLoading = useLoading(mapLoadingToProps$2);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const [entity, setEntity] = useState(initialState.entity);
  const [duration, setDuration] = useState(initialState.duration);
  const dispatchLoadingProduct = useCallback(dispatchLoading, []);
  useEffect(() => {
    async function handleOnSelectAsync() {
      dispatchLoadingProduct(true);
      try {
        const e = await onSelectAsync(product, duration);
        setEntity(e);
      } catch (e) {
        setEntity(null);
        setError(e);
      } finally {
        dispatchLoadingProduct(false);
      }
    }
    if (mountedRef.current) {
      handleOnSelectAsync();
    } else {
      mountedRef.current = true;
    }
  }, [product, duration, onSelectAsync, dispatchLoadingProduct]);
  const entityKey = findAnyKey(entity == null ? void 0 : entity.entities);
  const entities = entityKey ? entity.entities[entityKey] : [];
  const subheader = entityKey && entities.length ? `${pluralize(entityKey, entities.length, true)}, sorted by cost` : null;
  const headerProps = {
    classes,
    action: /* @__PURE__ */ React.createElement(PeriodSelect, {
      duration,
      onSelect: setDuration
    })
  };
  if (error || !entity) {
    return /* @__PURE__ */ React.createElement(InfoCard, {
      title: product.name,
      headerProps
    }, /* @__PURE__ */ React.createElement(ScrollAnchor, {
      id: product.kind
    }), /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error ? error.message : `Error: Could not fetch product insights for ${product.name}`));
  }
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: product.name,
    subheader,
    headerProps
  }, /* @__PURE__ */ React.createElement(ScrollAnchor, {
    id: product.kind
  }), entities.length ? /* @__PURE__ */ React.createElement(ProductInsightsChart, {
    entity,
    duration,
    billingDate: lastCompleteBillingDate
  }) : /* @__PURE__ */ React.createElement(Typography, null, "There are no ", product.name, " costs within this time frame for your team's projects."));
};

const ProductInsightsCardList = ({
  initialStates,
  onSelectAsync
}) => {
  if (!initialStates.length) {
    return /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(CircularProgress, null));
  }
  return /* @__PURE__ */ React.createElement(Collapse, {
    in: true,
    timeout: 1e3
  }, initialStates.map(({ product, entity, duration }) => /* @__PURE__ */ React.createElement(Box, {
    key: product.kind,
    mb: 6,
    position: "relative",
    "data-testid": `product-list-item-${product.kind}`
  }, /* @__PURE__ */ React.createElement(ProductInsightsCard, {
    product,
    onSelectAsync,
    initialState: { entity, duration }
  }))));
};

const mapLoadingToProps$1 = ({ dispatch }) => (isLoading) => dispatch({ [DefaultLoadingAction.CostInsightsProducts]: isLoading });
const ProductInsights = ({
  group,
  project,
  products,
  onLoaded
}) => {
  const client = useApi(costInsightsApiRef);
  const onceRef = useRef(false);
  const [initialStates, setStates] = useState([]);
  const [error, setError] = useState(null);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const dispatchLoading = useLoading(mapLoadingToProps$1);
  const dispatchLoadingProducts = useCallback(dispatchLoading, []);
  const onSelectAsyncMemo = useCallback(async function onSelectAsync(product, duration) {
    return client.getProductInsights({
      group,
      project,
      product: product.kind,
      intervals: intervalsOf(duration, lastCompleteBillingDate)
    });
  }, [client, group, project, lastCompleteBillingDate]);
  useEffect(() => {
    async function getAllProductInsights() {
      try {
        dispatchLoadingProducts(true);
        const responses = await Promise.allSettled(products.map((product) => client.getProductInsights({
          group,
          project,
          product: product.kind,
          intervals: intervalsOf(DEFAULT_DURATION, lastCompleteBillingDate)
        }))).then(settledResponseOf);
        const updatedInitialStates = initialStatesOf(products, responses).sort(totalAggregationSort);
        setStates(updatedInitialStates);
      } catch (e) {
        setError(e);
      } finally {
        dispatchLoadingProducts(false);
      }
    }
    getAllProductInsights();
  }, [
    client,
    group,
    project,
    products,
    lastCompleteBillingDate,
    dispatchLoadingProducts
  ]);
  useEffect(function handleOnLoaded() {
    if (onceRef.current) {
      const initialProducts = initialStates.map((state) => state.product);
      onLoaded(initialProducts);
    } else {
      onceRef.current = true;
    }
  }, [initialStates, onLoaded]);
  return /* @__PURE__ */ React.createElement(Box, {
    px: 3,
    py: 6
  }, /* @__PURE__ */ React.createElement(Box, {
    mt: 0,
    mb: 5,
    textAlign: "center"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4",
    gutterBottom: true
  }, "Your team's product usage")), error ? /* @__PURE__ */ React.createElement(Alert, {
    severity: "error"
  }, error.message) : /* @__PURE__ */ React.createElement(ProductInsightsCardList, {
    initialStates,
    onSelectAsync: onSelectAsyncMemo
  }));
};

const mapLoadingToProps = ({ state, actions, dispatch }) => ({
  loadingActions: actions,
  loadingGroups: state[DefaultLoadingAction.UserGroups],
  loadingBillingDate: state[DefaultLoadingAction.LastCompleteBillingDate],
  loadingInitial: state[DefaultLoadingAction.CostInsightsInitial],
  dispatchInitial: (isLoading) => dispatch({ [DefaultLoadingAction.CostInsightsInitial]: isLoading }),
  dispatchInsights: (isLoading) => dispatch({ [DefaultLoadingAction.CostInsightsPage]: isLoading }),
  dispatchNone: (loadingActions) => dispatch(getResetState(loadingActions)),
  dispatchReset: (loadingActions) => dispatch(getResetStateWithoutInitial(loadingActions))
});

const ProjectSelect = ({
  project,
  projects,
  onSelect
}) => {
  const classes = useSelectStyles();
  const projectOptions = projects.filter((p) => p.id).sort((a, b) => {
    var _a, _b;
    return ((_a = a.name) != null ? _a : a.id).localeCompare((_b = b.name) != null ? _b : b.id);
  });
  const handleOnChange = (e) => {
    onSelect(e.target.value);
  };
  const renderValue = (value) => {
    var _a;
    const proj = value;
    const projectObj = projects.find((p) => p.id === proj);
    return /* @__PURE__ */ React.createElement("b", {
      "data-testid": `selected-${proj}`
    }, proj === "all" ? "All Projects" : (_a = projectObj == null ? void 0 : projectObj.name) != null ? _a : proj);
  };
  return /* @__PURE__ */ React.createElement(Select, {
    className: classes.select,
    variant: "outlined",
    value: project != null ? project : "all",
    renderValue,
    onChange: handleOnChange,
    "data-testid": "project-filter-select"
  }, [{ id: "all" }, ...projectOptions].map((proj) => {
    var _a;
    return /* @__PURE__ */ React.createElement(MenuItem, {
      className: `${classes.menuItem} compact`,
      key: proj.id,
      value: proj.id,
      "data-testid": `option-${proj.id}`
    }, proj.id === "all" ? "All Projects" : (_a = proj.name) != null ? _a : proj.id);
  }));
};

const CostInsightsPage = () => {
  const classes = useSubtleTypographyStyles();
  const client = useApi(costInsightsApiRef);
  const config = useConfig();
  const groups = useGroups();
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const [alerts, setAlerts] = useState([]);
  const [currency, setCurrency] = useCurrency();
  const [projects, setProjects] = useState(null);
  const [products, setProducts] = useState(null);
  const [dailyCost, setDailyCost] = useState(null);
  const [metricData, setMetricData] = useState(null);
  const [error, setError] = useState(null);
  const { pageFilters, setPageFilters } = useFilters((p) => p);
  const active = useMemo(() => alerts.filter(isAlertActive), [alerts]);
  const snoozed = useMemo(() => alerts.filter(isAlertSnoozed), [alerts]);
  const accepted = useMemo(() => alerts.filter(isAlertAccepted), [alerts]);
  const dismissed = useMemo(() => alerts.filter(isAlertDismissed), [alerts]);
  const isActionItemsDisplayed = !!active.length;
  const isAlertInsightsDisplayed = !!alerts.length;
  const {
    loadingActions,
    loadingGroups,
    loadingBillingDate,
    loadingInitial,
    dispatchInitial,
    dispatchInsights,
    dispatchNone,
    dispatchReset
  } = useLoading(mapLoadingToProps);
  const dispatchLoadingInitial = useCallback(dispatchInitial, []);
  const dispatchLoadingInsights = useCallback(dispatchInsights, []);
  const dispatchLoadingNone = useCallback(dispatchNone, []);
  const dispatchLoadingReset = useCallback(dispatchReset, []);
  const setProject = (project) => setPageFilters({
    ...pageFilters,
    project: project === "all" ? null : project
  });
  useEffect(() => {
    async function getInsights() {
      setError(null);
      try {
        if (pageFilters.group) {
          dispatchLoadingInsights(true);
          const intervals = intervalsOf(pageFilters.duration, lastCompleteBillingDate);
          const [
            fetchedProjects,
            fetchedAlerts,
            fetchedMetricData,
            fetchedDailyCost
          ] = await Promise.all([
            client.getGroupProjects(pageFilters.group),
            client.getAlerts(pageFilters.group),
            pageFilters.metric ? client.getDailyMetricData(pageFilters.metric, intervals) : null,
            pageFilters.project ? client.getProjectDailyCost(pageFilters.project, intervals) : client.getGroupDailyCost(pageFilters.group, intervals)
          ]);
          setProjects(fetchedProjects);
          setAlerts(fetchedAlerts);
          setMetricData(fetchedMetricData);
          setDailyCost(fetchedDailyCost);
        } else {
          dispatchLoadingNone(loadingActions);
        }
      } catch (e) {
        setError(e);
        dispatchLoadingNone(loadingActions);
      } finally {
        dispatchLoadingInitial(false);
        dispatchLoadingInsights(false);
      }
    }
    if (!(loadingGroups && loadingBillingDate)) {
      getInsights();
    }
  }, [
    client,
    pageFilters,
    loadingActions,
    loadingGroups,
    loadingBillingDate,
    dispatchLoadingInsights,
    dispatchLoadingInitial,
    dispatchLoadingNone,
    lastCompleteBillingDate
  ]);
  if (loadingInitial) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, error.message);
  }
  if (!pageFilters.group) {
    return /* @__PURE__ */ React.createElement(CostInsightsLayout, {
      groups
    }, /* @__PURE__ */ React.createElement(Box, {
      textAlign: "right"
    }, /* @__PURE__ */ React.createElement(CopyUrlToClipboard, null)), /* @__PURE__ */ React.createElement(Container, {
      maxWidth: "lg"
    }, /* @__PURE__ */ React.createElement(CostInsightsHeaderNoGroups, null)), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(Container, {
      maxWidth: "lg"
    }, /* @__PURE__ */ React.createElement(WhyCostsMatter, null)));
  }
  if (!dailyCost) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, `Error: Could not fetch cost insights data for team ${pageFilters.group}`);
  }
  const onProjectSelect = (project) => {
    setProject(project);
    dispatchLoadingReset(loadingActions);
  };
  const CostOverviewBanner = () => /* @__PURE__ */ React.createElement(Box, {
    px: 3,
    pt: 6,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h4"
  }, "Cost Overview"), /* @__PURE__ */ React.createElement(Typography, {
    classes
  }, "Billing data as of ", lastCompleteBillingDate)), /* @__PURE__ */ React.createElement(Box, {
    display: "flex"
  }, /* @__PURE__ */ React.createElement(Box, {
    mr: 1
  }, /* @__PURE__ */ React.createElement(CurrencySelect, {
    currency,
    currencies: config.currencies,
    onSelect: setCurrency
  })), /* @__PURE__ */ React.createElement(ProjectSelect, {
    project: pageFilters.project,
    projects: projects || [],
    onSelect: onProjectSelect
  })));
  return /* @__PURE__ */ React.createElement(CostInsightsLayout, {
    groups
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    wrap: "nowrap"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true
  }, /* @__PURE__ */ React.createElement(Box, {
    position: "sticky",
    top: 20
  }, /* @__PURE__ */ React.createElement(CostInsightsNavigation, {
    products,
    alerts: active.length
  }))), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    mb: 2
  }, /* @__PURE__ */ React.createElement(CopyUrlToClipboard, null)), /* @__PURE__ */ React.createElement(Container, {
    maxWidth: "lg",
    disableGutters: true
  }, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "column"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(CostInsightsHeader, {
    owner: pageFilters.group,
    groups,
    hasCostData: !!dailyCost.aggregation.length,
    alerts: active.length
  })), /* @__PURE__ */ React.createElement(Collapse, {
    in: isActionItemsDisplayed,
    enter: false
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(Box, {
    px: 3,
    py: 6
  }, /* @__PURE__ */ React.createElement(ActionItems, {
    active,
    snoozed,
    accepted,
    dismissed
  }))), /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(CostOverviewBanner, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(Box, {
    px: 3,
    py: 6
  }, !!dailyCost.aggregation.length && /* @__PURE__ */ React.createElement(CostOverviewCard, {
    dailyCostData: dailyCost,
    metricData
  }), /* @__PURE__ */ React.createElement(WhyCostsMatter, null))), /* @__PURE__ */ React.createElement(Collapse, {
    in: isAlertInsightsDisplayed,
    enter: false
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(Box, {
    px: 6,
    py: 6,
    mx: -3,
    bgcolor: "alertBackground"
  }, /* @__PURE__ */ React.createElement(AlertInsights, {
    group: pageFilters.group,
    active,
    snoozed,
    accepted,
    dismissed,
    onChange: setAlerts
  })))), !isAlertInsightsDisplayed && /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: true
  }, /* @__PURE__ */ React.createElement(Box, {
    px: 3,
    py: 6
  }, /* @__PURE__ */ React.createElement(ProductInsights, {
    group: pageFilters.group,
    project: pageFilters.project,
    products: config.products,
    onLoaded: setProducts
  }))))))));
};

const CostInsightsPageRoot = () => /* @__PURE__ */ React.createElement(CostInsightsThemeProvider, null, /* @__PURE__ */ React.createElement(ConfigProvider, null, /* @__PURE__ */ React.createElement(LoadingProvider, null, /* @__PURE__ */ React.createElement(GroupsProvider, null, /* @__PURE__ */ React.createElement(BillingDateProvider, null, /* @__PURE__ */ React.createElement(FilterProvider, null, /* @__PURE__ */ React.createElement(ScrollProvider, null, /* @__PURE__ */ React.createElement(CurrencyProvider, null, /* @__PURE__ */ React.createElement(CostInsightsPage, null)))))))));

export { CostInsightsPageRoot as CostInsightsPage };
//# sourceMappingURL=index-240fdf67.esm.js.map
