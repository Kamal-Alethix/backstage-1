import * as React from 'react';
import React__default from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { AuthenticationError, ResponseError } from '@backstage/errors';
import { DateTime, Interval } from 'luxon';
import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, configApiRef, createRoutableExtension, createComponentExtension, useApi, errorApiRef, alertApiRef } from '@backstage/core-plugin-api';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, withStyles as withStyles$1 } from '@material-ui/core/styles';
import { withStyles, Chip, Typography as Typography$1, MenuItem as MenuItem$1, IconButton, Menu, Button as Button$1 } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Link, Progress, Table, EmptyState, Content, ResponseErrorPanel, ContentHeader, SupportButton, ItemCardGrid, Page, Header, HeaderLabel, HeaderTabs, HeaderIconLinkRow, CodeSnippet } from '@backstage/core-components';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import humanizeDuration from 'humanize-duration';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { parseEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import Chip$1 from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import RepeatIcon from '@material-ui/icons/Repeat';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import Divider from '@material-ui/core/Divider';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import BuildIcon from '@material-ui/icons/Build';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import TimelineIcon from '@material-ui/icons/Timeline';
import WebIcon from '@material-ui/icons/Web';
import { useEntity } from '@backstage/plugin-catalog-react';
import DialogContentText from '@material-ui/core/DialogContentText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ReplayIcon from '@material-ui/icons/Replay';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton$1 from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';

var SvgIlertIcon = function SvgIlertIcon(props) {
  return /*#__PURE__*/React.createElement(SvgIcon, props, /*#__PURE__*/React.createElement("path", {
    style: {
      stroke: "none",
      fillRule: "nonzero",
      fill: "#fff",
      fillOpacity: 1
    },
    d: "M0 9.277v9.297a4.118 4.118 0 0 0 4.105 4.106h8.477C6.219 21.008 1.277 15.793 0 9.277ZM19.527 22.563c1.801-.434 3.153-2.06 3.153-3.989v-2.3c-.989.546-2.047.949-3.153 1.195Zm0 0"
  }), /*#__PURE__*/React.createElement("path", {
    style: {
      stroke: "none",
      fillRule: "nonzero",
      fill: "#fff",
      fillOpacity: 1
    },
    d: "M14.418 17.469c-5.281-1.172-9.246-5.89-9.246-11.524-.004-2.09.555-4.14 1.613-5.945h-2.68A4.118 4.118 0 0 0 0 4.105v2.778c.434 7.933 6.336 14.433 13.992 15.797h.43ZM19.527 12.375v4.785a11.33 11.33 0 0 0 3.153-1.23V9.855a6.958 6.958 0 0 1-3.153 2.52Zm0 0"
  }), /*#__PURE__*/React.createElement("path", {
    style: {
      stroke: "none",
      fillRule: "nonzero",
      fill: "#fff",
      fillOpacity: 1
    },
    d: "M14.418 17.16v-4.785a6.929 6.929 0 0 1-4.363-6.43c0-2.441 1.289-4.699 3.386-5.945H7.13a11.4 11.4 0 0 0-1.66 5.945c0 5.465 3.832 10.051 8.949 11.215Zm0 0"
  }), /*#__PURE__*/React.createElement("path", {
    style: {
      stroke: "none",
      fillRule: "nonzero",
      fill: "#fff",
      fillOpacity: 1
    },
    d: "M10.355 5.945a6.62 6.62 0 0 0 4.063 6.106V9.918a4.695 4.695 0 0 0 5.11 0v2.133A6.653 6.653 0 0 0 22.68 9.3V4.105A4.118 4.118 0 0 0 18.574 0h-4.508a6.624 6.624 0 0 0-3.71 5.945Zm6.618-3.383a3.382 3.382 0 0 1 3.382 3.383 3.382 3.382 0 1 1-3.382-3.383Zm0 0"
  }));
};

const ilertApiRef = createApiRef({
  id: "plugin.ilert.service"
});
const DEFAULT_PROXY_PATH = "/ilert";
const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json"
};
class ILertClient {
  static fromConfig(configApi, discoveryApi) {
    var _a, _b;
    const baseUrl = (_a = configApi.getOptionalString("ilert.baseUrl")) != null ? _a : "https://app.ilert.com";
    return new ILertClient({
      discoveryApi,
      baseUrl,
      proxyPath: (_b = configApi.getOptionalString("ilert.proxyPath")) != null ? _b : DEFAULT_PROXY_PATH
    });
  }
  constructor(opts) {
    this.discoveryApi = opts.discoveryApi;
    this.baseUrl = opts.baseUrl;
    this.proxyPath = opts.proxyPath;
  }
  async fetch(input, init) {
    const apiUrl = await this.apiUrl();
    const response = await fetch(`${apiUrl}${input}`, init);
    if (response.status === 401) {
      throw new AuthenticationError("This request requires HTTP authentication.");
    }
    if (!response.ok || response.status >= 400) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
  async fetchIncidents(opts) {
    const init = {
      headers: JSON_HEADERS
    };
    const query = new URLSearchParams();
    if ((opts == null ? void 0 : opts.maxResults) !== void 0) {
      query.append("max-results", String(opts.maxResults));
    }
    if ((opts == null ? void 0 : opts.startIndex) !== void 0) {
      query.append("start-index", String(opts.startIndex));
    }
    if ((opts == null ? void 0 : opts.alertSources) !== void 0 && Array.isArray(opts.alertSources)) {
      opts.alertSources.forEach((a) => {
        if (a) {
          query.append("alert-source", String(a));
        }
      });
    }
    if ((opts == null ? void 0 : opts.states) !== void 0 && Array.isArray(opts.states)) {
      opts.states.forEach((state) => {
        query.append("state", state);
      });
    }
    const response = await this.fetch(`/api/v1/incidents?${query.toString()}`, init);
    return response;
  }
  async fetchIncidentsCount(opts) {
    const init = {
      headers: JSON_HEADERS
    };
    const query = new URLSearchParams();
    if (opts && opts.states && Array.isArray(opts.states)) {
      opts.states.forEach((state) => {
        query.append("state", state);
      });
    }
    const response = await this.fetch(`/api/v1/incidents/count?${query.toString()}`, init);
    return response && response.count ? response.count : 0;
  }
  async fetchIncident(id) {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch(`/api/v1/incidents/${encodeURIComponent(id)}`, init);
    return response;
  }
  async fetchIncidentResponders(incident) {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch(`/api/v1/incidents/${encodeURIComponent(incident.id)}/responders`, init);
    return response;
  }
  async fetchIncidentActions(incident) {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch(`/api/v1/incidents/${encodeURIComponent(incident.id)}/actions`, init);
    return response;
  }
  async acceptIncident(incident, userName) {
    var _a;
    const init = {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        apiKey: ((_a = incident.alertSource) == null ? void 0 : _a.integrationKey) || "",
        incidentKey: incident.incidentKey,
        summary: `from ${userName} via Backstage plugin`,
        eventType: "ACCEPT"
      })
    };
    await this.fetch("/api/v1/events", init);
    return this.fetchIncident(incident.id);
  }
  async resolveIncident(incident, userName) {
    var _a;
    const init = {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        apiKey: ((_a = incident.alertSource) == null ? void 0 : _a.integrationKey) || "",
        incidentKey: incident.incidentKey,
        summary: `from ${userName} via Backstage plugin`,
        eventType: "RESOLVE"
      })
    };
    await this.fetch("/api/v1/events", init);
    return this.fetchIncident(incident.id);
  }
  async assignIncident(incident, responder) {
    const init = {
      method: "PUT",
      headers: JSON_HEADERS
    };
    const query = new URLSearchParams();
    switch (responder.group) {
      case "ESCALATION_POLICY":
        query.append("policy-id", String(responder.id));
        break;
      case "ON_CALL_SCHEDULE":
        query.append("schedule-id", String(responder.id));
        break;
      default:
        query.append("user-id", String(responder.id));
        break;
    }
    const response = await this.fetch(`/api/v1/incidents/${encodeURIComponent(incident.id)}/assign?${query.toString()}`, init);
    return response;
  }
  async triggerIncidentAction(incident, action) {
    const init = {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        webhookId: action.webhookId,
        extensionId: action.extensionId,
        type: action.type,
        name: action.name
      })
    };
    await this.fetch(`/api/v1/incidents/${encodeURIComponent(incident.id)}/actions`, init);
  }
  async createIncident(eventRequest) {
    const init = {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        apiKey: eventRequest.integrationKey,
        summary: eventRequest.summary,
        details: eventRequest.details,
        eventType: "ALERT",
        links: [
          {
            href: eventRequest.source,
            text: "Backstage Url"
          }
        ],
        customDetails: {
          userName: eventRequest.userName
        }
      })
    };
    const response = await this.fetch("/api/v1/events", init);
    return response;
  }
  async fetchUptimeMonitors() {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch("/api/v1/uptime-monitors", init);
    return response;
  }
  async fetchUptimeMonitor(id) {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch(`/api/v1/uptime-monitors/${encodeURIComponent(id)}`, init);
    return response;
  }
  async pauseUptimeMonitor(uptimeMonitor) {
    const init = {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...uptimeMonitor, paused: true })
    };
    const response = await this.fetch(`/api/v1/uptime-monitors/${encodeURIComponent(uptimeMonitor.id)}`, init);
    return response;
  }
  async resumeUptimeMonitor(uptimeMonitor) {
    const init = {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...uptimeMonitor, paused: false })
    };
    const response = await this.fetch(`/api/v1/uptime-monitors/${encodeURIComponent(uptimeMonitor.id)}`, init);
    return response;
  }
  async fetchAlertSources() {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch("/api/v1/alert-sources", init);
    return response;
  }
  async fetchAlertSource(idOrIntegrationKey) {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch(`/api/v1/alert-sources/${encodeURIComponent(idOrIntegrationKey)}`, init);
    return response;
  }
  async fetchAlertSourceOnCalls(alertSource) {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch(`/api/v1/on-calls?policies=${encodeURIComponent(alertSource.escalationPolicy.id)}&expand=user&expand=escalationPolicy&timezone=${DateTime.local().zoneName}`, init);
    return response;
  }
  async enableAlertSource(alertSource) {
    const init = {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...alertSource, active: true })
    };
    const response = await this.fetch(`/api/v1/alert-sources/${encodeURIComponent(alertSource.id)}`, init);
    return response;
  }
  async disableAlertSource(alertSource) {
    const init = {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...alertSource, active: false })
    };
    const response = await this.fetch(`/api/v1/alert-sources/${encodeURIComponent(alertSource.id)}`, init);
    return response;
  }
  async addImmediateMaintenance(alertSourceId, minutes) {
    const init = {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({
        start: DateTime.utc().toISO(),
        end: DateTime.utc().plus({ minutes }).toISO(),
        description: `Immediate maintenance window for ${minutes} minutes. Backstage \u2014 iLert plugin.`,
        createdBy: "Backstage",
        timezone: DateTime.local().zoneName,
        alertSources: [{ id: alertSourceId }]
      })
    };
    const response = await this.fetch("/api/v1/maintenance-windows", init);
    return response;
  }
  async fetchOnCallSchedules() {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch("/api/v1/schedules", init);
    return response;
  }
  async fetchUsers() {
    const init = {
      headers: JSON_HEADERS
    };
    const response = await this.fetch("/api/v1/users", init);
    return response;
  }
  async overrideShift(scheduleId, userId, start, end) {
    const init = {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify({ user: { id: userId }, start, end })
    };
    const response = await this.fetch(`/api/v1/schedules/${encodeURIComponent(scheduleId)}/overrides`, init);
    return response;
  }
  getIncidentDetailsURL(incident) {
    return `${this.baseUrl}/incident/view.jsf?id=${encodeURIComponent(incident.id)}`;
  }
  getAlertSourceDetailsURL(alertSource) {
    if (!alertSource) {
      return "";
    }
    return `${this.baseUrl}/source/view.jsf?id=${encodeURIComponent(alertSource.id)}`;
  }
  getEscalationPolicyDetailsURL(escalationPolicy) {
    return `${this.baseUrl}/policy/view.jsf?id=${encodeURIComponent(escalationPolicy.id)}`;
  }
  getUptimeMonitorDetailsURL(uptimeMonitor) {
    return `${this.baseUrl}/uptime/view.jsf?id=${encodeURIComponent(uptimeMonitor.id)}`;
  }
  getScheduleDetailsURL(schedule) {
    return `${this.baseUrl}/schedule/view.jsf?id=${encodeURIComponent(schedule.id)}`;
  }
  getUserPhoneNumber(user) {
    var _a, _b;
    return ((_a = user == null ? void 0 : user.mobile) == null ? void 0 : _a.number) || ((_b = user == null ? void 0 : user.landline) == null ? void 0 : _b.number) || "";
  }
  getUserInitials(user) {
    if (!user) {
      return "";
    }
    if (!user.firstName && !user.lastName) {
      return user.username;
    }
    return `${user.firstName} ${user.lastName} (${user.username})`;
  }
  async apiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl("proxy");
    return proxyUrl + this.proxyPath;
  }
}

