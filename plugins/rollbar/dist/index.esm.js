import { createApiRef, useApi, configApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Box, Typography, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Sparklines, SparklinesBars } from 'react-sparklines';
import { Table } from '@backstage/core-components';
import { Routes, Route } from 'react-router';

const rollbarApiRef = createApiRef({
  id: "plugin.rollbar.service"
});

class RollbarClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  async getAllProjects() {
    return await this.get(`/projects`);
  }
  async getProject(projectName) {
    return await this.get(`/projects/${projectName}`);
  }
  async getTopActiveItems(project, hours = 24, environment = "production") {
    return await this.get(`/projects/${project}/top_active_items?environment=${environment}&hours=${hours}`);
  }
  async getProjectItems(project) {
    return await this.get(`/projects/${project}/items`);
  }
  async get(path) {
    const url = `${await this.discoveryApi.getBaseUrl("rollbar")}${path}`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {}
    });
    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }
    return await response.json();
  }
}

const ROLLBAR_ANNOTATION = "rollbar.com/project-slug";

function useProjectSlugFromEntity(entity) {
  var _a, _b, _c, _d;
  const configApi = useApi(configApiRef);
  const [project, organization] = ((_c = (_b = (_a = entity == null ? void 0 : entity.metadata) == null ? void 0 : _a.annotations) == null ? void 0 : _b[ROLLBAR_ANNOTATION]) != null ? _c : "").split("/").reverse();
  return {
    project,
    organization: (_d = organization != null ? organization : configApi.getOptionalString("rollbar.organization")) != null ? _d : configApi.getString("organization.name")
  };
}

function useTopActiveItems(entity) {
  const api = useApi(rollbarApiRef);
  const { organization, project } = useProjectSlugFromEntity(entity);
  const { value, loading, error } = useAsync(() => {
    if (!project) {
      return Promise.resolve([]);
    }
    return api.getTopActiveItems(project, 168).then((data) => data.sort((a, b) => b.item.occurrences - a.item.occurrences));
  }, [api, organization, project, entity]);
  return {
    items: value,
    organization,
    project,
    loading,
    error
  };
}

var RollbarLevel = /* @__PURE__ */ ((RollbarLevel2) => {
  RollbarLevel2[RollbarLevel2["debug"] = 10] = "debug";
  RollbarLevel2[RollbarLevel2["info"] = 20] = "info";
  RollbarLevel2[RollbarLevel2["warning"] = 30] = "warning";
  RollbarLevel2[RollbarLevel2["error"] = 40] = "error";
  RollbarLevel2[RollbarLevel2["critical"] = 50] = "critical";
  return RollbarLevel2;
})(RollbarLevel || {});
var RollbarFrameworkId = /* @__PURE__ */ ((RollbarFrameworkId2) => {
  RollbarFrameworkId2[RollbarFrameworkId2["unknown"] = 0] = "unknown";
  RollbarFrameworkId2[RollbarFrameworkId2["rails"] = 1] = "rails";
  RollbarFrameworkId2[RollbarFrameworkId2["django"] = 2] = "django";
  RollbarFrameworkId2[RollbarFrameworkId2["pyramid"] = 3] = "pyramid";
  RollbarFrameworkId2[RollbarFrameworkId2["node-js"] = 4] = "node-js";
  RollbarFrameworkId2[RollbarFrameworkId2["pylons"] = 5] = "pylons";
  RollbarFrameworkId2[RollbarFrameworkId2["php"] = 6] = "php";
  RollbarFrameworkId2[RollbarFrameworkId2["browser-js"] = 7] = "browser-js";
  RollbarFrameworkId2[RollbarFrameworkId2["rollbar-system"] = 8] = "rollbar-system";
  RollbarFrameworkId2[RollbarFrameworkId2["android"] = 9] = "android";
  RollbarFrameworkId2[RollbarFrameworkId2["ios"] = 10] = "ios";
  RollbarFrameworkId2[RollbarFrameworkId2["mailgun"] = 11] = "mailgun";
  RollbarFrameworkId2[RollbarFrameworkId2["logentries"] = 12] = "logentries";
  RollbarFrameworkId2[RollbarFrameworkId2["python"] = 13] = "python";
  RollbarFrameworkId2[RollbarFrameworkId2["ruby"] = 14] = "ruby";
  RollbarFrameworkId2[RollbarFrameworkId2["sidekiq"] = 15] = "sidekiq";
  RollbarFrameworkId2[RollbarFrameworkId2["flask"] = 16] = "flask";
  RollbarFrameworkId2[RollbarFrameworkId2["celery"] = 17] = "celery";
  RollbarFrameworkId2[RollbarFrameworkId2["rq"] = 18] = "rq";
  return RollbarFrameworkId2;
})(RollbarFrameworkId || {});

