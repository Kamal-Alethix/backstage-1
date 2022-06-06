import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, configApiRef, createRoutableExtension, createComponentExtension, useApi, alertApiRef } from '@backstage/core-plugin-api';
import React, { useEffect, useState, useCallback } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Button, makeStyles, ListItem, ListItemIcon, ListItemText, Typography, ListItemSecondaryAction, Tooltip, IconButton, createStyles, List, ListSubheader, Grid, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem, TextField, DialogActions, CircularProgress, Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import WebIcon from '@material-ui/icons/Web';
import { Alert } from '@material-ui/lab';
import { EmptyState, StatusWarning, Progress, StatusOK, StatusError, MissingAnnotationEmptyState, HeaderIconLinkRow } from '@backstage/core-components';
import Avatar from '@material-ui/core/Avatar';
import EmailIcon from '@material-ui/icons/Email';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { DateTime, Duration } from 'luxon';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import EmptyStateImage from '../assets/emptystate.svg';

class UnauthorizedError extends Error {
}
const splunkOnCallApiRef = createApiRef({
  id: "plugin.splunk-on-call.api"
});
class SplunkOnCallClient {
  constructor(config) {
    this.config = config;
  }
  static fromConfig(configApi, discoveryApi) {
    const eventsRestEndpoint = configApi.getOptionalString("splunkOnCall.eventsRestEndpoint") || null;
    return new SplunkOnCallClient({
      eventsRestEndpoint,
      discoveryApi
    });
  }
  async getIncidents() {
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/splunk-on-call/v1/incidents`;
    const { incidents } = await this.getByUrl(url);
    return incidents;
  }
  async getOnCallUsers() {
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/splunk-on-call/v1/oncall/current`;
    const { teamsOnCall } = await this.getByUrl(url);
    return teamsOnCall;
  }
  async getTeams() {
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/splunk-on-call/v1/team`;
    const teams = await this.getByUrl(url);
    return teams;
  }
  async getRoutingKeys() {
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/splunk-on-call/v1/org/routing-keys`;
    const { routingKeys } = await this.getByUrl(url);
    return routingKeys;
  }
  async getUsers() {
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/splunk-on-call/v2/user`;
    const { users } = await this.getByUrl(url);
    return users;
  }
  async getEscalationPolicies() {
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/splunk-on-call/v1/policies`;
    const { policies } = await this.getByUrl(url);
    return policies;
  }
  async incidentAction({
    routingKey,
    incidentType,
    incidentId,
    incidentDisplayName,
    incidentMessage,
    incidentStartTime
  }) {
    const body = JSON.stringify({
      message_type: incidentType,
      ...incidentId ? { entity_id: incidentId } : {},
      ...incidentDisplayName ? { entity_display_name: incidentDisplayName } : {},
      ...incidentMessage ? { state_message: incidentMessage } : {},
      ...incidentStartTime ? { state_start_time: incidentStartTime } : {}
    });
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body
    };
    const url = `${this.config.eventsRestEndpoint}/${routingKey}`;
    return this.request(url, options);
  }
  async getByUrl(url) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const response = await this.request(url, options);
    return response.json();
  }
  async request(url, options) {
    const response = await fetch(url, options);
    if (response.status === 403) {
      throw new UnauthorizedError();
    }
    if (!response.ok) {
      const payload = await response.json();
      const errors = payload.errors.map((error) => error).join(" ");
      const message = `Request failed with ${response.status}, ${errors}`;
      throw new Error(message);
    }
    return response;
  }
}

const rootRouteRef = createRouteRef({ id: "splunk-on-call" });
const splunkOnCallPlugin = createPlugin({
  id: "splunk-on-call",
  apis: [
    createApiFactory({
      api: splunkOnCallApiRef,
      deps: { discoveryApi: discoveryApiRef, configApi: configApiRef },
      factory: ({ configApi, discoveryApi }) => SplunkOnCallClient.fromConfig(configApi, discoveryApi)
    })
  ],
  routes: {
    root: rootRouteRef
  }
});
const SplunkOnCallPage = splunkOnCallPlugin.provide(createRoutableExtension({
  name: "SplunkOnCallPage",
  component: () => import('./SplunkOnCallPage-29d77bf1.esm.js').then((m) => m.SplunkOnCallPage),
  mountPoint: rootRouteRef
}));
const EntitySplunkOnCallCard$2 = splunkOnCallPlugin.provide(createComponentExtension({
  name: "EntitySplunkOnCallCard",
  component: {
    lazy: () => Promise.resolve().then(function () { return EntitySplunkOnCallCard$1; }).then((m) => m.EntitySplunkOnCallCard)
  }
}));

