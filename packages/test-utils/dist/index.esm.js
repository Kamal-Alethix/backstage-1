import { ConfigReader } from '@backstage/config';
import { createFetchApi, FetchMiddlewares, UrlPatternDiscovery, AlertApiForwarder, NoOpAnalyticsApi, ErrorAlerter, ErrorApiForwarder, UnhandledErrorForwarder, WebStorage, OAuthRequestManager, GoogleAuth, MicrosoftAuth, GithubAuth, OktaAuth, GitlabAuth, OneLoginAuth, BitbucketAuth, AtlassianAuth, createSpecializedApp, ApiProvider } from '@backstage/core-app-api';
import crossFetch, { Response } from 'cross-fetch';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import ObservableImpl from 'zen-observable';
import React from 'react';
import { MemoryRouter, Routes } from 'react-router';
import { Route } from 'react-router-dom';
import { lightTheme } from '@backstage/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import MockIcon from '@material-ui/icons/AcUnit';
import { createApiFactory, discoveryApiRef, configApiRef, alertApiRef, analyticsApiRef, errorApiRef, storageApiRef, oauthRequestApiRef, googleAuthApiRef, microsoftAuthApiRef, githubAuthApiRef, oktaAuthApiRef, gitlabAuthApiRef, oneloginAuthApiRef, bitbucketAuthApiRef, atlassianAuthApiRef, createRouteRef, attachComponentData } from '@backstage/core-plugin-api';
import { act, render } from '@testing-library/react';

class MockAnalyticsApi {
  constructor() {
    this.events = [];
  }
  captureEvent(event) {
    const { action, subject, value, attributes, context } = event;
    this.events.push({
      action,
      subject,
      context,
      ...value !== void 0 ? { value } : {},
      ...attributes !== void 0 ? { attributes } : {}
    });
  }
  getEvents() {
    return this.events;
  }
}

class MockConfigApi {
  constructor(data) {
    this.config = new ConfigReader(data);
  }
  has(key) {
    return this.config.has(key);
  }
  keys() {
    return this.config.keys();
  }
  get(key) {
    return this.config.get(key);
  }
  getOptional(key) {
    return this.config.getOptional(key);
  }
  getConfig(key) {
    return this.config.getConfig(key);
  }
  getOptionalConfig(key) {
    return this.config.getOptionalConfig(key);
  }
  getConfigArray(key) {
    return this.config.getConfigArray(key);
  }
  getOptionalConfigArray(key) {
    return this.config.getOptionalConfigArray(key);
  }
  getNumber(key) {
    return this.config.getNumber(key);
  }
  getOptionalNumber(key) {
    return this.config.getOptionalNumber(key);
  }
  getBoolean(key) {
    return this.config.getBoolean(key);
  }
  getOptionalBoolean(key) {
    return this.config.getOptionalBoolean(key);
  }
  getString(key) {
    return this.config.getString(key);
  }
  getOptionalString(key) {
    return this.config.getOptionalString(key);
  }
  getStringArray(key) {
    return this.config.getStringArray(key);
  }
  getOptionalStringArray(key) {
    return this.config.getOptionalStringArray(key);
  }
}

const nullObservable = {
  subscribe: () => ({ unsubscribe: () => {
  }, closed: true }),
  [Symbol.observable]() {
    return this;
  }
};
class MockErrorApi {
  constructor(options = {}) {
    this.options = options;
    this.errors = new Array();
    this.waiters = /* @__PURE__ */ new Set();
  }
  post(error, context) {
    if (this.options.collect) {
      this.errors.push({ error, context });
      for (const waiter of this.waiters) {
        if (waiter.pattern.test(error.message)) {
          this.waiters.delete(waiter);
          waiter.resolve({ error, context });
        }
      }
      return;
    }
    throw new Error(`MockErrorApi received unexpected error, ${error}`);
  }
  error$() {
    return nullObservable;
  }
  getErrors() {
    return this.errors;
  }
  waitForError(pattern, timeoutMs = 2e3) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Timed out waiting for error"));
      }, timeoutMs);
      this.waiters.add({ resolve, pattern });
    });
  }
}

