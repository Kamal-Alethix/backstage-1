import { createApiRef, createRouteRef, createPlugin, createApiFactory, configApiRef, discoveryApiRef, fetchApiRef, createComponentExtension, useApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import React, { useState } from 'react';
import { Progress, ErrorPanel, InfoCard, Link, Page, Content, MissingAnnotationEmptyState } from '@backstage/core-components';
import { makeStyles, Box, Typography, Grid, Tabs, Tab, Button } from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';
import DesktopMac from '@material-ui/icons/DesktopMac';
import { useEntity } from '@backstage/plugin-catalog-react';

const newRelicDashboardApiRef = createApiRef({
  id: "plugin.newrelicdashboard.service"
});

const getDashboardParentGuidQuery = "query ($query: String) {\n  actor {\n    entitySearch(query: $query) {\n      results {\n        entities {\n          name\n          ... on DashboardEntityOutline {\n            name\n            dashboardParentGuid\n          guid\n          }\n          permalink\n        }\n      }\n    }\n  }\n}\n";

const getDashboardSnapshotQuery = "mutation($guid: EntityGuid! , ,$duration: Milliseconds) {\n  dashboardCreateSnapshotUrl(guid: $guid , params: {timeWindow: {duration: $duration}})\n}";

class NewRelicDashboardClient {
  constructor({
    discoveryApi,
    fetchApi
  }) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
  }
  async callApi(query, variables) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const graphql = JSON.stringify({
      query,
      variables
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow"
    };
    const apiUrl = `${await this.discoveryApi.getBaseUrl("proxy")}/newrelic/api/graphql`;
    const response = await this.fetchApi.fetch(apiUrl, requestOptions);
    if (response.status === 200) {
      return await response.json();
    }
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    } else {
      return void 0;
    }
  }
  async getDashboardEntity(guid) {
    var _a, _b;
    const DashboardEntityList = await this.callApi(getDashboardParentGuidQuery, {
      query: `id ='${guid}' OR parentId ='${guid}'`
    });
    if (DashboardEntityList && ((_b = (_a = DashboardEntityList == null ? void 0 : DashboardEntityList.data) == null ? void 0 : _a.actor.entitySearch.results.entities) == null ? void 0 : _b.length) > 1) {
      DashboardEntityList.data.actor.entitySearch.results.entities = DashboardEntityList == null ? void 0 : DashboardEntityList.data.actor.entitySearch.results.entities.filter((entity) => (entity == null ? void 0 : entity.dashboardParentGuid) !== null);
    }
    return {
      getDashboardEntity: DashboardEntityList
    };
  }
  async getDashboardSnapshot(guid, duration) {
    const DashboardSnapshotValue = await this.callApi(getDashboardSnapshotQuery, {
      guid,
      duration
    });
    return {
      getDashboardSnapshot: DashboardSnapshotValue
    };
  }
}

const rootRouteRef = createRouteRef({
  id: "new-relic-dashboard"
});

const newRelicDashboardPlugin = createPlugin({
  id: "new-relic-dashboard",
  routes: {
    root: rootRouteRef
  },
  apis: [
    createApiFactory({
      api: newRelicDashboardApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef
      },
      factory: ({ configApi, discoveryApi, fetchApi }) => new NewRelicDashboardClient({
        discoveryApi,
        fetchApi,
        baseUrl: configApi.getOptionalString("newrelicdashboard.baseUrl")
      })
    })
  ]
});
const EntityNewRelicDashboardContent = newRelicDashboardPlugin.provide(createComponentExtension({
  name: "EntityNewRelicDashboardPage",
  component: {
    lazy: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.Router)
  }
}));
const EntityNewRelicDashboardCard = newRelicDashboardPlugin.provide(createComponentExtension({
  name: "EntityNewRelicDashboardListComponent",
  component: {
    lazy: () => Promise.resolve().then(function () { return DashboardEntityList$1; }).then((m) => m.DashboardEntityList)
  }
}));
const DashboardSnapshotComponent = newRelicDashboardPlugin.provide(createComponentExtension({
  name: "DashboardSnapshotComponent",
  component: {
    lazy: () => Promise.resolve().then(function () { return DashboardSnapshot$1; }).then((m) => m.DashboardSnapshot)
  }
}));

const NEWRELIC_GUID_ANNOTATION = "newrelic.com/dashboard-guid";

