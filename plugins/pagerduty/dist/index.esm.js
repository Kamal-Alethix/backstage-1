import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, configApiRef, identityApiRef, createComponentExtension, useApi, alertApiRef } from '@backstage/core-plugin-api';
import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles, ListItem, ListItemText, Chip, Typography, Link, ListItemSecondaryAction, Tooltip, IconButton, Grid, List, ListSubheader, ListItemIcon, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Card, CardHeader, Divider, CardContent } from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Warning from '@material-ui/icons/Warning';
import { DateTime, Duration } from 'luxon';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import EmptyStateImage from './assets/emptystate.svg';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { Alert } from '@material-ui/lab';
import { Progress, StatusWarning, EmptyState, Link as Link$1, HeaderIconLinkRow, TabbedCard, CardTab } from '@backstage/core-components';
import Avatar from '@material-ui/core/Avatar';
import EmailIcon from '@material-ui/icons/Email';
import useAsync from 'react-use/lib/useAsync';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import WebIcon from '@material-ui/icons/Web';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { useEntity } from '@backstage/plugin-catalog-react';
import { parseEntityRef, DEFAULT_NAMESPACE } from '@backstage/catalog-model';

class UnauthorizedError extends Error {
}
const pagerDutyApiRef = createApiRef({
  id: "plugin.pagerduty.api"
});
class PagerDutyClient {
  constructor(config) {
    this.config = config;
  }
  static fromConfig(configApi, discoveryApi, identityApi) {
    var _a;
    const eventsBaseUrl = (_a = configApi.getOptionalString("pagerDuty.eventsBaseUrl")) != null ? _a : "https://events.pagerduty.com/v2";
    return new PagerDutyClient({
      eventsBaseUrl,
      discoveryApi,
      identityApi
    });
  }
  async getServiceByIntegrationKey(integrationKey) {
    const params = `time_zone=UTC&include[]=integrations&include[]=escalation_policies&query=${integrationKey}`;
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/pagerduty/services?${params}`;
    const { services } = await this.getByUrl(url);
    return services;
  }
  async getIncidentsByServiceId(serviceId) {
    const params = `time_zone=UTC&sort_by=created_at&statuses[]=triggered&statuses[]=acknowledged&service_ids[]=${serviceId}`;
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/pagerduty/incidents?${params}`;
    const { incidents } = await this.getByUrl(url);
    return incidents;
  }
  async getChangeEventsByServiceId(serviceId) {
    const params = `limit=5&time_zone=UTC&sort_by=timestamp`;
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/pagerduty/services/${serviceId}/change_events?${params}`;
    const { change_events } = await this.getByUrl(url);
    return change_events;
  }
  async getOnCallByPolicyId(policyId) {
    const params = `time_zone=UTC&include[]=users&escalation_policy_ids[]=${policyId}`;
    const url = `${await this.config.discoveryApi.getBaseUrl("proxy")}/pagerduty/oncalls?${params}`;
    const { oncalls } = await this.getByUrl(url);
    return oncalls;
  }
  triggerAlarm(request) {
    var _a;
    const { integrationKey, source, description, userName } = request;
    const body = JSON.stringify({
      event_action: "trigger",
      routing_key: integrationKey,
      client: "Backstage",
      client_url: source,
      payload: {
        summary: description,
        source,
        severity: "error",
        class: "manual trigger",
        custom_details: {
          user: userName
        }
      }
    });
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json, text/plain, */*"
      },
      body
    };
    const url = (_a = this.config.eventsBaseUrl) != null ? _a : "https://events.pagerduty.com/v2";
    return this.request(`${url}/enqueue`, options);
  }
  async getByUrl(url) {
    const { token: idToken } = await this.config.identityApi.getCredentials();
    const options = {
      method: "GET",
      headers: {
        Accept: "application/vnd.pagerduty+json;version=2",
        "Content-Type": "application/json",
        ...idToken && { Authorization: `Bearer ${idToken}` }
      }
    };
    const response = await this.request(url, options);
    return response.json();
  }
  async request(url, options) {
    const response = await fetch(url, options);
    if (response.status === 401) {
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

createRouteRef({
  id: "pagerduty"
});
const pagerDutyPlugin = createPlugin({
  id: "pagerduty",
  apis: [
    createApiFactory({
      api: pagerDutyApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        configApi: configApiRef,
        identityApi: identityApiRef
      },
      factory: ({ configApi, discoveryApi, identityApi }) => PagerDutyClient.fromConfig(configApi, discoveryApi, identityApi)
    })
  ]
});
const EntityPagerDutyCard = pagerDutyPlugin.provide(createComponentExtension({
  name: "EntityPagerDutyCard",
  component: {
    lazy: () => Promise.resolve().then(function () { return index; }).then((m) => m.PagerDutyCard)
  }
}));

const useStyles$4 = makeStyles((theme) => ({
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
  warning: {
    borderColor: theme.palette.status.warning,
    color: theme.palette.status.warning,
    "& *": {
      color: theme.palette.status.warning
    }
  },
  error: {
    borderColor: theme.palette.status.error,
    color: theme.palette.status.error,
    "& *": {
      color: theme.palette.status.error
    }
  }
}));
const IncidentListItem = ({ incident }) => {
  var _a, _b, _c;
  const classes = useStyles$4();
  const duration = new Date().getTime() - new Date(incident.created_at).getTime();
  const createdAt = DateTime.local().minus(Duration.fromMillis(duration)).toRelative({ locale: "en" });
  const user = (_a = incident.assignments[0]) == null ? void 0 : _a.assignee;
  return /* @__PURE__ */ React.createElement(ListItem, {
    dense: true,
    key: incident.id
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Chip, {
      "data-testid": `chip-${incident.status}`,
      label: incident.status,
      size: "small",
      variant: "outlined",
      icon: incident.status === "acknowledged" ? /* @__PURE__ */ React.createElement(Done, null) : /* @__PURE__ */ React.createElement(Warning, null),
      className: incident.status === "triggered" ? classes.error : classes.warning
    }), incident.title),
    primaryTypographyProps: {
      variant: "body1",
      className: classes.listItemPrimary
    },
    secondary: /* @__PURE__ */ React.createElement(Typography, {
      noWrap: true,
      variant: "body2",
      color: "textSecondary"
    }, "Created ", createdAt, " and assigned to", " ", /* @__PURE__ */ React.createElement(Link, {
      href: (_b = user == null ? void 0 : user.html_url) != null ? _b : "#",
      target: "_blank",
      rel: "noopener noreferrer"
    }, (_c = user == null ? void 0 : user.summary) != null ? _c : "nobody"))
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "View in PagerDuty",
    placement: "top"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    href: incident.html_url,
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

const Incidents = ({ serviceId, refreshIncidents }) => {
  const api = useApi(pagerDutyApiRef);
  const [{ value: incidents, loading, error }, getIncidents] = useAsyncFn(async () => await api.getIncidentsByServiceId(serviceId));
  useEffect(() => {
    getIncidents();
  }, [refreshIncidents, getIncidents]);
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching information. ", error.message);
  }
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (!(incidents == null ? void 0 : incidents.length)) {
    return /* @__PURE__ */ React.createElement(IncidentsEmptyState, null);
  }
  return /* @__PURE__ */ React.createElement(List, {
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, null, "INCIDENTS")
  }, incidents.map((incident, index) => /* @__PURE__ */ React.createElement(IncidentListItem, {
    key: incident.id + index,
    incident
  })));
};

const useStyles$3 = makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
});
const EscalationUsersEmptyState = () => {
  const classes = useStyles$3();
  return /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement("div", {
    className: classes.denseListIcon
  }, /* @__PURE__ */ React.createElement(StatusWarning, null))), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: "Empty escalation policy"
  }));
};

const useStyles$2 = makeStyles({
  listItemPrimary: {
    fontWeight: "bold"
  }
});
const EscalationUser = ({ user }) => {
  const classes = useStyles$2();
  return /* @__PURE__ */ React.createElement(ListItem, null, /* @__PURE__ */ React.createElement(ListItemIcon, null, /* @__PURE__ */ React.createElement(Avatar, {
    alt: "User"
  })), /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(Typography, {
      className: classes.listItemPrimary
    }, user.name),
    secondary: user.email
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, /* @__PURE__ */ React.createElement(Tooltip, {
    title: "Send e-mail to user",
    placement: "top"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    href: `mailto:${user.email}`
  }, /* @__PURE__ */ React.createElement(EmailIcon, {
    color: "primary"
  }))), /* @__PURE__ */ React.createElement(Tooltip, {
    title: "View in PagerDuty",
    placement: "top"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    href: user.html_url,
    target: "_blank",
    rel: "noopener noreferrer",
    color: "primary"
  }, /* @__PURE__ */ React.createElement(OpenInBrowserIcon, null)))));
};

const EscalationPolicy = ({ policyId }) => {
  const api = useApi(pagerDutyApiRef);
  const {
    value: users,
    loading,
    error
  } = useAsync(async () => {
    const oncalls = await api.getOnCallByPolicyId(policyId);
    const usersItem = oncalls.sort((a, b) => a.escalation_level - b.escalation_level).map((oncall) => oncall.user);
    return usersItem;
  });
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching information. ", error.message);
  }
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (!(users == null ? void 0 : users.length)) {
    return /* @__PURE__ */ React.createElement(EscalationUsersEmptyState, null);
  }
  return /* @__PURE__ */ React.createElement(List, {
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, null, "ON CALL")
  }, users.map((user, index) => /* @__PURE__ */ React.createElement(EscalationUser, {
    key: index,
    user
  })));
};

const MissingTokenError = () => /* @__PURE__ */ React.createElement(EmptyState, {
  missing: "info",
  title: "Missing or invalid PagerDuty Token",
  description: "The request to fetch data needs a valid token. See README for more details.",
  action: /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    variant: "contained",
    href: "https://github.com/backstage/backstage/blob/master/plugins/pagerduty/README.md"
  }, "Read More")
});

const PAGERDUTY_INTEGRATION_KEY = "pagerduty.com/integration-key";

function usePagerdutyEntity() {
  var _a;
  const { entity } = useEntity();
  const integrationKey = (_a = entity.metadata.annotations) == null ? void 0 : _a[PAGERDUTY_INTEGRATION_KEY];
  const name = entity.metadata.name;
  return { integrationKey, name };
}

const TriggerDialog = ({
  showDialog,
  handleDialog,
  onIncidentCreated
}) => {
  const { name, integrationKey } = usePagerdutyEntity();
  const alertApi = useApi(alertApiRef);
  const identityApi = useApi(identityApiRef);
  const api = useApi(pagerDutyApiRef);
  const [description, setDescription] = useState("");
  const [{ value, loading, error }, handleTriggerAlarm] = useAsyncFn(async (descriptions) => {
    const { userEntityRef } = await identityApi.getBackstageIdentity();
    const { name: userName } = parseEntityRef(userEntityRef, {
      defaultKind: "User",
      defaultNamespace: DEFAULT_NAMESPACE
    });
    return await api.triggerAlarm({
      integrationKey,
      source: window.location.toString(),
      description: descriptions,
      userName
    });
  });
  const descriptionChanged = (event) => {
    setDescription(event.target.value);
  };
  useEffect(() => {
    if (value) {
      (async () => {
        alertApi.post({
          message: `Alarm successfully triggered`
        });
        handleDialog();
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        onIncidentCreated == null ? void 0 : onIncidentCreated();
      })();
    }
  }, [value, alertApi, handleDialog, onIncidentCreated]);
  if (error) {
    alertApi.post({
      message: `Failed to trigger alarm. ${error.message}`,
      severity: "error"
    });
  }
  return /* @__PURE__ */ React.createElement(Dialog, {
    maxWidth: "md",
    open: showDialog,
    onClose: handleDialog,
    fullWidth: true
  }, /* @__PURE__ */ React.createElement(DialogTitle, null, "This action will trigger an incident for ", /* @__PURE__ */ React.createElement("strong", null, '"', name, '"'), "."), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(Alert, {
    severity: "info"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    align: "justify"
  }, `If the issue you are seeing does not need urgent attention, please get in touch with the responsible team using their preferred communications channel. You can find information about the owner of this entity in the "About" card. If the issue is urgent, please don't hesitate to trigger the alert.`)), /* @__PURE__ */ React.createElement(Typography, {
    variant: "body1",
    style: { marginTop: "1em" },
    gutterBottom: true,
    align: "justify"
  }, "Please describe the problem you want to report. Be as descriptive as possible. Your signed in user and a reference to the current page will automatically be amended to the alarm so that the receiver can reach out to you if necessary."), /* @__PURE__ */ React.createElement(TextField, {
    inputProps: { "data-testid": "trigger-input" },
    id: "description",
    multiline: true,
    fullWidth: true,
    rows: "4",
    margin: "normal",
    label: "Problem description",
    variant: "outlined",
    onChange: descriptionChanged
  })), /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(Button, {
    "data-testid": "trigger-button",
    id: "trigger",
    color: "secondary",
    disabled: !description || loading,
    variant: "contained",
    onClick: () => handleTriggerAlarm(description),
    endIcon: loading && /* @__PURE__ */ React.createElement(CircularProgress, {
      size: 16
    })
  }, "Trigger Incident"), /* @__PURE__ */ React.createElement(Button, {
    id: "close",
    color: "primary",
    onClick: handleDialog
  }, "Close")));
};