const iLertRouteRef = createRouteRef({
  id: "ilert"
});

const ilertPlugin = createPlugin({
  id: "ilert",
  apis: [
    createApiFactory({
      api: ilertApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        configApi: configApiRef
      },
      factory: ({ discoveryApi, configApi }) => ILertClient.fromConfig(configApi, discoveryApi)
    })
  ],
  routes: {
    root: iLertRouteRef
  }
});
const ILertPage$1 = ilertPlugin.provide(createRoutableExtension({
  name: "ILertPage",
  component: () => import('./esm/index-8d0bcade.esm.js').then((m) => m.ILertPage),
  mountPoint: iLertRouteRef
}));
const EntityILertCard = ilertPlugin.provide(createComponentExtension({
  name: "EntityILertCard",
  component: {
    lazy: () => import('./esm/index-2cfc4ca3.esm.js').then((m) => m.ILertCard)
  }
}));

const PENDING = "PENDING";
const ACCEPTED = "ACCEPTED";
const RESOLVED = "RESOLVED";

makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});
const incidentStatusLabels = {
  [RESOLVED]: "Resolved",
  [ACCEPTED]: "Accepted",
  [PENDING]: "Pending"
};

const ResolvedChip = withStyles({
  root: {
    backgroundColor: "#4caf50",
    color: "white",
    margin: 0
  }
})(Chip);
const AcceptedChip = withStyles({
  root: {
    backgroundColor: "#ffb74d",
    color: "white",
    margin: 0
  }
})(Chip);
const PendingChip = withStyles({
  root: {
    backgroundColor: "#d32f2f",
    color: "white",
    margin: 0
  }
})(Chip);
const StatusChip$1 = ({ incident }) => {
  const label = `${incidentStatusLabels[incident.status]}`;
  switch (incident.status) {
    case RESOLVED:
      return /* @__PURE__ */ React__default.createElement(ResolvedChip, {
        label,
        size: "small"
      });
    case ACCEPTED:
      return /* @__PURE__ */ React__default.createElement(AcceptedChip, {
        label,
        size: "small"
      });
    case PENDING:
      return /* @__PURE__ */ React__default.createElement(PendingChip, {
        label,
        size: "small"
      });
    default:
      return /* @__PURE__ */ React__default.createElement(Chip, {
        label,
        size: "small"
      });
  }
};

const useStyles$g = makeStyles({
  root: {
    display: "flex",
    maxWidth: "100%"
  },
  image: {
    height: 22,
    paddingRight: 4
  },
  link: {
    lineHeight: "22px"
  }
});
const AlertSourceLink = ({
  alertSource
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles$g();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  if (!alertSource) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    spacing: 0
  }, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 2
  }, /* @__PURE__ */ React__default.createElement("img", {
    src: prefersDarkMode ? alertSource.lightIconUrl : alertSource.iconUrl,
    alt: alertSource.name,
    className: classes.image
  })), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    xs: 10
  }, /* @__PURE__ */ React__default.createElement(Link, {
    className: classes.link,
    to: ilertApi.getAlertSourceDetailsURL(alertSource)
  }, alertSource.name)));
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
const useStyles$f = makeStyles({
  root: {
    display: "flex"
  },
  label: {
    marginTop: 8,
    marginRight: 4
  },
  formControl: {
    minWidth: 120,
    maxWidth: 300
  },
  grow: {
    flexGrow: 1
  }
});
const TableTitle = ({
  incidentStates,
  onIncidentStatesChange
}) => {
  const classes = useStyles$f();
  const handleIncidentStatusSelectChange = (event) => {
    onIncidentStatesChange(event.target.value);
  };
  return /* @__PURE__ */ React__default.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    noWrap: true,
    className: classes.label
  }, "Status:"), /* @__PURE__ */ React__default.createElement(FormControl, {
    className: classes.formControl,
    variant: "outlined",
    size: "small"
  }, /* @__PURE__ */ React__default.createElement(Select, {
    id: "incidents-status-select",
    multiple: true,
    value: incidentStates,
    onChange: handleIncidentStatusSelectChange,
    renderValue: (selected) => selected.join(", "),
    MenuProps
  }, [PENDING, ACCEPTED, RESOLVED].map((state) => /* @__PURE__ */ React__default.createElement(MenuItem, {
    key: state,
    value: state
  }, /* @__PURE__ */ React__default.createElement(Checkbox, {
    checked: incidentStates.indexOf(state) > -1
  }), /* @__PURE__ */ React__default.createElement(ListItemText, {
    primary: incidentStatusLabels[state]
  }))))));
};

const useAssignIncident = (incident, open) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [incidentRespondersList, setIncidentRespondersList] = React__default.useState([]);
  const [incidentResponder, setIncidentResponder] = React__default.useState(null);
  const [isLoading, setIsLoading] = React__default.useState(false);
  const { error, retry } = useAsyncRetry(async () => {
    try {
      if (!incident || !open) {
        return;
      }
      const data = await ilertApi.fetchIncidentResponders(incident);
      if (data && Array.isArray(data)) {
        const groups = [
          "SUGGESTED",
          "USER",
          "ESCALATION_POLICY",
          "ON_CALL_SCHEDULE"
        ];
        data.sort((a, b) => groups.indexOf(a.group) - groups.indexOf(b.group));
        setIncidentRespondersList(data);
      }
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [incident, open]);
  return [
    {
      incidentRespondersList,
      incidentResponder,
      error,
      isLoading
    },
    {
      setIncidentRespondersList,
      setIncidentResponder,
      setIsLoading,
      retry
    }
  ];
};

const useStyles$e = makeStyles(() => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    minWidth: 120,
    width: "100%"
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18
    }
  },
  optionWrapper: {
    display: "flex",
    width: "100%"
  },
  sourceImage: {
    height: 22,
    paddingRight: 4
  }
}));
const IncidentAssignModal = ({
  incident,
  isModalOpened,
  setIsModalOpened,
  onIncidentChanged
}) => {
  const [
    { incidentRespondersList, incidentResponder, isLoading },
    { setIsLoading, setIncidentResponder, setIncidentRespondersList }
  ] = useAssignIncident(incident, isModalOpened);
  const callback = onIncidentChanged || ((_) => {
  });
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const classes = useStyles$e();
  const handleClose = () => {
    setIncidentRespondersList([]);
    setIsModalOpened(false);
  };
  const handleAssign = () => {
    if (!incident || !incidentResponder) {
      return;
    }
    setIsLoading(true);
    setIncidentRespondersList([]);
    setTimeout(async () => {
      try {
        const newIncident = await ilertApi.assignIncident(incident, incidentResponder);
        callback(newIncident);
        alertApi.post({ message: "Incident assigned." });
      } catch (err) {
        alertApi.post({ message: err, severity: "error" });
      }
      setIsLoading(false);
      setIsModalOpened(false);
    }, 250);
  };
  const canAssign = !!incidentResponder;
  return /* @__PURE__ */ React__default.createElement(Dialog, {
    open: isModalOpened,
    onClose: handleClose,
    "aria-labelledby": "assign-incident-form-title"
  }, /* @__PURE__ */ React__default.createElement(DialogTitle, {
    id: "assign-incident-form-title"
  }, "Select responder to assign"), /* @__PURE__ */ React__default.createElement(DialogContent, null, /* @__PURE__ */ React__default.createElement(Alert, {
    severity: "info"
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "body1",
    gutterBottom: true,
    align: "justify"
  }, "This action will assign the incident to the selected responder.")), /* @__PURE__ */ React__default.createElement(Autocomplete, {
    disabled: isLoading,
    options: incidentRespondersList,
    value: incidentResponder,
    classes: {
      root: classes.formControl,
      option: classes.option
    },
    onChange: (_event, newValue) => {
      setIncidentResponder(newValue);
    },
    autoHighlight: true,
    groupBy: (option) => {
      switch (option.group) {
        case "SUGGESTED":
          return "Suggested responders";
        case "USER":
          return "Users";
        case "ESCALATION_POLICY":
          return "Escalation policies";
        case "ON_CALL_SCHEDULE":
          return "Schedules";
        default:
          return "";
      }
    },
    getOptionLabel: (a) => a.name,
    renderOption: (a) => /* @__PURE__ */ React__default.createElement("div", {
      className: classes.optionWrapper
    }, /* @__PURE__ */ React__default.createElement(Typography$1, {
      noWrap: true
    }, a.name)),
    renderInput: (params) => /* @__PURE__ */ React__default.createElement(TextField, {
      ...params,
      label: "Responder",
      variant: "outlined",
      margin: "normal",
      inputProps: {
        ...params.inputProps,
        autoComplete: "new-password"
      }
    })
  })), /* @__PURE__ */ React__default.createElement(DialogActions, null, /* @__PURE__ */ React__default.createElement(Button, {
    disabled: !canAssign,
    onClick: handleAssign,
    color: "primary",
    variant: "contained"
  }, "Assign"), /* @__PURE__ */ React__default.createElement(Button, {
    onClick: handleClose,
    color: "primary"
  }, "Cancel")));
};

