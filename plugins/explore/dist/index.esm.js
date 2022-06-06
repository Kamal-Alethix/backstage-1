import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { entityRouteRef, getEntityRelations, entityRouteParams, EntityRefLinks } from '@backstage/plugin-catalog-react';
import { Card, CardMedia, CardContent, Box, Chip, CardActions } from '@material-ui/core';
import React from 'react';
import { ItemCardHeader, Button, Page, Header, RoutedTabs } from '@backstage/core-components';
import { useRouteRef, attachComponentData, useElementFilter, createRouteRef, createExternalRouteRef, createPlugin, createApiFactory, createRoutableExtension, createComponentExtension } from '@backstage/core-plugin-api';
import { exploreToolsConfigRef } from '@backstage/plugin-explore-react';

const DomainCard = ({ entity }) => {
  var _a;
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  const url = catalogEntityRoute(entityRouteParams(entity));
  const owner = /* @__PURE__ */ React.createElement(EntityRefLinks, {
    entityRefs: ownedByRelations,
    defaultKind: "group",
    color: "inherit"
  });
  return /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardMedia, null, /* @__PURE__ */ React.createElement(ItemCardHeader, {
    title: entity.metadata.name,
    subtitle: owner
  })), /* @__PURE__ */ React.createElement(CardContent, null, ((_a = entity.metadata.tags) == null ? void 0 : _a.length) ? /* @__PURE__ */ React.createElement(Box, null, entity.metadata.tags.map((tag) => /* @__PURE__ */ React.createElement(Chip, {
    size: "small",
    label: tag,
    key: tag
  }))) : null, entity.metadata.description), /* @__PURE__ */ React.createElement(CardActions, null, /* @__PURE__ */ React.createElement(Button, {
    to: url,
    color: "primary"
  }, "Explore")));
};

const dataKey = "plugin.explore.exploreLayoutRoute";
const Route = () => null;
attachComponentData(Route, dataKey, true);
attachComponentData(Route, "core.gatherMountPoints", true);
const ExploreLayout = ({
  title,
  subtitle,
  children
}) => {
  const routes = useElementFilter(children, (elements) => elements.selectByComponentData({
    key: dataKey,
    withStrictError: "Child of ExploreLayout must be an ExploreLayout.Route"
  }).getElements().map((child) => child.props));
  return /* @__PURE__ */ React.createElement(Page, {
    themeId: "home"
  }, /* @__PURE__ */ React.createElement(Header, {
    title: title != null ? title : "Explore our ecosystem",
    subtitle: subtitle != null ? subtitle : "Discover solutions available in our ecosystem"
  }), /* @__PURE__ */ React.createElement(RoutedTabs, {
    routes
  }));
};
ExploreLayout.Route = Route;

const exploreRouteRef = createRouteRef({
  id: "explore"
});
const catalogEntityRouteRef = createExternalRouteRef({
  id: "catalog-entity",
  params: ["namespace", "kind", "name"],
  optional: true
});