const useStyles$1 = makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  listItemPrimary: {
    fontWeight: "bold"
  }
});
const ChangeEventListItem = ({ changeEvent }) => {
  const classes = useStyles$1();
  const duration = new Date().getTime() - new Date(changeEvent.timestamp).getTime();
  const changedAt = DateTime.local().minus(Duration.fromMillis(duration)).toRelative({ locale: "en" });
  let externalLinkElem = null;
  if (changeEvent.links.length > 0) {
    const text = changeEvent.links[0].text;
    externalLinkElem = /* @__PURE__ */ React.createElement(Tooltip, {
      title: text,
      placement: "top"
    }, /* @__PURE__ */ React.createElement(IconButton, {
      component: Link$1,
      to: changeEvent.links[0].href,
      color: "primary"
    }, /* @__PURE__ */ React.createElement(OpenInBrowserIcon, null)));
  }
  return /* @__PURE__ */ React.createElement(ListItem, {
    dense: true,
    key: changeEvent.id
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    primary: /* @__PURE__ */ React.createElement(React.Fragment, null, changeEvent.summary),
    primaryTypographyProps: {
      variant: "body1",
      className: classes.listItemPrimary
    },
    secondary: /* @__PURE__ */ React.createElement(Typography, {
      variant: "body2",
      color: "textSecondary"
    }, "Triggered from ", changeEvent.source, " ", changedAt, ".")
  }), /* @__PURE__ */ React.createElement(ListItemSecondaryAction, null, externalLinkElem, changeEvent.html_url === void 0 ? null : /* @__PURE__ */ React.createElement(Tooltip, {
    title: "View in PagerDuty",
    placement: "top"
  }, /* @__PURE__ */ React.createElement(IconButton, {
    component: Link$1,
    to: changeEvent.html_url,
    color: "primary"
  }, /* @__PURE__ */ React.createElement(OpenInBrowserIcon, null)))));
};