const useIncidentActions = (incident, open) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [incidentActionsList, setIncidentActionsList] = React__default.useState([]);
  const [isLoading, setIsLoading] = React__default.useState(false);
  const { error, retry } = useAsyncRetry(async () => {
    try {
      if (!incident || !open) {
        return;
      }
      const data = await ilertApi.fetchIncidentActions(incident);
      setIncidentActionsList(data);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [incident, open]);
  return [
    {
      incidentActions: incidentActionsList,
      error,
      isLoading
    },
    {
      setIncidentActionsList,
      setIsLoading,
      retry
    }
  ];
};

const IncidentActionsMenu = ({
  incident,
  onIncidentChanged,
  setIsLoading
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const identityApi = useApi(identityApiRef);
  const [anchorEl, setAnchorEl] = React__default.useState(null);
  const callback = onIncidentChanged || ((_) => {
  });
  const setProcessing = setIsLoading || ((_) => {
  });
  const [isAssignIncidentModalOpened, setIsAssignIncidentModalOpened] = React__default.useState(false);
  const [{ incidentActions, isLoading }] = useIncidentActions(incident, Boolean(anchorEl));
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleAccept = async () => {
    try {
      handleCloseMenu();
      setProcessing(true);
      const { userEntityRef } = await identityApi.getBackstageIdentity();
      const { name: userName } = parseEntityRef(userEntityRef, {
        defaultKind: "User",
        defaultNamespace: DEFAULT_NAMESPACE
      });
      const newIncident = await ilertApi.acceptIncident(incident, userName);
      alertApi.post({ message: "Incident accepted." });
      callback(newIncident);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: "error" });
    }
  };
  const handleResolve = async () => {
    try {
      handleCloseMenu();
      setProcessing(true);
      const { userEntityRef } = await identityApi.getBackstageIdentity();
      const { name: userName } = parseEntityRef(userEntityRef, {
        defaultKind: "User",
        defaultNamespace: DEFAULT_NAMESPACE
      });
      const newIncident = await ilertApi.resolveIncident(incident, userName);
      alertApi.post({ message: "Incident resolved." });
      callback(newIncident);
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: "error" });
    }
  };
  const handleAssign = () => {
    handleCloseMenu();
    setIsAssignIncidentModalOpened(true);
  };
  const handleTriggerAction = (action) => async () => {
    try {
      handleCloseMenu();
      setProcessing(true);
      await ilertApi.triggerIncidentAction(incident, action);
      alertApi.post({ message: "Incident action triggered." });
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      alertApi.post({ message: err, severity: "error" });
    }
  };
  const actions = incidentActions.map((a) => {
    const successTrigger = a.history ? a.history.find((h) => h.success) : void 0;
    const triggeredBy = successTrigger && successTrigger.actor ? `${successTrigger.actor.firstName} ${successTrigger.actor.lastName}` : "";
    return /* @__PURE__ */ React__default.createElement(MenuItem$1, {
      key: a.webhookId,
      onClick: handleTriggerAction(a),
      disabled: !!successTrigger
    }, /* @__PURE__ */ React__default.createElement(Typography$1, {
      variant: "inherit",
      noWrap: true
    }, triggeredBy ? `${a.name} (by ${triggeredBy})` : a.name));
  });
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(IconButton, {
    "aria-label": "more",
    "aria-controls": "long-menu",
    "aria-haspopup": "true",
    onClick: handleClick,
    size: "small"
  }, /* @__PURE__ */ React__default.createElement(MoreVertIcon, null)), /* @__PURE__ */ React__default.createElement(Menu, {
    id: `incident-actions-menu-${incident.id}`,
    anchorEl,
    keepMounted: true,
    open: Boolean(anchorEl),
    onClose: handleCloseMenu,
    PaperProps: {
      style: { maxHeight: 48 * 5.5 }
    }
  }, incident.status === "PENDING" ? /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "ack",
    onClick: handleAccept
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "inherit",
    noWrap: true
  }, "Accept")) : null, incident.status !== "RESOLVED" ? /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "close",
    onClick: handleResolve
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "inherit",
    noWrap: true
  }, "Resolve")) : null, incident.status !== "RESOLVED" ? /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "assign",
    onClick: handleAssign
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "inherit",
    noWrap: true
  }, "Assign")) : null, isLoading ? /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "loading"
  }, /* @__PURE__ */ React__default.createElement(Progress, {
    style: { width: "100%" }
  })) : actions, /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "details",
    onClick: handleCloseMenu
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "inherit",
    noWrap: true
  }, /* @__PURE__ */ React__default.createElement(Link, {
    to: ilertApi.getIncidentDetailsURL(incident)
  }, "View in iLert")))), /* @__PURE__ */ React__default.createElement(IncidentAssignModal, {
    incident,
    setIsModalOpened: setIsAssignIncidentModalOpened,
    isModalOpened: isAssignIncidentModalOpened,
    onIncidentChanged
  }));
};

const useStyles$d = makeStyles({
  link: {
    lineHeight: "22px"
  }
});
const IncidentLink = ({ incident }) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles$d();
  if (!incident) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement(Link, {
    className: classes.link,
    to: ilertApi.getIncidentDetailsURL(incident)
  }, "#", incident.id);
};

