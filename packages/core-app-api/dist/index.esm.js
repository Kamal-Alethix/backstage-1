import React, { useContext, Children, isValidElement, useEffect, useMemo, useState, createContext } from 'react';
import PropTypes from 'prop-types';
import { createVersionedContext, createVersionedValueMap, getOrCreateGlobalSingleton } from '@backstage/version-bridge';
import ObservableImpl from 'zen-observable';
import { SessionState, FeatureFlagState, getComponentData, attachComponentData, useApi, featureFlagsApiRef, AnalyticsContext, useAnalytics, appThemeApiRef, configApiRef, identityApiRef, useApp, useElementFilter } from '@backstage/core-plugin-api';
import { z } from 'zod';
import { ConfigReader } from '@backstage/config';
export { ConfigReader } from '@backstage/config';
import { matchRoutes, generatePath, useLocation, Routes, Route, useRoutes } from 'react-router-dom';
import useAsync from 'react-use/lib/useAsync';
import useObservable from 'react-use/lib/useObservable';

class ApiAggregator {
  constructor(...holders) {
    this.holders = holders;
  }
  get(apiRef) {
    for (const holder of this.holders) {
      const api = holder.get(apiRef);
      if (api) {
        return api;
      }
    }
    return void 0;
  }
}

const ApiContext = createVersionedContext("api-context");
const ApiProvider = (props) => {
  var _a;
  const { apis, children } = props;
  const parentHolder = (_a = useContext(ApiContext)) == null ? void 0 : _a.atVersion(1);
  const holder = parentHolder ? new ApiAggregator(apis, parentHolder) : apis;
  return /* @__PURE__ */ React.createElement(ApiContext.Provider, {
    value: createVersionedValueMap({ 1: holder }),
    children
  });
};
ApiProvider.propTypes = {
  apis: PropTypes.shape({ get: PropTypes.func.isRequired }).isRequired,
  children: PropTypes.node
};

class ApiResolver {
  constructor(factories) {
    this.factories = factories;
    this.apis = /* @__PURE__ */ new Map();
  }
  static validateFactories(factories, apis) {
    for (const api of apis) {
      const heap = [api];
      const allDeps = /* @__PURE__ */ new Set();
      while (heap.length) {
        const apiRef = heap.shift();
        const factory = factories.get(apiRef);
        if (!factory) {
          continue;
        }
        for (const dep of Object.values(factory.deps)) {
          if (dep.id === api.id) {
            throw new Error(`Circular dependency of api factory for ${api}`);
          }
          if (!allDeps.has(dep)) {
            allDeps.add(dep);
            heap.push(dep);
          }
        }
      }
    }
  }
  get(ref) {
    return this.load(ref);
  }
  load(ref, loading = []) {
    const impl = this.apis.get(ref.id);
    if (impl) {
      return impl;
    }
    const factory = this.factories.get(ref);
    if (!factory) {
      return void 0;
    }
    if (loading.includes(factory.api)) {
      throw new Error(`Circular dependency of api factory for ${factory.api}`);
    }
    const deps = this.loadDeps(ref, factory.deps, [...loading, factory.api]);
    const api = factory.factory(deps);
    this.apis.set(ref.id, api);
    return api;
  }
  loadDeps(dependent, apis, loading) {
    const impls = {};
    for (const key in apis) {
      if (apis.hasOwnProperty(key)) {
        const ref = apis[key];
        const api = this.load(ref, loading);
        if (!api) {
          throw new Error(`No API factory available for dependency ${ref} of dependent ${dependent}`);
        }
        impls[key] = api;
      }
    }
    return impls;
  }
}

var ScopePriority = /* @__PURE__ */ ((ScopePriority2) => {
  ScopePriority2[ScopePriority2["default"] = 10] = "default";
  ScopePriority2[ScopePriority2["app"] = 50] = "app";
  ScopePriority2[ScopePriority2["static"] = 100] = "static";
  return ScopePriority2;
})(ScopePriority || {});
class ApiFactoryRegistry {
  constructor() {
    this.factories = /* @__PURE__ */ new Map();
  }
  register(scope, factory) {
    const priority = ScopePriority[scope];
    const existing = this.factories.get(factory.api.id);
    if (existing && existing.priority >= priority) {
      return false;
    }
    this.factories.set(factory.api.id, { priority, factory });
    return true;
  }
  get(api) {
    const tuple = this.factories.get(api.id);
    if (!tuple) {
      return void 0;
    }
    return tuple.factory;
  }
  getAllApis() {
    const refs = /* @__PURE__ */ new Set();
    for (const { factory } of this.factories.values()) {
      refs.add(factory.api);
    }
    return refs;
  }
}

function showLoginPopup(options) {
  return new Promise((resolve, reject) => {
    const width = options.width || 500;
    const height = options.height || 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open(options.url, options.name, `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top},left=${left}`);
    let targetOrigin = "";
    if (!popup || typeof popup.closed === "undefined" || popup.closed) {
      const error = new Error("Failed to open auth popup.");
      error.name = "PopupRejectedError";
      reject(error);
      return;
    }
    const messageListener = (event) => {
      if (event.source !== popup) {
        return;
      }
      if (event.origin !== options.origin) {
        return;
      }
      const { data } = event;
      if (data.type === "config_info") {
        targetOrigin = data.targetOrigin;
        return;
      }
      if (data.type !== "authorization_response") {
        return;
      }
      const authResult = data;
      if ("error" in authResult) {
        const error = new Error(authResult.error.message);
        error.name = authResult.error.name;
        reject(error);
      } else {
        resolve(authResult.response);
      }
      done();
    };
    const intervalId = setInterval(() => {
      if (popup.closed) {
        const errMessage = `Login failed, ${targetOrigin && targetOrigin !== window.location.origin ? `Incorrect app origin, expected ${targetOrigin}` : "popup was closed"}`;
        const error = new Error(errMessage);
        error.name = "PopupClosedError";
        reject(error);
        done();
      }
    }, 100);
    function done() {
      window.removeEventListener("message", messageListener);
      clearInterval(intervalId);
    }
    window.addEventListener("message", messageListener);
  });
}

function defaultJoinScopes(scopes) {
  return [...scopes].join(" ");
}
class DefaultAuthConnector {
  constructor(options) {
    const {
      discoveryApi,
      environment,
      provider,
      joinScopes = defaultJoinScopes,
      oauthRequestApi,
      sessionTransform = (id) => id
    } = options;
    this.authRequester = oauthRequestApi.createAuthRequester({
      provider,
      onAuthRequest: (scopes) => this.showPopup(scopes)
    });
    this.discoveryApi = discoveryApi;
    this.environment = environment;
    this.provider = provider;
    this.joinScopesFunc = joinScopes;
    this.sessionTransform = sessionTransform;
  }
  async createSession(options) {
    if (options.instantPopup) {
      return this.showPopup(options.scopes);
    }
    return this.authRequester(options.scopes);
  }
  async refreshSession() {
    const res = await fetch(await this.buildUrl("/refresh", { optional: true }), {
      headers: {
        "x-requested-with": "XMLHttpRequest"
      },
      credentials: "include"
    }).catch((error) => {
      throw new Error(`Auth refresh request failed, ${error}`);
    });
    if (!res.ok) {
      const error = new Error(`Auth refresh request failed, ${res.statusText}`);
      error.status = res.status;
      throw error;
    }
    const authInfo = await res.json();
    if (authInfo.error) {
      const error = new Error(authInfo.error.message);
      if (authInfo.error.name) {
        error.name = authInfo.error.name;
      }
      throw error;
    }
    return await this.sessionTransform(authInfo);
  }
  async removeSession() {
    const res = await fetch(await this.buildUrl("/logout"), {
      method: "POST",
      headers: {
        "x-requested-with": "XMLHttpRequest"
      },
      credentials: "include"
    }).catch((error) => {
      throw new Error(`Logout request failed, ${error}`);
    });
    if (!res.ok) {
      const error = new Error(`Logout request failed, ${res.statusText}`);
      error.status = res.status;
      throw error;
    }
  }
  async showPopup(scopes) {
    const scope = this.joinScopesFunc(scopes);
    const popupUrl = await this.buildUrl("/start", {
      scope,
      origin: location.origin
    });
    const payload = await showLoginPopup({
      url: popupUrl,
      name: `${this.provider.title} Login`,
      origin: new URL(popupUrl).origin,
      width: 450,
      height: 730
    });
    return await this.sessionTransform(payload);
  }
  async buildUrl(path, query) {
    const baseUrl = await this.discoveryApi.getBaseUrl("auth");
    const queryString = this.buildQueryString({
      ...query,
      env: this.environment
    });
    return `${baseUrl}/${this.provider.id}${path}${queryString}`;
  }
  buildQueryString(query) {
    if (!query) {
      return "";
    }
    const queryString = Object.entries(query).map(([key, value]) => {
      if (typeof value === "string") {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      } else if (value) {
        return encodeURIComponent(key);
      }
      return void 0;
    }).filter(Boolean).join("&");
    if (!queryString) {
      return "";
    }
    return `?${queryString}`;
  }
}