const useStyles$1 = makeStyles({
  svgIcon: {
    display: "inline-block",
    "& svg": {
      display: "inline-block",
      fontSize: "inherit",
      verticalAlign: "baseline"
    }
  }
});
const DashboardEntityList = () => {
  var _a, _b, _c, _d, _e, _f;
  const { entity } = useEntity();
  const classes = useStyles$1();
  const newRelicDashboardAPI = useApi(newRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async () => {
    var _a2;
    const dashboardObject = newRelicDashboardAPI.getDashboardEntity(String((_a2 = entity.metadata.annotations) == null ? void 0 : _a2[NEWRELIC_GUID_ANNOTATION]));
    return dashboardObject;
  }, [(_a = entity.metadata.annotations) == null ? void 0 : _a[NEWRELIC_GUID_ANNOTATION]]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(ErrorPanel, {
      title: error.name,
      defaultExpanded: true,
      error
    });
  }
  return /* @__PURE__ */ React.createElement(InfoCard, {
    title: "New Relic Dashboard Pages",
    variant: "gridItem"
  }, (value == null ? void 0 : value.getDashboardEntity) === void 0 && "Unauthorized Request , please check API Key", (value == null ? void 0 : value.getDashboardEntity) !== void 0 && ((_d = (_c = (_b = value == null ? void 0 : value.getDashboardEntity) == null ? void 0 : _b.data.actor.entitySearch.results) == null ? void 0 : _c.entities) == null ? void 0 : _d.length) <= 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, "No Dashboard Pages found with the specified Dashboard GUID"), (_f = (_e = value == null ? void 0 : value.getDashboardEntity) == null ? void 0 : _e.data.actor.entitySearch.results.entities) == null ? void 0 : _f.map((entityResult) => {
    return /* @__PURE__ */ React.createElement(Box, {
      style: { margin: "10px" },
      display: "flex"
    }, /* @__PURE__ */ React.createElement(Box, {
      mr: 1,
      className: classes.svgIcon
    }, /* @__PURE__ */ React.createElement(Typography, {
      component: "div"
    }, /* @__PURE__ */ React.createElement(DesktopMac, null))), /* @__PURE__ */ React.createElement(Box, {
      flexGrow: "1"
    }, /* @__PURE__ */ React.createElement(Link, {
      to: entityResult.permalink
    }, entityResult.name)));
  }));
};

var DashboardEntityList$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DashboardEntityList: DashboardEntityList
});

const DashboardSnapshot = ({
  guid,
  name,
  permalink,
  duration
}) => {
  var _a, _b, _c;
  const newRelicDashboardAPI = useApi(newRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async () => {
    const dashboardObject = newRelicDashboardAPI.getDashboardSnapshot(guid, duration);
    return dashboardObject;
  }, [guid, duration]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(ErrorPanel, {
      title: error.name,
      defaultExpanded: true,
      error
    });
  }
  const url = (_c = (_b = (_a = value == null ? void 0 : value.getDashboardSnapshot) == null ? void 0 : _a.data) == null ? void 0 : _b.dashboardCreateSnapshotUrl) == null ? void 0 : _c.replace(/\pdf$/i, "png");
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    style: { marginTop: "30px" }
  }, /* @__PURE__ */ React.createElement(InfoCard, {
    variant: "gridItem",
    title: name
  }, /* @__PURE__ */ React.createElement(Box, {
    display: "flex"
  }, /* @__PURE__ */ React.createElement(Box, {
    flexGrow: "1"
  }, /* @__PURE__ */ React.createElement(Link, {
    to: permalink
  }, url ? /* @__PURE__ */ React.createElement("img", {
    alt: `${name} Dashbord`,
    style: { border: "solid 1px black" },
    src: url
  }) : "Dashboard loading... , click here to open if it did not render correctly")))));
};

var DashboardSnapshot$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DashboardSnapshot: DashboardSnapshot
});