const useStyles$c = makeStyles((theme) => ({
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const IncidentsTable = ({
  incidents,
  incidentsCount,
  tableState,
  states,
  isLoading,
  onIncidentChanged,
  setIsLoading,
  onIncidentStatesChange,
  onChangePage,
  onChangeRowsPerPage,
  compact
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles$c();
  const xsColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const smColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const mdColumnStyle = {
    width: "15%",
    maxWidth: "15%"
  };
  const lgColumnStyle = {
    width: "20%",
    maxWidth: "20%"
  };
  const xlColumnStyle = {
    width: "30%",
    maxWidth: "30%"
  };
  const idColumn = {
    title: "ID",
    field: "id",
    highlight: true,
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: (rowData) => /* @__PURE__ */ React__default.createElement(IncidentLink, {
      incident: rowData
    })
  };
  const summaryColumn = {
    title: "Summary",
    field: "summary",
    cellStyle: !compact ? xlColumnStyle : void 0,
    headerStyle: !compact ? xlColumnStyle : void 0,
    render: (rowData) => /* @__PURE__ */ React__default.createElement(Typography, null, rowData.summary)
  };
  const sourceColumn = {
    title: "Source",
    field: "source",
    cellStyle: mdColumnStyle,
    headerStyle: mdColumnStyle,
    render: (rowData) => /* @__PURE__ */ React__default.createElement(AlertSourceLink, {
      alertSource: rowData.alertSource
    })
  };
  const durationColumn = {
    title: "Duration",
    field: "reportTime",
    type: "datetime",
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: (rowData) => /* @__PURE__ */ React__default.createElement(Typography, {
      noWrap: true
    }, rowData.status !== "RESOLVED" ? humanizeDuration(Interval.fromDateTimes(DateTime.fromISO(rowData.reportTime), DateTime.now()).toDuration().valueOf(), { units: ["h", "m", "s"], largest: 2, round: true }) : humanizeDuration(Interval.fromDateTimes(DateTime.fromISO(rowData.reportTime), DateTime.fromISO(rowData.resolvedOn)).toDuration().valueOf(), { units: ["h", "m", "s"], largest: 2, round: true }))
  };
  const assignedToColumn = {
    title: "Assigned to",
    field: "assignedTo",
    cellStyle: !compact ? mdColumnStyle : lgColumnStyle,
    headerStyle: !compact ? mdColumnStyle : lgColumnStyle,
    render: (rowData) => /* @__PURE__ */ React__default.createElement(Typography, {
      noWrap: true
    }, ilertApi.getUserInitials(rowData.assignedTo))
  };
  const priorityColumn = {
    title: "Priority",
    field: "priority",
    cellStyle: smColumnStyle,
    headerStyle: smColumnStyle,
    render: (rowData) => /* @__PURE__ */ React__default.createElement(Typography, {
      noWrap: true
    }, rowData.priority === "HIGH" ? "High" : "Low")
  };
  const statusColumn = {
    title: "Status",
    field: "status",
    cellStyle: xsColumnStyle,
    headerStyle: xsColumnStyle,
    render: (rowData) => /* @__PURE__ */ React__default.createElement(StatusChip$1, {
      incident: rowData
    })
  };
  const actionsColumn = {
    title: "",
    field: "",
    cellStyle: xsColumnStyle,
    headerStyle: xsColumnStyle,
    render: (rowData) => /* @__PURE__ */ React__default.createElement(IncidentActionsMenu, {
      incident: rowData,
      onIncidentChanged,
      setIsLoading
    })
  };
  const columns = compact ? [
    summaryColumn,
    durationColumn,
    assignedToColumn,
    statusColumn,
    actionsColumn
  ] : [
    idColumn,
    summaryColumn,
    sourceColumn,
    durationColumn,
    assignedToColumn,
    priorityColumn,
    statusColumn,
    actionsColumn
  ];
  let tableStyle = {};
  if (compact) {
    tableStyle = {
      width: "100%",
      maxWidth: "100%",
      minWidth: "0",
      height: "calc(100% - 10px)",
      boxShadow: "none !important",
      borderRadius: "none !important"
    };
  } else {
    tableStyle = {
      width: "100%",
      maxWidth: "100%"
    };
  }
  return /* @__PURE__ */ React__default.createElement(Table, {
    style: tableStyle,
    options: {
      sorting: false,
      search: !compact,
      paging: !compact,
      actionsColumnIndex: -1,
      pageSize: tableState.pageSize,
      pageSizeOptions: !compact ? [10, 20, 50, 100] : [3, 10, 20, 50, 100],
      padding: "dense",
      loadingType: "overlay",
      showEmptyDataSourceMessage: !isLoading,
      showTitle: true,
      toolbar: true
    },
    emptyContent: /* @__PURE__ */ React__default.createElement(Typography, {
      color: "textSecondary",
      className: classes.empty
    }, "No incidents right now"),
    title: !compact ? /* @__PURE__ */ React__default.createElement(TableTitle, {
      incidentStates: states,
      onIncidentStatesChange
    }) : /* @__PURE__ */ React__default.createElement(Typography, {
      variant: "button",
      color: "textSecondary"
    }, "INCIDENTS"),
    page: tableState.page,
    totalCount: incidentsCount,
    onPageChange: onChangePage,
    onRowsPerPageChange: onChangeRowsPerPage,
    columns,
    data: incidents,
    isLoading
  });
};

const MissingAuthorizationHeaderError = () => /* @__PURE__ */ React__default.createElement(EmptyState, {
  missing: "info",
  title: "Missing or invalid iLert authorization header",
  description: "The request to fetch data needs a valid authorization header. See README for more details.",
  action: /* @__PURE__ */ React__default.createElement(Button$1, {
    color: "primary",
    variant: "contained",
    href: "https://github.com/backstage/backstage/blob/master/plugins/ilert/README.md"
  }, "Read More")
});

const useIncidents = (paging, singleSource, alertSource) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [tableState, setTableState] = React__default.useState({
    page: 0,
    pageSize: 10
  });
  const [states, setStates] = React__default.useState([
    ACCEPTED,
    PENDING
  ]);
  const [incidentsList, setIncidentsList] = React__default.useState([]);
  const [incidentsCount, setIncidentsCount] = React__default.useState(0);
  const [isLoading, setIsLoading] = React__default.useState(false);
  const fetchIncidentsCall = async () => {
    try {
      if (singleSource && !alertSource) {
        return;
      }
      setIsLoading(true);
      const opts = {
        states,
        alertSources: alertSource ? [alertSource.id] : []
      };
      if (paging) {
        opts.maxResults = tableState.pageSize;
        opts.startIndex = tableState.page * tableState.pageSize;
      }
      const data = await ilertApi.fetchIncidents(opts);
      setIncidentsList(data || []);
      setIsLoading(false);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      setIsLoading(false);
      throw e;
    }
  };
  const fetchIncidentsCountCall = async () => {
    try {
      const count = await ilertApi.fetchIncidentsCount({ states });
      setIncidentsCount(count || 0);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };
  const fetchIncidents = useAsyncRetry(fetchIncidentsCall, [
    tableState,
    states,
    singleSource,
    alertSource
  ]);
  const refetchIncidents = () => {
    setTableState({ ...tableState, page: 0 });
    Promise.all([fetchIncidentsCall(), fetchIncidentsCountCall()]);
  };
  const fetchIncidentsCount = useAsyncRetry(fetchIncidentsCountCall, [states]);
  const error = fetchIncidents.error || fetchIncidentsCount.error;
  const retry = () => {
    fetchIncidents.retry();
    fetchIncidentsCount.retry();
  };
  const onIncidentChanged = (newIncident) => {
    let shouldRefetchIncidents = false;
    setIncidentsList(incidentsList.reduce((acc, incident) => {
      if (newIncident.id === incident.id) {
        if (states.includes(newIncident.status)) {
          acc.push(newIncident);
        } else {
          shouldRefetchIncidents = true;
        }
        return acc;
      }
      acc.push(incident);
      return acc;
    }, []));
    if (shouldRefetchIncidents) {
      refetchIncidents();
    }
  };
  const onChangePage = (page) => {
    setTableState({ ...tableState, page });
  };
  const onChangeRowsPerPage = (p) => {
    setTableState({ ...tableState, pageSize: p });
  };
  const onIncidentStatesChange = (s) => {
    setStates(s);
  };
  return [
    {
      tableState,
      states,
      incidents: incidentsList,
      incidentsCount,
      error,
      isLoading
    },
    {
      setTableState,
      setStates,
      setIncidentsList,
      setIsLoading,
      retry,
      onIncidentChanged,
      refetchIncidents,
      onChangePage,
      onChangeRowsPerPage,
      onIncidentStatesChange
    }
  ];
};

const useNewIncident = (open, initialAlertSource) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [alertSourcesList, setAlertSourcesList] = React__default.useState([]);
  const [alertSource, setAlertSource] = React__default.useState(null);
  const [summary, setSummary] = React__default.useState("");
  const [details, setDetails] = React__default.useState("");
  const [isLoading, setIsLoading] = React__default.useState(false);
  const fetchAlertSources = useAsyncRetry(async () => {
    try {
      if (!open || initialAlertSource) {
        return;
      }
      const count = await ilertApi.fetchAlertSources();
      setAlertSourcesList(count || 0);
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [open]);
  const error = fetchAlertSources.error;
  const retry = () => {
    fetchAlertSources.retry();
  };
  return [
    {
      alertSources: alertSourcesList,
      alertSource: initialAlertSource ? initialAlertSource : alertSource,
      summary,
      details,
      error,
      isLoading
    },
    {
      setAlertSourcesList,
      setAlertSource,
      setSummary,
      setDetails,
      setIsLoading,
      retry
    }
  ];
};

const useStyles$b = makeStyles(() => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    minWidth: 120,
    width: "100%"
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18
    }
  },
  optionWrapper: {
    display: "flex",
    width: "100%"
  },
  sourceImage: {
    height: 22,
    paddingRight: 4
  }
}));
const IncidentNewModal = ({
  isModalOpened,
  setIsModalOpened,
  refetchIncidents,
  initialAlertSource,
  entityName
}) => {
  const [
    { alertSources, alertSource, summary, details, isLoading },
    { setAlertSource, setSummary, setDetails, setIsLoading }
  ] = useNewIncident(isModalOpened, initialAlertSource);
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const identityApi = useApi(identityApiRef);
  const source = window.location.toString();
  const classes = useStyles$b();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const handleClose = () => {
    setIsModalOpened(false);
  };
  let integrationKey = "";
  if (initialAlertSource && initialAlertSource.integrationKey) {
    integrationKey = initialAlertSource.integrationKey;
  } else if (alertSource && alertSource.integrationKey) {
    integrationKey = alertSource.integrationKey;
  }
  const handleCreate = () => {
    if (!integrationKey) {
      return;
    }
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const { userEntityRef } = await identityApi.getBackstageIdentity();
        const { name: userName } = parseEntityRef(userEntityRef, {
          defaultKind: "User",
          defaultNamespace: DEFAULT_NAMESPACE
        });
        await ilertApi.createIncident({
          integrationKey,
          summary,
          details,
          userName,
          source
        });
        alertApi.post({ message: "Incident created." });
        refetchIncidents();
      } catch (err) {
        alertApi.post({ message: err, severity: "error" });
      }
      setIsModalOpened(false);
    }, 250);
  };
  const canCreate = !!integrationKey && !!summary;
  return /* @__PURE__ */ React__default.createElement(Dialog, {
    open: isModalOpened,
    onClose: handleClose,
    "aria-labelledby": "create-incident-form-title"
  }, /* @__PURE__ */ React__default.createElement(DialogTitle, {
    id: "create-incident-form-title"
  }, entityName ? /* @__PURE__ */ React__default.createElement("div", null, "This action will trigger an incident for", " ", /* @__PURE__ */ React__default.createElement("strong", null, '"', entityName, '"'), ".") : "New incident"), /* @__PURE__ */ React__default.createElement(DialogContent, null, /* @__PURE__ */ React__default.createElement(Alert, {
    severity: "info"
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "body1",
    gutterBottom: true,
    align: "justify"
  }, "Please describe the problem you want to report. Be as descriptive as possible. Your signed in user and a reference to the current page will automatically be amended to the alarm so that the receiver can reach out to you if necessary.")), !initialAlertSource ? /* @__PURE__ */ React__default.createElement(Autocomplete, {
    disabled: isLoading,
    options: alertSources,
    value: alertSource,
    classes: {
      root: classes.formControl,
      option: classes.option
    },
    onChange: (_event, newValue) => {
      setAlertSource(newValue);
    },
    autoHighlight: true,
    getOptionLabel: (a) => a.name,
    renderOption: (a) => /* @__PURE__ */ React__default.createElement("div", {
      className: classes.optionWrapper
    }, /* @__PURE__ */ React__default.createElement("img", {
      src: prefersDarkMode ? a.lightIconUrl : a.iconUrl,
      alt: a.name,
      className: classes.sourceImage
    }), /* @__PURE__ */ React__default.createElement(Typography$1, {
      noWrap: true
    }, a.name)),
    renderInput: (params) => /* @__PURE__ */ React__default.createElement(TextField, {
      ...params,
      label: "Alert Source",
      variant: "outlined",
      margin: "normal",
      inputProps: {
        ...params.inputProps,
        autoComplete: "new-password"
      }
    })
  }) : null, /* @__PURE__ */ React__default.createElement(TextField, {
    disabled: isLoading,
    label: "Summary",
    fullWidth: true,
    margin: "normal",
    variant: "outlined",
    classes: {
      root: classes.formControl
    },
    value: summary,
    onChange: (event) => {
      setSummary(event.target.value);
    }
  }), /* @__PURE__ */ React__default.createElement(TextField, {
    disabled: isLoading,
    label: "Details",
    fullWidth: true,
    multiline: true,
    rows: 4,
    margin: "normal",
    variant: "outlined",
    classes: {
      root: classes.formControl
    },
    value: details,
    onChange: (event) => {
      setDetails(event.target.value);
    }
  })), /* @__PURE__ */ React__default.createElement(DialogActions, null, /* @__PURE__ */ React__default.createElement(Button, {
    disabled: !canCreate,
    onClick: handleCreate,
    color: "secondary",
    variant: "contained"
  }, "Create"), /* @__PURE__ */ React__default.createElement(Button, {
    onClick: handleClose,
    color: "primary"
  }, "Cancel")));
};

const IncidentsPage = () => {
  const [
    { tableState, states, incidents, incidentsCount, isLoading, error },
    {
      onIncidentStatesChange,
      onChangePage,
      onChangeRowsPerPage,
      onIncidentChanged,
      refetchIncidents,
      setIsLoading
    }
  ] = useIncidents(true);
  const [isModalOpened, setIsModalOpened] = React__default.useState(false);
  const handleCreateNewIncidentClick = () => {
    setIsModalOpened(true);
  };
  if (error) {
    if (error instanceof AuthenticationError) {
      return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(MissingAuthorizationHeaderError, null));
    }
    return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(ResponseErrorPanel, {
      error
    }));
  }
  return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(ContentHeader, {
    title: "Incidents"
  }, /* @__PURE__ */ React__default.createElement(Button, {
    variant: "contained",
    color: "primary",
    size: "small",
    startIcon: /* @__PURE__ */ React__default.createElement(AddIcon, null),
    onClick: handleCreateNewIncidentClick
  }, "Create Incident"), /* @__PURE__ */ React__default.createElement(IncidentNewModal, {
    isModalOpened,
    setIsModalOpened,
    refetchIncidents
  }), /* @__PURE__ */ React__default.createElement(SupportButton, null, "This helps you to bring iLert into your developer portal.")), /* @__PURE__ */ React__default.createElement(IncidentsTable, {
    incidents,
    incidentsCount,
    tableState,
    states,
    onIncidentChanged,
    onIncidentStatesChange,
    onChangePage,
    onChangeRowsPerPage,
    isLoading,
    setIsLoading
  }));
};

const UpChip = withStyles$1({
  root: {
    backgroundColor: "#4caf50",
    color: "white",
    margin: 0
  }
})(Chip$1);
const DownChip = withStyles$1({
  root: {
    backgroundColor: "#d32f2f",
    color: "white",
    margin: 0
  }
})(Chip$1);
const UnknownChip = withStyles$1({
  root: {
    backgroundColor: "#92949c",
    color: "white",
    margin: 0
  }
})(Chip$1);
const uptimeMonitorStatusLabels = {
  ["up"]: "Up",
  ["down"]: "Down",
  ["unknown"]: "Unknown"
};
const StatusChip = ({
  uptimeMonitor
}) => {
  let label = `${uptimeMonitorStatusLabels[uptimeMonitor.status]}`;
  if (uptimeMonitor.paused) {
    label = "Paused";
    return /* @__PURE__ */ React__default.createElement(UnknownChip, {
      label,
      size: "small"
    });
  }
  switch (uptimeMonitor.status) {
    case "up":
      return /* @__PURE__ */ React__default.createElement(UpChip, {
        label,
        size: "small"
      });
    case "down":
      return /* @__PURE__ */ React__default.createElement(DownChip, {
        label,
        size: "small"
      });
    case "unknown":
      return /* @__PURE__ */ React__default.createElement(UnknownChip, {
        label,
        size: "small"
      });
    default:
      return /* @__PURE__ */ React__default.createElement(Chip$1, {
        label,
        size: "small"
      });
  }
};