class DirectAuthConnector {
  constructor(options) {
    const { discoveryApi, environment, provider } = options;
    this.discoveryApi = discoveryApi;
    this.environment = environment;
    this.provider = provider;
  }
  async createSession() {
    const popupUrl = await this.buildUrl("/start");
    const payload = await showLoginPopup({
      url: popupUrl,
      name: `${this.provider.title} Login`,
      origin: new URL(popupUrl).origin,
      width: 450,
      height: 730
    });
    return {
      ...payload,
      id: payload.profile.email
    };
  }
  async refreshSession() {
  }
  async removeSession() {
    const res = await fetch(await this.buildUrl("/logout"), {
      method: "POST",
      headers: {
        "x-requested-with": "XMLHttpRequest"
      },
      credentials: "include"
    }).catch((error) => {
      throw new Error(`Logout request failed, ${error}`);
    });
    if (!res.ok) {
      const error = new Error(`Logout request failed, ${res.statusText}`);
      error.status = res.status;
      throw error;
    }
  }
  async buildUrl(path) {
    const baseUrl = await this.discoveryApi.getBaseUrl("auth");
    return `${baseUrl}/${this.provider.id}${path}?env=${this.environment}`;
  }
}

function hasScopes$1(searched, searchFor) {
  for (const scope of searchFor) {
    if (!searched.has(scope)) {
      return false;
    }
  }
  return true;
}
class SessionScopeHelper {
  constructor(options) {
    this.options = options;
  }
  sessionExistsAndHasScope(session, scopes) {
    if (!session) {
      return false;
    }
    if (!scopes) {
      return true;
    }
    if (this.options.sessionScopes === void 0) {
      return true;
    }
    const sessionScopes = this.options.sessionScopes(session);
    return hasScopes$1(sessionScopes, scopes);
  }
  getExtendedScope(session, scopes) {
    const newScope = new Set(this.options.defaultScopes);
    if (session && this.options.sessionScopes !== void 0) {
      const sessionScopes = this.options.sessionScopes(session);
      for (const scope of sessionScopes) {
        newScope.add(scope);
      }
    }
    if (scopes) {
      for (const scope of scopes) {
        newScope.add(scope);
      }
    }
    return newScope;
  }
}

class PublishSubject {
  constructor() {
    this.isClosed = false;
    this.observable = new ObservableImpl((subscriber) => {
      if (this.isClosed) {
        if (this.terminatingError) {
          subscriber.error(this.terminatingError);
        } else {
          subscriber.complete();
        }
        return () => {
        };
      }
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
    this.subscribers = /* @__PURE__ */ new Set();
  }
  [Symbol.observable]() {
    return this;
  }
  get closed() {
    return this.isClosed;
  }
  next(value) {
    if (this.isClosed) {
      throw new Error("PublishSubject is closed");
    }
    this.subscribers.forEach((subscriber) => subscriber.next(value));
  }
  error(error) {
    if (this.isClosed) {
      throw new Error("PublishSubject is closed");
    }
    this.isClosed = true;
    this.terminatingError = error;
    this.subscribers.forEach((subscriber) => subscriber.error(error));
  }
  complete() {
    if (this.isClosed) {
      throw new Error("PublishSubject is closed");
    }
    this.isClosed = true;
    this.subscribers.forEach((subscriber) => subscriber.complete());
  }
  subscribe(onNext, onError, onComplete) {
    const observer = typeof onNext === "function" ? {
      next: onNext,
      error: onError,
      complete: onComplete
    } : onNext;
    return this.observable.subscribe(observer);
  }
}
class BehaviorSubject {
  constructor(value) {
    this.subscribers = /* @__PURE__ */ new Set();
    this.isClosed = false;
    this.currentValue = value;
    this.terminatingError = void 0;
    this.observable = new ObservableImpl((subscriber) => {
      if (this.isClosed) {
        if (this.terminatingError) {
          subscriber.error(this.terminatingError);
        } else {
          subscriber.complete();
        }
        return () => {
        };
      }
      subscriber.next(this.currentValue);
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }
  [Symbol.observable]() {
    return this;
  }
  get closed() {
    return this.isClosed;
  }
  next(value) {
    if (this.isClosed) {
      throw new Error("BehaviorSubject is closed");
    }
    this.currentValue = value;
    this.subscribers.forEach((subscriber) => subscriber.next(value));
  }
  error(error) {
    if (this.isClosed) {
      throw new Error("BehaviorSubject is closed");
    }
    this.isClosed = true;
    this.terminatingError = error;
    this.subscribers.forEach((subscriber) => subscriber.error(error));
  }
  complete() {
    if (this.isClosed) {
      throw new Error("BehaviorSubject is closed");
    }
    this.isClosed = true;
    this.subscribers.forEach((subscriber) => subscriber.complete());
  }
  subscribe(onNext, onError, onComplete) {
    const observer = typeof onNext === "function" ? {
      next: onNext,
      error: onError,
      complete: onComplete
    } : onNext;
    return this.observable.subscribe(observer);
  }
}

class SessionStateTracker {
  constructor() {
    this.subject = new BehaviorSubject(SessionState.SignedOut);
    this.signedIn = false;
  }
  setIsSignedIn(isSignedIn) {
    if (this.signedIn !== isSignedIn) {
      this.signedIn = isSignedIn;
      this.subject.next(this.signedIn ? SessionState.SignedIn : SessionState.SignedOut);
    }
  }
  sessionState$() {
    return this.subject;
  }
}

class RefreshingAuthSessionManager {
  constructor(options) {
    this.stateTracker = new SessionStateTracker();
    const {
      connector,
      defaultScopes = /* @__PURE__ */ new Set(),
      sessionScopes,
      sessionShouldRefresh
    } = options;
    this.connector = connector;
    this.sessionScopesFunc = sessionScopes;
    this.sessionShouldRefreshFunc = sessionShouldRefresh;
    this.helper = new SessionScopeHelper({ sessionScopes, defaultScopes });
  }
  async getSession(options) {
    if (this.helper.sessionExistsAndHasScope(this.currentSession, options.scopes)) {
      const shouldRefresh = this.sessionShouldRefreshFunc(this.currentSession);
      if (!shouldRefresh) {
        return this.currentSession;
      }
      try {
        const refreshedSession = await this.collapsedSessionRefresh();
        const currentScopes = this.sessionScopesFunc(this.currentSession);
        const refreshedScopes = this.sessionScopesFunc(refreshedSession);
        if (hasScopes$1(refreshedScopes, currentScopes)) {
          this.currentSession = refreshedSession;
        }
        return refreshedSession;
      } catch (error) {
        if (options.optional) {
          return void 0;
        }
        throw error;
      }
    }
    if (!this.currentSession && !options.instantPopup) {
      try {
        const newSession = await this.collapsedSessionRefresh();
        this.currentSession = newSession;
        return this.getSession(options);
      } catch {
      }
    }
    if (options.optional) {
      return void 0;
    }
    this.currentSession = await this.connector.createSession({
      ...options,
      scopes: this.helper.getExtendedScope(this.currentSession, options.scopes)
    });
    this.stateTracker.setIsSignedIn(true);
    return this.currentSession;
  }
  async removeSession() {
    this.currentSession = void 0;
    await this.connector.removeSession();
    this.stateTracker.setIsSignedIn(false);
  }
  sessionState$() {
    return this.stateTracker.sessionState$();
  }
  async collapsedSessionRefresh() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    this.refreshPromise = this.connector.refreshSession();
    try {
      const session = await this.refreshPromise;
      this.stateTracker.setIsSignedIn(true);
      return session;
    } finally {
      delete this.refreshPromise;
    }
  }
}

class StaticAuthSessionManager {
  constructor(options) {
    this.stateTracker = new SessionStateTracker();
    const { connector, defaultScopes = /* @__PURE__ */ new Set(), sessionScopes } = options;
    this.connector = connector;
    this.helper = new SessionScopeHelper({ sessionScopes, defaultScopes });
  }
  setSession(session) {
    this.currentSession = session;
    this.stateTracker.setIsSignedIn(Boolean(session));
  }
  async getSession(options) {
    if (this.helper.sessionExistsAndHasScope(this.currentSession, options.scopes)) {
      return this.currentSession;
    }
    if (options.optional) {
      return void 0;
    }
    this.currentSession = await this.connector.createSession({
      ...options,
      scopes: this.helper.getExtendedScope(this.currentSession, options.scopes)
    });
    this.stateTracker.setIsSignedIn(true);
    return this.currentSession;
  }
  async removeSession() {
    this.currentSession = void 0;
    this.stateTracker.setIsSignedIn(false);
  }
  sessionState$() {
    return this.stateTracker.sessionState$();
  }
}

class AuthSessionStore {
  constructor(options) {
    const {
      manager,
      storageKey,
      schema,
      sessionScopes,
      sessionShouldRefresh = () => false
    } = options;
    this.manager = manager;
    this.storageKey = storageKey;
    this.schema = schema;
    this.sessionShouldRefreshFunc = sessionShouldRefresh;
    this.helper = new SessionScopeHelper({
      sessionScopes,
      defaultScopes: /* @__PURE__ */ new Set()
    });
  }
  setSession(session) {
    this.manager.setSession(session);
    this.saveSession(session);
  }
  async getSession(options) {
    const { scopes } = options;
    const session = this.loadSession();
    if (this.helper.sessionExistsAndHasScope(session, scopes)) {
      const shouldRefresh = this.sessionShouldRefreshFunc(session);
      if (!shouldRefresh) {
        this.manager.setSession(session);
        return session;
      }
    }
    const newSession = await this.manager.getSession(options);
    this.saveSession(newSession);
    return newSession;
  }
  async removeSession() {
    localStorage.removeItem(this.storageKey);
    await this.manager.removeSession();
  }
  sessionState$() {
    return this.manager.sessionState$();
  }
  loadSession() {
    try {
      const sessionJson = localStorage.getItem(this.storageKey);
      if (sessionJson) {
        const session = JSON.parse(sessionJson, (_key, value) => {
          if ((value == null ? void 0 : value.__type) === "Set") {
            return new Set(value.__value);
          }
          return value;
        });
        try {
          return this.schema.parse(session);
        } catch (e) {
          console.log(`Failed to load session from local storage because it did not conform to the expected schema, ${e}`);
          throw e;
        }
      }
      return void 0;
    } catch (error) {
      localStorage.removeItem(this.storageKey);
      return void 0;
    }
  }
  saveSession(session) {
    if (session === void 0) {
      localStorage.removeItem(this.storageKey);
      return;
    }
    try {
      this.schema.parse(session);
    } catch (e) {
      console.warn(`Failed to save session to local storage because it did not conform to the expected schema, ${e}`);
      return;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(session, (_key, value) => {
      if (value instanceof Set) {
        return {
          __type: "Set",
          __value: Array.from(value)
        };
      }
      return value;
    }));
  }
}

const DEFAULT_PROVIDER$9 = {
  id: "oauth2",
  title: "Your Identity Provider",
  icon: () => null
};
class OAuth2 {
  static create(options) {
    const {
      discoveryApi,
      environment = "development",
      provider = DEFAULT_PROVIDER$9,
      oauthRequestApi,
      defaultScopes = [],
      scopeTransform = (x) => x
    } = options;
    const connector = new DefaultAuthConnector({
      discoveryApi,
      environment,
      provider,
      oauthRequestApi,
      sessionTransform(res) {
        return {
          ...res,
          providerInfo: {
            idToken: res.providerInfo.idToken,
            accessToken: res.providerInfo.accessToken,
            scopes: OAuth2.normalizeScopes(scopeTransform, res.providerInfo.scope),
            expiresAt: new Date(Date.now() + res.providerInfo.expiresInSeconds * 1e3)
          }
        };
      }
    });
    const sessionManager = new RefreshingAuthSessionManager({
      connector,
      defaultScopes: new Set(defaultScopes),
      sessionScopes: (session) => session.providerInfo.scopes,
      sessionShouldRefresh: (session) => {
        const expiresInSec = (session.providerInfo.expiresAt.getTime() - Date.now()) / 1e3;
        return expiresInSec < 60 * 5;
      }
    });
    return new OAuth2({ sessionManager, scopeTransform });
  }
  constructor(options) {
    this.sessionManager = options.sessionManager;
    this.scopeTransform = options.scopeTransform;
  }
  async signIn() {
    await this.getAccessToken();
  }
  async signOut() {
    await this.sessionManager.removeSession();
  }
  sessionState$() {
    return this.sessionManager.sessionState$();
  }
  async getAccessToken(scope, options) {
    var _a;
    const normalizedScopes = OAuth2.normalizeScopes(this.scopeTransform, scope);
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: normalizedScopes
    });
    return (_a = session == null ? void 0 : session.providerInfo.accessToken) != null ? _a : "";
  }
  async getIdToken(options = {}) {
    var _a;
    const session = await this.sessionManager.getSession(options);
    return (_a = session == null ? void 0 : session.providerInfo.idToken) != null ? _a : "";
  }
  async getBackstageIdentity(options = {}) {
    const session = await this.sessionManager.getSession(options);
    return session == null ? void 0 : session.backstageIdentity;
  }
  async getProfile(options = {}) {
    const session = await this.sessionManager.getSession(options);
    return session == null ? void 0 : session.profile;
  }
  static normalizeScopes(scopeTransform, scopes) {
    if (!scopes) {
      return /* @__PURE__ */ new Set();
    }
    const scopeList = Array.isArray(scopes) ? scopes : scopes.split(/[\s|,]/).filter(Boolean);
    return new Set(scopeTransform(scopeList));
  }
}

const DEFAULT_PROVIDER$8 = {
  id: "github",
  title: "GitHub",
  icon: () => null
};
class GithubAuth {
  static create(options) {
    const {
      discoveryApi,
      environment = "development",
      provider = DEFAULT_PROVIDER$8,
      oauthRequestApi,
      defaultScopes = ["read:user"]
    } = options;
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes
    });
  }
}