function TabPanel(props) {
  const { children, value1, index, ...other } = props;
  return /* @__PURE__ */ React.createElement("div", {
    role: "tabpanel",
    hidden: value1 !== index,
    id: `simple-tabpanel-${index}`,
    "aria-labelledby": `simple-tab-${index}`,
    ...other
  }, children);
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}
const useStyles = makeStyles((theme) => ({
  tabsWrapper: {
    gridArea: "pageSubheader",
    backgroundColor: theme.palette.background.paper,
    paddingLeft: theme.spacing(3)
  },
  defaultTab: {
    padding: theme.spacing(3, 3),
    ...theme.typography.caption,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: theme.palette.text.secondary
  },
  selected: {
    color: theme.palette.text.primary
  },
  tabRoot: {
    "&:hover": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary
    }
  }
}), { name: "DashboardHeaderTabs" });
const DashboardSnapshotList = ({ guid }) => {
  var _a, _b, _c, _d, _e, _f;
  const styles = useStyles();
  const newRelicDashboardAPI = useApi(newRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async () => {
    const dashboardObject = newRelicDashboardAPI.getDashboardEntity(guid);
    return dashboardObject;
  }, [guid]);
  const [value1, setValue1] = useState(0);
  const handleChange = ({}, newValue) => {
    setValue1(newValue);
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement(Progress, null);
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(ErrorPanel, {
      title: error.name,
      defaultExpanded: true,
      error
    });
  }
  return /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    direction: "column"
  }, /* @__PURE__ */ React.createElement(Tabs, {
    selectionFollowsFocus: true,
    indicatorColor: "primary",
    textColor: "inherit",
    variant: "scrollable",
    scrollButtons: "auto",
    "aria-label": "scrollable auto tabs example",
    onChange: handleChange,
    value: value1,
    style: { width: "100%" }
  }, (_c = (_b = (_a = value == null ? void 0 : value.getDashboardEntity) == null ? void 0 : _a.data) == null ? void 0 : _b.actor.entitySearch.results.entities) == null ? void 0 : _c.map((Entity, index) => {
    return /* @__PURE__ */ React.createElement(Tab, {
      label: Entity.name,
      className: styles.defaultTab,
      classes: {
        selected: styles.selected,
        root: styles.tabRoot
      },
      ...a11yProps(index)
    });
  })), (_f = (_e = (_d = value == null ? void 0 : value.getDashboardEntity) == null ? void 0 : _d.data) == null ? void 0 : _e.actor.entitySearch.results.entities) == null ? void 0 : _f.map((Entity, index) => {
    return /* @__PURE__ */ React.createElement(TabPanel, {
      value1,
      index
    }, /* @__PURE__ */ React.createElement(DashboardSnapshot, {
      name: Entity.name,
      permalink: Entity.permalink,
      guid: Entity.guid,
      duration: 2629743e4
    }));
  }));
};

const NewRelicDashboard = () => {
  var _a;
  const { entity } = useEntity();
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Content, null, /* @__PURE__ */ React.createElement(Grid, {
    container: true,
    spacing: 6,
    direction: "row",
    alignItems: "stretch"
  }, /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(DashboardEntityList, null)), /* @__PURE__ */ React.createElement(Grid, {
    item: true,
    xs: 12
  }, /* @__PURE__ */ React.createElement(DashboardSnapshotList, {
    guid: String((_a = entity.metadata.annotations) == null ? void 0 : _a[NEWRELIC_GUID_ANNOTATION])
  })))));
};

const isNewRelicDashboardAvailable = (entity) => {
  var _a, _b;
  return Boolean((_b = (_a = entity == null ? void 0 : entity.metadata) == null ? void 0 : _a.annotations) == null ? void 0 : _b[NEWRELIC_GUID_ANNOTATION]);
};
const Router = () => {
  const { entity } = useEntity();
  if (isNewRelicDashboardAvailable(entity)) {
    return /* @__PURE__ */ React.createElement(NewRelicDashboard, null);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MissingAnnotationEmptyState, {
    annotation: NEWRELIC_GUID_ANNOTATION
  }), /* @__PURE__ */ React.createElement(Button, {
    variant: "contained",
    color: "primary",
    href: "https://github.com/backstage/backstage/tree/master/plugins/newrelic-dashboard"
  }, "Read New Relic Dashboard Plugin Docs"));
};

var Router$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isNewRelicDashboardAvailable: isNewRelicDashboardAvailable,
  Router: Router
});

export { DashboardSnapshotComponent, EntityNewRelicDashboardCard, EntityNewRelicDashboardContent, isNewRelicDashboardAvailable, newRelicDashboardPlugin };
//# sourceMappingURL=index.esm.js.map