const useStyles$a = makeStyles({
  link: {
    lineHeight: "22px"
  }
});
const EscalationPolicyLink = ({
  escalationPolicy
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles$a();
  if (!escalationPolicy) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement(Link, {
    className: classes.link,
    to: ilertApi.getEscalationPolicyDetailsURL(escalationPolicy)
  }, escalationPolicy.name);
};

const UptimeMonitorCheckType = ({
  uptimeMonitor
}) => {
  switch (uptimeMonitor.region) {
    case "EU":
      return /* @__PURE__ */ React__default.createElement(Typography, {
        noWrap: true
      }, `${uptimeMonitor.checkType.toUpperCase()} \u{1F1E9}\u{1F1EA}`);
    default:
      return /* @__PURE__ */ React__default.createElement(Typography, {
        noWrap: true
      }, `${uptimeMonitor.checkType.toUpperCase()} \u{1F1FA}\u{1F1F8}`);
  }
};

const UptimeMonitorActionsMenu = ({
  uptimeMonitor,
  onUptimeMonitorChanged
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const [anchorEl, setAnchorEl] = React__default.useState(null);
  const callback = onUptimeMonitorChanged || ((_) => {
  });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handlePause = async () => {
    try {
      const newUptimeMonitor = await ilertApi.pauseUptimeMonitor(uptimeMonitor);
      handleCloseMenu();
      alertApi.post({ message: "Uptime monitor paused." });
      callback(newUptimeMonitor);
    } catch (err) {
      alertApi.post({ message: err, severity: "error" });
    }
  };
  const handleResume = async () => {
    try {
      const newUptimeMonitor = await ilertApi.resumeUptimeMonitor(uptimeMonitor);
      handleCloseMenu();
      alertApi.post({ message: "Uptime monitor resumed." });
      callback(newUptimeMonitor);
    } catch (err) {
      alertApi.post({ message: err, severity: "error" });
    }
  };
  const handleOpenReport = async () => {
    try {
      const um = await ilertApi.fetchUptimeMonitor(uptimeMonitor.id);
      handleCloseMenu();
      window.open(um.shareUrl, "_blank");
    } catch (err) {
      alertApi.post({ message: err, severity: "error" });
    }
  };
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(IconButton, {
    "aria-label": "more",
    "aria-controls": "long-menu",
    "aria-haspopup": "true",
    onClick: handleClick,
    size: "small"
  }, /* @__PURE__ */ React__default.createElement(MoreVertIcon, null)), /* @__PURE__ */ React__default.createElement(Menu, {
    id: `uptime-monitor-actions-menu-${uptimeMonitor.id}`,
    anchorEl,
    keepMounted: true,
    open: Boolean(anchorEl),
    onClose: handleCloseMenu,
    PaperProps: {
      style: { maxHeight: 48 * 4.5 }
    }
  }, uptimeMonitor.paused ? /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "ack",
    onClick: handleResume
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "inherit",
    noWrap: true
  }, "Resume")) : null, !uptimeMonitor.paused ? /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "close",
    onClick: handlePause
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "inherit",
    noWrap: true
  }, "Pause")) : null, /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "report",
    onClick: handleCloseMenu
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "inherit",
    noWrap: true
  }, /* @__PURE__ */ React__default.createElement(Link, {
    to: "#",
    onClick: handleOpenReport
  }, "View Report"))), /* @__PURE__ */ React__default.createElement(MenuItem$1, {
    key: "details",
    onClick: handleCloseMenu
  }, /* @__PURE__ */ React__default.createElement(Typography$1, {
    variant: "inherit",
    noWrap: true
  }, /* @__PURE__ */ React__default.createElement(Link, {
    to: ilertApi.getUptimeMonitorDetailsURL(uptimeMonitor)
  }, "View in iLert")))));
};

const useStyles$9 = makeStyles({
  link: {
    lineHeight: "22px"
  }
});
const UptimeMonitorLink = ({
  uptimeMonitor
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles$9();
  if (!uptimeMonitor) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement(Link, {
    className: classes.link,
    to: ilertApi.getUptimeMonitorDetailsURL(uptimeMonitor)
  }, "#", uptimeMonitor.id);
};

const useStyles$8 = makeStyles((theme) => ({
  empty: {
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  }
}));
const UptimeMonitorsTable = ({
  uptimeMonitors,
  tableState,
  isLoading,
  onChangePage,
  onChangeRowsPerPage,
  onUptimeMonitorChanged
}) => {
  const classes = useStyles$8();
  const smColumnStyle = {
    width: "5%",
    maxWidth: "5%"
  };
  const mdColumnStyle = {
    width: "10%",
    maxWidth: "10%"
  };
  const lgColumnStyle = {
    width: "15%",
    maxWidth: "15%"
  };
  const columns = [
    {
      title: "ID",
      field: "id",
      highlight: true,
      cellStyle: mdColumnStyle,
      headerStyle: mdColumnStyle,
      render: (rowData) => /* @__PURE__ */ React__default.createElement(UptimeMonitorLink, {
        uptimeMonitor: rowData
      })
    },
    {
      title: "Name",
      field: "name",
      render: (rowData) => /* @__PURE__ */ React__default.createElement(Typography, null, rowData.name)
    },
    {
      title: "Check Type",
      field: "checkType",
      cellStyle: lgColumnStyle,
      headerStyle: lgColumnStyle,
      render: (rowData) => /* @__PURE__ */ React__default.createElement(UptimeMonitorCheckType, {
        uptimeMonitor: rowData
      })
    },
    {
      title: "Last state change",
      field: "lastStatusChange",
      type: "datetime",
      cellStyle: mdColumnStyle,
      headerStyle: mdColumnStyle,
      render: (rowData) => /* @__PURE__ */ React__default.createElement(Typography, {
        noWrap: true
      }, humanizeDuration(Interval.fromDateTimes(DateTime.fromISO(rowData.lastStatusChange), DateTime.now()).toDuration().valueOf(), { units: ["h", "m", "s"], largest: 2, round: true }))
    },
    {
      title: "Escalation policy",
      field: "assignedTo",
      cellStyle: lgColumnStyle,
      headerStyle: lgColumnStyle,
      render: (rowData) => /* @__PURE__ */ React__default.createElement(EscalationPolicyLink, {
        escalationPolicy: rowData.escalationPolicy
      })
    },
    {
      title: "Status",
      field: "status",
      cellStyle: smColumnStyle,
      headerStyle: smColumnStyle,
      render: (rowData) => /* @__PURE__ */ React__default.createElement(StatusChip, {
        uptimeMonitor: rowData
      })
    },
    {
      title: "",
      field: "",
      cellStyle: smColumnStyle,
      headerStyle: smColumnStyle,
      render: (rowData) => /* @__PURE__ */ React__default.createElement(UptimeMonitorActionsMenu, {
        uptimeMonitor: rowData,
        onUptimeMonitorChanged
      })
    }
  ];
  return /* @__PURE__ */ React__default.createElement(Table, {
    options: {
      sorting: true,
      search: true,
      paging: true,
      actionsColumnIndex: -1,
      pageSize: tableState.pageSize,
      pageSizeOptions: [10, 20, 50, 100],
      padding: "dense",
      loadingType: "overlay",
      showEmptyDataSourceMessage: !isLoading
    },
    emptyContent: /* @__PURE__ */ React__default.createElement(Typography, {
      color: "textSecondary",
      className: classes.empty
    }, "No uptime monitor"),
    page: tableState.page,
    onPageChange: onChangePage,
    onRowsPerPageChange: onChangeRowsPerPage,
    localization: { header: { actions: void 0 } },
    isLoading,
    columns,
    data: uptimeMonitors
  });
};

const useUptimeMonitors = () => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [tableState, setTableState] = React__default.useState({
    page: 0,
    pageSize: 10
  });
  const [uptimeMonitorsList, setUptimeMonitorsList] = React__default.useState([]);
  const [isLoading, setIsLoading] = React__default.useState(false);
  const { error, retry } = useAsyncRetry(async () => {
    try {
      setIsLoading(true);
      const data = await ilertApi.fetchUptimeMonitors();
      setUptimeMonitorsList(data || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [tableState]);
  const onUptimeMonitorChanged = (newUptimeMonitor) => {
    setUptimeMonitorsList(uptimeMonitorsList.map((uptimeMonitor) => {
      if (newUptimeMonitor.id === uptimeMonitor.id) {
        return newUptimeMonitor;
      }
      return uptimeMonitor;
    }));
  };
  const onChangePage = (page) => {
    setTableState({ ...tableState, page });
  };
  const onChangeRowsPerPage = (pageSize) => {
    setTableState({ ...tableState, pageSize });
  };
  return [
    {
      tableState,
      uptimeMonitors: uptimeMonitorsList,
      error,
      isLoading
    },
    {
      setTableState,
      setUptimeMonitorsList,
      retry,
      onUptimeMonitorChanged,
      onChangePage,
      onChangeRowsPerPage,
      setIsLoading
    }
  ];
};

const UptimeMonitorsPage = () => {
  const [
    { tableState, uptimeMonitors, isLoading, error },
    { onChangePage, onChangeRowsPerPage, onUptimeMonitorChanged }
  ] = useUptimeMonitors();
  if (error) {
    if (error instanceof AuthenticationError) {
      return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(MissingAuthorizationHeaderError, null));
    }
    return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(ResponseErrorPanel, {
      error
    }));
  }
  return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(ContentHeader, {
    title: "Uptime Monitors"
  }, /* @__PURE__ */ React__default.createElement(SupportButton, null, "This helps you to bring iLert into your developer portal.")), /* @__PURE__ */ React__default.createElement(UptimeMonitorsTable, {
    uptimeMonitors,
    tableState,
    isLoading,
    onChangePage,
    onChangeRowsPerPage,
    onUptimeMonitorChanged
  }));
};