const DEFAULT_PROVIDER$7 = {
  id: "gitlab",
  title: "GitLab",
  icon: () => null
};
class GitlabAuth {
  static create(options) {
    const {
      discoveryApi,
      environment = "development",
      provider = DEFAULT_PROVIDER$7,
      oauthRequestApi,
      defaultScopes = ["read_user"]
    } = options;
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes
    });
  }
}

const DEFAULT_PROVIDER$6 = {
  id: "google",
  title: "Google",
  icon: () => null
};
const SCOPE_PREFIX$1 = "https://www.googleapis.com/auth/";
class GoogleAuth {
  static create(options) {
    const {
      discoveryApi,
      oauthRequestApi,
      environment = "development",
      provider = DEFAULT_PROVIDER$6,
      defaultScopes = [
        "openid",
        `${SCOPE_PREFIX$1}userinfo.email`,
        `${SCOPE_PREFIX$1}userinfo.profile`
      ]
    } = options;
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes,
      scopeTransform(scopes) {
        return scopes.map((scope) => {
          if (scope === "openid") {
            return scope;
          }
          if (scope === "profile" || scope === "email") {
            return `${SCOPE_PREFIX$1}userinfo.${scope}`;
          }
          if (scope.startsWith(SCOPE_PREFIX$1)) {
            return scope;
          }
          return `${SCOPE_PREFIX$1}${scope}`;
        });
      }
    });
  }
}

const DEFAULT_PROVIDER$5 = {
  id: "okta",
  title: "Okta",
  icon: () => null
};
const OKTA_OIDC_SCOPES = /* @__PURE__ */ new Set([
  "openid",
  "profile",
  "email",
  "phone",
  "address",
  "groups",
  "offline_access"
]);
const OKTA_SCOPE_PREFIX = "okta.";
class OktaAuth {
  static create(options) {
    const {
      discoveryApi,
      environment = "development",
      provider = DEFAULT_PROVIDER$5,
      oauthRequestApi,
      defaultScopes = ["openid", "email", "profile", "offline_access"]
    } = options;
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes,
      scopeTransform(scopes) {
        return scopes.map((scope) => {
          if (OKTA_OIDC_SCOPES.has(scope)) {
            return scope;
          }
          if (scope.startsWith(OKTA_SCOPE_PREFIX)) {
            return scope;
          }
          return `${OKTA_SCOPE_PREFIX}${scope}`;
        });
      }
    });
  }
}

const samlSessionSchema = z.object({
  profile: z.object({
    email: z.string().optional(),
    displayName: z.string().optional(),
    picture: z.string().optional()
  }),
  backstageIdentity: z.object({
    token: z.string(),
    identity: z.object({
      type: z.literal("user"),
      userEntityRef: z.string(),
      ownershipEntityRefs: z.array(z.string())
    })
  })
});

const DEFAULT_PROVIDER$4 = {
  id: "saml",
  title: "SAML",
  icon: () => null
};
class SamlAuth {
  constructor(sessionManager) {
    this.sessionManager = sessionManager;
  }
  static create(options) {
    const {
      discoveryApi,
      environment = "development",
      provider = DEFAULT_PROVIDER$4
    } = options;
    const connector = new DirectAuthConnector({
      discoveryApi,
      environment,
      provider
    });
    const sessionManager = new StaticAuthSessionManager({
      connector
    });
    const authSessionStore = new AuthSessionStore({
      manager: sessionManager,
      storageKey: `${provider.id}Session`,
      schema: samlSessionSchema
    });
    return new SamlAuth(authSessionStore);
  }
  sessionState$() {
    return this.sessionManager.sessionState$();
  }
  async signIn() {
    await this.getBackstageIdentity({});
  }
  async signOut() {
    await this.sessionManager.removeSession();
  }
  async getBackstageIdentity(options = {}) {
    const session = await this.sessionManager.getSession(options);
    return session == null ? void 0 : session.backstageIdentity;
  }
  async getProfile(options = {}) {
    const session = await this.sessionManager.getSession(options);
    return session == null ? void 0 : session.profile;
  }
}

const DEFAULT_PROVIDER$3 = {
  id: "microsoft",
  title: "Microsoft",
  icon: () => null
};
class MicrosoftAuth {
  static create(options) {
    const {
      environment = "development",
      provider = DEFAULT_PROVIDER$3,
      oauthRequestApi,
      discoveryApi,
      defaultScopes = [
        "openid",
        "offline_access",
        "profile",
        "email",
        "User.Read"
      ]
    } = options;
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes
    });
  }
}

