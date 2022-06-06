import { createRouteRef, createApiRef, createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import React from 'react';
import { makeStyles, List, ListItem, ListItemText } from '@material-ui/core';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const rootRouteRef = createRouteRef({
  id: "tech-insights"
});

const techInsightsApiRef = createApiRef({
  id: "plugin.techinsights.service"
});

const useStyles = makeStyles((theme) => ({
  listItemText: {
    paddingRight: theme.spacing(0.5),
    flex: "0 1 auto"
  },
  icon: {
    marginLeft: "auto"
  }
}));
const BooleanCheck = ({ checkResult }) => {
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(List, null, checkResult.map((check, index) => /* @__PURE__ */ React.createElement(ListItem, {
    key: check.check.id
  }, /* @__PURE__ */ React.createElement(ListItemText, {
    key: index,
    primary: check.check.name,
    secondary: check.check.description,
    className: classes.listItemText
  }), check.result ? /* @__PURE__ */ React.createElement(CheckCircleOutline, {
    className: classes.icon,
    color: "primary"
  }) : /* @__PURE__ */ React.createElement(ErrorOutlineIcon, {
    className: classes.icon,
    color: "error"
  }))));
};

function defaultCheckResultRenderers(value, title, description) {
  return [
    {
      type: "json-rules-engine",
      title: title || "Boolean scorecard",
      description: description || "This card represents an overview of default boolean Backstage checks:",
      component: /* @__PURE__ */ React.createElement(BooleanCheck, {
        checkResult: value
      })
    }
  ];
}

class TechInsightsClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }
  getScorecardsDefinition(type, value, title, description) {
    const resultRenderers = defaultCheckResultRenderers(value, title, description);
    return resultRenderers.find((d) => d.type === type);
  }
  async getAllChecks() {
    const url = await this.discoveryApi.getBaseUrl("tech-insights");
    const { token } = await this.identityApi.getCredentials();
    const response = await fetch(`${url}/checks`, {
      headers: token ? {
        Authorization: `Bearer ${token}`
      } : void 0
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
  async runChecks(entityParams, checks) {
    const url = await this.discoveryApi.getBaseUrl("tech-insights");
    const { token } = await this.identityApi.getCredentials();
    const { namespace, kind, name } = entityParams;
    const requestBody = { checks };
    const response = await fetch(`${url}/checks/run/${encodeURIComponent(namespace)}/${encodeURIComponent(kind)}/${encodeURIComponent(name)}`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        ...token && { Authorization: `Bearer ${token}` }
      }
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
  async runBulkChecks(entities, checks) {
    const url = await this.discoveryApi.getBaseUrl("tech-insights");
    const { token } = await this.identityApi.getCredentials();
    const checkIds = checks ? checks.map((check) => check.id) : [];
    const requestBody = {
      entities,
      checks: checkIds.length > 0 ? checkIds : void 0
    };
    const response = await fetch(`${url}/checks/run`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        ...token && { Authorization: `Bearer ${token}` }
      }
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
}

const techInsightsPlugin = createPlugin({
  id: "tech-insights",
  apis: [
    createApiFactory({
      api: techInsightsApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => new TechInsightsClient({ discoveryApi, identityApi })
    })
  ],
  routes: {
    root: rootRouteRef
  }
});
const EntityTechInsightsScorecardContent = techInsightsPlugin.provide(createRoutableExtension({
  name: "EntityTechInsightsScorecardContent",
  component: () => import('./esm/index-14cfaa0b.esm.js').then((m) => m.ScorecardsContent),
  mountPoint: rootRouteRef
}));
const EntityTechInsightsScorecardCard = techInsightsPlugin.provide(createRoutableExtension({
  name: "EntityTechInsightsScorecardCard",
  component: () => import('./esm/index-ecd7db6b.esm.js').then((m) => m.ScorecardsCard),
  mountPoint: rootRouteRef
}));

export { EntityTechInsightsScorecardCard, EntityTechInsightsScorecardContent, TechInsightsClient, techInsightsApiRef, techInsightsPlugin };
//# sourceMappingURL=index.esm.js.map