const MissingApiKeyOrApiIdError = () => /* @__PURE__ */ React.createElement(EmptyState, {
  missing: "info",
  title: "Missing or invalid Splunk On-Call API key and/or API id",
  description: "The request to fetch data needs a valid api id and a valid api key. See README for more details.",
  action: /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    variant: "contained",
    href: "https://github.com/backstage/backstage/blob/master/plugins/splunk-on-call/README.md"
  }, "Read More")
});

const useStyles$6 = makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});
const EscalationUsersEmptyState = () => {
  const classes = useStyles$6();
  return /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement("div", {
    className: classes.denseListIcon
  }, /* @__PURE__ */ React.createElement(StatusWarning, null))), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "Empty escalation policy"
  }));
};

const useStyles$5 = makeStyles({
  listItemPrimary: {
    fontWeight: "bold"
  }
});
const EscalationUser = ({ user }) => {
  const classes = useStyles$5();
  return /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Avatar, {
    alt: "User"
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(Typography, {
      className: classes.listItemPrimary
    }, user.firstName, " ", user.lastName),
    secondary: user.email
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Send e-mail to user",
    placement: "top"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    href: `mailto:${user.email}`
  }, /* @__PURE__ */ React.createElement(EmailIcon, {
    color: "primary"
  })))));
};

const useStyles$4 = makeStyles((theme) => createStyles({
  root: {
    maxHeight: "400px",
    overflow: "auto"
  },
  subheader: {
    backgroundColor: theme.palette.background.paper
  },
  progress: {
    margin: `0 ${theme.spacing(2)}px`
  }
}));
const EscalationPolicy = ({ users, team }) => {
  const classes = useStyles$4();
  const api = useApi(splunkOnCallApiRef);
  const {
    value: userNames,
    loading,
    error
  } = useAsync(async () => {
    const oncalls = await api.getOnCallUsers();
    const teamUsernames = oncalls.filter((oncall) => {
      var _a;
      return ((_a = oncall.team) == null ? void 0 : _a.name) === team;
    }).flatMap((oncall) => {
      var _a;
      return (_a = oncall.oncallNow) == null ? void 0 : _a.flatMap((oncallNow) => {
        var _a2;
        return (_a2 = oncallNow.users) == null ? void 0 : _a2.flatMap((user) => {
          var _a3;
          return (_a3 = user == null ? void 0 : user.onCalluser) == null ? void 0 : _a3.username;
        });
      });
    });
    return teamUsernames;
  });
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching information. ", error.message);
  }
  if (!loading && !(userNames == null ? void 0 : userNames.length)) {
    return /* @__PURE__ */ React.createElement(EscalationUsersEmptyState, null);
  }
  return /* @__PURE__ */ React.createElement(List, {
    className: classes.root,
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, {
      className: classes.subheader
    }, "ON CALL")
  }, loading ? /* @__PURE__ */ React.createElement(Progress, {
    className: classes.progress
  }) : userNames && userNames.map((userName, index) => userName && userName in users && /* @__PURE__ */ React.createElement(EscalationUser, {
    key: index,
    user: users[userName]
  })));
};

