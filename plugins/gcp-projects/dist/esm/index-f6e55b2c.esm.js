import { createApiRef, createRouteRef, createPlugin, createApiFactory, googleAuthApiRef, createRoutableExtension } from '@backstage/core-plugin-api';

const gcpApiRef = createApiRef({
  id: "plugin.gcpprojects.service"
});

const BASE_URL = "https://content-cloudresourcemanager.googleapis.com/v1/projects";
class GcpClient {
  constructor(googleAuthApi) {
    this.googleAuthApi = googleAuthApi;
  }
  async listProjects() {
    const response = await fetch(BASE_URL, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`List request failed to ${BASE_URL} with ${response.status} ${response.statusText}`);
    }
    const { projects } = await response.json();
    return projects;
  }
  async getProject(projectId) {
    const url = `${BASE_URL}/${projectId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await this.getToken()}`
      }
    });
    if (!response.ok) {
      throw new Error(`Get request failed to ${url} with ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }
  async createProject(options) {
    const newProject = {
      name: options.projectName,
      projectId: options.projectId
    };
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${await this.getToken()}`
      },
      body: JSON.stringify(newProject)
    });
    if (!response.ok) {
      throw new Error(`Create request failed to ${BASE_URL} with ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }
  async getToken() {
    return this.googleAuthApi.getAccessToken("https://www.googleapis.com/auth/cloud-platform");
  }
}

const rootRouteRef = createRouteRef({
  id: "gcp-projects"
});
createRouteRef({
  id: "gcp-projects:project"
});
createRouteRef({
  id: "gcp-projects:new"
});

const gcpProjectsPlugin = createPlugin({
  id: "gcp-projects",
  routes: {
    root: rootRouteRef
  },
  apis: [
    createApiFactory({
      api: gcpApiRef,
      deps: { googleAuthApi: googleAuthApiRef },
      factory({ googleAuthApi }) {
        return new GcpClient(googleAuthApi);
      }
    })
  ]
});
const GcpProjectsPage = gcpProjectsPlugin.provide(createRoutableExtension({
  name: "GcpProjectsPage",
  component: () => import('./index-f29477da.esm.js').then((m) => m.GcpProjectsPage),
  mountPoint: rootRouteRef
}));

export { GcpProjectsPage as G, gcpProjectsPlugin as a, GcpClient as b, gcpApiRef as g, rootRouteRef as r };
//# sourceMappingURL=index-f6e55b2c.esm.js.map