const DEFAULT_PROVIDER$2 = {
  id: "onelogin",
  title: "onelogin",
  icon: () => null
};
const OIDC_SCOPES = /* @__PURE__ */ new Set([
  "openid",
  "profile",
  "email",
  "phone",
  "address",
  "groups",
  "offline_access"
]);
const SCOPE_PREFIX = "onelogin.";
class OneLoginAuth {
  static create(options) {
    const {
      discoveryApi,
      environment = "development",
      provider = DEFAULT_PROVIDER$2,
      oauthRequestApi
    } = options;
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes: ["openid", "email", "profile", "offline_access"],
      scopeTransform(scopes) {
        return scopes.map((scope) => {
          if (OIDC_SCOPES.has(scope)) {
            return scope;
          }
          if (scope.startsWith(SCOPE_PREFIX)) {
            return scope;
          }
          return `${SCOPE_PREFIX}${scope}`;
        });
      }
    });
  }
}

const DEFAULT_PROVIDER$1 = {
  id: "bitbucket",
  title: "Bitbucket",
  icon: () => null
};
class BitbucketAuth {
  static create(options) {
    const {
      discoveryApi,
      environment = "development",
      provider = DEFAULT_PROVIDER$1,
      oauthRequestApi,
      defaultScopes = ["team"]
    } = options;
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes
    });
  }
}

const DEFAULT_PROVIDER = {
  id: "atlassian",
  title: "Atlassian",
  icon: () => null
};
class AtlassianAuth {
  static create(options) {
    const {
      discoveryApi,
      environment = "development",
      provider = DEFAULT_PROVIDER,
      oauthRequestApi
    } = options;
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment
    });
  }
}

class AlertApiForwarder {
  constructor() {
    this.subject = new PublishSubject();
  }
  post(alert) {
    this.subject.next(alert);
  }
  alert$() {
    return this.subject;
  }
}

class NoOpAnalyticsApi {
  captureEvent(_event) {
  }
}

