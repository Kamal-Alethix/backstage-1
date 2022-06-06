import { createRouteRef, createApiRef, createPlugin, createApiFactory, configApiRef, discoveryApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import fetch from 'cross-fetch';
import qs from 'qs';

const rootRouteRef = createRouteRef({
  id: "apache-airflow"
});

const apacheAirflowApiRef = createApiRef({
  id: "plugin.apacheairflow.service"
});

class ApacheAirflowClient {
  constructor({
    discoveryApi,
    baseUrl = "http://localhost:8080"
  }) {
    this.discoveryApi = discoveryApi;
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  }
  async listDags(options = { objectsPerRequest: 100 }) {
    const dags = [];
    const searchParams = {
      limit: options.objectsPerRequest,
      offset: 0
    };
    for (; ; ) {
      const response = await this.fetch(`/dags?${qs.stringify(searchParams)}`);
      dags.push(...response.dags);
      if (dags.length >= response.total_entries) {
        break;
      }
      if (typeof searchParams.offset !== "undefined") {
        searchParams.offset += options.objectsPerRequest;
      }
    }
    return dags;
  }
  async updateDag(dagId, isPaused) {
    const init = {
      method: "PATCH",
      body: JSON.stringify({ is_paused: isPaused })
    };
    return await this.fetch(`/dags/${dagId}`, init);
  }
  async getInstanceStatus() {
    return await this.fetch("/health");
  }
  async getInstanceVersion() {
    return await this.fetch("/version");
  }
  async fetch(input, init) {
    const proxyUri = `${await this.discoveryApi.getBaseUrl("proxy")}/airflow`;
    const response = await fetch(`${proxyUri}${input}`, init);
    if (!response.ok)
      throw new Error(response.statusText);
    return await response.json();
  }
}

const apacheAirflowPlugin = createPlugin({
  id: "apache-airflow",
  routes: {
    root: rootRouteRef
  },
  apis: [
    createApiFactory({
      api: apacheAirflowApiRef,
      deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
      factory: ({ configApi, discoveryApi }) => new ApacheAirflowClient({
        discoveryApi,
        baseUrl: configApi.getString("apacheAirflow.baseUrl")
      })
    })
  ]
});
const ApacheAirflowPage = apacheAirflowPlugin.provide(createRoutableExtension({
  name: "ApacheAirflowPage",
  component: () => import('./index-9a1d28fa.esm.js').then((m) => m.HomePage),
  mountPoint: rootRouteRef
}));

export { ApacheAirflowPage as A, apacheAirflowApiRef as a, apacheAirflowPlugin as b };
//# sourceMappingURL=index-41db7896.esm.js.map
