import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, createRoutableExtension } from '@backstage/core-plugin-api';

const newRelicApiRef = createApiRef({
  id: "plugin.newrelic.service"
});
const DEFAULT_PROXY_PATH_BASE = "/newrelic";
class NewRelicClient {
  constructor(options) {
    var _a;
    this.discoveryApi = options.discoveryApi;
    this.proxyPathBase = (_a = options.proxyPathBase) != null ? _a : DEFAULT_PROXY_PATH_BASE;
  }
  async getApplications() {
    var _a;
    const url = await this.getApiUrl("apm", "applications.json");
    const response = await fetch(url);
    let responseJson;
    try {
      responseJson = await response.json();
    } catch (e) {
      responseJson = { applications: [] };
    }
    if (response.status !== 200) {
      throw new Error(`Error communicating with New Relic: ${((_a = responseJson == null ? void 0 : responseJson.error) == null ? void 0 : _a.title) || response.statusText}`);
    }
    return responseJson;
  }
  async getApiUrl(product, path) {
    const proxyUrl = await this.discoveryApi.getBaseUrl("proxy");
    return `${proxyUrl}${this.proxyPathBase}/${product}/api/${path}`;
  }
}

const rootRouteRef = createRouteRef({
  id: "newrelic"
});
const newRelicPlugin = createPlugin({
  id: "newrelic",
  apis: [
    createApiFactory({
      api: newRelicApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new NewRelicClient({ discoveryApi })
    })
  ],
  routes: {
    root: rootRouteRef
  }
});
const NewRelicPage = newRelicPlugin.provide(createRoutableExtension({
  name: "NewRelicPage",
  component: () => import('./index-22104ae7.esm.js').then((m) => m.default),
  mountPoint: rootRouteRef
}));

export { NewRelicPage as N, newRelicPlugin as a, newRelicApiRef as n };
//# sourceMappingURL=index-0a45db74.esm.js.map