const useStyles$3 = makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  listItemPrimary: {
    fontWeight: "bold"
  },
  listItemIcon: {
    minWidth: "1em"
  },
  secondaryAction: {
    paddingRight: 48
  }
});
const IncidentPhaseStatus = ({
  currentPhase
}) => {
  switch (currentPhase) {
    case "UNACKED":
      return /* @__PURE__ */ React.createElement(StatusError, null);
    case "ACKED":
      return /* @__PURE__ */ React.createElement(StatusWarning, null);
    default:
      return /* @__PURE__ */ React.createElement(StatusOK, null);
  }
};
const incidentPhaseTooltip = (currentPhase) => {
  switch (currentPhase) {
    case "UNACKED":
      return "Triggered";
    case "ACKED":
      return "Acknowledged";
    default:
      return "Resolved";
  }
};
const IncidentAction = ({
  currentPhase,
  incidentId,
  resolveAction,
  acknowledgeAction
}) => {
  switch (currentPhase) {
    case "UNACKED":
      return /* @__PURE__ */ React.createElement(Tooltip, {
        title: "Acknowledge",
        placement: "top"
      }, /* @__PURE__ */ React.createElement(IconButton, {
        onClick: () => acknowledgeAction({ incidentId, incidentType: "ACKNOWLEDGEMENT" })
      }, /* @__PURE__ */ React.createElement(DoneIcon, null)));
    case "ACKED":
      return /* @__PURE__ */ React.createElement(Tooltip, {
        title: "Resolve",
        placement: "top"
      }, /* @__PURE__ */ React.createElement(IconButton, {
        onClick: () => resolveAction({ incidentId, incidentType: "RECOVERY" })
      }, /* @__PURE__ */ React.createElement(DoneAllIcon, null)));
    default:
      return /* @__PURE__ */ React.createElement(React.Fragment, null);
  }
};
const IncidentListItem = ({
  incident,
  readOnly,
  onIncidentAction,
  team
}) => {
  var _a;
  const classes = useStyles$3();
  const duration = new Date().getTime() - new Date(incident.startTime).getTime();
  const createdAt = DateTime.local().minus(Duration.fromMillis(duration)).toRelative({ locale: "en" });
  const alertApi = useApi(alertApiRef);
  const api = useApi(splunkOnCallApiRef);
  const hasBeenManuallyTriggered = (_a = incident.monitorName) == null ? void 0 : _a.includes("vouser-");
  const source = () => {
    var _a2;
    if (hasBeenManuallyTriggered) {
      return (_a2 = incident.monitorName) == null ? void 0 : _a2.replace("vouser-", "");
    }
    if (incident.monitorType === "API") {
      return "{ REST }";
    }
    return incident.monitorName;
  };
  const [{ value: resolveValue, error: resolveError }, handleResolveIncident] = useAsyncFn(async ({ incidentId, incidentType }) => await api.incidentAction({
    routingKey: team,
    incidentType,
    incidentId
  }));
  const [
    { value: acknowledgeValue, error: acknowledgeError },
    handleAcknowledgeIncident
  ] = useAsyncFn(async ({ incidentId, incidentType }) => await api.incidentAction({
    routingKey: team,
    incidentType,
    incidentId
  }));
  useEffect(() => {
    if (acknowledgeValue) {
      alertApi.post({
        message: `Incident successfully acknowledged`
      });
    }
    if (resolveValue) {
      alertApi.post({
        message: `Incident successfully resolved`
      });
    }
    if (resolveValue || acknowledgeValue) {
      onIncidentAction();
    }
  }, [acknowledgeValue, resolveValue, alertApi, onIncidentAction]);
  if (acknowledgeError) {
    alertApi.post({
      message: `Failed to acknowledge incident. ${acknowledgeError.message}`,
      severity: "error"
    });
  }
  if (resolveError) {
    alertApi.post({
      message: `Failed to resolve incident. ${resolveError.message}`,
      severity: "error"
    });
  }
  return /* @__PURE__ */ React.createElement(ListItem, {
    dense: true,
    key: incident.entityId
  }, /* @__PURE__ */ React.createElement(ListItemIcon, {
    className: classes.listItemIcon
  }, /* @__PURE__ */ React.createElement(Tooltip, {
    title: incidentPhaseTooltip(incident.currentPhase),
    placement: "top"
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.denseListIcon
  }, /* @__PURE__ */ React.createElement(IncidentPhaseStatus, {
    currentPhase: incident.currentPhase
  })))), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: incident.entityDisplayName,
    primaryTypographyProps: {
      variant: "body1",
      className: classes.listItemPrimary
    },
    secondary: /* @__PURE__ */ React.createElement(Typography, {
      noWrap: true,
      variant: "body2",
      color: "textSecondary"
    }, "#", incident.incidentNumber, " - Created ", createdAt, " ", source() && `by ${source()}`)
  }), incident.incidentLink && incident.incidentNumber && /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, !readOnly && /* @__PURE__ */ React.createElement(IncidentAction, {
    currentPhase: incident.currentPhase || "",
    incidentId: incident.entityId,
    resolveAction: handleResolveIncident,
    acknowledgeAction: handleAcknowledgeIncident
  }), /* @__PURE__ */ React.createElement(Tooltip, {
    title: "View in Splunk On-Call",
    placement: "top"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    href: incident.incidentLink,
    target: "_blank",
    rel: "noopener noreferrer",
    color: "primary"
  }, /* @__PURE__ */ React.createElement(OpenInBrowserIcon, null)))));
};

