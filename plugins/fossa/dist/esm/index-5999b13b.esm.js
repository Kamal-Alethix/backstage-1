import { createApiRef, createRouteRef, createPlugin, createApiFactory, configApiRef, discoveryApiRef, identityApiRef, createComponentExtension, createRoutableExtension } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import fetch from 'cross-fetch';
import pLimit from 'p-limit';

const fossaApiRef = createApiRef({
  id: "plugin.fossa.service"
});

class FossaClient {
  constructor({
    discoveryApi,
    identityApi,
    organizationId
  }) {
    this.limit = pLimit(5);
    this.discoveryApi = discoveryApi;
    this.identityApi = identityApi;
    this.organizationId = organizationId;
  }
  async callApi(path, query) {
    const apiUrl = `${await this.discoveryApi.getBaseUrl("proxy")}/fossa`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(`${apiUrl}/${path}?${new URLSearchParams(query).toString()}`, {
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : {}
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  }
  async *getProject(projectTitles) {
    const pageSize = 1e3;
    for (let page = 0; ; page++) {
      const projects = await this.limit(() => this.callApi("projects", {
        count: pageSize,
        page,
        sort: "title+",
        ...this.organizationId && {
          organizationId: this.organizationId
        },
        ...projectTitles.size === 1 && {
          title: projectTitles.values().next().value
        }
      }));
      for (const project of projects) {
        if (projectTitles.has(project.title) && project.revisions.length > 0) {
          const revision = project.revisions[0];
          yield {
            title: project.title,
            summary: {
              timestamp: revision.updatedAt,
              issueCount: revision.unresolved_licensing_issue_count || revision.unresolved_issue_count,
              dependencyCount: revision.dependency_count,
              projectDefaultBranch: project.default_branch,
              projectUrl: `https://app.fossa.com/projects/${encodeURIComponent(project.locator)}`
            }
          };
        }
      }
      if (projects.length < pageSize) {
        break;
      }
    }
  }
  async getFindingSummaries(projectTitles) {
    const map = /* @__PURE__ */ new Map();
    if (projectTitles.length === 0) {
      return map;
    }
    for await (const { title, summary } of this.getProject(new Set(projectTitles))) {
      map.set(title, summary);
    }
    return map;
  }
  async getFindingSummary(projectTitle) {
    const summaries = await this.getFindingSummaries([projectTitle]);
    return summaries.get(projectTitle);
  }
}

const rootRoute = createRouteRef({
  id: "fossa-overview"
});

const fossaPlugin = createPlugin({
  id: "fossa",
  apis: [
    createApiFactory({
      api: fossaApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef
      },
      factory: ({ configApi, discoveryApi, identityApi }) => new FossaClient({
        discoveryApi,
        identityApi,
        organizationId: configApi.getOptionalString("fossa.organizationId")
      })
    })
  ],
  routes: {
    fossaOverview: rootRoute
  }
});

const EntityFossaCard = fossaPlugin.provide(createComponentExtension({
  name: "EntityFossaCard",
  component: {
    lazy: () => import('./index-4457d87c.esm.js').then((m) => m.FossaCard)
  }
}));
const FossaPage = fossaPlugin.provide(createRoutableExtension({
  name: "FossaPage",
  component: () => import('./index-9346ad27.esm.js').then((m) => m.FossaPage),
  mountPoint: rootRoute
}));

export { EntityFossaCard as E, FossaPage as F, fossaPlugin as a, fossaApiRef as f };
//# sourceMappingURL=index-5999b13b.esm.js.map