const exampleTools = [
  {
    title: "New Relic",
    description: "Observability platform built to help engineers create and monitor their software",
    url: "/newrelic",
    image: "https://i.imgur.com/L37ikrX.jpg",
    tags: ["newrelic", "performance", "monitoring", "errors", "alerting"]
  },
  {
    title: "CircleCI",
    description: "Provides builds overview, detailed build info and retriggering functionality for CircleCI.",
    url: "/circleci",
    image: "https://miro.medium.com/max/1200/1*hkTBp22vLAqlIHkrkZHPnw.png",
    tags: ["circleci", "ci", "dev"]
  },
  {
    title: "Sentry",
    description: "Self-hosted and cloud-based error monitoring that helps software teams discover, triage, and prioritize errors in real-time.",
    url: "/sentry",
    image: "https://sentry-brand.storage.googleapis.com/sentry-logo-black.png",
    tags: ["sentry", "monitoring", "errors"]
  },
  {
    title: "Lighthouse",
    description: "Google's Lighthouse tool is a great resource for benchmarking and improving the accessibility, performance, SEO, and best practices of your website.",
    url: "/lighthouse",
    image: "https://raw.githubusercontent.com/GoogleChrome/lighthouse/8b3d7f052b2e64dd857e741d7395647f487697e7/assets/lighthouse-logo.png",
    tags: ["web", "seo", "accessibility", "performance"]
  },
  {
    title: "Tech Radar",
    description: "Tech Radar is a list of technologies, complemented by an assessment result, called ring assignment.",
    url: "/tech-radar",
    image: "https://storage.googleapis.com/wf-blogs-engineering-media/2018/09/fe13bb32-wf-tech-radar-hero-1024x597.png",
    tags: ["standards", "landscape"]
  },
  {
    title: "Cost Insights",
    description: "Insights into cloud costs for your organization.",
    url: "/cost-insights",
    image: "https://cloud.google.com/images/press/logo-cloud.png",
    tags: ["cloud", "finops"]
  },
  {
    title: "GraphiQL",
    description: "Integrates GraphiQL as a tool to browse GraphiQL endpoints inside Backstage.",
    url: "/graphiql",
    image: "https://camo.githubusercontent.com/517398c3fbe0687d3d4dcbe05da82970b882e75a/68747470733a2f2f64337676366c703535716a6171632e636c6f756466726f6e742e6e65742f6974656d732f33413061324e314c3346324f304c3377326e316a2f477261706869514c382e706e673f582d436c6f75644170702d56697369746f722d49643d3433363432",
    tags: ["graphql", "dev"]
  },
  {
    title: "GitOps Clusters",
    description: "Create GitOps-managed clusters with Backstage. Currently supports EKS flavors and profiles like Machine Learning Ops (MLOps)",
    url: "/gitops-clusters",
    image: "https://miro.medium.com/max/801/1*R28u8gj-hVdDFISoYqPhrQ.png",
    tags: ["gitops", "dev"]
  },
  {
    title: "Rollbar",
    description: "Error monitoring and crash reporting for agile development and continuous delivery",
    url: "/rollbar",
    image: "https://images.ctfassets.net/cj4mgtttlyx7/4DfiWj9CbuHBi10uWK7JHn/5e94a6c5dbd5d50bdcd8d9e78f88689b/rollbar-seo.png",
    tags: ["rollbar", "monitoring", "errors"]
  }
];

const explorePlugin = createPlugin({
  id: "explore",
  apis: [
    createApiFactory({
      api: exploreToolsConfigRef,
      deps: {},
      factory: () => ({
        async getTools() {
          return exampleTools;
        }
      })
    })
  ],
  routes: {
    explore: exploreRouteRef
  },
  externalRoutes: {
    catalogEntity: catalogEntityRouteRef
  }
});

const ExplorePage = explorePlugin.provide(createRoutableExtension({
  name: "ExplorePage",
  component: () => import('./esm/index-f9f0fffe.esm.js').then((m) => m.ExplorePage),
  mountPoint: exploreRouteRef
}));
const DomainExplorerContent = explorePlugin.provide(createComponentExtension({
  name: "DomainExplorerContent",
  component: {
    lazy: () => import('./esm/index-98a7674d.esm.js').then((m) => m.DomainExplorerContent)
  }
}));
const GroupsExplorerContent = explorePlugin.provide(createComponentExtension({
  name: "GroupsExplorerContent",
  component: {
    lazy: () => import('./esm/index-2a21494c.esm.js').then((m) => m.GroupsExplorerContent)
  }
}));
const ToolExplorerContent = explorePlugin.provide(createComponentExtension({
  name: "ToolExplorerContent",
  component: {
    lazy: () => import('./esm/index-e7a4f929.esm.js').then((m) => m.ToolExplorerContent)
  }
}));

export { DomainCard, DomainExplorerContent, ExploreLayout, ExplorePage, GroupsExplorerContent, ToolExplorerContent, catalogEntityRouteRef, explorePlugin, exploreRouteRef, explorePlugin as plugin };
//# sourceMappingURL=index.esm.js.map
