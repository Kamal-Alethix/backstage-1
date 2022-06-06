import React, { Fragment } from 'react';
import { screen } from 'testing-library__dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route } from 'react-router-dom';
import { act, render } from '@testing-library/react';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { FlatRoutes } from '@backstage/core-app-api';
import { techdocsApiRef, techdocsStorageApiRef, TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { techdocsPlugin, TechDocsReaderPage } from '@backstage/plugin-techdocs';
import { catalogPlugin } from '@backstage/plugin-catalog';
import { searchApiRef } from '@backstage/plugin-search-react';
import { scmIntegrationsApiRef } from '@backstage/integration-react';

const techdocsApi = {
  getTechDocsMetadata: jest.fn(),
  getEntityMetadata: jest.fn()
};
const techdocsStorageApi = {
  getApiOrigin: jest.fn(),
  getBaseUrl: jest.fn(),
  getEntityDocs: jest.fn(),
  syncEntityDocs: jest.fn()
};
const searchApi = {
  query: jest.fn().mockResolvedValue({ results: [] })
};
const scmIntegrationsApi = {
  fromConfig: jest.fn().mockReturnValue({})
};
const defaultOptions = {
  dom: /* @__PURE__ */ React.createElement(React.Fragment, null),
  entity: {},
  metadata: {},
  componentId: "docs",
  apis: [],
  path: ""
};
const defaultMetadata = {
  site_name: "Tech Docs",
  site_description: "Tech Docs"
};
const defaultEntity = {
  kind: "Component",
  metadata: { namespace: "default", name: "docs" }
};
const defaultDom = /* @__PURE__ */ React.createElement("html", {
  lang: "en"
}, /* @__PURE__ */ React.createElement("head", null), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement("div", {
  "data-md-component": "container"
}, /* @__PURE__ */ React.createElement("div", {
  "data-md-component": "navigation"
}), /* @__PURE__ */ React.createElement("div", {
  "data-md-component": "toc"
}), /* @__PURE__ */ React.createElement("div", {
  "data-md-component": "main"
}))));
class TechDocsAddonTester {
  constructor(addons) {
    this.options = defaultOptions;
    this.addons = addons;
  }
  static buildAddonsInTechDocs(addons) {
    return new TechDocsAddonTester(addons);
  }
  withApis(apis) {
    const refs = apis.map(([ref]) => ref);
    this.options.apis = this.options.apis.filter(([ref]) => !refs.includes(ref)).concat(apis);
    return this;
  }
  withDom(dom) {
    this.options.dom = dom;
    return this;
  }
  withMetadata(metadata) {
    this.options.metadata = metadata;
    return this;
  }
  withEntity(entity) {
    this.options.entity = entity;
    return this;
  }
  atPath(path) {
    this.options.path = path;
    return this;
  }
  build() {
    var _a, _b, _c, _d, _e;
    const apis = [
      [techdocsApiRef, techdocsApi],
      [techdocsStorageApiRef, techdocsStorageApi],
      [searchApiRef, searchApi],
      [scmIntegrationsApiRef, scmIntegrationsApi],
      ...this.options.apis
    ];
    const entityName = {
      namespace: ((_b = (_a = this.options.entity) == null ? void 0 : _a.metadata) == null ? void 0 : _b.namespace) || defaultEntity.metadata.namespace,
      kind: ((_c = this.options.entity) == null ? void 0 : _c.kind) || defaultEntity.kind,
      name: ((_e = (_d = this.options.entity) == null ? void 0 : _d.metadata) == null ? void 0 : _e.name) || defaultEntity.metadata.name
    };
    techdocsApi.getTechDocsMetadata.mockReturnValue(this.options.metadata || { ...defaultMetadata });
    techdocsApi.getEntityMetadata.mockResolvedValue(this.options.entity || { ...defaultEntity });
    techdocsStorageApi.syncEntityDocs.mockResolvedValue("cached");
    techdocsStorageApi.getApiOrigin.mockResolvedValue("https://backstage.example.com/api/techdocs");
    techdocsStorageApi.getBaseUrl.mockResolvedValue(`https://backstage.example.com/api/techdocs/${entityName.namespace}/${entityName.kind}/${entityName.name}/${this.options.path}`);
    techdocsStorageApi.getEntityDocs.mockResolvedValue(renderToStaticMarkup(this.options.dom || defaultDom));
    const TechDocsAddonsPage = () => {
      return /* @__PURE__ */ React.createElement(TestApiProvider, {
        apis
      }, /* @__PURE__ */ React.createElement(FlatRoutes, null, /* @__PURE__ */ React.createElement(Route, {
        path: "/docs/:namespace/:kind/:name/*",
        element: /* @__PURE__ */ React.createElement(TechDocsReaderPage, null)
      }, /* @__PURE__ */ React.createElement(TechDocsAddons, null, this.addons.map((addon, index) => /* @__PURE__ */ React.createElement(Fragment, {
        key: index
      }, addon))))));
    };
    return wrapInTestApp(/* @__PURE__ */ React.createElement(TechDocsAddonsPage, null), {
      routeEntries: [
        `/docs/${entityName.namespace}/${entityName.kind}/${entityName.name}/${this.options.path}`
      ],
      mountedRoutes: {
        "/docs": techdocsPlugin.routes.root,
        "/docs/:namespace/:kind/:name/*": techdocsPlugin.routes.docRoot,
        "/catalog/:namespace/:kind/:name": catalogPlugin.routes.catalogEntity
      }
    });
  }
  async renderWithEffects() {
    await act(async () => {
      render(this.build());
    });
    const shadowHost = screen.getByTestId("techdocs-native-shadowroot");
    return {
      ...screen,
      shadowRoot: (shadowHost == null ? void 0 : shadowHost.shadowRoot) || null
    };
  }
}
TechDocsAddonTester.buildAddonsInTechDocs;

export { TechDocsAddonTester };
//# sourceMappingURL=index.esm.js.map
