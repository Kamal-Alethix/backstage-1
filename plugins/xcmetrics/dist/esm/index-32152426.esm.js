import { createApiRef, createRouteRef, createSubRouteRef, createPlugin, createApiFactory, discoveryApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { DateTime } from 'luxon';

const xcmetricsApiRef = createApiRef({
  id: "plugin.xcmetrics.api"
});

class XcmetricsClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
  }
  async getBuild(id) {
    const response = await this.get(`/build/${id}`);
    return await response.json();
  }
  async getBuilds(limit = 10) {
    const response = await this.get(`/build?per=${limit}`);
    return (await response.json()).items;
  }
  async getFilteredBuilds(filters, page, perPage) {
    const response = await this.post("/build/filter", {
      from: DateTime.fromISO(filters.from).startOf("day").toISO({ suppressMilliseconds: true }),
      to: DateTime.fromISO(filters.to).endOf("day").startOf("second").toISO({ suppressMilliseconds: true }),
      status: filters.buildStatus,
      projectName: filters.project,
      page,
      per: perPage
    });
    return await response.json();
  }
  async getBuildCounts(days) {
    const response = await this.get(`/statistics/build/count?days=${days}`);
    return await response.json();
  }
  async getBuildErrors(buildId) {
    const response = await this.get(`/build/error/${buildId}`);
    return await response.json();
  }
  async getBuildHost(buildId) {
    const response = await this.get(`/build/host/${buildId}`);
    return await response.json();
  }
  async getBuildMetadata(buildId) {
    const response = await this.get(`/build/metadata/${buildId}`);
    return (await response.json()).metadata;
  }
  async getBuildTimes(days) {
    const response = await this.get(`/statistics/build/time?days=${days}`);
    return await response.json();
  }
  async getBuildStatuses(limit) {
    const response = await this.get(`/statistics/build/status?per=${limit}`);
    return (await response.json()).items;
  }
  async getBuildWarnings(buildId) {
    const response = await this.get(`/build/warning/${buildId}`);
    return await response.json();
  }
  async getProjects() {
    const response = await this.get("/build/project");
    return await response.json();
  }
  async get(path) {
    const baseUrl = `${await this.discoveryApi.getBaseUrl("proxy")}/xcmetrics`;
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response;
  }
  async post(path, body) {
    const baseUrl = `${await this.discoveryApi.getBaseUrl("proxy")}/xcmetrics`;
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response;
  }
}

const rootRouteRef = createRouteRef({
  id: "xcmetrics"
});
const buildsRouteRef = createSubRouteRef({
  id: "xcmetrics-builds",
  parent: rootRouteRef,
  path: "/builds"
});

const xcmetricsPlugin = createPlugin({
  id: "xcmetrics",
  routes: {
    root: rootRouteRef
  },
  apis: [
    createApiFactory({
      api: xcmetricsApiRef,
      deps: {
        discoveryApi: discoveryApiRef
      },
      factory({ discoveryApi }) {
        return new XcmetricsClient({ discoveryApi });
      }
    })
  ]
});
const XcmetricsPage = xcmetricsPlugin.provide(createRoutableExtension({
  name: "XcmetricsPage",
  component: () => import('./index-29ee7066.esm.js').then((m) => m.XcmetricsLayout),
  mountPoint: rootRouteRef
}));

export { XcmetricsPage as X, xcmetricsPlugin as a, buildsRouteRef as b, xcmetricsApiRef as x };
//# sourceMappingURL=index-32152426.esm.js.map
