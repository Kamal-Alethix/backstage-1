import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { makeStyles } from '@material-ui/core/styles';
import { Progress, ResponseErrorPanel, Table, InfoCard, Link } from '@backstage/core-components';
import { makeStyles as makeStyles$1, Box, Button, Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotesIcon from '@material-ui/icons/Notes';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import WarningIcon from '@material-ui/icons/Warning';
import AddIcon from '@material-ui/icons/Add';
import { useEntity } from '@backstage/plugin-catalog-react';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { f as fireHydrantApiRef } from './index-3ce28126.esm.js';
import { useApi, errorApiRef, configApiRef } from '@backstage/core-plugin-api';

const useStyles$1 = makeStyles({
  container: {
    overflow: "auto",
    width: "100%",
    "& td": {
      minWidth: "145px"
    },
    "& th": {
      minWidth: "145px"
    }
  }
});
const DenseTable = ({
  service,
  startDate,
  endDate
}) => {
  const classes = useStyles$1();
  const columns = [
    { field: "healthiness", title: "Healthiness" },
    { field: "impacted", title: "Impacted" },
    { field: "incidents", title: "Incidents" },
    { field: "mttd", title: "MTTD" },
    { field: "mtta", title: "MTTA" },
    { field: "mttm", title: "MTTM" },
    { field: "mttr", title: "MTTR" }
  ];
  return /* @__PURE__ */ React.createElement("div", {
    className: classes.container
  }, /* @__PURE__ */ React.createElement(Table, {
    title: "Incident Analytics",
    subtitle: `${startDate.toFormat("MMMM dd, yyyy")} - ${endDate.toFormat("MMMM dd, yyyy")}`,
    options: { paging: false, search: false },
    columns,
    data: [service]
  }));
};
const secondsToDhms = (seconds) => {
  const secs = Number(seconds);
  const d = Math.floor(secs / (60 * 60 * 24));
  const h = Math.floor(secs / (60 * 60) % 24);
  const m = Math.floor(secs / 60 % 60);
  const s = secs % 60;
  const dDisplay = d > 0 ? `${d}d ` : "";
  const hDisplay = h > 0 ? `${h}h ` : "00h ";
  const mDisplay = m > 0 ? `${m}m ` : "00m ";
  const sDisplay = s > 0 ? `${s}s` : "00s";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};
const truncateNum = (num) => {
  const matcher = `^-?\\d+(?:\\.\\d{0,3})?`;
  const re = new RegExp(matcher);
  const match = num.toString().match(re);
  const result = match && match[0] || "0";
  return result;
};
const calcHealthiness = ({
  mttm,
  incidents,
  range
}) => {
  const num = (1 - mttm * incidents / range) * 100;
  return `${truncateNum(num)}%`;
};
const ServiceAnalytics = ({
  value,
  loading,
  error
}) => {
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  const startDate = DateTime.now().minus({ days: 30 }).toUTC();
  const endDate = DateTime.now().toUTC();
  if (value.id) {
    const serviceData = {
      healthiness: value.mttm && value.count ? calcHealthiness({
        mttm: value.mttm,
        incidents: value.count,
        range: endDate.diff(startDate, "seconds").as("seconds")
      }) : "100%",
      impacted: value.total_time ? secondsToDhms(value.total_time) : "-",
      incidents: value.count,
      mttd: value.mttd ? secondsToDhms(value.mttd) : "-",
      mtta: value.mtta ? secondsToDhms(value.mtta) : "-",
      mttm: value.mttm ? secondsToDhms(value.mttm) : "-",
      mttr: value.mttr ? secondsToDhms(value.mttr) : "-"
    };
    return /* @__PURE__ */ React.createElement(DenseTable, {
      service: serviceData,
      startDate,
      endDate
    });
  }
  return null;
};

const useServiceDetails = ({ serviceName }) => {
  const api = useApi(fireHydrantApiRef);
  const errorApi = useApi(errorApiRef);
  const { loading, value, error, retry } = useAsyncRetry(async () => {
    try {
      return await api.getServiceDetails({ serviceName });
    } catch (e) {
      errorApi.post(e);
      return Promise.reject(e);
    }
  });
  return {
    loading,
    value,
    error,
    retry
  };
};

const useServiceAnalytics = ({
  serviceId,
  startDate,
  endDate
}) => {
  const api = useApi(fireHydrantApiRef);
  const errorApi = useApi(errorApiRef);
  const { loading, value, error, retry } = useAsyncRetry(async () => {
    try {
      return await api.getServiceAnalytics({
        serviceId,
        startDate,
        endDate
      });
    } catch (e) {
      errorApi.post(e);
      return Promise.reject(e);
    }
  });
  return {
    loading,
    value,
    error,
    retry
  };
};

const useStyles = makeStyles$1((theme) => ({
  button: {
    color: "#3b2492",
    display: "grid",
    gridGap: "4px",
    textAlign: "center",
    justifyItems: "center",
    width: "105px",
    backgroundColor: theme.palette.type === "dark" ? "#f1edff" : "",
    "&:hover, &:focus": {
      backgroundColor: "#f1edff",
      color: "#614ab6"
    },
    "&:active": {
      color: "#3b2492",
      backgroundColor: "#b2a6e3",
      boxShadow: "rgb(59, 36, 146) 0px 0px 0px 1px inset, rgb(141, 134, 188) 3px 3px 0px 0px inset;"
    },
    border: "1px solid #3b2492",
    borderRadius: "5px",
    padding: "8px 10px",
    textTransform: "none"
  },
  buttonLink: {
    backgroundColor: "#3b2492",
    color: "#FFF",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#614ab6"
    }
  },
  buttonContainer: {
    display: "grid",
    gridGap: "24px",
    gridAutoFlow: "column",
    gridAutoColumns: "min-content"
  },
  icon: {
    color: "#f1642d"
  },
  link: {
    textDecoration: "underline",
    fontSize: "16px",
    lineHeight: "27px",
    color: "#3b2492",
    "&:hover, &:focus": {
      fontWeight: "500"
    }
  },
  linksContainer: {
    borderBottom: "1px solid #d5d5d5",
    padding: "10px 0px 10px 20px",
    backgroundColor: "#f1edff",
    marginBottom: "20px"
  },
  table: {
    width: "100%"
  },
  warning: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    background: "#f1edff",
    color: "#3b2492"
  }
}));
const ServiceAnalyticsView = ({
  serviceId,
  startDate,
  endDate
}) => {
  const {
    loading: analyticsLoading,
    value: analyticsValue = {},
    error: analyticsError
  } = useServiceAnalytics({
    serviceId,
    startDate: startDate.toFormat("YYYY-MM-DD"),
    endDate: endDate.toFormat("YYYY-MM-DD")
  });
  return /* @__PURE__ */ React.createElement(ServiceAnalytics, {
    loading: analyticsLoading,
    value: analyticsValue,
    error: analyticsError
  });
};
const ServiceDetailsCard = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const { entity } = useEntity();
  const classes = useStyles();
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const configApi = useApi(configApiRef);
  const BASE_URL = configApi.getOptionalString("firehydrant.baseUrl") || "https://app.firehydrant.io";
  const startDate = DateTime.now().minus({ days: 30 }).toUTC();
  const endDate = DateTime.now().toUTC();
  const fireHydrantServiceName = `${entity == null ? void 0 : entity.kind}:${(_b = (_a = entity == null ? void 0 : entity.metadata) == null ? void 0 : _a.namespace) != null ? _b : "default"}/${(_c = entity == null ? void 0 : entity.metadata) == null ? void 0 : _c.name}`;
  const { loading, value, error } = useServiceDetails({
    serviceName: fireHydrantServiceName
  });
  const activeIncidents = (_e = (_d = value == null ? void 0 : value.service) == null ? void 0 : _d.active_incidents) != null ? _e : [];
  const incidents = (_f = value == null ? void 0 : value.incidents) != null ? _f : [];
  const serviceId = (_g = value == null ? void 0 : value.service) == null ? void 0 : _g.id;
  useEffect(() => {
    if ((value == null ? void 0 : value.service) && Object.keys(value == null ? void 0 : value.service).length > 0) {
      setShowServiceDetails(true);
    }
  }, [value]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(ResponseErrorPanel, {
      error
    });
  }
  const headerText = showServiceDetails ? `There ${(activeIncidents == null ? void 0 : activeIncidents.length) === 1 ? "is" : "are"} ${activeIncidents == null ? void 0 : activeIncidents.length} active incident${(activeIncidents == null ? void 0 : activeIncidents.length) === 1 ? "" : "s"}.` : "";
  const serviceIncidentsLink = `${BASE_URL}/incidents?search={"services":[{"label":${JSON.stringify((_h = value == null ? void 0 : value.service) == null ? void 0 : _h.name)},"value":${JSON.stringify((_i = value == null ? void 0 : value.service) == null ? void 0 : _i.id)}}]}`;
  return /* @__PURE__ */ React.createElement(InfoCard, null, !showServiceDetails && !loading && /* @__PURE__ */ React.createElement("div", {
    className: classes.warning
  }, /* @__PURE__ */ React.createElement(WarningIcon, null), "\xA0\xA0", /* @__PURE__ */ React.createElement("span", null, "This service does not exist in FireHydrant.")), showServiceDetails && /* @__PURE__ */ React.createElement(Box, {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #d5d5d5"
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement("h2", null, headerText)), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Button, {
    className: classes.buttonLink,
    color: "default",
    href: serviceIncidentsLink,
    startIcon: /* @__PURE__ */ React.createElement(ExitToAppIcon, null),
    target: "_blank",
    variant: "outlined"
  }, "View service incidents"))), activeIncidents && (activeIncidents == null ? void 0 : activeIncidents.length) > 0 && /* @__PURE__ */ React.createElement(Box, {
    className: classes.linksContainer
  }, incidents && (incidents == null ? void 0 : incidents.slice(0, 5).map((incident, index) => /* @__PURE__ */ React.createElement("div", {
    key: index
  }, /* @__PURE__ */ React.createElement(Link, {
    className: classes.link,
    to: incident.incident_url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, incident.name))))), /* @__PURE__ */ React.createElement(Box, {
    paddingLeft: "16px",
    marginTop: "10px"
  }, /* @__PURE__ */ React.createElement(Typography, {
    variant: "subtitle1"
  }, "View in FireHydrant "), /* @__PURE__ */ React.createElement(Box, {
    className: classes.buttonContainer,
    marginTop: "10px"
  }, /* @__PURE__ */ React.createElement(Button, {
    component: Link,
    target: "_blank",
    rel: "noopener",
    className: classes.button,
    to: `${BASE_URL}/incidents/new`
  }, /* @__PURE__ */ React.createElement(Box, {
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(AddIcon, {
    className: classes.icon
  })), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement("span", null, "Declare an incident")))), /* @__PURE__ */ React.createElement(Button, {
    component: Link,
    target: "_blank",
    rel: "noopener",
    className: classes.button,
    to: `${BASE_URL}/incidents`
  }, /* @__PURE__ */ React.createElement(Box, {
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(WhatshotIcon, {
    className: classes.icon
  })), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement("span", null, "View all incidents")))), showServiceDetails && /* @__PURE__ */ React.createElement(Button, {
    component: Link,
    target: "_blank",
    rel: "noopener",
    className: classes.button,
    to: `${BASE_URL}/services/${(_j = value == null ? void 0 : value.service) == null ? void 0 : _j.id}`
  }, /* @__PURE__ */ React.createElement(Box, {
    flexDirection: "column"
  }, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(NotesIcon, {
    className: classes.icon
  })), /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement("span", null, "View Service Details")))))), showServiceDetails && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(ServiceAnalyticsView, {
    serviceId,
    startDate,
    endDate
  })));
};

export { ServiceDetailsCard };
//# sourceMappingURL=index-d55240ec.esm.js.map
