import { createApiRef, createRouteRef, createPlugin, createApiFactory, discoveryApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

const codesceneApiRef = createApiRef({
  id: "plugin.codescene.service"
});
class CodeSceneClient {
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
  }
  async fetchProjects() {
    return this.fetchFromApi("projects");
  }
  async fetchProject(projectId) {
    return this.fetchFromApi(`projects/${projectId}`);
  }
  async fetchAnalyses(projectId) {
    return this.fetchFromApi(`projects/${projectId}/analyses`);
  }
  async fetchLatestAnalysis(projectId) {
    return this.fetchFromApi(`projects/${projectId}/analyses/latest`);
  }
  async fetchFromApi(path) {
    const apiUrl = await this.getApiUrl();
    const res = await fetch(`${apiUrl}/${path}`);
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    return await res.json();
  }
  async getApiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl("proxy");
    return `${proxyUrl}/codescene-api`;
  }
}

const rootRouteRef = createRouteRef({
  id: "codescene"
});
const projectDetailsRouteRef = createRouteRef({
  id: "codescene-project-page",
  params: ["projectId"]
});

const codescenePlugin = createPlugin({
  id: "codescene",
  apis: [
    createApiFactory({
      api: codesceneApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new CodeSceneClient({ discoveryApi })
    })
  ],
  routes: {
    root: rootRouteRef,
    projectPage: projectDetailsRouteRef
  }
});
const CodeScenePage = codescenePlugin.provide(createRoutableExtension({
  name: "CodeScenePage",
  component: () => import('./index-17ea94a4.esm.js').then((m) => m.CodeScenePageComponent),
  mountPoint: rootRouteRef
}));
const CodeSceneProjectDetailsPage = codescenePlugin.provide(createRoutableExtension({
  name: "CodeSceneProjectDetailsPage",
  component: () => import('./index-ae3fcafc.esm.js').then((m) => m.CodeSceneProjectDetailsPage),
  mountPoint: projectDetailsRouteRef
}));

var _path, _path2;

var SvgCodesceneIcon = function SvgCodesceneIcon(props) {
  return /*#__PURE__*/React.createElement(SvgIcon, props, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M21.898 6.168C20.5 2.242 17.016.004 12.004.004 6.988.004 3.5 2.242 2.102 6.168.895 6.59 0 8.871 0 11.707c0 3.148 1.102 5.613 2.512 5.613.031 0 .062 0 .093-.004.485.977 1.118 1.727 1.907 2.27 1.914 1.32 4.574 1.41 7.375 1.41h.332c2.77 0 5.383-.11 7.27-1.41.788-.543 1.425-1.293 1.906-2.27a.753.753 0 0 0 .093.004c1.41 0 2.512-2.465 2.512-5.613 0-2.836-.895-5.117-2.102-5.539ZM.468 11.707c0-2.422.657-4.21 1.419-4.86-.309 1.09-.469 2.294-.469 3.606 0 2.692.312 4.79.965 6.371-.946-.164-1.914-2.176-1.914-5.117Zm20.665 5.043a7.517 7.517 0 0 1-.203.434c-.442.855-1.008 1.52-1.707 2.003-1.77 1.22-4.192 1.348-6.996 1.348h-.34c-2.856 0-5.32-.11-7.11-1.348-.699-.484-1.261-1.148-1.707-2.003a7.517 7.517 0 0 1-.203-.434c-.66-1.523-.98-3.594-.98-6.297 0-1.43.199-2.723.582-3.871.05-.164.113-.324.172-.48C4.035 2.523 7.32.484 12 .484c4.68 0 7.965 2.04 9.36 5.618.062.156.12.316.171.48.383 1.148.582 2.441.582 3.871 0 2.703-.32 4.77-.98 6.297Zm.484.074c.653-1.578.965-3.676.965-6.37 0-1.313-.16-2.517-.469-3.606.762.652 1.418 2.441 1.418 4.863 0 2.937-.968 4.95-1.914 5.113Zm0 0"
  })), _path2 || (_path2 = /*#__PURE__*/React.createElement("path", {
    d: "M12 3.477c-6.348 0-9.176 2.57-9.176 8.34 0 5.609 3 8.335 9.176 8.335s9.176-2.726 9.176-8.336c0-5.77-2.828-8.34-9.176-8.34Zm0 16.195c-5.941 0-8.707-2.496-8.707-7.86 0-3.66.988-7.859 8.707-7.859 7.719 0 8.707 4.2 8.707 7.86 0 5.363-2.766 7.859-8.707 7.859Zm0 0"
  })));
};

const CodeSceneIcon = SvgCodesceneIcon;

export { CodeSceneIcon as C, codescenePlugin as a, CodeScenePage as b, codesceneApiRef as c, CodeSceneProjectDetailsPage as d, rootRouteRef as r };
//# sourceMappingURL=index-bdc8477a.esm.js.map
