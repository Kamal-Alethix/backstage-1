import { createRouteRef, createPlugin, createRoutableExtension, createApiRef } from '@backstage/core-plugin-api';

const rootCatalogCicdStatsRouteRef = createRouteRef({
  id: "cicd-statistics"
});
const cicdStatisticsPlugin = createPlugin({
  id: "cicd-statistics",
  routes: {
    entityContent: rootCatalogCicdStatsRouteRef
  }
});
const EntityCicdStatisticsContent = cicdStatisticsPlugin.provide(createRoutableExtension({
  component: () => import('./esm/entity-page-7847c329.esm.js').then((m) => m.EntityPageCicdCharts),
  mountPoint: rootCatalogCicdStatsRouteRef,
  name: "EntityCicdStatisticsContent"
}));

const statusTypes = [
  "succeeded",
  "failed",
  "enqueued",
  "scheduled",
  "running",
  "aborted",
  "stalled",
  "expired",
  "unknown"
];
const triggerReasons = [
  "scm",
  "manual",
  "internal",
  "other"
];
class AbortError extends Error {
}

const cicdStatisticsApiRef = createApiRef({
  id: "cicd-statistics-api"
});

export { AbortError, EntityCicdStatisticsContent, cicdStatisticsApiRef, cicdStatisticsPlugin, statusTypes, triggerReasons };
//# sourceMappingURL=index.esm.js.map
