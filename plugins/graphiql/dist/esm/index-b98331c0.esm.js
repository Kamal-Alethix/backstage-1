import * as React from 'react';
import React__default, { useState, Suspense } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { createApiRef, createRouteRef, createPlugin, createApiFactory, createRoutableExtension, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import 'graphiql/graphiql.css';
import { makeStyles, Typography, Tabs, Tab, Divider } from '@material-ui/core';
import { Progress, Content, Page, Header, HeaderLabel } from '@backstage/core-components';

var _path, _path2, _path3, _path4, _path5, _path6, _path7, _path8;

var SvgGraphiqlIcon = function SvgGraphiqlIcon(props) {
  return /*#__PURE__*/React.createElement(SvgIcon, props, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "m3.45 18.16-.864-.5 9.61-16.64.863.496Zm0 0"
  })), _path2 || (_path2 = /*#__PURE__*/React.createElement("path", {
    d: "M2.387 16.332h19.218v.996H2.387Zm0 0"
  })), _path3 || (_path3 = /*#__PURE__*/React.createElement("path", {
    d: "m12.383 22.441-9.613-5.55.496-.864 9.613 5.551ZM20.73 7.977l-9.613-5.551.5-.864 9.613 5.551Zm0 0"
  })), _path4 || (_path4 = /*#__PURE__*/React.createElement("path", {
    d: "m3.27 7.973-.5-.864 9.613-5.55.5.863Zm0 0"
  })), _path5 || (_path5 = /*#__PURE__*/React.createElement("path", {
    d: "m20.555 18.16-9.61-16.644.864-.496 9.609 16.64ZM3.148 6.45h.997v11.1h-.997Zm0 0"
  })), _path6 || (_path6 = /*#__PURE__*/React.createElement("path", {
    d: "M19.855 6.45h.997v11.1h-.997Zm0 0"
  })), _path7 || (_path7 = /*#__PURE__*/React.createElement("path", {
    d: "m12.21 22.02-.433-.754 8.36-4.825.433.75Zm0 0"
  })), _path8 || (_path8 = /*#__PURE__*/React.createElement("path", {
    d: "M22.172 17.875a2.099 2.099 0 0 1-2.863.766 2.095 2.095 0 1 1 2.093-3.63 2.09 2.09 0 0 1 .77 2.864M5.453 8.219a2.095 2.095 0 1 1-3.63-2.092 2.095 2.095 0 0 1 3.63 2.092M1.828 17.875a2.103 2.103 0 0 1 .77-2.863 2.1 2.1 0 0 1 2.863.77 2.096 2.096 0 0 1-3.633 2.093M18.547 8.219a2.095 2.095 0 1 1 3.63-2.092 2.095 2.095 0 0 1-3.63 2.092M12 23.746a2.094 2.094 0 1 1 0-4.187 2.094 2.094 0 0 1 0 4.187M12 4.441a2.094 2.094 0 1 1 0-4.187 2.094 2.094 0 0 1 0 4.187"
  })));
};

class GraphQLEndpoints {
  constructor(endpoints) {
    this.endpoints = endpoints;
  }
  static create(config) {
    const { id, title, url, method = "POST" } = config;
    return {
      id,
      title,
      fetcher: async (params, options = {}) => {
        const body = JSON.stringify(params);
        const headers = {
          "Content-Type": "application/json",
          ...config.headers,
          ...options.headers
        };
        const res = await fetch(url, {
          method,
          headers,
          body
        });
        return res.json();
      }
    };
  }
  static github(config) {
    const {
      id,
      title,
      url = "https://api.github.com/graphql",
      errorApi,
      githubAuthApi
    } = config;
    return {
      id,
      title,
      fetcher: async (params, options = {}) => {
        let retried = false;
        const doRequest = async () => {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await githubAuthApi.getAccessToken()}`,
              ...options.headers
            },
            body: JSON.stringify(params)
          });
          if (!res.ok) {
            throw new Error(`Request failed with status ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          if (!data.errors || retried) {
            return data;
          }
          retried = true;
          const missingScopes = data.errors.filter(({ type }) => type === "INSUFFICIENT_SCOPES").flatMap(({ message }) => {
            const scopesMatch = message.match(/one of the following scopes: (\[.*?\])/);
            if (!scopesMatch) {
              return [];
            }
            try {
              const scopes = JSON.parse(scopesMatch[1].replace(/'/g, '"'));
              return scopes;
            } catch (error) {
              if (errorApi) {
                errorApi.post(new Error(`Failed to parse scope string "${scopesMatch[1]}", ${error}`));
              }
              return [];
            }
          });
          await githubAuthApi.getAccessToken(missingScopes);
          return doRequest();
        };
        return await doRequest();
      }
    };
  }
  static from(endpoints) {
    return new GraphQLEndpoints(endpoints);
  }
  async getEndpoints() {
    return this.endpoints;
  }
}

const graphQlBrowseApiRef = createApiRef({
  id: "plugin.graphiql.browse"
});

const graphiQLRouteRef = createRouteRef({
  id: "graphiql-root"
});

const graphiqlPlugin = createPlugin({
  id: "graphiql",
  apis: [
    createApiFactory(graphQlBrowseApiRef, GraphQLEndpoints.from([
      GraphQLEndpoints.create({
        id: "gitlab",
        title: "GitLab",
        url: "https://gitlab.com/api/graphql"
      })
    ]))
  ]
});
const GraphiQLPage$1 = graphiqlPlugin.provide(createRoutableExtension({
  name: "GraphiQLPage",
  component: () => import('./index-8bf96b8d.esm.js').then((m) => m.GraphiQLPage),
  mountPoint: graphiQLRouteRef
}));

const _StorageBucket = class {
  constructor(storage, bucket) {
    this.storage = storage;
    this.bucket = bucket;
  }
  static forStorage(storage, bucket) {
    const storageBucket = new _StorageBucket(storage, bucket);
    return new Proxy(storageBucket, _StorageBucket.noPropAccessProxyHandler);
  }
  static forLocalStorage(bucket) {
    return _StorageBucket.forStorage(localStorage, bucket);
  }
  get length() {
    throw new Error("Method not implemented.");
  }
  clear() {
    this.storage.removeItem(this.bucket);
  }
  getItem(key) {
    var _a, _b;
    return (_b = (_a = this.read()) == null ? void 0 : _a[key]) != null ? _b : null;
  }
  key() {
    throw new Error("Method not implemented.");
  }
  removeItem(key) {
    const data = this.read();
    if (!data) {
      return;
    }
    if (key in data) {
      delete data[key];
      this.write(data);
    }
  }
  setItem(key, value) {
    var _a;
    const data = (_a = this.read()) != null ? _a : {};
    data[key] = value;
    this.write(data);
  }
  read() {
    const bucketValue = this.storage.getItem(this.bucket);
    if (!bucketValue) {
      return void 0;
    }
    try {
      return JSON.parse(bucketValue);
    } catch {
      return void 0;
    }
  }
  write(data) {
    this.storage.setItem(this.bucket, JSON.stringify(data));
  }
};
let StorageBucket = _StorageBucket;
StorageBucket.noPropAccessProxyHandler = {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    throw new Error("Direct property access is not allowed for StorageBuckets");
  },
  set() {
    throw new Error("Direct property access is not allowed for StorageBuckets");
  }
};