class MockFetchApi {
  constructor(options) {
    this.implementation = build(options);
  }
  get fetch() {
    return this.implementation.fetch;
  }
}
function build(options) {
  return createFetchApi({
    baseImplementation: baseImplementation(options),
    middleware: [
      resolvePluginProtocol(options),
      injectIdentityAuth(options)
    ].filter((x) => Boolean(x))
  });
}
function baseImplementation(options) {
  const implementation = options == null ? void 0 : options.baseImplementation;
  if (!implementation) {
    return crossFetch;
  } else if (implementation === "none") {
    return () => Promise.resolve(new Response());
  }
  return implementation;
}
function resolvePluginProtocol(allOptions) {
  const options = allOptions == null ? void 0 : allOptions.resolvePluginProtocol;
  if (!options) {
    return void 0;
  }
  return FetchMiddlewares.resolvePluginProtocol({
    discoveryApi: options.discoveryApi
  });
}
function injectIdentityAuth(allOptions) {
  const options = allOptions == null ? void 0 : allOptions.injectIdentityAuth;
  if (!options) {
    return void 0;
  }
  const identityApi = "token" in options ? { getCredentials: async () => ({ token: options.token }) } : options.identityApi;
  return FetchMiddlewares.injectIdentityAuth({
    identityApi,
    allowUrl: () => true
  });
}

class MockPermissionApi {
  constructor(requestHandler = () => AuthorizeResult.ALLOW) {
    this.requestHandler = requestHandler;
  }
  async authorize(request) {
    return { result: this.requestHandler(request) };
  }
}

class MockStorageApi {
  constructor(namespace, bucketStorageApis, data) {
    this.subscribers = /* @__PURE__ */ new Set();
    this.observable = new ObservableImpl((subscriber) => {
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
    this.namespace = namespace;
    this.bucketStorageApis = bucketStorageApis;
    this.data = { ...data };
  }
  static create(data) {
    return new MockStorageApi("", /* @__PURE__ */ new Map(), data);
  }
  forBucket(name) {
    if (!this.bucketStorageApis.has(name)) {
      this.bucketStorageApis.set(name, new MockStorageApi(`${this.namespace}/${name}`, this.bucketStorageApis, this.data));
    }
    return this.bucketStorageApis.get(name);
  }
  snapshot(key) {
    if (this.data.hasOwnProperty(this.getKeyName(key))) {
      const data = this.data[this.getKeyName(key)];
      return {
        key,
        presence: "present",
        value: data
      };
    }
    return {
      key,
      presence: "absent",
      value: void 0
    };
  }
  async set(key, data) {
    const serialized = JSON.parse(JSON.stringify(data), (_key, value) => {
      if (typeof value === "object" && value !== null) {
        Object.freeze(value);
      }
      return value;
    });
    this.data[this.getKeyName(key)] = serialized;
    this.notifyChanges({
      key,
      presence: "present",
      value: serialized
    });
  }
  async remove(key) {
    delete this.data[this.getKeyName(key)];
    this.notifyChanges({
      key,
      presence: "absent",
      value: void 0
    });
  }
  observe$(key) {
    return this.observable.filter(({ key: messageKey }) => messageKey === key);
  }
  getKeyName(key) {
    return `${this.namespace}/${encodeURIComponent(key)}`;
  }
  notifyChanges(message) {
    for (const subscription of this.subscribers) {
      subscription.next(message);
    }
  }
}

function mockBreakpoint(options) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => {
      var _a;
      return {
        matches: (_a = options.matches) != null ? _a : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      };
    })
  });
}

async function renderWithEffects(nodes, options) {
  let value;
  await act(async () => {
    value = render(nodes, options);
  });
  return value;
}