const buildItemUrl = (org, project, id) => `https://rollbar.com/${org}/${project}/items/${id}`;

const TrendGraph = ({ counts }) => {
  return /* @__PURE__ */ React.createElement(Sparklines, {
    data: counts,
    svgHeight: 48,
    min: 0,
    margin: 4
  }, /* @__PURE__ */ React.createElement(SparklinesBars, {
    barWidth: 2
  }));
};

const columns = [
  {
    title: "ID",
    field: "item.counter",
    type: "string",
    align: "left",
    width: "70px",
    render: (data) => /* @__PURE__ */ React.createElement(Link, {
      href: buildItemUrl(data.org, data.project, data.item.counter),
      target: "_blank",
      rel: "noreferrer"
    }, data.item.counter)
  },
  {
    title: "Title",
    field: "item.title",
    type: "string",
    align: "left"
  },
  {
    title: "Trend",
    sorting: false,
    render: (data) => /* @__PURE__ */ React.createElement(TrendGraph, {
      counts: data.counts
    })
  },
  {
    title: "Occurrences",
    field: "item.occurrences",
    type: "numeric",
    align: "right"
  },
  {
    title: "Environment",
    field: "item.environment",
    type: "string"
  },
  {
    title: "Level",
    field: "item.level",
    type: "string",
    render: (data) => RollbarLevel[data.item.level]
  },
  {
    title: "Framework",
    field: "item.framework",
    type: "string",
    render: (data) => RollbarFrameworkId[data.item.framework]
  },
  {
    title: "Last Occurrence",
    field: "item.lastOccurrenceTimestamp",
    type: "datetime",
    render: (data) => new Date(data.item.lastOccurrenceTimestamp * 1e3).toLocaleDateString()
  }
];
const RollbarTopItemsTable = ({
  items,
  organization,
  project,
  loading,
  error
}) => {
  if (error) {
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Alert, {
      severity: "error"
    }, "Error encountered while fetching rollbar top items. ", error.toString()));
  }
  return /* @__PURE__ */ React.createElement(Table, {
    isLoading: loading,
    columns,
    options: {
      padding: "dense",
      search: true,
      paging: true,
      pageSize: 5,
      showEmptyDataSourceMessage: !loading
    },
    title: /* @__PURE__ */ React.createElement(Box, {
      display: "flex",
      alignItems: "center"
    }, /* @__PURE__ */ React.createElement(Box, {
      mr: 1
    }), /* @__PURE__ */ React.createElement(Typography, {
      variant: "h6"
    }, "Top Active Items / ", project)),
    data: items.map((i) => ({ org: organization, project, ...i }))
  });
};

const RollbarProject = ({ entity }) => {
  const { items, organization, project, loading, error } = useTopActiveItems(entity);
  return /* @__PURE__ */ React.createElement(RollbarTopItemsTable, {
    organization,
    project,
    items: items || [],
    loading,
    error
  });
};

const EntityPageRollbar = () => {
  const { entity } = useEntity();
  return /* @__PURE__ */ React.createElement(RollbarProject, {
    entity
  });
};

const isPluginApplicableToEntity = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[ROLLBAR_ANNOTATION]);
};
const Router = (_props) => {
  const { entity } = useEntity();
  if (!isPluginApplicableToEntity(entity)) ;
  return /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/",
    element: /* @__PURE__ */ React.createElement(EntityPageRollbar, null)
  }));
};

var Router$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  isPluginApplicableToEntity: isPluginApplicableToEntity,
  Router: Router
});

const rootRouteRef = createRouteRef({
  id: "rollbar"
});
const rollbarPlugin = createPlugin({
  id: "rollbar",
  apis: [
    createApiFactory({
      api: rollbarApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => new RollbarClient({ discoveryApi, identityApi })
    })
  ],
  routes: {
    entityContent: rootRouteRef
  }
});
const EntityRollbarContent = rollbarPlugin.provide(createRoutableExtension({
  name: "EntityRollbarContent",
  component: () => Promise.resolve().then(function () { return Router$1; }).then((m) => m.Router),
  mountPoint: rootRouteRef
}));

export { EntityPageRollbar, EntityRollbarContent, ROLLBAR_ANNOTATION, RollbarClient, Router, isPluginApplicableToEntity, isPluginApplicableToEntity as isRollbarAvailable, rollbarPlugin as plugin, rollbarApiRef, rollbarPlugin };
//# sourceMappingURL=index.esm.js.map