const GraphiQL = React__default.lazy(() => import('graphiql'));
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexFlow: "column nowrap"
  },
  tabs: {
    background: theme.palette.background.paper
  },
  graphiQlWrapper: {
    flex: 1,
    "@global": {
      ".graphiql-container": {
        boxSizing: "initial"
      }
    }
  }
}));
const GraphiQLBrowser = (props) => {
  const { endpoints } = props;
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  if (!endpoints.length) {
    return /* @__PURE__ */ React__default.createElement(Typography, {
      variant: "h4"
    }, "No endpoints available");
  }
  const { id, fetcher } = endpoints[tabIndex];
  const storage = StorageBucket.forLocalStorage(`plugin/graphiql/data/${id}`);
  return /* @__PURE__ */ React__default.createElement("div", {
    className: classes.root
  }, /* @__PURE__ */ React__default.createElement(Suspense, {
    fallback: /* @__PURE__ */ React__default.createElement(Progress, null)
  }, /* @__PURE__ */ React__default.createElement(Tabs, {
    classes: { root: classes.tabs },
    value: tabIndex,
    onChange: (_, value) => setTabIndex(value),
    indicatorColor: "primary"
  }, endpoints.map(({ title }, index) => /* @__PURE__ */ React__default.createElement(Tab, {
    key: index,
    label: title,
    value: index
  }))), /* @__PURE__ */ React__default.createElement(Divider, null), /* @__PURE__ */ React__default.createElement("div", {
    className: classes.graphiQlWrapper
  }, /* @__PURE__ */ React__default.createElement(GraphiQL, {
    headerEditorEnabled: true,
    key: tabIndex,
    fetcher,
    storage
  }))));
};

const GraphiQLPage = () => {
  const graphQlBrowseApi = useApi(graphQlBrowseApiRef);
  const endpoints = useAsync(() => graphQlBrowseApi.getEndpoints());
  let content;
  if (endpoints.loading) {
    content = /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(Progress, null));
  } else if (endpoints.error) {
    content = /* @__PURE__ */ React__default.createElement(Content, null, /* @__PURE__ */ React__default.createElement(Typography, {
      variant: "h4",
      color: "error"
    }, "Failed to load GraphQL endpoints, ", String(endpoints.error)));
  } else {
    content = /* @__PURE__ */ React__default.createElement(Content, {
      noPadding: true
    }, /* @__PURE__ */ React__default.createElement(GraphiQLBrowser, {
      endpoints: endpoints.value
    }));
  }
  return /* @__PURE__ */ React__default.createElement(Page, {
    themeId: "tool"
  }, /* @__PURE__ */ React__default.createElement(Header, {
    title: "GraphiQL"
  }, /* @__PURE__ */ React__default.createElement(HeaderLabel, {
    label: "Owner",
    value: "Spotify"
  }), /* @__PURE__ */ React__default.createElement(HeaderLabel, {
    label: "Lifecycle",
    value: "Alpha"
  })), content);
};

const GraphiQLIcon = SvgGraphiqlIcon;

export { GraphiQLPage as G, GraphiQLBrowser as a, GraphiQLIcon as b, GraphiQLPage$1 as c, GraphQLEndpoints as d, graphQlBrowseApiRef as e, graphiQLRouteRef as f, graphiqlPlugin as g };
//# sourceMappingURL=index-b98331c0.esm.js.map
