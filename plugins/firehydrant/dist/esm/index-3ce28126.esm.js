import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, createComponentExtension } from '@backstage/core-plugin-api';

const fireHydrantApiRef = createApiRef({
  id: "plugin.firehydrant.service"
});
const DEFAULT_PROXY_PATH = "/firehydrant/api";
class FireHydrantAPIClient {
  constructor(options) {
    var _a;
    this.discoveryApi = options.discoveryApi;
    this.proxyPath = (_a = options.proxyPath) != null ? _a : DEFAULT_PROXY_PATH;
  }
  async getServiceAnalytics(options) {
    const proxyUrl = await this.getApiUrl();
    const response = await fetch(`${proxyUrl}/metrics/services/${options.serviceId}?start_date=${options.startDate}&end_date=${options.endDate}`);
    if (!response.ok) {
      throw new Error(`There was a problem fetching FireHydrant analytics data: ${response.statusText}`);
    }
    const json = await response.json();
    return json;
  }
  async getServiceDetails(options) {
    var _a;
    const proxyUrl = await this.getApiUrl();
    const response = await fetch(`${proxyUrl}/services?query=${options.serviceName}`);
    if (!response.ok) {
      throw new Error(`There was a problem fetching FireHydrant data: ${response.statusText}`);
    }
    const json = await response.json();
    const servicesData = {
      service: {},
      incidents: []
    };
    if (((_a = json.data) == null ? void 0 : _a.length) === 0) {
      return servicesData;
    }
    servicesData.service = json.data[0];
    const incidentsJson = await this.getServiceIncidents({
      serviceId: json.data[0].id
    });
    servicesData.incidents = incidentsJson;
    return servicesData;
  }
  async getServiceIncidents(options) {
    const proxyUrl = await this.getApiUrl();
    const response = await fetch(`${proxyUrl}/incidents?services=${options.serviceId}&active=true`);
    if (!response.ok) {
      throw new Error(`There was a problem fetching FireHydrant incidents data: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data;
  }
  async getApiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl("proxy");
    return proxyUrl + this.proxyPath;
  }
}

const rootRouteRef = createRouteRef({
  id: "firehydrant"
});

const firehydrantPlugin = createPlugin({
  id: "firehydrant",
  apis: [
    createApiFactory({
      api: fireHydrantApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new FireHydrantAPIClient({ discoveryApi })
    })
  ],
  routes: {
    root: rootRouteRef
  }
});
const FirehydrantCard = firehydrantPlugin.provide(createComponentExtension({
  name: "FirehydrantCard",
  component: {
    lazy: () => import('./index-d55240ec.esm.js').then((m) => m.ServiceDetailsCard)
  }
}));

export { FirehydrantCard as F, firehydrantPlugin as a, fireHydrantApiRef as f };
//# sourceMappingURL=index-3ce28126.esm.js.map