const useShiftOverride = (s, isModalOpened) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [shift, setShift] = React__default.useState(s);
  const [usersList, setUsersList] = React__default.useState([]);
  const [isLoading, setIsLoading] = React__default.useState(false);
  const { error, retry } = useAsyncRetry(async () => {
    try {
      if (!isModalOpened) {
        return;
      }
      setIsLoading(true);
      const data = await ilertApi.fetchUsers();
      setUsersList(data || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  }, [isModalOpened]);
  const setUser = (user) => {
    setShift({ ...shift, user });
  };
  const setStart = (start) => {
    setShift({ ...shift, start });
  };
  const setEnd = (end) => {
    setShift({ ...shift, end });
  };
  return [
    {
      shift,
      users: usersList,
      user: shift.user,
      start: shift.start,
      end: shift.end,
      error,
      isLoading
    },
    {
      retry,
      setIsLoading,
      setUser,
      setStart,
      setEnd
    }
  ];
};

const useStyles$7 = makeStyles(() => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    minWidth: 120,
    width: "100%"
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18
    }
  },
  optionWrapper: {
    display: "flex",
    width: "100%"
  },
  sourceImage: {
    height: 22,
    paddingRight: 4
  },
  grow: {
    flexGrow: 1
  }
}));
const ShiftOverrideModal = ({
  scheduleId,
  shift,
  refetchOnCallSchedules,
  isModalOpened,
  setIsModalOpened
}) => {
  const [
    { isLoading, users, user, start, end },
    { setUser, setStart, setEnd, setIsLoading }
  ] = useShiftOverride(shift, isModalOpened);
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const classes = useStyles$7();
  const handleClose = () => {
    setIsModalOpened(false);
  };
  const handleOverride = () => {
    if (!shift || !shift.user) {
      return;
    }
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const success = await ilertApi.overrideShift(scheduleId, user.id, start, end);
        if (success) {
          alertApi.post({ message: "Shift overridden." });
          refetchOnCallSchedules();
        }
      } catch (err) {
        alertApi.post({ message: err, severity: "error" });
      }
      setIsModalOpened(false);
    }, 250);
  };
  if (!shift) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement(Dialog, {
    open: isModalOpened,
    onClose: handleClose,
    "aria-labelledby": "override-shift-form-title"
  }, /* @__PURE__ */ React__default.createElement(DialogTitle, {
    id: "override-shift-form-title"
  }, "Shift override"), /* @__PURE__ */ React__default.createElement(DialogContent, null, /* @__PURE__ */ React__default.createElement(MuiPickersUtilsProvider, {
    utils: LuxonUtils
  }, /* @__PURE__ */ React__default.createElement(Autocomplete, {
    disabled: isLoading,
    options: users,
    value: user,
    classes: {
      root: classes.formControl,
      option: classes.option
    },
    onChange: (_event, newValue) => {
      setUser(newValue);
    },
    autoHighlight: true,
    getOptionLabel: (a) => ilertApi.getUserInitials(a),
    renderOption: (a) => /* @__PURE__ */ React__default.createElement("div", {
      className: classes.optionWrapper
    }, /* @__PURE__ */ React__default.createElement(Typography$1, {
      noWrap: true
    }, ilertApi.getUserInitials(a))),
    renderInput: (params) => /* @__PURE__ */ React__default.createElement(TextField, {
      ...params,
      label: "User",
      variant: "outlined",
      fullWidth: true,
      inputProps: {
        ...params.inputProps,
        autoComplete: "new-password"
      }
    })
  }), /* @__PURE__ */ React__default.createElement(DateTimePicker, {
    label: "Start",
    inputVariant: "outlined",
    fullWidth: true,
    margin: "normal",
    ampm: false,
    value: start,
    className: classes.formControl,
    onChange: (date) => {
      setStart(date ? date.toISO() : "");
    }
  }), /* @__PURE__ */ React__default.createElement(DateTimePicker, {
    label: "End",
    inputVariant: "outlined",
    fullWidth: true,
    margin: "normal",
    ampm: false,
    value: end,
    className: classes.formControl,
    onChange: (date) => {
      setEnd(date ? date.toISO() : "");
    }
  }))), /* @__PURE__ */ React__default.createElement(DialogActions, null, /* @__PURE__ */ React__default.createElement(Button, {
    disabled: isLoading,
    onClick: handleOverride,
    color: "primary",
    variant: "contained"
  }, "Override"), /* @__PURE__ */ React__default.createElement(Button, {
    disabled: isLoading,
    onClick: handleClose,
    color: "primary"
  }, "Cancel")));
};

const useStyles$6 = makeStyles({
  button: {
    marginTop: 4,
    padding: 0,
    lineHeight: 1.8,
    "& span": {
      lineHeight: 1.8,
      fontSize: "0.65rem"
    },
    "& svg": {
      fontSize: "0.85rem !important"
    }
  }
});
const OnCallShiftItem = ({
  scheduleId,
  shift,
  refetchOnCallSchedules
}) => {
  const classes = useStyles$6();
  const [isModalOpened, setIsModalOpened] = React__default.useState(false);
  const handleOverride = () => {
    setIsModalOpened(true);
  };
  if (!shift || !shift.start) {
    return /* @__PURE__ */ React__default.createElement(Grid, {
      container: true,
      spacing: 0
    }, /* @__PURE__ */ React__default.createElement(Grid, {
      item: true,
      sm: 12
    }, /* @__PURE__ */ React__default.createElement(Typography, {
      variant: "subtitle1",
      color: "textSecondary"
    }, "Nobody")));
  }
  return /* @__PURE__ */ React__default.createElement(Grid, {
    container: true,
    spacing: 0
  }, shift && shift.user ? /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    sm: 12
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle1",
    noWrap: true
  }, `${shift.user.firstName} ${shift.user.lastName} (${shift.user.username})`)) : null, /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    sm: 12
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle2",
    color: "textSecondary"
  }, `${DateTime.fromISO(shift.start).toFormat("D MMM, HH:mm")} - ${DateTime.fromISO(shift.end).toFormat("D MMM, HH:mm")}`)), /* @__PURE__ */ React__default.createElement(Grid, {
    item: true,
    sm: 12
  }, /* @__PURE__ */ React__default.createElement(Button, {
    color: "primary",
    size: "small",
    className: classes.button,
    startIcon: /* @__PURE__ */ React__default.createElement(RepeatIcon, null),
    onClick: handleOverride
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "overline"
  }, "Override shift")), /* @__PURE__ */ React__default.createElement(ShiftOverrideModal, {
    scheduleId,
    shift,
    refetchOnCallSchedules,
    isModalOpened,
    setIsModalOpened
  })));
};

const useStyles$5 = makeStyles(() => ({
  card: {
    margin: 16,
    width: "calc(100% - 32px)"
  },
  cardHeader: {
    maxWidth: "100%"
  },
  cardContent: {
    marginLeft: 80,
    borderLeft: "1px #808289 solid",
    position: "relative"
  },
  indicatorNext: {
    position: "absolute",
    top: "calc(40% - 10px)",
    left: -6,
    width: 12,
    height: 12,
    background: "#92949c !important",
    borderRadius: "50%"
  },
  indicatorCurrent: {
    position: "absolute",
    top: "calc(40% - 10px)",
    left: -6,
    width: 12,
    height: 12,
    background: "#ffb74d !important",
    color: "#ffb74d !important",
    borderRadius: "50%",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  },
  beforeText: {
    position: "absolute",
    top: "calc(31% - 10px)",
    left: -78,
    width: 65,
    height: 20,
    textAlign: "center",
    color: "#808289"
  },
  marginBottom: {
    marginBottom: 16
  },
  link: {
    fontSize: "1.5rem",
    fontWeight: 700,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "block"
  }
}));
const OnCallSchedulesGrid = ({
  onCallSchedules,
  isLoading,
  refetchOnCallSchedules
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles$5();
  if (isLoading) {
    return /* @__PURE__ */ React__default.createElement(Progress, null);
  }
  return /* @__PURE__ */ React__default.createElement(ItemCardGrid, {
    "data-testid": "docs-explore"
  }, !(onCallSchedules == null ? void 0 : onCallSchedules.length) ? null : onCallSchedules.map((schedule, index) => /* @__PURE__ */ React__default.createElement(Card, {
    key: index
  }, /* @__PURE__ */ React__default.createElement(CardHeader, {
    classes: { content: classes.cardHeader },
    title: /* @__PURE__ */ React__default.createElement(Link, {
      to: ilertApi.getScheduleDetailsURL(schedule),
      className: classes.link
    }, schedule.name)
  }), /* @__PURE__ */ React__default.createElement(CardContent, {
    className: classes.cardContent
  }, /* @__PURE__ */ React__default.createElement("div", {
    className: classes.indicatorCurrent
  }), /* @__PURE__ */ React__default.createElement(OnCallShiftItem, {
    shift: schedule.currentShift,
    scheduleId: schedule.id,
    refetchOnCallSchedules
  }), /* @__PURE__ */ React__default.createElement(Typography, {
    className: classes.beforeText,
    variant: "body2"
  }, "On call now")), /* @__PURE__ */ React__default.createElement(CardContent, {
    className: `${classes.cardContent} ${classes.marginBottom}`
  }, /* @__PURE__ */ React__default.createElement("div", {
    className: classes.indicatorNext
  }), /* @__PURE__ */ React__default.createElement(OnCallShiftItem, {
    shift: schedule.nextShift,
    scheduleId: schedule.id,
    refetchOnCallSchedules
  }), /* @__PURE__ */ React__default.createElement(Typography, {
    className: classes.beforeText,
    variant: "body2"
  }, "Next on call")))));
};

const useOnCallSchedules = () => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [onCallSchedulesList, setOnCallSchedulesList] = React__default.useState([]);
  const [isLoading, setIsLoading] = React__default.useState(false);
  const fetchOnCallSchedulesCall = async () => {
    try {
      setIsLoading(true);
      const data = await ilertApi.fetchOnCallSchedules();
      setOnCallSchedulesList(data || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };
  const { error, retry } = useAsyncRetry(fetchOnCallSchedulesCall, []);
  return [
    {
      onCallSchedules: onCallSchedulesList,
      error,
      isLoading
    },
    {
      retry,
      setIsLoading,
      refetchOnCallSchedules: fetchOnCallSchedulesCall
    }
  ];
};

const OnCallSchedulesPage = () => {
  const [{ onCallSchedules, isLoading, error }, { refetchOnCallSchedules }] = useOnCallSchedules();
  if (error) {
    if (error instanceof AuthenticationError) {
      return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(MissingAuthorizationHeaderError, null));
    }
    return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(ResponseErrorPanel, {
      error
    }));
  }
  return /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(ContentHeader, {
    title: "Who is on call?"
  }, /* @__PURE__ */ React__default.createElement(SupportButton, null, "This helps you to bring iLert into your developer portal.")), /* @__PURE__ */ React__default.createElement(OnCallSchedulesGrid, {
    onCallSchedules,
    isLoading,
    refetchOnCallSchedules
  }));
};

const ILertPage = () => {
  const [selectedTab, setSelectedTab] = React__default.useState(0);
  const tabs = [
    { label: "Who is on call?" },
    { label: "Incidents" },
    { label: "Uptime Monitors" }
  ];
  const renderTab = () => {
    switch (selectedTab) {
      case 0:
        return /* @__PURE__ */ React__default.createElement(OnCallSchedulesPage, null);
      case 1:
        return /* @__PURE__ */ React__default.createElement(IncidentsPage, null);
      case 2:
        return /* @__PURE__ */ React__default.createElement(UptimeMonitorsPage, null);
      default:
        return null;
    }
  };
  return /* @__PURE__ */ React__default.createElement(Page, {
    themeId: "website"
  }, /* @__PURE__ */ React__default.createElement(Header, {
    title: "iLert",
    type: "tool"
  }, /* @__PURE__ */ React__default.createElement(HeaderLabel, {
    label: "Owner",
    value: "iLert"
  }), /* @__PURE__ */ React__default.createElement(HeaderLabel, {
    label: "Lifecycle",
    value: "Alpha"
  })), /* @__PURE__ */ React__default.createElement(HeaderTabs, {
    selectedIndex: selectedTab,
    onChange: (index) => setSelectedTab(index),
    tabs: tabs.map(({ label }, index) => ({
      id: index.toString(),
      label
    }))
  }), /* @__PURE__ */ React__default.createElement(Content, {
    noPadding: true
  }, renderTab()));
};

const ILERT_INTEGRATION_KEY_ANNOTATION = "ilert.com/integration-key";

