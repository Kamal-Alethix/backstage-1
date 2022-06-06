import { createApiRef, createRouteRef, createPlugin, createApiFactory, configApiRef, createRoutableExtension } from '@backstage/core-plugin-api';

const allureApiRef = createApiRef({
  id: "allure-api"
});

class AllureApiClient {
  constructor(options) {
    this.configApi = options.configApi;
  }
  async getReportUrl(projectId) {
    const baseUrl = this.configApi.getString("allure.baseUrl");
    return `${baseUrl}/projects/${projectId}/reports/latest/index.html`;
  }
}

const allureRouteRef = createRouteRef({
  id: "allure"
});
const allurePlugin = createPlugin({
  id: "allure",
  apis: [
    createApiFactory({
      api: allureApiRef,
      deps: {
        configApi: configApiRef
      },
      factory: ({ configApi }) => new AllureApiClient({ configApi })
    })
  ],
  routes: {
    root: allureRouteRef
  }
});
const EntityAllureReportContent = allurePlugin.provide(createRoutableExtension({
  name: "EntityAllureReportContent",
  component: () => import('./index-8e0dda57.esm.js').then((m) => m.AllureReportComponent),
  mountPoint: allureRouteRef
}));

const ALLURE_PROJECT_ID_ANNOTATION = "qameta.io/allure-project";
const isAllureReportAvailable = (entity) => {
  var _a;
  return Boolean((_a = entity.metadata.annotations) == null ? void 0 : _a[ALLURE_PROJECT_ID_ANNOTATION]);
};
const getAllureProjectId = (entity) => {
  var _a, _b;
  return (_b = (_a = entity == null ? void 0 : entity.metadata.annotations) == null ? void 0 : _a[ALLURE_PROJECT_ID_ANNOTATION]) != null ? _b : "";
};

export { ALLURE_PROJECT_ID_ANNOTATION as A, EntityAllureReportContent as E, allureApiRef as a, allurePlugin as b, getAllureProjectId as g, isAllureReportAvailable as i };
//# sourceMappingURL=index-cc7d96cc.esm.js.map