const STORAGE_KEY = "theme";
class AppThemeSelector {
  constructor(themes) {
    this.themes = themes;
    this.subject = new BehaviorSubject(void 0);
  }
  static createWithStorage(themes) {
    var _a;
    const selector = new AppThemeSelector(themes);
    if (!window.localStorage) {
      return selector;
    }
    const initialThemeId = (_a = window.localStorage.getItem(STORAGE_KEY)) != null ? _a : void 0;
    selector.setActiveThemeId(initialThemeId);
    selector.activeThemeId$().subscribe((themeId) => {
      if (themeId) {
        window.localStorage.setItem(STORAGE_KEY, themeId);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    });
    window.addEventListener("storage", (event) => {
      var _a2;
      if (event.key === STORAGE_KEY) {
        const themeId = (_a2 = localStorage.getItem(STORAGE_KEY)) != null ? _a2 : void 0;
        selector.setActiveThemeId(themeId);
      }
    });
    return selector;
  }
  getInstalledThemes() {
    return this.themes.slice();
  }
  activeThemeId$() {
    return this.subject;
  }
  getActiveThemeId() {
    return this.activeThemeId;
  }
  setActiveThemeId(themeId) {
    this.activeThemeId = themeId;
    this.subject.next(themeId);
  }
}

const ERROR_PREFIX = "Invalid discovery URL pattern,";
class UrlPatternDiscovery {
  constructor(parts) {
    this.parts = parts;
  }
  static compile(pattern) {
    const parts = pattern.split(/\{\{\s*pluginId\s*\}\}/);
    const urlStr = parts.join("pluginId");
    let url;
    try {
      url = new URL(urlStr);
    } catch {
      throw new Error(`${ERROR_PREFIX} URL '${urlStr}' is invalid`);
    }
    if (url.hash) {
      throw new Error(`${ERROR_PREFIX} URL must not have a hash`);
    }
    if (url.search) {
      throw new Error(`${ERROR_PREFIX} URL must not have a query`);
    }
    if (urlStr.endsWith("/")) {
      throw new Error(`${ERROR_PREFIX} URL must not end with a slash`);
    }
    return new UrlPatternDiscovery(parts);
  }
  async getBaseUrl(pluginId) {
    return this.parts.join(pluginId);
  }
}

class ErrorAlerter {
  constructor(alertApi, errorApi) {
    this.alertApi = alertApi;
    this.errorApi = errorApi;
  }
  post(error, context) {
    if (!(context == null ? void 0 : context.hidden)) {
      this.alertApi.post({ message: error.message, severity: "error" });
    }
    return this.errorApi.post(error, context);
  }
  error$() {
    return this.errorApi.error$();
  }
}

class ErrorApiForwarder {
  constructor() {
    this.subject = new PublishSubject();
  }
  post(error, context) {
    this.subject.next({ error, context });
  }
  error$() {
    return this.subject;
  }
}

class UnhandledErrorForwarder {
  static forward(errorApi, errorContext) {
    window.addEventListener("unhandledrejection", (e) => {
      errorApi.post(e.reason, errorContext);
    });
  }
}

function validateFlagName(name) {
  if (name.length < 3) {
    throw new Error(`The '${name}' feature flag must have a minimum length of three characters.`);
  }
  if (name.length > 150) {
    throw new Error(`The '${name}' feature flag must not exceed 150 characters.`);
  }
  if (!name.match(/^[a-z]+[a-z0-9-]+$/)) {
    throw new Error(`The '${name}' feature flag must start with a lowercase letter and only contain lowercase letters, numbers and hyphens. Examples: feature-flag-one, alpha, release-2020`);
  }
}
class LocalStorageFeatureFlags {
  constructor() {
    this.registeredFeatureFlags = [];
  }
  registerFlag(flag) {
    validateFlagName(flag.name);
    this.registeredFeatureFlags.push(flag);
  }
  getRegisteredFlags() {
    return this.registeredFeatureFlags.slice();
  }
  isActive(name) {
    if (!this.flags) {
      this.flags = this.load();
    }
    return this.flags.get(name) === FeatureFlagState.Active;
  }
  save(options) {
    if (!this.flags) {
      this.flags = this.load();
    }
    if (!options.merge) {
      this.flags.clear();
    }
    for (const [name, state] of Object.entries(options.states)) {
      this.flags.set(name, state);
    }
    const enabled = Array.from(this.flags.entries()).filter(([, state]) => state === FeatureFlagState.Active);
    window.localStorage.setItem("featureFlags", JSON.stringify(Object.fromEntries(enabled)));
  }
  load() {
    try {
      const jsonStr = window.localStorage.getItem("featureFlags");
      if (!jsonStr) {
        return /* @__PURE__ */ new Map();
      }
      const json = JSON.parse(jsonStr);
      if (typeof json !== "object" || json === null || Array.isArray(json)) {
        return /* @__PURE__ */ new Map();
      }
      const entries = Object.entries(json).filter(([name, value]) => {
        validateFlagName(name);
        return value === FeatureFlagState.Active;
      });
      return new Map(entries);
    } catch {
      return /* @__PURE__ */ new Map();
    }
  }
}

function createFetchApi(options) {
  var _a;
  let result = options.baseImplementation || global.fetch;
  const middleware = [(_a = options.middleware) != null ? _a : []].flat().reverse();
  for (const m of middleware) {
    result = m.apply(result);
  }
  return {
    fetch: result
  };
}

class IdentityAuthInjectorFetchMiddleware {
  constructor(identityApi, allowUrl, headerName, headerValue) {
    this.identityApi = identityApi;
    this.allowUrl = allowUrl;
    this.headerName = headerName;
    this.headerValue = headerValue;
  }
  static create(options) {
    var _a, _b;
    const matcher = buildMatcher(options);
    const headerName = ((_a = options.header) == null ? void 0 : _a.name) || "authorization";
    const headerValue = ((_b = options.header) == null ? void 0 : _b.value) || ((token) => `Bearer ${token}`);
    return new IdentityAuthInjectorFetchMiddleware(options.identityApi, matcher, headerName, headerValue);
  }
  apply(next) {
    return async (input, init) => {
      const request = new Request(input, init);
      const { token } = await this.identityApi.getCredentials();
      if (request.headers.get(this.headerName) || typeof token !== "string" || !token || !this.allowUrl(request.url)) {
        return next(input, init);
      }
      request.headers.set(this.headerName, this.headerValue(token));
      return next(request);
    };
  }
}
function buildMatcher(options) {
  if (options.allowUrl) {
    return options.allowUrl;
  } else if (options.urlPrefixAllowlist) {
    return buildPrefixMatcher(options.urlPrefixAllowlist);
  } else if (options.config) {
    return buildPrefixMatcher([options.config.getString("backend.baseUrl")]);
  }
  return () => false;
}
function buildPrefixMatcher(prefixes) {
  const trimmedPrefixes = prefixes.map((prefix) => prefix.replace(/\/$/, ""));
  return (url) => trimmedPrefixes.some((prefix) => url === prefix || url.startsWith(`${prefix}/`));
}

function join(left, right) {
  if (!right || right === "/") {
    return left;
  }
  return `${left.replace(/\/$/, "")}/${right.replace(/^\//, "")}`;
}
class PluginProtocolResolverFetchMiddleware {
  constructor(discoveryApi) {
    this.discoveryApi = discoveryApi;
  }
  apply(next) {
    return async (input, init) => {
      const request = new Request(input, init);
      const prefix = "plugin://";
      if (!request.url.startsWith(prefix)) {
        return next(input, init);
      }
      const { hostname, pathname, search, hash, username, password } = new URL(`http://${request.url.substring(prefix.length)}`);
      let base = await this.discoveryApi.getBaseUrl(hostname);
      if (username || password) {
        const baseUrl = new URL(base);
        const authority = `${username}${password ? `:${password}` : ""}@`;
        base = `${baseUrl.protocol}//${authority}${baseUrl.host}${baseUrl.pathname}`;
      }
      const target = `${join(base, pathname)}${search}${hash}`;
      return next(target, typeof input === "string" ? init : input);
    };
  }
}

class FetchMiddlewares {
  static resolvePluginProtocol(options) {
    return new PluginProtocolResolverFetchMiddleware(options.discoveryApi);
  }
  static injectIdentityAuth(options) {
    return IdentityAuthInjectorFetchMiddleware.create(options);
  }
  constructor() {
  }
}

function hasScopes(searched, searchFor) {
  for (const scope of searchFor) {
    if (!searched.has(scope)) {
      return false;
    }
  }
  return true;
}
function joinScopes(scopes, ...moreScopess) {
  const result = new Set(scopes);
  for (const moreScopes of moreScopess) {
    for (const scope of moreScopes) {
      result.add(scope);
    }
  }
  return result;
}
class OAuthPendingRequests {
  constructor() {
    this.requests = [];
    this.subject = new BehaviorSubject(this.getCurrentPending());
  }
  request(scopes) {
    return new Promise((resolve, reject) => {
      this.requests.push({ scopes, resolve, reject });
      this.subject.next(this.getCurrentPending());
    });
  }
  resolve(scopes, result) {
    this.requests = this.requests.filter((request) => {
      if (hasScopes(scopes, request.scopes)) {
        request.resolve(result);
        return false;
      }
      return true;
    });
    this.subject.next(this.getCurrentPending());
  }
  reject(error) {
    this.requests.forEach((request) => request.reject(error));
    this.requests = [];
    this.subject.next(this.getCurrentPending());
  }
  pending() {
    return this.subject;
  }
  getCurrentPending() {
    const currentScopes = this.requests.length === 0 ? void 0 : this.requests.slice(1).reduce((acc, current) => joinScopes(acc, current.scopes), this.requests[0].scopes);
    return {
      scopes: currentScopes,
      resolve: (value) => {
        if (currentScopes) {
          this.resolve(currentScopes, value);
        }
      },
      reject: (reason) => {
        if (currentScopes) {
          this.reject(reason);
        }
      }
    };
  }
}

class OAuthRequestManager {
  constructor() {
    this.subject = new BehaviorSubject([]);
    this.currentRequests = [];
    this.handlerCount = 0;
  }
  createAuthRequester(options) {
    const handler = new OAuthPendingRequests();
    const index = this.handlerCount;
    this.handlerCount++;
    handler.pending().subscribe({
      next: (scopeRequest) => {
        const newRequests = this.currentRequests.slice();
        const request = this.makeAuthRequest(scopeRequest, options);
        if (!request) {
          delete newRequests[index];
        } else {
          newRequests[index] = request;
        }
        this.currentRequests = newRequests;
        this.subject.next(newRequests.filter(Boolean));
      }
    });
    return (scopes) => {
      return handler.request(scopes);
    };
  }
  makeAuthRequest(request, options) {
    const { scopes } = request;
    if (!scopes) {
      return void 0;
    }
    return {
      provider: options.provider,
      trigger: async () => {
        const result = await options.onAuthRequest(scopes);
        request.resolve(result);
      },
      reject: () => {
        const error = new Error("Login failed, rejected by user");
        error.name = "RejectedError";
        request.reject(error);
      }
    };
  }
  authRequest$() {
    return this.subject;
  }
}

const buckets = /* @__PURE__ */ new Map();
class WebStorage {
  constructor(namespace, errorApi) {
    this.namespace = namespace;
    this.errorApi = errorApi;
    this.subscribers = /* @__PURE__ */ new Set();
    this.observable = new ObservableImpl((subscriber) => {
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }
  static create(options) {
    var _a;
    return new WebStorage((_a = options.namespace) != null ? _a : "", options.errorApi);
  }
  get(key) {
    return this.snapshot(key).value;
  }
  snapshot(key) {
    let value = void 0;
    let presence = "absent";
    try {
      const item = localStorage.getItem(this.getKeyName(key));
      if (item) {
        value = JSON.parse(item, (_key, val) => {
          if (typeof val === "object" && val !== null) {
            Object.freeze(val);
          }
          return val;
        });
        presence = "present";
      }
    } catch (e) {
      this.errorApi.post(new Error(`Error when parsing JSON config from storage for: ${key}`));
    }
    return { key, value, presence };
  }
  forBucket(name) {
    const bucketPath = `${this.namespace}/${name}`;
    if (!buckets.has(bucketPath)) {
      buckets.set(bucketPath, new WebStorage(bucketPath, this.errorApi));
    }
    return buckets.get(bucketPath);
  }
  async set(key, data) {
    localStorage.setItem(this.getKeyName(key), JSON.stringify(data));
    this.notifyChanges(key);
  }
  async remove(key) {
    localStorage.removeItem(this.getKeyName(key));
    this.notifyChanges(key);
  }
  observe$(key) {
    return this.observable.filter(({ key: messageKey }) => messageKey === key);
  }
  getKeyName(key) {
    return `${this.namespace}/${encodeURIComponent(key)}`;
  }
  notifyChanges(key) {
    const snapshot = this.snapshot(key);
    for (const subscription of this.subscribers) {
      subscription.next(snapshot);
    }
  }
}

function traverseElementTree(options) {
  const collectors = {};
  for (const name in options.collectors) {
    if (options.collectors.hasOwnProperty(name)) {
      collectors[name] = options.collectors[name]();
    }
  }
  const queue = [
    {
      node: Children.toArray(options.root),
      parent: void 0,
      contexts: {}
    }
  ];
  while (queue.length !== 0) {
    const { node, parent, contexts } = queue.shift();
    Children.forEach(node, (element) => {
      if (!isValidElement(element)) {
        return;
      }
      const nextContexts = {};
      for (const name in collectors) {
        if (collectors.hasOwnProperty(name)) {
          const collector = collectors[name];
          nextContexts[name] = collector.visit(collector.accumulator, element, parent, contexts[name]);
        }
      }
      for (const discoverer of options.discoverers) {
        const children = discoverer(element);
        if (children) {
          queue.push({
            node: children,
            parent: element,
            contexts: nextContexts
          });
        }
      }
    });
  }
  return Object.fromEntries(Object.entries(collectors).map(([name, c]) => [name, c.accumulator]));
}
function createCollector(accumulatorFactory, visit) {
  return () => ({ accumulator: accumulatorFactory(), visit });
}
function childDiscoverer(element) {
  var _a;
  return (_a = element.props) == null ? void 0 : _a.children;
}
function routeElementDiscoverer(element) {
  var _a, _b, _c;
  if (((_a = element.props) == null ? void 0 : _a.path) && ((_b = element.props) == null ? void 0 : _b.element)) {
    return (_c = element.props) == null ? void 0 : _c.element;
  }
  return void 0;
}

const pluginCollector = createCollector(() => /* @__PURE__ */ new Set(), (acc, node) => {
  const plugin = getComponentData(node, "core.plugin");
  if (plugin) {
    acc.add(plugin);
  }
});

const FeatureFlagged = (props) => {
  const { children } = props;
  const featureFlagApi = useApi(featureFlagsApiRef);
  const isEnabled = "with" in props ? featureFlagApi.isActive(props.with) : !featureFlagApi.isActive(props.without);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, isEnabled ? children : null);
};
attachComponentData(FeatureFlagged, "core.featureFlagged", true);

const MATCH_ALL_ROUTE = {
  caseSensitive: false,
  path: "/*",
  element: "match-all",
  routeRefs: /* @__PURE__ */ new Set()
};
const routingV1Collector = createCollector(() => ({
  paths: /* @__PURE__ */ new Map(),
  parents: /* @__PURE__ */ new Map(),
  objects: new Array()
}), (acc, node, parent, ctx) => {
  var _a, _b, _c, _d, _e;
  if ((parent == null ? void 0 : parent.props.element) === node) {
    return ctx;
  }
  let currentObj = ctx == null ? void 0 : ctx.obj;
  let currentParentRouteRef = ctx == null ? void 0 : ctx.routeRef;
  let sticky = ctx == null ? void 0 : ctx.sticky;
  const path = (_a = node.props) == null ? void 0 : _a.path;
  const parentChildren = (_b = currentObj == null ? void 0 : currentObj.children) != null ? _b : acc.objects;
  const caseSensitive = Boolean((_c = node.props) == null ? void 0 : _c.caseSensitive);
  let currentCtxPath = ctx == null ? void 0 : ctx.path;
  if (getComponentData(node, "core.gatherMountPoints")) {
    if (!path) {
      throw new Error("Mount point gatherer must have a path");
    }
    currentCtxPath = path;
  }
  const element = (_d = node.props) == null ? void 0 : _d.element;
  let routeRef = getComponentData(node, "core.mountPoint");
  if (!routeRef && isValidElement(element)) {
    routeRef = getComponentData(element, "core.mountPoint");
  }
  if (routeRef) {
    let routePath = path;
    if (currentCtxPath) {
      if (routePath) {
        currentCtxPath = void 0;
      } else {
        routePath = currentCtxPath;
      }
    }
    if (!routePath) {
      throw new Error("Mounted routable extension must have a path");
    }
    acc.paths.set(routeRef, routePath);
    if (currentParentRouteRef && sticky) {
      acc.parents.set(routeRef, currentParentRouteRef);
      if (path) {
        currentParentRouteRef = routeRef;
        sticky = false;
      }
    } else {
      acc.parents.set(routeRef, currentParentRouteRef);
      currentParentRouteRef = routeRef;
    }
    if (path) {
      currentObj = {
        caseSensitive,
        path,
        element: "mounted",
        routeRefs: /* @__PURE__ */ new Set([routeRef]),
        children: [MATCH_ALL_ROUTE],
        plugin: getComponentData(node.props.element, "core.plugin")
      };
      parentChildren.push(currentObj);
    } else {
      currentObj == null ? void 0 : currentObj.routeRefs.add(routeRef);
    }
  }
  if (getComponentData(node, "core.gatherMountPoints")) {
    sticky = true;
  }
  const isGatherer = getComponentData(node, "core.gatherMountPoints");
  if (isGatherer) {
    if (!path) {
      throw new Error("Mount point gatherer must have a path");
    }
    if (!routeRef) {
      currentObj = {
        caseSensitive,
        path,
        element: "gathered",
        routeRefs: /* @__PURE__ */ new Set(),
        children: [MATCH_ALL_ROUTE],
        plugin: (_e = ctx == null ? void 0 : ctx.obj) == null ? void 0 : _e.plugin
      };
      parentChildren.push(currentObj);
    }
  }
  return {
    obj: currentObj,
    path: currentCtxPath,
    routeRef: currentParentRouteRef,
    sticky
  };
});
const featureFlagCollector = createCollector(() => /* @__PURE__ */ new Set(), (acc, node) => {
  if (node.type === FeatureFlagged) {
    const props = node.props;
    acc.add("with" in props ? props.with : props.without);
  }
});

const routeRefType = getOrCreateGlobalSingleton("route-ref-type", () => Symbol("route-ref-type"));
function isRouteRef(routeRef) {
  return routeRef[routeRefType] === "absolute";
}
function isSubRouteRef(routeRef) {
  return routeRef[routeRefType] === "sub";
}
function isExternalRouteRef(routeRef) {
  return routeRef[routeRefType] === "external";
}

function joinPaths(...paths) {
  const normalized = paths.join("/").replace(/\/\/+/g, "/");
  if (normalized !== "/" && normalized.endsWith("/")) {
    return normalized.slice(0, -1);
  }
  return normalized;
}
function resolveTargetRef(anyRouteRef, routePaths, routeBindings) {
  let targetRef;
  let subRoutePath = "";
  if (isRouteRef(anyRouteRef)) {
    targetRef = anyRouteRef;
  } else if (isSubRouteRef(anyRouteRef)) {
    targetRef = anyRouteRef.parent;
    subRoutePath = anyRouteRef.path;
  } else if (isExternalRouteRef(anyRouteRef)) {
    const resolvedRoute = routeBindings.get(anyRouteRef);
    if (!resolvedRoute) {
      return [void 0, ""];
    }
    if (isRouteRef(resolvedRoute)) {
      targetRef = resolvedRoute;
    } else if (isSubRouteRef(resolvedRoute)) {
      targetRef = resolvedRoute.parent;
      subRoutePath = resolvedRoute.path;
    } else {
      throw new Error(`ExternalRouteRef was bound to invalid target, ${resolvedRoute}`);
    }
  } else if (anyRouteRef[routeRefType]) {
    throw new Error(`Unknown or invalid route ref type, ${anyRouteRef[routeRefType]}`);
  } else {
    throw new Error(`Unknown object passed to useRouteRef, got ${anyRouteRef}`);
  }
  if (!targetRef) {
    return [void 0, ""];
  }
  const resolvedPath = routePaths.get(targetRef);
  if (!resolvedPath) {
    return [void 0, ""];
  }
  const targetPath = joinPaths(resolvedPath, subRoutePath);
  return [targetRef, targetPath];
}
function resolveBasePath(targetRef, sourceLocation, routePaths, routeParents, routeObjects) {
  var _a;
  const match = (_a = matchRoutes(routeObjects, sourceLocation)) != null ? _a : [];
  const refDiffList = Array();
  let matchIndex = -1;
  for (let targetSearchRef = targetRef; targetSearchRef; targetSearchRef = routeParents.get(targetSearchRef)) {
    matchIndex = match.findIndex((m) => m.route.routeRefs.has(targetSearchRef));
    if (matchIndex !== -1) {
      break;
    }
    refDiffList.unshift(targetSearchRef);
  }
  if (refDiffList.length === 0) {
    matchIndex -= 1;
  }
  const parentPath = matchIndex === -1 ? "" : match[matchIndex].pathname;
  const diffPath = joinPaths(...refDiffList.slice(0, -1).map((ref) => {
    const path = routePaths.get(ref);
    if (!path) {
      throw new Error(`No path for ${ref}`);
    }
    if (path.includes(":")) {
      throw new Error(`Cannot route to ${targetRef} with parent ${ref} as it has parameters`);
    }
    return path;
  }));
  return parentPath + diffPath;
}
class RouteResolver {
  constructor(routePaths, routeParents, routeObjects, routeBindings, appBasePath) {
    this.routePaths = routePaths;
    this.routeParents = routeParents;
    this.routeObjects = routeObjects;
    this.routeBindings = routeBindings;
    this.appBasePath = appBasePath;
  }
  resolve(anyRouteRef, sourceLocation) {
    const [targetRef, targetPath] = resolveTargetRef(anyRouteRef, this.routePaths, this.routeBindings);
    if (!targetRef) {
      return void 0;
    }
    let relativeSourceLocation;
    if (typeof sourceLocation === "string") {
      relativeSourceLocation = this.trimPath(sourceLocation);
    } else if (sourceLocation.pathname) {
      relativeSourceLocation = {
        ...sourceLocation,
        pathname: this.trimPath(sourceLocation.pathname)
      };
    } else {
      relativeSourceLocation = sourceLocation;
    }
    const basePath = this.appBasePath + resolveBasePath(targetRef, relativeSourceLocation, this.routePaths, this.routeParents, this.routeObjects);
    const routeFunc = (...[params]) => {
      return basePath + generatePath(targetPath, params);
    };
    return routeFunc;
  }
  trimPath(targetPath) {
    if (!targetPath) {
      return targetPath;
    }
    if (targetPath.startsWith(this.appBasePath)) {
      return targetPath.slice(this.appBasePath.length);
    }
    return targetPath;
  }
}

const RoutingContext = createVersionedContext("routing-context");
const RoutingProvider = ({
  routePaths,
  routeParents,
  routeObjects,
  routeBindings,
  basePath = "",
  children
}) => {
  const resolver = new RouteResolver(routePaths, routeParents, routeObjects, routeBindings, basePath);
  const versionedValue = createVersionedValueMap({ 1: resolver });
  return /* @__PURE__ */ React.createElement(RoutingContext.Provider, {
    value: versionedValue
  }, children);
};

const getExtensionContext = (pathname, routes) => {
  var _a, _b;
  try {
    const matches = matchRoutes(routes, { pathname });
    const routeObject = (_a = matches == null ? void 0 : matches.filter((match) => {
      var _a2;
      return ((_a2 = match == null ? void 0 : match.route.routeRefs) == null ? void 0 : _a2.size) > 0;
    }).pop()) == null ? void 0 : _a.route;
    if (!routeObject) {
      return {};
    }
    let routeRef;
    if (routeObject.routeRefs.size === 1) {
      routeRef = routeObject.routeRefs.values().next().value;
    }
    return {
      extension: "App",
      pluginId: ((_b = routeObject.plugin) == null ? void 0 : _b.getId()) || "root",
      ...routeRef ? { routeRef: routeRef.id } : {}
    };
  } catch {
    return {};
  }
};
const TrackNavigation = ({
  pathname,
  search,
  hash
}) => {
  const analytics = useAnalytics();
  useEffect(() => {
    analytics.captureEvent("navigate", `${pathname}${search}${hash}`);
  }, [analytics, pathname, search, hash]);
  return null;
};
const RouteTracker = ({
  routeObjects
}) => {
  const { pathname, search, hash } = useLocation();
  return /* @__PURE__ */ React.createElement(AnalyticsContext, {
    attributes: getExtensionContext(pathname, routeObjects)
  }, /* @__PURE__ */ React.createElement(TrackNavigation, {
    pathname,
    search,
    hash
  }));
};

function validateRouteParameters(routePaths, routeParents) {
  const notLeafRoutes = new Set(routeParents.values());
  notLeafRoutes.delete(void 0);
  for (const route of routeParents.keys()) {
    if (notLeafRoutes.has(route)) {
      continue;
    }
    let currentRouteRef = route;
    let fullPath = "";
    while (currentRouteRef) {
      const path = routePaths.get(currentRouteRef);
      if (!path) {
        throw new Error(`No path for ${currentRouteRef}`);
      }
      fullPath = `${path}${fullPath}`;
      currentRouteRef = routeParents.get(currentRouteRef);
    }
    const params = fullPath.match(/:(\w+)/g);
    if (params) {
      for (let j = 0; j < params.length; j++) {
        for (let i = j + 1; i < params.length; i++) {
          if (params[i] === params[j]) {
            throw new Error(`Parameter ${params[i]} is duplicated in path ${fullPath}`);
          }
        }
      }
    }
  }
}
function validateRouteBindings(routeBindings, plugins) {
  for (const plugin of plugins) {
    if (!plugin.externalRoutes) {
      continue;
    }
    for (const [name, externalRouteRef] of Object.entries(plugin.externalRoutes)) {
      if (externalRouteRef.optional) {
        continue;
      }
      if (!routeBindings.has(externalRouteRef)) {
        throw new Error(`External route '${name}' of the '${plugin.getId()}' plugin must be bound to a target route. See https://backstage.io/link?bind-routes for details.`);
      }
    }
  }
}

const AppContext = createVersionedContext("app-context");
const AppContextProvider = ({
  appContext,
  children
}) => {
  const versionedValue = createVersionedValueMap({ 1: appContext });
  return /* @__PURE__ */ React.createElement(AppContext.Provider, {
    value: versionedValue,
    children
  });
};

function mkError(thing) {
  return new Error(`Tried to access IdentityApi ${thing} before app was loaded`);
}
function logDeprecation(thing) {
  console.warn(`WARNING: Call to ${thing} is deprecated and will break in the future`);
}
class AppIdentityProxy {
  constructor() {
    this.resolveTarget = () => {
    };
    this.waitForTarget = new Promise((resolve) => {
      this.resolveTarget = resolve;
    });
  }
  setTarget(identityApi) {
    this.target = identityApi;
    this.resolveTarget(identityApi);
  }
  getUserId() {
    if (!this.target) {
      throw mkError("getUserId");
    }
    if (!this.target.getUserId) {
      throw new Error("IdentityApi does not implement getUserId");
    }
    logDeprecation("getUserId");
    return this.target.getUserId();
  }
  getProfile() {
    if (!this.target) {
      throw mkError("getProfile");
    }
    if (!this.target.getProfile) {
      throw new Error("IdentityApi does not implement getProfile");
    }
    logDeprecation("getProfile");
    return this.target.getProfile();
  }
  async getProfileInfo() {
    return this.waitForTarget.then((target) => target.getProfileInfo());
  }
  async getBackstageIdentity() {
    const identity = await this.waitForTarget.then((target) => target.getBackstageIdentity());
    if (!identity.userEntityRef.match(/^.*:.*\/.*$/)) {
      console.warn(`WARNING: The App IdentityApi provided an invalid userEntityRef, '${identity.userEntityRef}'. It must be a full Entity Reference of the form '<kind>:<namespace>/<name>'.`);
    }
    return identity;
  }
  async getCredentials() {
    return this.waitForTarget.then((target) => target.getCredentials());
  }
  async getIdToken() {
    return this.waitForTarget.then((target) => {
      if (!target.getIdToken) {
        throw new Error("IdentityApi does not implement getIdToken");
      }
      logDeprecation("getIdToken");
      return target.getIdToken();
    });
  }
  async signOut() {
    await this.waitForTarget.then((target) => target.signOut());
    location.reload();
  }
}

function resolveTheme(themeId, shouldPreferDark, themes) {
  if (themeId !== void 0) {
    const selectedTheme = themes.find((theme) => theme.id === themeId);
    if (selectedTheme) {
      return selectedTheme;
    }
  }
  if (shouldPreferDark) {
    const darkTheme = themes.find((theme) => theme.variant === "dark");
    if (darkTheme) {
      return darkTheme;
    }
  }
  const lightTheme = themes.find((theme) => theme.variant === "light");
  if (lightTheme) {
    return lightTheme;
  }
  return themes[0];
}
const useShouldPreferDarkTheme = () => {
  const mediaQuery = useMemo(() => window.matchMedia("(prefers-color-scheme: dark)"), []);
  const [shouldPreferDark, setPrefersDark] = useState(mediaQuery.matches);
  useEffect(() => {
    const listener = (event) => {
      setPrefersDark(event.matches);
    };
    mediaQuery.addListener(listener);
    return () => {
      mediaQuery.removeListener(listener);
    };
  }, [mediaQuery]);
  return shouldPreferDark;
};
function AppThemeProvider({ children }) {
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(appThemeApi.activeThemeId$(), appThemeApi.getActiveThemeId());
  const shouldPreferDark = Boolean(window.matchMedia) ? useShouldPreferDarkTheme() : false;
  const appTheme = resolveTheme(themeId, shouldPreferDark, appThemeApi.getInstalledThemes());
  if (!appTheme) {
    throw new Error("App has no themes");
  }
  return /* @__PURE__ */ React.createElement(appTheme.Provider, {
    children
  });
}

const defaultConfigLoader = async (runtimeConfigJson = "__APP_INJECTED_RUNTIME_CONFIG__") => {
  const appConfig = process.env.APP_CONFIG;
  if (!appConfig) {
    throw new Error("No static configuration provided");
  }
  if (!Array.isArray(appConfig)) {
    throw new Error("Static configuration has invalid format");
  }
  const configs = appConfig.slice();
  if (runtimeConfigJson !== "__app_injected_runtime_config__".toLocaleUpperCase("en-US")) {
    try {
      const data = JSON.parse(runtimeConfigJson);
      if (Array.isArray(data)) {
        configs.push(...data);
      } else {
        configs.push({ data, context: "env" });
      }
    } catch (error) {
      throw new Error(`Failed to load runtime configuration, ${error}`);
    }
  }
  const windowAppConfig = window.__APP_CONFIG__;
  if (windowAppConfig) {
    configs.push({
      context: "window",
      data: windowAppConfig
    });
  }
  return configs;
};

class ApiRegistryBuilder {
  constructor() {
    this.apis = [];
  }
  add(api, impl) {
    this.apis.push([api.id, impl]);
    return impl;
  }
  build() {
    return new ApiRegistry(new Map(this.apis));
  }
}
class ApiRegistry {
  constructor(apis) {
    this.apis = apis;
  }
  static builder() {
    return new ApiRegistryBuilder();
  }
  static from(apis) {
    return new ApiRegistry(new Map(apis.map(([api, impl]) => [api.id, impl])));
  }
  static with(api, impl) {
    return new ApiRegistry(/* @__PURE__ */ new Map([[api.id, impl]]));
  }
  with(api, impl) {
    return new ApiRegistry(new Map([...this.apis, [api.id, impl]]));
  }
  get(api) {
    return this.apis.get(api.id);
  }
}

function resolveRouteBindings(bindRoutes) {
  const result = /* @__PURE__ */ new Map();
  if (bindRoutes) {
    const bind = (externalRoutes, targetRoutes) => {
      for (const [key, value] of Object.entries(targetRoutes)) {
        const externalRoute = externalRoutes[key];
        if (!externalRoute) {
          throw new Error(`Key ${key} is not an existing external route`);
        }
        if (!value && !externalRoute.optional) {
          throw new Error(`External route ${key} is required but was undefined`);
        }
        if (value) {
          result.set(externalRoute, value);
        }
      }
    };
    bindRoutes({ bind });
  }
  return result;
}

const InternalAppContext = createContext({ routeObjects: [] });
function getBasePath(configApi) {
  var _a;
  let { pathname } = new URL((_a = configApi.getOptionalString("app.baseUrl")) != null ? _a : "/", "http://dummy.dev");
  pathname = pathname.replace(/\/*$/, "");
  return pathname;
}
function useConfigLoader(configLoader, components, appThemeApi) {
  var _a;
  const hasConfig = Boolean(configLoader);
  const config = useAsync(configLoader || (() => Promise.resolve([])));
  let noConfigNode = void 0;
  if (hasConfig && config.loading) {
    const { Progress } = components;
    noConfigNode = /* @__PURE__ */ React.createElement(Progress, null);
  } else if (config.error) {
    const { BootErrorPage } = components;
    noConfigNode = /* @__PURE__ */ React.createElement(BootErrorPage, {
      step: "load-config",
      error: config.error
    });
  }
  const { ThemeProvider = AppThemeProvider } = components;
  if (noConfigNode) {
    return {
      node: /* @__PURE__ */ React.createElement(ApiProvider, {
        apis: ApiRegistry.with(appThemeApiRef, appThemeApi)
      }, /* @__PURE__ */ React.createElement(ThemeProvider, null, noConfigNode))
    };
  }
  const configReader = ConfigReader.fromConfigs((_a = config.value) != null ? _a : []);
  return { api: configReader };
}
class AppContextImpl {
  constructor(app) {
    this.app = app;
  }
  getPlugins() {
    return this.app.getPlugins();
  }
  getSystemIcon(key) {
    return this.app.getSystemIcon(key);
  }
  getComponents() {
    return this.app.getComponents();
  }
}
class AppManager {
  constructor(options) {
    this.appIdentityProxy = new AppIdentityProxy();
    var _a, _b, _c, _d;
    this.apis = (_a = options.apis) != null ? _a : [];
    this.icons = options.icons;
    this.plugins = new Set((_b = options.plugins) != null ? _b : []);
    this.components = options.components;
    this.themes = options.themes;
    this.configLoader = (_c = options.configLoader) != null ? _c : defaultConfigLoader;
    this.defaultApis = (_d = options.defaultApis) != null ? _d : [];
    this.bindRoutes = options.bindRoutes;
    this.apiFactoryRegistry = new ApiFactoryRegistry();
  }
  getPlugins() {
    return Array.from(this.plugins);
  }
  getSystemIcon(key) {
    return this.icons[key];
  }
  getComponents() {
    return this.components;
  }
  getProvider() {
    const appContext = new AppContextImpl(this);
    let routesHaveBeenValidated = false;
    const Provider = ({ children }) => {
      const appThemeApi = useMemo(() => AppThemeSelector.createWithStorage(this.themes), []);
      const { routing, featureFlags, routeBindings } = useMemo(() => {
        const result = traverseElementTree({
          root: children,
          discoverers: [childDiscoverer, routeElementDiscoverer],
          collectors: {
            routing: routingV1Collector,
            collectedPlugins: pluginCollector,
            featureFlags: featureFlagCollector
          }
        });
        result.collectedPlugins.forEach((plugin) => this.plugins.add(plugin));
        this.verifyPlugins(this.plugins);
        this.getApiHolder();
        return {
          ...result,
          routeBindings: resolveRouteBindings(this.bindRoutes)
        };
      }, [children]);
      if (!routesHaveBeenValidated) {
        routesHaveBeenValidated = true;
        validateRouteParameters(routing.paths, routing.parents);
        validateRouteBindings(routeBindings, this.plugins);
      }
      const loadedConfig = useConfigLoader(this.configLoader, this.components, appThemeApi);
      const hasConfigApi = "api" in loadedConfig;
      if (hasConfigApi) {
        const { api } = loadedConfig;
        this.configApi = api;
      }
      useEffect(() => {
        if (hasConfigApi) {
          const featureFlagsApi = this.getApiHolder().get(featureFlagsApiRef);
          for (const plugin of this.plugins.values()) {
            if ("getFeatureFlags" in plugin) {
              for (const flag of plugin.getFeatureFlags()) {
                featureFlagsApi.registerFlag({
                  name: flag.name,
                  pluginId: plugin.getId()
                });
              }
            } else {
              for (const output of plugin.output()) {
                if (output.type === "feature-flag") {
                  featureFlagsApi.registerFlag({
                    name: output.name,
                    pluginId: plugin.getId()
                  });
                }
              }
            }
          }
          for (const name of featureFlags) {
            featureFlagsApi.registerFlag({ name, pluginId: "" });
          }
        }
      }, [hasConfigApi, loadedConfig, featureFlags]);
      if ("node" in loadedConfig) {
        return loadedConfig.node;
      }
      const { ThemeProvider = AppThemeProvider } = this.components;
      return /* @__PURE__ */ React.createElement(ApiProvider, {
        apis: this.getApiHolder()
      }, /* @__PURE__ */ React.createElement(AppContextProvider, {
        appContext
      }, /* @__PURE__ */ React.createElement(ThemeProvider, null, /* @__PURE__ */ React.createElement(RoutingProvider, {
        routePaths: routing.paths,
        routeParents: routing.parents,
        routeObjects: routing.objects,
        routeBindings,
        basePath: getBasePath(loadedConfig.api)
      }, /* @__PURE__ */ React.createElement(InternalAppContext.Provider, {
        value: { routeObjects: routing.objects }
      }, children)))));
    };
    return Provider;
  }
  getRouter() {
    const { Router: RouterComponent, SignInPage: SignInPageComponent } = this.components;
    const SignInPageWrapper = ({
      component: Component,
      children
    }) => {
      const [identityApi, setIdentityApi] = useState();
      if (!identityApi) {
        return /* @__PURE__ */ React.createElement(Component, {
          onSignInSuccess: setIdentityApi
        });
      }
      this.appIdentityProxy.setTarget(identityApi);
      return children;
    };
    const AppRouter = ({ children }) => {
      const configApi = useApi(configApiRef);
      const mountPath = `${getBasePath(configApi)}/*`;
      const { routeObjects } = useContext(InternalAppContext);
      if (!SignInPageComponent) {
        this.appIdentityProxy.setTarget({
          getUserId: () => "guest",
          getIdToken: async () => void 0,
          getProfile: () => ({
            email: "guest@example.com",
            displayName: "Guest"
          }),
          getProfileInfo: async () => ({
            email: "guest@example.com",
            displayName: "Guest"
          }),
          getBackstageIdentity: async () => ({
            type: "user",
            userEntityRef: "user:default/guest",
            ownershipEntityRefs: ["user:default/guest"]
          }),
          getCredentials: async () => ({}),
          signOut: async () => {
          }
        });
        return /* @__PURE__ */ React.createElement(RouterComponent, null, /* @__PURE__ */ React.createElement(RouteTracker, {
          routeObjects
        }), /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
          path: mountPath,
          element: /* @__PURE__ */ React.createElement(React.Fragment, null, children)
        })));
      }
      return /* @__PURE__ */ React.createElement(RouterComponent, null, /* @__PURE__ */ React.createElement(RouteTracker, {
        routeObjects
      }), /* @__PURE__ */ React.createElement(SignInPageWrapper, {
        component: SignInPageComponent
      }, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
        path: mountPath,
        element: /* @__PURE__ */ React.createElement(React.Fragment, null, children)
      }))));
    };
    return AppRouter;
  }
  getApiHolder() {
    if (this.apiHolder) {
      for (const plugin of this.plugins) {
        for (const factory of plugin.getApis()) {
          if (!this.apiFactoryRegistry.get(factory.api)) {
            this.apiFactoryRegistry.register("default", factory);
          }
        }
      }
      ApiResolver.validateFactories(this.apiFactoryRegistry, this.apiFactoryRegistry.getAllApis());
      return this.apiHolder;
    }
    this.apiFactoryRegistry.register("static", {
      api: appThemeApiRef,
      deps: {},
      factory: () => AppThemeSelector.createWithStorage(this.themes)
    });
    this.apiFactoryRegistry.register("static", {
      api: configApiRef,
      deps: {},
      factory: () => {
        if (!this.configApi) {
          throw new Error("Tried to access config API before config was loaded");
        }
        return this.configApi;
      }
    });
    this.apiFactoryRegistry.register("static", {
      api: identityApiRef,
      deps: {},
      factory: () => this.appIdentityProxy
    });
    this.apiFactoryRegistry.register("default", {
      api: featureFlagsApiRef,
      deps: {},
      factory: () => new LocalStorageFeatureFlags()
    });
    for (const factory of this.defaultApis) {
      this.apiFactoryRegistry.register("default", factory);
    }
    for (const plugin of this.plugins) {
      for (const factory of plugin.getApis()) {
        if (!this.apiFactoryRegistry.register("default", factory)) {
          throw new Error(`Plugin ${plugin.getId()} tried to register duplicate or forbidden API factory for ${factory.api}`);
        }
      }
    }
    for (const factory of this.apis) {
      if (!this.apiFactoryRegistry.register("app", factory)) {
        throw new Error(`Duplicate or forbidden API factory for ${factory.api} in app`);
      }
    }
    ApiResolver.validateFactories(this.apiFactoryRegistry, this.apiFactoryRegistry.getAllApis());
    this.apiHolder = new ApiResolver(this.apiFactoryRegistry);
    return this.apiHolder;
  }
  verifyPlugins(plugins) {
    const pluginIds = /* @__PURE__ */ new Set();
    for (const plugin of plugins) {
      const id = plugin.getId();
      if (pluginIds.has(id)) {
        throw new Error(`Duplicate plugin found '${id}'`);
      }
      pluginIds.add(id);
    }
  }
}