const ChangeEventEmptyState = () => {
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    justify: "center",
    direction: "column",
    alignItems: "center"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "h5"
  }, "No change events to display yet.")), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement("img", {
    src: EmptyStateImage,
    alt: "EmptyState",
    "data-testid": "emptyStateImg"
  })));
};

const ChangeEvents = ({ serviceId, refreshEvents }) => {
  const api = useApi(pagerDutyApiRef);
  const [{ value: changeEvents, loading, error }, getChangeEvents] = useAsyncFn(async () => await api.getChangeEventsByServiceId(serviceId));
  useEffect(() => {
    getChangeEvents();
  }, [refreshEvents, getChangeEvents]);
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching information. ", error.message);
  }
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (!(changeEvents == null ? void 0 : changeEvents.length)) {
    return /* @__PURE__ */ React.createElement(ChangeEventEmptyState, null);
  }
  return /* @__PURE__ */ React.createElement(List, {
    dense: true,
    subheader: /* @__PURE__ */ React.createElement(ListSubheader, null, "CHANGE EVENTS")
  }, changeEvents.map((changeEvent, index) => /* @__PURE__ */ React.createElement(ChangeEventListItem, {
    key: changeEvent.id + index,
    changeEvent
  })));
};

const isPluginApplicableToEntity = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[PAGERDUTY_INTEGRATION_KEY]);
};
const PagerDutyCard = () => {
  const { integrationKey } = usePagerdutyEntity();
  const api = useApi(pagerDutyApiRef);
  const [refreshIncidents, setRefreshIncidents] = useState(false);
  const [refreshChangeEvents, setRefreshChangeEvents] = useState(false);
  const [dialogShown, setDialogShown] = useState(false);
  const showDialog = useCallback(() => {
    setDialogShown(true);
  }, [setDialogShown]);
  const hideDialog = useCallback(() => {
    setDialogShown(false);
  }, [setDialogShown]);
  const handleRefresh = useCallback(() => {
    setRefreshIncidents((x) => !x);
    setRefreshChangeEvents((x) => !x);
  }, []);
  const {
    value: service,
    loading,
    error
  } = useAsync(async () => {
    const services = await api.getServiceByIntegrationKey(integrationKey);
    return {
      id: services[0].id,
      name: services[0].name,
      url: services[0].html_url,
      policyId: services[0].escalation_policy.id,
      policyLink: services[0].escalation_policy.html_url
    };
  });
  if (error instanceof UnauthorizedError) {
    return /* @__PURE__ */ React.createElement(MissingTokenError, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching information. ", error.message);
  }
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  const serviceLink = {
    label: "Service Directory",
    href: service.url,
    icon: /* @__PURE__ */ React.createElement(WebIcon, null)
  };
  const triggerLink = {
    label: "Create Incident",
    onClick: showDialog,
    icon: /* @__PURE__ */ React.createElement(AlarmAddIcon, null),
    color: "secondary"
  };
  const escalationPolicyLink = {
    label: "Escalation Policy",
    href: service.policyLink,
    icon: /* @__PURE__ */ React.createElement(DateRangeIcon, null)
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, {
    "data-testid": "pagerduty-card"
  }, /* @__PURE__ */ React.createElement(CardHeader, {
    title: "PagerDuty",
    subheader: /* @__PURE__ */ React.createElement(HeaderIconLinkRow, {
      links: [serviceLink, triggerLink, escalationPolicyLink]
    })
  }), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(TabbedCard, null, /* @__PURE__ */ React.createElement(CardTab, {
    label: "Incidents"
  }, /* @__PURE__ */ React.createElement(Incidents, {
    serviceId: service.id,
    refreshIncidents
  })), /* @__PURE__ */ React.createElement(CardTab, {
    label: "Change Events"
  }, /* @__PURE__ */ React.createElement(ChangeEvents, {
    serviceId: service.id,
    refreshEvents: refreshChangeEvents
  }))), /* @__PURE__ */ React.createElement(EscalationPolicy, {
    policyId: service.policyId
  }))), /* @__PURE__ */ React.createElement(TriggerDialog, {
    "data-testid": "trigger-dialog",
    showDialog: dialogShown,
    handleDialog: hideDialog,
    onIncidentCreated: handleRefresh
  }));
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isPluginApplicableToEntity: isPluginApplicableToEntity,
  PagerDutyCard: PagerDutyCard
});

const useStyles = makeStyles((theme) => ({
  buttonStyle: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.error.dark
    }
  }
}));
function TriggerButton(props) {
  var _a;
  const { buttonStyle } = useStyles();
  const { integrationKey } = usePagerdutyEntity();
  const [dialogShown, setDialogShown] = useState(false);
  const showDialog = useCallback(() => {
    setDialogShown(true);
  }, [setDialogShown]);
  const hideDialog = useCallback(() => {
    setDialogShown(false);
  }, [setDialogShown]);
  const disabled = !integrationKey;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: showDialog,
    variant: "contained",
    className: disabled ? "" : buttonStyle,
    disabled
  }, integrationKey ? (_a = props.children) != null ? _a : "Create Incident" : "Missing integration key"), integrationKey && /* @__PURE__ */ React.createElement(TriggerDialog, {
    showDialog: dialogShown,
    handleDialog: hideDialog
  }));
}

export { EntityPagerDutyCard, PagerDutyCard, PagerDutyClient, TriggerButton, UnauthorizedError, isPluginApplicableToEntity as isPagerDutyAvailable, isPluginApplicableToEntity, pagerDutyApiRef, pagerDutyPlugin, pagerDutyPlugin as plugin };
//# sourceMappingURL=index.esm.js.map