const IncidentsEmptyState = () => {
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justifyContent: "center",
    direction: "column",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "Nice! No incidents found!")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement("img", {
    src: EmptyStateImage,
    alt: "EmptyState",
    "data-testid": "emptyStateImg"
  })));
};

const useStyles$2 = makeStyles((theme) => createStyles({
  root: {
    maxHeight: "400px",
    overflow: "auto"
  },
  subheader: {
    backgroundColor: theme.palette.background.paper
  },
  progress: {
    margin: `0 ${theme.spacing(2)}px`
  }
}));
const Incidents = ({ readOnly, refreshIncidents, team }) => {
  const classes = useStyles$2();
  const api = useApi(splunkOnCallApiRef);
  const [{ value: incidents, loading, error }, getIncidents] = useAsyncFn(async () => {
    var _a;
    await new Promise((resolve) => setTimeout(resolve, 2e3));
    const allIncidents = await api.getIncidents();
    const teams = await api.getTeams();
    const teamSlug = (_a = teams.find((teamValue) => teamValue.name === team)) == null ? void 0 : _a.slug;
    const filteredIncidents = teamSlug ? allIncidents.filter((incident) => {
      var _a2;
      return (_a2 = incident.pagedTeams) == null ? void 0 : _a2.includes(teamSlug);
    }) : [];
    return filteredIncidents;
  });
  useEffect(() => {
    getIncidents();
  }, [refreshIncidents, getIncidents]);
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching information. ", error.message);
  }
  if (!loading && !(incidents == null ? void 0 : incidents.length)) {
    return /* @__PURE__ */ React.createElement(IncidentsEmptyState, null);
  }
  return /* @__PURE__ */ React.createElement(List, {
    className: classes.root,
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, {
      className: classes.subheader
    }, "CRITICAL INCIDENTS")
  }, loading ? /* @__PURE__ */ React.createElement(Progress, {
    className: classes.progress
  }) : incidents.map((incident, index) => /* @__PURE__ */ React.createElement(IncidentListItem, {
    onIncidentAction: () => getIncidents(),
    key: index,
    team,
    incident,
    readOnly
  })));
};