function createSpecializedApp(options) {
  return new AppManager(options);
}

const FlatRoutes = (props) => {
  const app = useApp();
  const { NotFoundErrorPage } = app.getComponents();
  const routes = useElementFilter(props.children, (elements) => elements.getElements().flatMap((child) => {
    var _a;
    let path = child.props.path;
    if (path === "") {
      return [];
    }
    path = (_a = path == null ? void 0 : path.replace(/\/\*$/, "")) != null ? _a : "/";
    return [
      {
        path,
        element: child,
        children: child.props.children ? [
          {
            path: path === "/" ? "/" : "/*",
            element: child.props.children
          }
        ] : void 0
      }
    ];
  }).sort((a, b) => b.path.localeCompare(a.path)).map((obj) => {
    obj.path = obj.path === "/" ? "/" : `${obj.path}/*`;
    return obj;
  }));
  routes.push({
    element: /* @__PURE__ */ React.createElement(NotFoundErrorPage, null),
    path: "/*"
  });
  return useRoutes(routes);
};

export { AlertApiForwarder, ApiFactoryRegistry, ApiProvider, ApiResolver, AppThemeSelector, AtlassianAuth, BitbucketAuth, ErrorAlerter, ErrorApiForwarder, FeatureFlagged, FetchMiddlewares, FlatRoutes, GithubAuth, GitlabAuth, GoogleAuth, LocalStorageFeatureFlags, MicrosoftAuth, NoOpAnalyticsApi, OAuth2, OAuthRequestManager, OktaAuth, OneLoginAuth, SamlAuth, UnhandledErrorForwarder, UrlPatternDiscovery, WebStorage, createFetchApi, createSpecializedApp, defaultConfigLoader };
//# sourceMappingURL=index.esm.js.map