const defaultApis = [
  createApiFactory({
    api: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => UrlPatternDiscovery.compile(`${configApi.getString("backend.baseUrl")}/api/{{ pluginId }}`)
  }),
  createApiFactory(alertApiRef, new AlertApiForwarder()),
  createApiFactory(analyticsApiRef, new NoOpAnalyticsApi()),
  createApiFactory({
    api: errorApiRef,
    deps: { alertApi: alertApiRef },
    factory: ({ alertApi }) => {
      const errorApi = new ErrorAlerter(alertApi, new ErrorApiForwarder());
      UnhandledErrorForwarder.forward(errorApi, { hidden: false });
      return errorApi;
    }
  }),
  createApiFactory({
    api: storageApiRef,
    deps: { errorApi: errorApiRef },
    factory: ({ errorApi }) => WebStorage.create({ errorApi })
  }),
  createApiFactory(oauthRequestApiRef, new OAuthRequestManager()),
  createApiFactory({
    api: googleAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => GoogleAuth.create({
      discoveryApi,
      oauthRequestApi,
      environment: configApi.getOptionalString("auth.environment")
    })
  }),
  createApiFactory({
    api: microsoftAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => MicrosoftAuth.create({
      discoveryApi,
      oauthRequestApi,
      environment: configApi.getOptionalString("auth.environment")
    })
  }),
  createApiFactory({
    api: githubAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => GithubAuth.create({
      discoveryApi,
      oauthRequestApi,
      defaultScopes: ["read:user"],
      environment: configApi.getOptionalString("auth.environment")
    })
  }),
  createApiFactory({
    api: oktaAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => OktaAuth.create({
      discoveryApi,
      oauthRequestApi,
      environment: configApi.getOptionalString("auth.environment")
    })
  }),
  createApiFactory({
    api: gitlabAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => GitlabAuth.create({
      discoveryApi,
      oauthRequestApi,
      environment: configApi.getOptionalString("auth.environment")
    })
  }),
  createApiFactory({
    api: oneloginAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => OneLoginAuth.create({
      discoveryApi,
      oauthRequestApi,
      environment: configApi.getOptionalString("auth.environment")
    })
  }),
  createApiFactory({
    api: bitbucketAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => BitbucketAuth.create({
      discoveryApi,
      oauthRequestApi,
      defaultScopes: ["team"],
      environment: configApi.getOptionalString("auth.environment")
    })
  }),
  createApiFactory({
    api: atlassianAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) => {
      return AtlassianAuth.create({
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString("auth.environment")
      });
    }
  })
];

const mockApis = [
  createApiFactory(errorApiRef, new MockErrorApi()),
  createApiFactory(storageApiRef, MockStorageApi.create())
];

const mockIcons = {
  "kind:api": MockIcon,
  "kind:component": MockIcon,
  "kind:domain": MockIcon,
  "kind:group": MockIcon,
  "kind:location": MockIcon,
  "kind:system": MockIcon,
  "kind:user": MockIcon,
  brokenImage: MockIcon,
  catalog: MockIcon,
  scaffolder: MockIcon,
  techdocs: MockIcon,
  search: MockIcon,
  chat: MockIcon,
  dashboard: MockIcon,
  docs: MockIcon,
  email: MockIcon,
  github: MockIcon,
  group: MockIcon,
  help: MockIcon,
  user: MockIcon,
  warning: MockIcon
};
const ErrorBoundaryFallback = ({ error }) => {
  throw new Error(`Reached ErrorBoundaryFallback Page with error, ${error}`);
};
const NotFoundErrorPage = () => {
  throw new Error("Reached NotFound Page");
};
const BootErrorPage = ({ step, error }) => {
  throw new Error(`Reached BootError Page at step ${step} with error ${error}`);
};
const Progress = () => /* @__PURE__ */ React.createElement("div", {
  "data-testid": "progress"
});
const NoRender = (_props) => null;
function isExternalRouteRef(routeRef) {
  return String(routeRef).includes("{type=external,");
}
function createTestAppWrapper(options = {}) {
  var _a;
  const { routeEntries = ["/"] } = options;
  const boundRoutes = /* @__PURE__ */ new Map();
  const app = createSpecializedApp({
    apis: mockApis,
    defaultApis,
    configLoader: false,
    components: {
      Progress,
      BootErrorPage,
      NotFoundErrorPage,
      ErrorBoundaryFallback,
      Router: ({ children }) => /* @__PURE__ */ React.createElement(MemoryRouter, {
        initialEntries: routeEntries,
        children
      })
    },
    icons: mockIcons,
    plugins: [],
    themes: [
      {
        id: "light",
        title: "Test App Theme",
        variant: "light",
        Provider: ({ children }) => /* @__PURE__ */ React.createElement(ThemeProvider, {
          theme: lightTheme
        }, /* @__PURE__ */ React.createElement(CssBaseline, null, children))
      }
    ],
    bindRoutes: ({ bind }) => {
      for (const [externalRef, absoluteRef] of boundRoutes) {
        bind({ ref: externalRef }, {
          ref: absoluteRef
        });
      }
    }
  });
  const routeElements = Object.entries((_a = options.mountedRoutes) != null ? _a : {}).map(([path, routeRef]) => {
    const Page = () => /* @__PURE__ */ React.createElement("div", null, "Mounted at ", path);
    if (isExternalRouteRef(routeRef)) {
      const absoluteRef = createRouteRef({ id: "id" });
      boundRoutes.set(routeRef, absoluteRef);
      attachComponentData(Page, "core.mountPoint", absoluteRef);
    } else {
      attachComponentData(Page, "core.mountPoint", routeRef);
    }
    return /* @__PURE__ */ React.createElement(Route, {
      key: path,
      path,
      element: /* @__PURE__ */ React.createElement(Page, null)
    });
  });
  const AppProvider = app.getProvider();
  const AppRouter = app.getRouter();
  const TestAppWrapper = ({ children }) => /* @__PURE__ */ React.createElement(AppProvider, null, /* @__PURE__ */ React.createElement(AppRouter, null, /* @__PURE__ */ React.createElement(NoRender, null, routeElements), /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
    path: "/*",
    element: /* @__PURE__ */ React.createElement(React.Fragment, null, children)
  }))));
  return TestAppWrapper;
}
function wrapInTestApp(Component, options = {}) {
  const TestAppWrapper = createTestAppWrapper(options);
  let wrappedElement;
  if (Component instanceof Function) {
    wrappedElement = /* @__PURE__ */ React.createElement(Component, null);
  } else {
    wrappedElement = Component;
  }
  return /* @__PURE__ */ React.createElement(TestAppWrapper, null, wrappedElement);
}
async function renderInTestApp(Component, options = {}) {
  let wrappedElement;
  if (Component instanceof Function) {
    wrappedElement = /* @__PURE__ */ React.createElement(Component, null);
  } else {
    wrappedElement = Component;
  }
  return renderWithEffects(wrappedElement, {
    wrapper: createTestAppWrapper(options)
  });
}