const useStyles$1 = makeStyles((theme) => createStyles({
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2
  },
  formControl: {
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minWidth: `calc(100% - ${theme.spacing(2)}px)`
  },
  formHeader: {
    width: "50%"
  },
  incidentType: {
    width: "90%"
  },
  targets: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  }
}));
const TriggerDialog = ({
  team,
  showDialog,
  handleDialog,
  onIncidentCreated
}) => {
  const alertApi = useApi(alertApiRef);
  const api = useApi(splunkOnCallApiRef);
  const classes = useStyles$1();
  const [incidentType, setIncidentType] = useState("");
  const [incidentId, setIncidentId] = useState();
  const [incidentDisplayName, setIncidentDisplayName] = useState("");
  const [incidentMessage, setIncidentMessage] = useState("");
  const [incidentStartTime, setIncidentStartTime] = useState();
  const [
    { value, loading: triggerLoading, error: triggerError },
    handleTriggerAlarm
  ] = useAsyncFn(async (params) => await api.incidentAction(params));
  const handleIncidentType = (event) => {
    setIncidentType(event.target.value);
  };
  const handleIncidentId = (event) => {
    setIncidentId(event.target.value);
  };
  const handleIncidentDisplayName = (event) => {
    setIncidentDisplayName(event.target.value);
  };
  const handleIncidentMessage = (event) => {
    setIncidentMessage(event.target.value);
  };
  const handleIncidentStartTime = (event) => {
    const dateTime = new Date(event.target.value).getTime();
    const dateTimeInSeconds = Math.floor(dateTime / 1e3);
    setIncidentStartTime(dateTimeInSeconds);
  };
  useEffect(() => {
    if (value) {
      alertApi.post({
        message: `Alarm successfully triggered`
      });
      onIncidentCreated();
      handleDialog();
    }
  }, [value, alertApi, handleDialog, onIncidentCreated]);
  if (triggerError) {
    alertApi.post({
      message: `Failed to trigger alarm. ${triggerError.message}`,
      severity: "error"
    });
  }
  return /* @__PURE__ */ React.createElement(Dialog, {
    maxWidth: "md",
    open: showDialog,
    onClose: handleDialog,
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(DialogTitle, null, "This action will trigger an incident"), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle1",
    gutterBottom: true,
    align: "justify"
  }, "Created by: ", /* @__PURE__ */ React.createElement("b", null, `{ REST } Endpoint`)), /* @__PURE__ */ React.createElement(Alert, {
    severity: "info"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    align: "justify"
  }, `If the issue you are seeing does not need urgent attention, please get in touch with the responsible team using their preferred communications channel. You can find information about the owner of this entity in the "About" card. If the issue is urgent, please don't hesitate to trigger the alert.`)), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    style: { marginTop: "1em" },
    gutterBottom: true,
    align: "justify"
  }, "Please describe the problem you want to report. Be as descriptive as possible. ", /* @__PURE__ */ React.createElement("br", null), "Note that only the ", /* @__PURE__ */ React.createElement("b", null, "Incident type"), ", ", /* @__PURE__ */ React.createElement("b", null, "Incident display name"), " ", "and the ", /* @__PURE__ */ React.createElement("b", null, "Incident message"), " fields are ", /* @__PURE__ */ React.createElement("b", null, "required"), "."), /* @__PURE__ */ React.createElement(FormControl, {
    className: classes.formControl
  }, /* @__PURE__ */ React.createElement("div", {
    className: classes.formHeader
  }, /* @__PURE__ */ React.createElement(InputLabel, {
    id: "demo-simple-select-label"
  }, "Incident type"), /* @__PURE__ */ React.createElement(Select, {
    id: "incident-type",
    className: classes.incidentType,
    value: incidentType,
    onChange: handleIncidentType,
    inputProps: { "data-testid": "trigger-incident-type" }
  }, /* @__PURE__ */ React.createElement(MenuItem, {
    value: "CRITICAL"
  }, "Critical"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: "WARNING"
  }, "Warning"), /* @__PURE__ */ React.createElement(MenuItem, {
    value: "INFO"
  }, "Info"))), /* @__PURE__ */ React.createElement(TextField, {
    className: classes.formHeader,
    id: "datetime-local",
    label: "Incident start time",
    type: "datetime-local",
    onChange: handleIncidentStartTime,
    InputLabelProps: {
      shrink: true
    }
  })), /* @__PURE__ */ React.createElement(TextField, {
    inputProps: { "data-testid": "trigger-incident-id" },
    id: "summary",
    fullWidth: true,
    margin: "normal",
    label: "Incident id",
    variant: "outlined",
    onChange: handleIncidentId
  }), /* @__PURE__ */ React.createElement(TextField, {
    required: true,
    inputProps: { "data-testid": "trigger-incident-displayName" },
    id: "summary",
    fullWidth: true,
    margin: "normal",
    label: "Incident display name",
    variant: "outlined",
    onChange: handleIncidentDisplayName
  }), /* @__PURE__ */ React.createElement(TextField, {
    required: true,
    inputProps: { "data-testid": "trigger-incident-message" },
    id: "details",
    multiline: true,
    fullWidth: true,
    rows: "2",
    margin: "normal",
    label: "Incident message",
    variant: "outlined",
    onChange: handleIncidentMessage
  })), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    "data-testid": "trigger-button",
    id: "trigger",
    color: "secondary",
    disabled: !incidentType.length || !incidentDisplayName || !incidentMessage || triggerLoading,
    variant: "contained",
    onClick: () => handleTriggerAlarm({
      routingKey: team,
      incidentType,
      incidentDisplayName,
      incidentMessage,
      ...incidentId ? { incidentId } : {},
      ...incidentStartTime ? { incidentStartTime } : {}
    }),
    endIcon: triggerLoading && /* @__PURE__ */ React.createElement(CircularProgress, {
      size: 16
    })
  }, "Trigger Incident"), /* @__PURE__ */ React.createElement(Button, {
    id: "close",
    color: "primary",
    onClick: handleDialog
  }, "Close")));
};