const ILertCardActionsHeader = ({
  alertSource,
  setAlertSource,
  setIsNewIncidentModalOpened,
  setIsMaintenanceModalOpened,
  uptimeMonitor
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const [isLoading, setIsLoading] = React__default.useState(false);
  const [isDisableModalOpened, setIsDisableModalOpened] = React__default.useState(false);
  const handleCreateNewIncident = () => {
    setIsNewIncidentModalOpened(true);
  };
  const handleEnableAlertSource = async () => {
    try {
      if (!alertSource) {
        return;
      }
      setIsLoading(true);
      const newAlertSource = await ilertApi.enableAlertSource(alertSource);
      alertApi.post({ message: "Alert source enabled." });
      setIsLoading(false);
      setAlertSource(newAlertSource);
    } catch (err) {
      setIsLoading(false);
      alertApi.post({ message: err, severity: "error" });
    }
  };
  const handleDisableAlertSource = async () => {
    try {
      if (!alertSource) {
        return;
      }
      setIsDisableModalOpened(false);
      setIsLoading(true);
      const newAlertSource = await ilertApi.disableAlertSource(alertSource);
      alertApi.post({ message: "Alert source disabled." });
      setIsLoading(false);
      setAlertSource(newAlertSource);
    } catch (err) {
      setIsLoading(false);
      alertApi.post({ message: err, severity: "error" });
    }
  };
  const handleDisableAlertSourceWarningOpen = () => {
    setIsDisableModalOpened(true);
  };
  const handleDisableAlertSourceWarningClose = () => {
    setIsDisableModalOpened(false);
  };
  const handleMaintenanceAlertSource = () => {
    setIsMaintenanceModalOpened(true);
  };
  const alertSourceLink = {
    label: "Alert Source",
    href: ilertApi.getAlertSourceDetailsURL(alertSource),
    icon: /* @__PURE__ */ React__default.createElement(WebIcon, null)
  };
  const createIncidentLink = {
    label: "Create Incident",
    onClick: handleCreateNewIncident,
    icon: /* @__PURE__ */ React__default.createElement(AlarmAddIcon, null),
    color: "secondary",
    disabled: !alertSource || alertSource.status === "DISABLED" || alertSource.status === "IN_MAINTENANCE"
  };
  const enableAlertSourceLink = {
    label: "Enable",
    onClick: handleEnableAlertSource,
    icon: /* @__PURE__ */ React__default.createElement(PlayArrowIcon, null),
    disabled: !alertSource || isLoading
  };
  const disableAlertSourceLink = {
    label: "Disable",
    onClick: handleDisableAlertSourceWarningOpen,
    icon: /* @__PURE__ */ React__default.createElement(PauseIcon, null),
    disabled: !alertSource || isLoading
  };
  const maintenanceAlertSourceLink = {
    label: "Immediate maintenance",
    onClick: handleMaintenanceAlertSource,
    icon: /* @__PURE__ */ React__default.createElement(BuildIcon, null),
    disabled: !alertSource || isLoading
  };
  const uptimeMonitorReportLink = {
    label: "Uptime Report",
    href: uptimeMonitor ? uptimeMonitor.shareUrl : "",
    icon: /* @__PURE__ */ React__default.createElement(TimelineIcon, null),
    disabled: !alertSource || !uptimeMonitor || isLoading
  };
  const links = [
    alertSourceLink,
    createIncidentLink,
    alertSource && alertSource.active ? disableAlertSourceLink : enableAlertSourceLink
  ];
  if (alertSource && alertSource.integrationType === "MONITOR") {
    links.push(uptimeMonitorReportLink);
  }
  if (alertSource && alertSource.status !== "IN_MAINTENANCE") {
    links.push(maintenanceAlertSourceLink);
  }
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(HeaderIconLinkRow, {
    links
  }), /* @__PURE__ */ React__default.createElement(Dialog, {
    open: isDisableModalOpened,
    onClose: handleDisableAlertSourceWarningClose,
    "aria-labelledby": "alert-source-disable-form-title"
  }, /* @__PURE__ */ React__default.createElement(DialogTitle, {
    id: "alert-source-disable-form-title"
  }, "Disable alert source"), /* @__PURE__ */ React__default.createElement(DialogContent, null, /* @__PURE__ */ React__default.createElement(Alert, {
    severity: "info"
  }, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "body1",
    align: "justify"
  }, "Do you really want to disable this alert source? A disabled alert source cannot create new incidents."))), /* @__PURE__ */ React__default.createElement(DialogActions, null, /* @__PURE__ */ React__default.createElement(Button, {
    onClick: handleDisableAlertSource,
    color: "secondary",
    variant: "contained"
  }, "Disable"), /* @__PURE__ */ React__default.createElement(Button, {
    onClick: handleDisableAlertSourceWarningClose,
    color: "primary"
  }, "Cancel"))));
};

const useAlertSource = (integrationKey) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [alertSource, setAlertSource] = React__default.useState(null);
  const [isAlertSourceLoading, setIsAlertSourceLoading] = React__default.useState(false);
  const [uptimeMonitor, setUptimeMonitor] = React__default.useState(null);
  const [isUptimeMonitorLoading, setIsUptimeMonitorLoading] = React__default.useState(false);
  const fetchAlertSourceCall = async () => {
    try {
      if (!integrationKey) {
        return;
      }
      setIsAlertSourceLoading(true);
      const data = await ilertApi.fetchAlertSource(integrationKey);
      setAlertSource(data || null);
      setIsAlertSourceLoading(false);
    } catch (e) {
      setIsAlertSourceLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };
  const { error: alertSourceError, retry: alertSourceRetry } = useAsyncRetry(fetchAlertSourceCall, [integrationKey]);
  const fetchUptimeMonitorCall = async () => {
    try {
      if (!alertSource || alertSource.integrationType !== "MONITOR") {
        return;
      }
      setIsUptimeMonitorLoading(true);
      const data = await ilertApi.fetchUptimeMonitor(alertSource.id);
      setUptimeMonitor(data || null);
      setIsUptimeMonitorLoading(false);
    } catch (e) {
      setIsUptimeMonitorLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };
  const { error: uptimeMonitorError, retry: uptimeMonitorRetry } = useAsyncRetry(fetchUptimeMonitorCall, [alertSource]);
  const retry = () => {
    alertSourceRetry();
    uptimeMonitorRetry();
  };
  return [
    {
      alertSource,
      uptimeMonitor,
      error: alertSourceError || uptimeMonitorError,
      isLoading: isAlertSourceLoading || isUptimeMonitorLoading
    },
    {
      retry,
      setIsLoading: setIsAlertSourceLoading,
      refetchAlertSource: fetchAlertSourceCall,
      setAlertSource
    }
  ];
};

function useILertEntity() {
  var _a;
  const { entity } = useEntity();
  const integrationKey = ((_a = entity.metadata.annotations) == null ? void 0 : _a[ILERT_INTEGRATION_KEY_ANNOTATION]) || "";
  const name = entity.metadata.name;
  const identifier = `${entity.kind}:${entity.metadata.namespace || "default"}/${entity.metadata.name}`;
  return { integrationKey, name, identifier };
}

const MaintenanceChip = withStyles$1({
  root: {
    backgroundColor: "#92949c",
    color: "white",
    marginTop: 8
  }
})(Chip$1);
const ILertCardHeaderStatus = ({
  alertSource
}) => {
  if (!alertSource) {
    return null;
  }
  switch (alertSource.status) {
    case "IN_MAINTENANCE":
      return /* @__PURE__ */ React__default.createElement(MaintenanceChip, {
        label: "MAINTENANCE",
        size: "small"
      });
    case "DISABLED":
      return /* @__PURE__ */ React__default.createElement(MaintenanceChip, {
        label: "INACTIVE",
        size: "small"
      });
    default:
      return null;
  }
};

const ILertCardMaintenanceModal = ({
  alertSource,
  refetchAlertSource,
  isModalOpened,
  setIsModalOpened
}) => {
  const ilertApi = useApi(ilertApiRef);
  const alertApi = useApi(alertApiRef);
  const [minutes, setMinutes] = React__default.useState(5);
  const handleClose = () => {
    setIsModalOpened(false);
  };
  const handleImmediateMaintenance = () => {
    if (!alertSource) {
      return;
    }
    setIsModalOpened(false);
    setTimeout(async () => {
      try {
        await ilertApi.addImmediateMaintenance(alertSource.id, minutes);
        alertApi.post({ message: "Maintenance started." });
        refetchAlertSource();
      } catch (err) {
        alertApi.post({ message: err, severity: "error" });
      }
    }, 250);
  };
  const handleMinutesChange = (event) => {
    setMinutes(event.target.value);
  };
  const minuteOptions = [
    {
      value: 5,
      label: "5 minutes"
    },
    {
      value: 10,
      label: "10 minutes"
    },
    {
      value: 15,
      label: "15 minutes"
    },
    {
      value: 30,
      label: "30 minutes"
    },
    {
      value: 60,
      label: "60 minutes"
    }
  ];
  if (!alertSource) {
    return null;
  }
  return /* @__PURE__ */ React__default.createElement(Dialog, {
    open: isModalOpened,
    onClose: handleClose,
    "aria-labelledby": "maintenance-form-title"
  }, /* @__PURE__ */ React__default.createElement(DialogTitle, {
    id: "maintenance-form-title"
  }, "New maintenance window"), /* @__PURE__ */ React__default.createElement(DialogContent, null, /* @__PURE__ */ React__default.createElement(DialogContentText, null, "Keep your alert sources quiet, when your systems are under maintenance."), /* @__PURE__ */ React__default.createElement(TextField, {
    select: true,
    label: "Duration",
    value: minutes,
    onChange: handleMinutesChange,
    variant: "outlined",
    fullWidth: true
  }, minuteOptions.map((option) => /* @__PURE__ */ React__default.createElement(MenuItem, {
    key: option.value,
    value: option.value
  }, option.label)))), /* @__PURE__ */ React__default.createElement(DialogActions, null, /* @__PURE__ */ React__default.createElement(Button, {
    onClick: handleImmediateMaintenance,
    color: "primary",
    variant: "contained"
  }, "Create"), /* @__PURE__ */ React__default.createElement(Button, {
    onClick: handleClose,
    color: "primary"
  }, "Cancel")));
};

const ENTITY_YAML = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example
  description: example.com
  annotations:
    ilert.com/integration-key: [INTEGRATION_KEY]
spec:
  type: website
  lifecycle: production
  owner: guest`;
const useStyles$4 = makeStyles((theme) => ({
  code: {
    borderRadius: 6,
    margin: theme.spacing(2, 0),
    background: theme.palette.type === "dark" ? "#444" : "#fff"
  },
  header: {
    display: "inline-block",
    padding: theme.spacing(2, 2, 2, 2.5)
  }
}));
const ILertCardEmptyState = () => {
  const classes = useStyles$4();
  return /* @__PURE__ */ React__default.createElement(Card, {
    "data-testid": "ilert-empty-card"
  }, /* @__PURE__ */ React__default.createElement(CardHeader, {
    title: "iLert",
    className: classes.header
  }), /* @__PURE__ */ React__default.createElement(Divider, null), /* @__PURE__ */ React__default.createElement(CardContent, null, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "body1"
  }, "No integration key defined for this entity. You can add integration key to your entity YAML as shown in the highlighted example below:"), /* @__PURE__ */ React__default.createElement("div", {
    className: classes.code
  }, /* @__PURE__ */ React__default.createElement(CodeSnippet, {
    text: ENTITY_YAML,
    language: "yaml",
    showLineNumbers: true,
    highlightedNumbers: [6, 7],
    customStyle: { background: "inherit", fontSize: "115%" }
  })), /* @__PURE__ */ React__default.createElement(Button, {
    variant: "contained",
    color: "primary",
    target: "_blank",
    href: "https://github.com/backstage/backstage/blob/master/plugins/ilert/README.md"
  }, "Read more")));
};

const useAlertSourceOnCalls = (alertSource) => {
  const ilertApi = useApi(ilertApiRef);
  const errorApi = useApi(errorApiRef);
  const [onCallsList, setOnCallsList] = React__default.useState([]);
  const [isLoading, setIsLoading] = React__default.useState(false);
  const fetchAlertSourceOnCallsCall = async () => {
    try {
      if (!alertSource) {
        return;
      }
      setIsLoading(true);
      const data = await ilertApi.fetchAlertSourceOnCalls(alertSource);
      setOnCallsList(data || []);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (!(e instanceof AuthenticationError)) {
        errorApi.post(e);
      }
      throw e;
    }
  };
  const { error, retry } = useAsyncRetry(fetchAlertSourceOnCallsCall, [
    alertSource
  ]);
  return [
    {
      onCalls: onCallsList,
      error,
      isLoading
    },
    {
      retry,
      setIsLoading,
      refetchAlertSourceOnCalls: fetchAlertSourceOnCallsCall
    }
  ];
};

const useStyles$3 = makeStyles({
  text: {
    fontStyle: "italic"
  }
});
const ILertCardOnCallEmptyState = () => {
  const classes = useStyles$3();
  return /* @__PURE__ */ React__default.createElement(ListItem, null, /* @__PURE__ */ React__default.createElement(ListItemText, null, /* @__PURE__ */ React__default.createElement(Typography, {
    variant: "subtitle1",
    color: "textSecondary",
    className: classes.text
  }, "Nobody")));
};

const useStyles$2 = makeStyles({
  listItemPrimary: {
    fontWeight: "bold"
  },
  fistItemLine: {
    position: "absolute",
    bottom: 0,
    height: "50%",
    left: 36
  },
  lastItemLine: {
    position: "absolute",
    top: 0,
    height: "50%",
    left: 36
  },
  itemLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    height: "100%",
    left: 36
  }
});
const ILertCardOnCallItem = ({
  onCall,
  fistItem = false,
  lastItem = false
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles$2();
  if (!onCall || !onCall.user) {
    return null;
  }
  const phoneNumber = ilertApi.getUserPhoneNumber(onCall.user);
  const escalationRepeating = onCall.escalationPolicy.repeating;
  const escalationSeconds = onCall.escalationPolicy.escalationRules[onCall.escalationLevel - 1].escalationTimeout;
  const escalationHoursOnly = Math.floor(escalationSeconds / 60);
  const escalationMinutesOnly = escalationSeconds % 60;
  let escalationText = "";
  if (!lastItem || lastItem && escalationRepeating) {
    escalationText = "escalate";
    if (escalationSeconds === 0) {
      escalationText += " immediately";
    } else {
      escalationText += " after";
      if (escalationHoursOnly > 0) {
        escalationText += ` ${escalationHoursOnly} ${escalationHoursOnly === 1 ? "hour" : "hours"}`;
      }
      if (escalationMinutesOnly > 0 || escalationSeconds === 0) {
        escalationText += ` ${escalationMinutesOnly} ${escalationMinutesOnly === 1 ? "minute" : "minutes"}`;
      }
    }
  }
  return /* @__PURE__ */ React__default.createElement(ListItem, null, fistItem ? /* @__PURE__ */ React__default.createElement(Divider, {
    orientation: "vertical",
    className: classes.fistItemLine
  }) : null, lastItem ? /* @__PURE__ */ React__default.createElement(Divider, {
    orientation: "vertical",
    className: classes.lastItemLine
  }) : null, !fistItem && !lastItem ? /* @__PURE__ */ React__default.createElement(Divider, {
    orientation: "vertical",
    className: classes.itemLine
  }) : null, /* @__PURE__ */ React__default.createElement(ListItemIcon, null, /* @__PURE__ */ React__default.createElement(Tooltip, {
    title: `Escalation level #${onCall.escalationLevel}`,
    placement: "top"
  }, /* @__PURE__ */ React__default.createElement(Avatar, null, onCall.escalationLevel))), onCall.schedule ? /* @__PURE__ */ React__default.createElement(Tooltip, {
    title: `On call shift ${DateTime.fromISO(onCall.start).toFormat("D MMM, HH:mm")} - ${DateTime.fromISO(onCall.end).toFormat("D MMM, HH:mm")}`,
    placement: "top-start"
  }, /* @__PURE__ */ React__default.createElement(ListItemText, {
    primary: /* @__PURE__ */ React__default.createElement(Typography, {
      className: classes.listItemPrimary
    }, ilertApi.getUserInitials(onCall.user)),
    secondary: escalationText
  })) : /* @__PURE__ */ React__default.createElement(ListItemText, {
    primary: /* @__PURE__ */ React__default.createElement(Typography, {
      className: classes.listItemPrimary
    }, ilertApi.getUserInitials(onCall.user)),
    secondary: escalationText
  }), /* @__PURE__ */ React__default.createElement(ListItemSecondaryAction, null, phoneNumber ? /* @__PURE__ */ React__default.createElement(Tooltip, {
    title: "Call to user",
    placement: "top"
  }, /* @__PURE__ */ React__default.createElement(IconButton$1, {
    href: `tel:${phoneNumber}`
  }, /* @__PURE__ */ React__default.createElement(PhoneIcon, {
    color: "secondary"
  }))) : null, /* @__PURE__ */ React__default.createElement(Tooltip, {
    title: `Send e-mail to user ${onCall.user.email}`,
    placement: "top"
  }, /* @__PURE__ */ React__default.createElement(IconButton$1, {
    href: `mailto:${onCall.user.email}`
  }, /* @__PURE__ */ React__default.createElement(EmailIcon, {
    color: "primary"
  })))));
};