function setupRequestMockHandlers(worker) {
  beforeAll(() => worker.listen({ onUnhandledRequest: "error" }));
  afterAll(() => worker.close());
  afterEach(() => worker.resetHandlers());
}

const allCategories = ["log", "warn", "error"];
function withLogCollector(logsToCollect, callback) {
  const oneArg = !callback;
  const actualCallback = oneArg ? logsToCollect : callback;
  const categories = oneArg ? allCategories : logsToCollect;
  const logs = {
    log: new Array(),
    warn: new Array(),
    error: new Array()
  };
  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;
  if (categories.includes("log")) {
    console.log = (message) => {
      logs.log.push(message);
    };
  }
  if (categories.includes("warn")) {
    console.warn = (message) => {
      logs.warn.push(message);
    };
  }
  if (categories.includes("error")) {
    console.error = (message) => {
      logs.error.push(message);
    };
  }
  const restore = () => {
    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;
  };
  try {
    const ret = actualCallback();
    if (!ret || !ret.then) {
      restore();
      return logs;
    }
    return ret.then(() => {
      restore();
      return logs;
    }, (error) => {
      restore();
      throw error;
    });
  } catch (error) {
    restore();
    throw error;
  }
}

class TestApiRegistry {
  constructor(apis) {
    this.apis = apis;
  }
  static from(...apis) {
    return new TestApiRegistry(new Map(apis.map(([api, impl]) => [api.id, impl])));
  }
  get(api) {
    return this.apis.get(api.id);
  }
}
const TestApiProvider = (props) => {
  return /* @__PURE__ */ React.createElement(ApiProvider, {
    apis: TestApiRegistry.from(...props.apis),
    children: props.children
  });
};

export { MockAnalyticsApi, MockConfigApi, MockErrorApi, MockFetchApi, MockPermissionApi, MockStorageApi, TestApiProvider, TestApiRegistry, createTestAppWrapper, mockBreakpoint, renderInTestApp, renderWithEffects, setupRequestMockHandlers, withLogCollector, wrapInTestApp };
//# sourceMappingURL=index.esm.js.map
