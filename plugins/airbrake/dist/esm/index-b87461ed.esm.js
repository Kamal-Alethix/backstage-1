import { createRouteRef, createApiRef, createPlugin, createApiFactory, discoveryApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';

const rootRouteRef = createRouteRef({
  id: "airbrake"
});

const airbrakeApiRef = createApiRef({
  id: "plugin.airbrake.service"
});

class ProductionAirbrakeApi {
  constructor(discoveryApi) {
    this.discoveryApi = discoveryApi;
  }
  async fetchGroups(projectId) {
    const baseUrl = await this.discoveryApi.getBaseUrl("airbrake");
    const apiUrl = `${baseUrl}/api/v4/projects/${projectId}/groups`;
    const response = await fetch(apiUrl);
    if (response.status >= 400 && response.status < 600) {
      throw new Error("Failed fetching Airbrake groups");
    }
    return await response.json();
  }
}

const airbrakePlugin = createPlugin({
  id: "airbrake",
  apis: [
    createApiFactory({
      api: airbrakeApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new ProductionAirbrakeApi(discoveryApi)
    })
  ],
  routes: {
    root: rootRouteRef
  }
});

const EntityAirbrakeContent = airbrakePlugin.provide(createRoutableExtension({
  name: "EntityAirbrakeContent",
  mountPoint: rootRouteRef,
  component: () => import('./index-e08215d4.esm.js').then(({ EntityAirbrakeWidget }) => {
    return () => {
      const { entity } = useEntity();
      return /* @__PURE__ */ React.createElement(EntityAirbrakeWidget, {
        entity
      });
    };
  })
}));

export { EntityAirbrakeContent as E, airbrakeApiRef as a, airbrakePlugin as b };
//# sourceMappingURL=index-b87461ed.esm.js.map