const useStyles$1 = makeStyles((theme) => ({
  repeatText: {
    fontStyle: "italic"
  },
  repeatIcon: {
    marginLeft: theme.spacing(1)
  }
}));
const ILertCardOnCall = ({
  alertSource
}) => {
  const classes = useStyles$1();
  const [{ onCalls, isLoading }, {}] = useAlertSourceOnCalls(alertSource);
  if (isLoading) {
    return /* @__PURE__ */ React__default.createElement(Progress, null);
  }
  if (!alertSource || !onCalls) {
    return null;
  }
  const repeatInfo = () => {
    if (!alertSource || !alertSource.escalationPolicy || !alertSource.escalationPolicy.repeating || !alertSource.escalationPolicy.frequency) {
      return null;
    }
    return /* @__PURE__ */ React__default.createElement(ListItem, {
      key: "repeat"
    }, /* @__PURE__ */ React__default.createElement(ListItemIcon, null, /* @__PURE__ */ React__default.createElement(ReplayIcon, {
      className: classes.repeatIcon,
      fontSize: "small"
    })), /* @__PURE__ */ React__default.createElement(ListItemText, {
      primary: /* @__PURE__ */ React__default.createElement(Typography, {
        variant: "body2",
        color: "textSecondary",
        className: classes.repeatText
      }, `Repeat ${alertSource.escalationPolicy.frequency} times`)
    }));
  };
  if (!onCalls.length) {
    return /* @__PURE__ */ React__default.createElement(List, {
      dense: true,
      subheader: /* @__PURE__ */ React__default.createElement(ListSubheader, null, "ON CALL")
    }, /* @__PURE__ */ React__default.createElement(ILertCardOnCallEmptyState, null));
  }
  if (onCalls.length === 1) {
    /* @__PURE__ */ React__default.createElement(List, {
      dense: true,
      subheader: /* @__PURE__ */ React__default.createElement(ListSubheader, null, "ON CALL")
    }, /* @__PURE__ */ React__default.createElement(ILertCardOnCallItem, {
      onCall: onCalls[0],
      fistItem: false,
      lastItem: false
    }));
  }
  return /* @__PURE__ */ React__default.createElement(List, {
    dense: true,
    subheader: /* @__PURE__ */ React__default.createElement(ListSubheader, null, "ON CALL")
  }, onCalls.map((onCall, index) => /* @__PURE__ */ React__default.createElement(ILertCardOnCallItem, {
    key: index,
    onCall,
    fistItem: index === 0,
    lastItem: index === onCalls.length - 1
  })), repeatInfo());
};

const isPluginApplicableToEntity = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[ILERT_INTEGRATION_KEY_ANNOTATION]);
};
const useStyles = makeStyles({
  content: {
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
    paddingBottom: "0 !important",
    paddingTop: "0 !important",
    "& div div": {
      boxShadow: "none !important"
    }
  }
});
const ILertCard = () => {
  const classes = useStyles();
  const { integrationKey, name } = useILertEntity();
  const [
    { alertSource, uptimeMonitor },
    { setAlertSource, refetchAlertSource }
  ] = useAlertSource(integrationKey);
  const [
    { tableState, states, incidents, incidentsCount, isLoading, error },
    {
      onIncidentStatesChange,
      onChangePage,
      onChangeRowsPerPage,
      onIncidentChanged,
      refetchIncidents,
      setIsLoading
    }
  ] = useIncidents(false, true, alertSource);
  const [isNewIncidentModalOpened, setIsNewIncidentModalOpened] = React__default.useState(false);
  const [isMaintenanceModalOpened, setIsMaintenanceModalOpened] = React__default.useState(false);
  if (error) {
    if (error instanceof AuthenticationError) {
      return /* @__PURE__ */ React__default.createElement(MissingAuthorizationHeaderError, null);
    }
    return /* @__PURE__ */ React__default.createElement(ResponseErrorPanel, {
      error
    });
  }
  if (!integrationKey) {
    return /* @__PURE__ */ React__default.createElement(ILertCardEmptyState, null);
  }
  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, /* @__PURE__ */ React__default.createElement(Card, {
    "data-testid": "ilert-card"
  }, /* @__PURE__ */ React__default.createElement(CardHeader, {
    title: "iLert",
    subheader: /* @__PURE__ */ React__default.createElement(ILertCardActionsHeader, {
      alertSource,
      setAlertSource,
      setIsNewIncidentModalOpened,
      setIsMaintenanceModalOpened,
      uptimeMonitor
    }),
    action: /* @__PURE__ */ React__default.createElement(ILertCardHeaderStatus, {
      alertSource
    })
  }), /* @__PURE__ */ React__default.createElement(Divider, null), /* @__PURE__ */ React__default.createElement(CardContent, {
    className: classes.content
  }, /* @__PURE__ */ React__default.createElement(ILertCardOnCall, {
    alertSource
  }), /* @__PURE__ */ React__default.createElement(IncidentsTable, {
    incidents,
    incidentsCount,
    tableState,
    states,
    onIncidentChanged,
    onIncidentStatesChange,
    onChangePage,
    onChangeRowsPerPage,
    isLoading,
    setIsLoading,
    compact: true
  }))), /* @__PURE__ */ React__default.createElement(IncidentNewModal, {
    isModalOpened: isNewIncidentModalOpened,
    setIsModalOpened: setIsNewIncidentModalOpened,
    refetchIncidents,
    initialAlertSource: alertSource,
    entityName: name
  }), /* @__PURE__ */ React__default.createElement(ILertCardMaintenanceModal, {
    alertSource,
    refetchAlertSource,
    isModalOpened: isMaintenanceModalOpened,
    setIsModalOpened: setIsMaintenanceModalOpened
  }));
};

const ILertIcon = SvgIlertIcon;

export { EntityILertCard, ILertCard, ILertClient, ILertIcon, ILertPage$1 as ILertPage, ILertPage as Router, iLertRouteRef, ilertApiRef, ilertPlugin, isPluginApplicableToEntity as isILertAvailable, isPluginApplicableToEntity, ilertPlugin as plugin };
//# sourceMappingURL=index.esm.js.map
