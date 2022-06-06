import { createRouteRef, createApiRef, createPlugin, createApiFactory, createRoutableExtension } from '@backstage/core-plugin-api';

const gitOpsClusterListRoute = createRouteRef({
  id: "gitops-clusters"
});
const gitOpsClusterDetailsRoute = createRouteRef({
  id: "gitops-cluster:details",
  params: ["owner", "repo"]
});
const gitOpsClusterCreateRoute = createRouteRef({
  id: "gitops-cluster:create"
});

class FetchError extends Error {
  get name() {
    return this.constructor.name;
  }
  static async forResponse(resp) {
    return new FetchError(`Request failed with status code ${resp.status}.
Reason: ${await resp.text()}`);
  }
}
const gitOpsApiRef = createApiRef({
  id: "plugin.gitops.service"
});
class GitOpsRestApi {
  constructor(url = "") {
    this.url = url;
  }
  async fetch(path, init) {
    const resp = await fetch(`${this.url}${path}`, init);
    if (!resp.ok)
      throw await FetchError.forResponse(resp);
    return await resp.json();
  }
  async fetchUserInfo(req) {
    const resp = await fetch(`https://api.github.com/user`, {
      method: "get",
      headers: new Headers({
        Authorization: `token ${req.accessToken}`
      })
    });
    if (!resp.ok)
      throw await FetchError.forResponse(resp);
    return await resp.json();
  }
  async fetchLog(req) {
    return await this.fetch(`/api/cluster/run-status`, {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(req)
    });
  }
  async changeClusterState(req) {
    return await this.fetch("/api/cluster/state", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(req)
    });
  }
  async cloneClusterFromTemplate(req) {
    return await this.fetch("/api/cluster/clone-from-template", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(req)
    });
  }
  async applyProfiles(req) {
    return await this.fetch("/api/cluster/profiles", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(req)
    });
  }
  async listClusters(req) {
    return await this.fetch("/api/clusters", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(req)
    });
  }
}

const gitopsProfilesPlugin = createPlugin({
  id: "gitops-profiles",
  apis: [
    createApiFactory(gitOpsApiRef, new GitOpsRestApi("http://localhost:3008"))
  ],
  routes: {
    listPage: gitOpsClusterListRoute,
    detailsPage: gitOpsClusterDetailsRoute,
    createPage: gitOpsClusterCreateRoute
  }
});
const GitopsProfilesClusterListPage = gitopsProfilesPlugin.provide(createRoutableExtension({
  name: "GitopsProfilesClusterListPage",
  component: () => import('./esm/index-a383559c.esm.js').then((m) => m.default),
  mountPoint: gitOpsClusterListRoute
}));
const GitopsProfilesClusterPage = gitopsProfilesPlugin.provide(createRoutableExtension({
  name: "GitopsProfilesClusterPage",
  component: () => import('./esm/index-c384ac37.esm.js').then((m) => m.default),
  mountPoint: gitOpsClusterDetailsRoute
}));
const GitopsProfilesCreatePage = gitopsProfilesPlugin.provide(createRoutableExtension({
  name: "GitopsProfilesCreatePage",
  component: () => import('./esm/index-e604c5bc.esm.js').then((m) => m.default),
  mountPoint: gitOpsClusterCreateRoute
}));

export { FetchError, GitOpsRestApi, GitopsProfilesClusterListPage, GitopsProfilesClusterPage, GitopsProfilesCreatePage, gitOpsApiRef, gitopsProfilesPlugin, gitopsProfilesPlugin as plugin };
//# sourceMappingURL=index.esm.js.map