const SPLUNK_ON_CALL_TEAM = "splunk.com/on-call-team";
const SPLUNK_ON_CALL_ROUTING_KEY = "splunk.com/on-call-routing-key";
const MissingAnnotation = () => /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Typography, null, "The Splunk On Call plugin requires setting either the", " ", /* @__PURE__ */ React.createElement("code", null, SPLUNK_ON_CALL_TEAM), " or the", " ", /* @__PURE__ */ React.createElement("code", null, SPLUNK_ON_CALL_ROUTING_KEY), " annotation."), /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
  annotation: SPLUNK_ON_CALL_TEAM
}));
const InvalidAnnotation = ({
  teamName,
  routingKey
}) => {
  let titleSuffix = "provided annotation";
  if (routingKey) {
    titleSuffix = `"${routingKey}" routing key`;
  }
  if (teamName) {
    titleSuffix = `"${teamName}" team name`;
  }
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, {
    title: "Splunk On-Call"
  }), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(EmptyState, {
    title: `Splunk On-Call API returned no record of teams associated with the ${titleSuffix}`,
    missing: "info",
    description: "Escalation Policy and incident information unavailable. Splunk On-Call requires a valid team name or routing key."
  })));
};
const MissingEventsRestEndpoint = () => /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(EmptyState, {
  title: "No Splunk On-Call REST endpoint available.",
  missing: "info",
  description: "You need to add a valid REST endpoint to your 'app-config.yaml' if you want to enable Splunk On-Call."
}));
const isSplunkOnCallAvailable = (entity) => {
  var _a, _b;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[SPLUNK_ON_CALL_TEAM]) || Boolean((_b = entity.metadata.annotations) == null ? void 0 : _b[SPLUNK_ON_CALL_ROUTING_KEY]);
};
const useStyles = makeStyles({
  onCallCard: {
    marginBottom: "1em"
  }
});
const EntitySplunkOnCallCard = (props) => {
  const { readOnly } = props;
  const classes = useStyles();
  const config = useApi(configApiRef);
  const api = useApi(splunkOnCallApiRef);
  const { entity } = useEntity();
  const [showDialog, setShowDialog] = useState(false);
  const [refreshIncidents, setRefreshIncidents] = useState(false);
  const teamAnnotation = entity ? entity.metadata.annotations[SPLUNK_ON_CALL_TEAM] : void 0;
  const routingKeyAnnotation = entity ? entity.metadata.annotations[SPLUNK_ON_CALL_ROUTING_KEY] : void 0;
  const eventsRestEndpoint = config.getOptionalString("splunkOnCall.eventsRestEndpoint") || null;
  const handleRefresh = useCallback(() => {
    setRefreshIncidents((x) => !x);
  }, []);
  const handleDialog = useCallback(() => {
    setShowDialog((x) => !x);
  }, []);
  const {
    value: usersAndTeams,
    loading,
    error
  } = useAsync(async () => {
    const allUsers = await api.getUsers();
    const usersHashMap = allUsers.reduce((map, obj) => {
      if (obj.username) {
        map[obj.username] = obj;
      }
      return map;
    }, {});
    const teams2 = await api.getTeams();
    let foundTeams = [
      teams2.find((teamValue) => teamValue.name === teamAnnotation)
    ].filter((team) => team !== void 0);
    if (!foundTeams.length && routingKeyAnnotation) {
      const routingKeys = await api.getRoutingKeys();
      const foundRoutingKey = routingKeys.find((key) => key.routingKey === routingKeyAnnotation);
      foundTeams = foundRoutingKey ? foundRoutingKey.targets.map((target) => {
        const teamUrlParts = target._teamUrl.split("/");
        const teamSlug = teamUrlParts[teamUrlParts.length - 1];
        return teams2.find((teamValue) => teamValue.slug === teamSlug);
      }).filter((team) => team !== void 0) : [];
    }
    return { usersHashMap, foundTeams };
  });
  if (!teamAnnotation && !routingKeyAnnotation) {
    return /* @__PURE__ */ React.createElement(MissingAnnotation, null);
  }
  if (!eventsRestEndpoint) {
    return /* @__PURE__ */ React.createElement(MissingEventsRestEndpoint, null);
  }
  if (error instanceof UnauthorizedError) {
    return /* @__PURE__ */ React.createElement(MissingApiKeyOrApiIdError, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching information. ", error.message);
  }
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (!(usersAndTeams == null ? void 0 : usersAndTeams.foundTeams) || !(usersAndTeams == null ? void 0 : usersAndTeams.foundTeams.length)) {
    return /* @__PURE__ */ React.createElement(InvalidAnnotation, {
      teamName: teamAnnotation,
      routingKey: routingKeyAnnotation
    });
  }
  const Content = ({
    team,
    usersHashMap
  }) => {
    var _a;
    const teamName = (_a = team == null ? void 0 : team.name) != null ? _a : "";
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Incidents, {
      readOnly: readOnly || false,
      team: teamName,
      refreshIncidents
    }), usersHashMap && team && /* @__PURE__ */ React.createElement(EscalationPolicy, {
      team: teamName,
      users: usersHashMap
    }), /* @__PURE__ */ React.createElement(TriggerDialog, {
      team: teamName,
      showDialog,
      handleDialog,
      onIncidentCreated: handleRefresh
    }));
  };
  const triggerLink = {
    label: "Create Incident",
    onClick: handleDialog,
    color: "secondary",
    icon: /* @__PURE__ */ React.createElement(AlarmAddIcon, null)
  };
  const serviceLink = {
    label: "Portal",
    href: "https://portal.victorops.com/",
    icon: /* @__PURE__ */ React.createElement(WebIcon, null)
  };
  const teams = (usersAndTeams == null ? void 0 : usersAndTeams.foundTeams) || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, teams.map((team, i) => /* @__PURE__ */ React.createElement(Card, {
    key: i,
    className: classes.onCallCard
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    title: "Splunk On-Call",
    subheader: [
      /* @__PURE__ */ React.createElement(Typography, {
        key: "team_name"
      }, "Team: ", team && team.name ? team.name : ""),
      /* @__PURE__ */ React.createElement(HeaderIconLinkRow, {
        key: "incident_trigger",
        links: !readOnly ? [serviceLink, triggerLink] : [serviceLink]
      })
    ]
  }), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Content, {
    team,
    usersHashMap: usersAndTeams == null ? void 0 : usersAndTeams.usersHashMap
  })))));
};

var EntitySplunkOnCallCard$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SPLUNK_ON_CALL_TEAM: SPLUNK_ON_CALL_TEAM,
  SPLUNK_ON_CALL_ROUTING_KEY: SPLUNK_ON_CALL_ROUTING_KEY,
  MissingAnnotation: MissingAnnotation,
  InvalidAnnotation: InvalidAnnotation,
  MissingEventsRestEndpoint: MissingEventsRestEndpoint,
  isSplunkOnCallAvailable: isSplunkOnCallAvailable,
  EntitySplunkOnCallCard: EntitySplunkOnCallCard
});

export { EntitySplunkOnCallCard as E, SplunkOnCallPage as S, UnauthorizedError as U, EntitySplunkOnCallCard$2 as a, SplunkOnCallClient as b, splunkOnCallApiRef as c, isSplunkOnCallAvailable as i, splunkOnCallPlugin as s };
//# sourceMappingURL=index-4741b8ba.esm.js.map
