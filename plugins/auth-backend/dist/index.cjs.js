'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var express = require('express');
var Router = require('express-promise-router');
var cookieParser = require('cookie-parser');
var OAuth2Strategy = require('passport-oauth2');
var errors = require('@backstage/errors');
var pickBy = require('lodash/pickBy');
var crypto = require('crypto');
var url = require('url');
var jwtDecoder = require('jwt-decode');
var fetch = require('node-fetch');
var NodeCache = require('node-cache');
var jose = require('jose');
var passportBitbucketOauth2 = require('passport-bitbucket-oauth2');
var passportGithub2 = require('passport-github2');
var passportGitlab2 = require('passport-gitlab2');
var passportGoogleOauth20 = require('passport-google-oauth20');
var passportMicrosoft = require('passport-microsoft');
var pluginAuthNode = require('@backstage/plugin-auth-node');
var openidClient = require('openid-client');
var passportOktaOauth = require('passport-okta-oauth');
var passportOneloginOauth = require('passport-onelogin-oauth');
var passportSaml = require('passport-saml');
var googleAuthLibrary = require('google-auth-library');
var catalogClient = require('@backstage/catalog-client');
var catalogModel = require('@backstage/catalog-model');
var luxon = require('luxon');
var uuid = require('uuid');
var backendCommon = require('@backstage/backend-common');
var firestore = require('@google-cloud/firestore');
var lodash = require('lodash');
var session = require('express-session');
var passport = require('passport');
var minimatch = require('minimatch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var cookieParser__default = /*#__PURE__*/_interopDefaultLegacy(cookieParser);
var OAuth2Strategy__default = /*#__PURE__*/_interopDefaultLegacy(OAuth2Strategy);
var pickBy__default = /*#__PURE__*/_interopDefaultLegacy(pickBy);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var crypto__namespace = /*#__PURE__*/_interopNamespace(crypto);
var jwtDecoder__default = /*#__PURE__*/_interopDefaultLegacy(jwtDecoder);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var NodeCache__default = /*#__PURE__*/_interopDefaultLegacy(NodeCache);
var session__default = /*#__PURE__*/_interopDefaultLegacy(session);
var passport__default = /*#__PURE__*/_interopDefaultLegacy(passport);

const defaultScopes = ["offline_access", "read:me"];
class AtlassianStrategy extends OAuth2Strategy__default["default"] {
  constructor(options, verify) {
    if (!options.scope) {
      throw new TypeError("Atlassian requires a scope option");
    }
    const scopes = options.scope.split(" ");
    const optionsWithURLs = {
      ...options,
      authorizationURL: `https://auth.atlassian.com/authorize`,
      tokenURL: `https://auth.atlassian.com/oauth/token`,
      scope: Array.from(/* @__PURE__ */ new Set([...defaultScopes, ...scopes]))
    };
    super(optionsWithURLs, verify);
    this.profileURL = "https://api.atlassian.com/me";
    this.name = "atlassian";
    this._oauth2.useAuthorizationHeaderforGET(true);
  }
  authorizationParams() {
    return {
      audience: "api.atlassian.com",
      prompt: "consent"
    };
  }
  userProfile(accessToken, done) {
    this._oauth2.get(this.profileURL, accessToken, (err, body) => {
      if (err) {
        return done(new OAuth2Strategy.InternalOAuthError("Failed to fetch user profile", err.statusCode));
      }
      if (!body) {
        return done(new Error("Failed to fetch user profile, body cannot be empty"));
      }
      try {
        const json = typeof body !== "string" ? body.toString() : body;
        const profile = AtlassianStrategy.parse(json);
        return done(null, profile);
      } catch (e) {
        return done(new Error("Failed to parse user profile"));
      }
    });
  }
  static parse(json) {
    const resp = JSON.parse(json);
    return {
      id: resp.account_id,
      provider: "atlassian",
      username: resp.nickname,
      displayName: resp.name,
      emails: [{ value: resp.email }],
      photos: [{ value: resp.picture }]
    };
  }
}

const readState = (stateString) => {
  var _a, _b;
  const state = Object.fromEntries(new URLSearchParams(Buffer.from(stateString, "hex").toString("utf-8")));
  if (!state.nonce || !state.env || ((_a = state.nonce) == null ? void 0 : _a.length) === 0 || ((_b = state.env) == null ? void 0 : _b.length) === 0) {
    throw Error(`Invalid state passed via request`);
  }
  return state;
};
const encodeState = (state) => {
  const stateString = new URLSearchParams(pickBy__default["default"](state, (value) => value !== void 0)).toString();
  return Buffer.from(stateString, "utf-8").toString("hex");
};
const verifyNonce = (req, providerId) => {
  var _a, _b;
  const cookieNonce = req.cookies[`${providerId}-nonce`];
  const state = readState((_b = (_a = req.query.state) == null ? void 0 : _a.toString()) != null ? _b : "");
  const stateNonce = state.nonce;
  if (!cookieNonce) {
    throw new Error("Auth response is missing cookie nonce");
  }
  if (stateNonce.length === 0) {
    throw new Error("Auth response is missing state nonce");
  }
  if (cookieNonce !== stateNonce) {
    throw new Error("Invalid nonce");
  }
};
const defaultCookieConfigurer = ({
  callbackUrl,
  providerId
}) => {
  const { hostname: domain, pathname, protocol } = new URL(callbackUrl);
  const secure = protocol === "https:";
  const path = pathname.endsWith(`${providerId}/handler/frame`) ? pathname.slice(0, -"/handler/frame".length) : `${pathname}/${providerId}`;
  return { domain, path, secure };
};

class OAuthEnvironmentHandler {
  constructor(handlers) {
    this.handlers = handlers;
  }
  static mapConfig(config, factoryFunc) {
    const envs = config.keys();
    const handlers = /* @__PURE__ */ new Map();
    for (const env of envs) {
      const envConfig = config.getConfig(env);
      const handler = factoryFunc(envConfig);
      handlers.set(env, handler);
    }
    return new OAuthEnvironmentHandler(handlers);
  }
  async start(req, res) {
    const provider = this.getProviderForEnv(req);
    await provider.start(req, res);
  }
  async frameHandler(req, res) {
    const provider = this.getProviderForEnv(req);
    await provider.frameHandler(req, res);
  }
  async refresh(req, res) {
    var _a;
    const provider = this.getProviderForEnv(req);
    await ((_a = provider.refresh) == null ? void 0 : _a.call(provider, req, res));
  }
  async logout(req, res) {
    var _a;
    const provider = this.getProviderForEnv(req);
    await ((_a = provider.logout) == null ? void 0 : _a.call(provider, req, res));
  }
  getRequestFromEnv(req) {
    var _a, _b;
    const reqEnv = (_a = req.query.env) == null ? void 0 : _a.toString();
    if (reqEnv) {
      return reqEnv;
    }
    const stateParams = (_b = req.query.state) == null ? void 0 : _b.toString();
    if (!stateParams) {
      return void 0;
    }
    const env = readState(stateParams).env;
    return env;
  }
  getProviderForEnv(req) {
    const env = this.getRequestFromEnv(req);
    if (!env) {
      throw new errors.InputError(`Must specify 'env' query to select environment`);
    }
    const handler = this.handlers.get(env);
    if (!handler) {
      throw new errors.NotFoundError(`No configuration available for the '${env}' environment of this provider.`);
    }
    return handler;
  }
}

const safelyEncodeURIComponent = (value) => {
  return encodeURIComponent(value).replace(/'/g, "%27");
};
const postMessageResponse = (res, appOrigin, response) => {
  const jsonData = JSON.stringify(response);
  const base64Data = safelyEncodeURIComponent(jsonData);
  const base64Origin = safelyEncodeURIComponent(appOrigin);
  const script = `
    var authResponse = decodeURIComponent('${base64Data}');
    var origin = decodeURIComponent('${base64Origin}');
    var originInfo = {'type': 'config_info', 'targetOrigin': origin};
    (window.opener || window.parent).postMessage(originInfo, '*');
    (window.opener || window.parent).postMessage(JSON.parse(authResponse), origin);
    setTimeout(() => {
      window.close();
    }, 100); // same as the interval of the core-app-api lib/loginPopup.ts (to address race conditions)
  `;
  const hash = crypto__default["default"].createHash("sha256").update(script).digest("base64");
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Frame-Options", "sameorigin");
  res.setHeader("Content-Security-Policy", `script-src 'sha256-${hash}'`);
  res.end(`<html><body><script>${script}<\/script></body></html>`);
};
const ensuresXRequestedWith = (req) => {
  const requiredHeader = req.header("X-Requested-With");
  if (!requiredHeader || requiredHeader !== "XMLHttpRequest") {
    return false;
  }
  return true;
};

function parseJwtPayload(token) {
  const [_header, payload, _signature] = token.split(".");
  return JSON.parse(Buffer.from(payload, "base64").toString());
}
function prepareBackstageIdentityResponse(result) {
  const { sub, ent } = parseJwtPayload(result.token);
  return {
    ...result,
    identity: {
      type: "user",
      userEntityRef: sub,
      ownershipEntityRefs: ent != null ? ent : []
    }
  };
}

const THOUSAND_DAYS_MS = 1e3 * 24 * 60 * 60 * 1e3;
const TEN_MINUTES_MS = 600 * 1e3;
class OAuthAdapter {
  constructor(handlers, options) {
    this.handlers = handlers;
    this.options = options;
    this.setNonceCookie = (res, nonce) => {
      res.cookie(`${this.options.providerId}-nonce`, nonce, {
        maxAge: TEN_MINUTES_MS,
        ...this.baseCookieOptions,
        path: `${this.options.cookiePath}/handler`
      });
    };
    this.setGrantedScopeCookie = (res, scope) => {
      res.cookie(`${this.options.providerId}-granted-scope`, scope, {
        maxAge: THOUSAND_DAYS_MS,
        ...this.baseCookieOptions
      });
    };
    this.getGrantedScopeFromCookie = (req) => {
      return req.cookies[`${this.options.providerId}-granted-scope`];
    };
    this.setRefreshTokenCookie = (res, refreshToken) => {
      res.cookie(`${this.options.providerId}-refresh-token`, refreshToken, {
        maxAge: THOUSAND_DAYS_MS,
        ...this.baseCookieOptions
      });
    };
    this.removeRefreshTokenCookie = (res) => {
      res.cookie(`${this.options.providerId}-refresh-token`, "", {
        maxAge: 0,
        ...this.baseCookieOptions
      });
    };
    this.baseCookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      secure: this.options.secure,
      path: this.options.cookiePath,
      domain: this.options.cookieDomain
    };
  }
  static fromConfig(config, handlers, options) {
    var _a;
    const { origin: appOrigin } = new url.URL(config.appUrl);
    const cookieConfigurer = (_a = config.cookieConfigurer) != null ? _a : defaultCookieConfigurer;
    const cookieConfig = cookieConfigurer({
      providerId: options.providerId,
      baseUrl: config.baseUrl,
      callbackUrl: options.callbackUrl
    });
    return new OAuthAdapter(handlers, {
      ...options,
      appOrigin,
      cookieDomain: cookieConfig.domain,
      cookiePath: cookieConfig.path,
      secure: cookieConfig.secure,
      isOriginAllowed: config.isOriginAllowed
    });
  }
  async start(req, res) {
    var _a, _b, _c, _d;
    const scope = (_b = (_a = req.query.scope) == null ? void 0 : _a.toString()) != null ? _b : "";
    const env = (_c = req.query.env) == null ? void 0 : _c.toString();
    const origin = (_d = req.query.origin) == null ? void 0 : _d.toString();
    if (!env) {
      throw new errors.InputError("No env provided in request query parameters");
    }
    const nonce = crypto__default["default"].randomBytes(16).toString("base64");
    this.setNonceCookie(res, nonce);
    const state = { nonce, env, origin };
    if (this.options.persistScopes) {
      state.scope = scope;
    }
    const forwardReq = Object.assign(req, { scope, state });
    const { url, status } = await this.handlers.start(forwardReq);
    res.statusCode = status || 302;
    res.setHeader("Location", url);
    res.setHeader("Content-Length", "0");
    res.end();
  }
  async frameHandler(req, res) {
    var _a, _b;
    let appOrigin = this.options.appOrigin;
    try {
      const state = readState((_b = (_a = req.query.state) == null ? void 0 : _a.toString()) != null ? _b : "");
      if (state.origin) {
        try {
          appOrigin = new url.URL(state.origin).origin;
        } catch {
          throw new errors.NotAllowedError("App origin is invalid, failed to parse");
        }
        if (!this.options.isOriginAllowed(appOrigin)) {
          throw new errors.NotAllowedError(`Origin '${appOrigin}' is not allowed`);
        }
      }
      verifyNonce(req, this.options.providerId);
      const { response, refreshToken } = await this.handlers.handler(req);
      if (this.options.persistScopes && state.scope) {
        this.setGrantedScopeCookie(res, state.scope);
        response.providerInfo.scope = state.scope;
      }
      if (refreshToken) {
        this.setRefreshTokenCookie(res, refreshToken);
      }
      const identity = await this.populateIdentity(response.backstageIdentity);
      return postMessageResponse(res, appOrigin, {
        type: "authorization_response",
        response: { ...response, backstageIdentity: identity }
      });
    } catch (error) {
      const { name, message } = errors.isError(error) ? error : new Error("Encountered invalid error");
      return postMessageResponse(res, appOrigin, {
        type: "authorization_response",
        error: { name, message }
      });
    }
  }
  async logout(req, res) {
    if (!ensuresXRequestedWith(req)) {
      throw new errors.AuthenticationError("Invalid X-Requested-With header");
    }
    this.removeRefreshTokenCookie(res);
    res.status(200).end();
  }
  async refresh(req, res) {
    var _a, _b;
    if (!ensuresXRequestedWith(req)) {
      throw new errors.AuthenticationError("Invalid X-Requested-With header");
    }
    if (!this.handlers.refresh) {
      throw new errors.InputError(`Refresh token is not supported for provider ${this.options.providerId}`);
    }
    try {
      const refreshToken = req.cookies[`${this.options.providerId}-refresh-token`];
      if (!refreshToken) {
        throw new errors.InputError("Missing session cookie");
      }
      let scope = (_b = (_a = req.query.scope) == null ? void 0 : _a.toString()) != null ? _b : "";
      if (this.options.persistScopes) {
        scope = this.getGrantedScopeFromCookie(req);
      }
      const forwardReq = Object.assign(req, { scope, refreshToken });
      const { response, refreshToken: newRefreshToken } = await this.handlers.refresh(forwardReq);
      const backstageIdentity = await this.populateIdentity(response.backstageIdentity);
      if (newRefreshToken && newRefreshToken !== refreshToken) {
        this.setRefreshTokenCookie(res, newRefreshToken);
      }
      res.status(200).json({ ...response, backstageIdentity });
    } catch (error) {
      throw new errors.AuthenticationError("Refresh failed", error);
    }
  }
  async populateIdentity(identity) {
    if (!identity) {
      return void 0;
    }
    if (!identity.token) {
      throw new errors.InputError(`Identity response must return a token`);
    }
    return prepareBackstageIdentityResponse(identity);
  }
}

const makeProfileInfo = (profile, idToken) => {
  var _a, _b;
  let email = void 0;
  if (profile.emails && profile.emails.length > 0) {
    const [firstEmail] = profile.emails;
    email = firstEmail.value;
  }
  let picture = void 0;
  if (profile.avatarUrl) {
    picture = profile.avatarUrl;
  } else if (profile.photos && profile.photos.length > 0) {
    const [firstPhoto] = profile.photos;
    picture = firstPhoto.value;
  }
  let displayName = (_b = (_a = profile.displayName) != null ? _a : profile.username) != null ? _b : profile.id;
  if ((!email || !picture || !displayName) && idToken) {
    try {
      const decoded = jwtDecoder__default["default"](idToken);
      if (!email && decoded.email) {
        email = decoded.email;
      }
      if (!picture && decoded.picture) {
        picture = decoded.picture;
      }
      if (!displayName && decoded.name) {
        displayName = decoded.name;
      }
    } catch (e) {
      throw new Error(`Failed to parse id token and get profile info, ${e}`);
    }
  }
  return {
    email,
    picture,
    displayName
  };
};
const executeRedirectStrategy = async (req, providerStrategy, options) => {
  return new Promise((resolve) => {
    const strategy = Object.create(providerStrategy);
    strategy.redirect = (url, status) => {
      resolve({ url, status: status != null ? status : void 0 });
    };
    strategy.authenticate(req, { ...options });
  });
};
const executeFrameHandlerStrategy = async (req, providerStrategy) => {
  return new Promise((resolve, reject) => {
    const strategy = Object.create(providerStrategy);
    strategy.success = (result, privateInfo) => {
      resolve({ result, privateInfo });
    };
    strategy.fail = (info) => {
      var _a;
      reject(new Error(`Authentication rejected, ${(_a = info.message) != null ? _a : ""}`));
    };
    strategy.error = (error) => {
      var _a;
      let message = `Authentication failed, ${error.message}`;
      if ((_a = error.oauthError) == null ? void 0 : _a.data) {
        try {
          const errorData = JSON.parse(error.oauthError.data);
          if (errorData.message) {
            message += ` - ${errorData.message}`;
          }
        } catch (parseError) {
          message += ` - ${error.oauthError}`;
        }
      }
      reject(new Error(message));
    };
    strategy.redirect = () => {
      reject(new Error("Unexpected redirect"));
    };
    strategy.authenticate(req, {});
  });
};
const executeRefreshTokenStrategy = async (providerStrategy, refreshToken, scope) => {
  return new Promise((resolve, reject) => {
    const anyStrategy = providerStrategy;
    const OAuth2 = anyStrategy._oauth2.constructor;
    const oauth2 = new OAuth2(anyStrategy._oauth2._clientId, anyStrategy._oauth2._clientSecret, anyStrategy._oauth2._baseSite, anyStrategy._oauth2._authorizeUrl, anyStrategy._refreshURL || anyStrategy._oauth2._accessTokenUrl, anyStrategy._oauth2._customHeaders);
    oauth2.getOAuthAccessToken(refreshToken, {
      scope,
      grant_type: "refresh_token"
    }, (err, accessToken, newRefreshToken, params) => {
      if (err) {
        reject(new Error(`Failed to refresh access token ${err.toString()}`));
      }
      if (!accessToken) {
        reject(new Error(`Failed to refresh access token, no access token received`));
      }
      resolve({
        accessToken,
        refreshToken: newRefreshToken,
        params
      });
    });
  });
};
const executeFetchUserProfileStrategy = async (providerStrategy, accessToken) => {
  return new Promise((resolve, reject) => {
    const anyStrategy = providerStrategy;
    anyStrategy.userProfile(accessToken, (error, rawProfile) => {
      if (error) {
        reject(error);
      } else {
        resolve(rawProfile);
      }
    });
  });
};

function createAuthProviderIntegration(config) {
  var _a;
  return Object.freeze({
    ...config,
    resolvers: Object.freeze((_a = config.resolvers) != null ? _a : {})
  });
}

const atlassianDefaultAuthHandler = async ({
  fullProfile,
  params
}) => ({
  profile: makeProfileInfo(fullProfile, params.id_token)
});
class AtlassianAuthProvider {
  constructor(options) {
    this.resolverContext = options.resolverContext;
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this._strategy = new AtlassianStrategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      scope: options.scopes
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, {
        fullProfile,
        accessToken,
        refreshToken,
        params
      });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this._strategy, {
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result } = await executeFrameHandlerStrategy(req, this._strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: result.refreshToken
    };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
  async refresh(req) {
    const { accessToken, params, refreshToken } = await executeRefreshTokenStrategy(this._strategy, req.refreshToken, req.scope);
    const fullProfile = await executeFetchUserProfileStrategy(this._strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
}
const atlassian = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a, _b;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const scopes = envConfig.getString("scopes");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authHandler = (_a = options == null ? void 0 : options.authHandler) != null ? _a : atlassianDefaultAuthHandler;
      const provider = new AtlassianAuthProvider({
        clientId,
        clientSecret,
        scopes,
        callbackUrl,
        authHandler,
        signInResolver: (_b = options == null ? void 0 : options.signIn) == null ? void 0 : _b.resolver,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  }
});
const createAtlassianProvider = atlassian.create;

class Auth0Strategy extends OAuth2Strategy__default["default"] {
  constructor(options, verify) {
    const optionsWithURLs = {
      ...options,
      authorizationURL: `https://${options.domain}/authorize`,
      tokenURL: `https://${options.domain}/oauth/token`,
      userInfoURL: `https://${options.domain}/userinfo`,
      apiUrl: `https://${options.domain}/api`
    };
    super(optionsWithURLs, verify);
  }
}

class Auth0AuthProvider {
  constructor(options) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this._strategy = new Auth0Strategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      domain: options.domain,
      passReqToCallback: false
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, {
        fullProfile,
        accessToken,
        refreshToken,
        params
      }, {
        refreshToken
      });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this._strategy, {
      accessType: "offline",
      prompt: "consent",
      scope: req.scope,
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this._strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    const { accessToken, refreshToken, params } = await executeRefreshTokenStrategy(this._strategy, req.refreshToken, req.scope);
    const fullProfile = await executeFetchUserProfileStrategy(this._strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
}
const auth0 = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const domain = envConfig.getString("domain");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile, params }) => ({
        profile: makeProfileInfo(fullProfile, params.id_token)
      });
      const signInResolver = (_a = options == null ? void 0 : options.signIn) == null ? void 0 : _a.resolver;
      const provider = new Auth0AuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        domain,
        authHandler,
        signInResolver,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  }
});
const createAuth0Provider = auth0.create;

const ALB_JWT_HEADER = "x-amzn-oidc-data";
const ALB_ACCESS_TOKEN_HEADER = "x-amzn-oidc-accesstoken";
class AwsAlbAuthProvider {
  constructor(options) {
    this.getKey = async (header) => {
      if (!header.kid) {
        throw new errors.AuthenticationError("No key id was specified in header");
      }
      const optionalCacheKey = this.keyCache.get(header.kid);
      if (optionalCacheKey) {
        return crypto__namespace.createPublicKey(optionalCacheKey);
      }
      const keyText = await fetch__default["default"](`https://public-keys.auth.elb.${encodeURIComponent(this.region)}.amazonaws.com/${encodeURIComponent(header.kid)}`).then((response) => response.text());
      const keyValue = crypto__namespace.createPublicKey(keyText);
      this.keyCache.set(header.kid, keyValue.export({ format: "pem", type: "spki" }));
      return keyValue;
    };
    this.region = options.region;
    this.issuer = options.issuer;
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this.resolverContext = options.resolverContext;
    this.keyCache = new NodeCache__default["default"]({ stdTTL: 3600 });
  }
  frameHandler() {
    return Promise.resolve(void 0);
  }
  async refresh(req, res) {
    try {
      const result = await this.getResult(req);
      const response = await this.handleResult(result);
      res.json(response);
    } catch (e) {
      throw new errors.AuthenticationError("Exception occurred during AWS ALB token refresh", e);
    }
  }
  start() {
    return Promise.resolve(void 0);
  }
  async getResult(req) {
    const jwt = req.header(ALB_JWT_HEADER);
    const accessToken = req.header(ALB_ACCESS_TOKEN_HEADER);
    if (jwt === void 0) {
      throw new errors.AuthenticationError(`Missing ALB OIDC header: ${ALB_JWT_HEADER}`);
    }
    if (accessToken === void 0) {
      throw new errors.AuthenticationError(`Missing ALB OIDC header: ${ALB_ACCESS_TOKEN_HEADER}`);
    }
    try {
      const verifyResult = await jose.jwtVerify(jwt, this.getKey);
      const claims = verifyResult.payload;
      if (this.issuer && claims.iss !== this.issuer) {
        throw new errors.AuthenticationError("Issuer mismatch on JWT token");
      }
      const fullProfile = {
        provider: "unknown",
        id: claims.sub,
        displayName: claims.name,
        username: claims.email.split("@")[0].toLowerCase(),
        name: {
          familyName: claims.family_name,
          givenName: claims.given_name
        },
        emails: [{ value: claims.email.toLowerCase() }],
        photos: [{ value: claims.picture }]
      };
      return {
        fullProfile,
        expiresInSeconds: claims.exp,
        accessToken
      };
    } catch (e) {
      throw new Error(`Exception occurred during JWT processing: ${e}`);
    }
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const backstageIdentity = await this.signInResolver({
      result,
      profile
    }, this.resolverContext);
    return {
      providerInfo: {
        accessToken: result.accessToken,
        expiresInSeconds: result.expiresInSeconds
      },
      backstageIdentity: prepareBackstageIdentityResponse(backstageIdentity),
      profile
    };
  }
}
const awsAlb = createAuthProviderIntegration({
  create(options) {
    return ({ config, resolverContext }) => {
      const region = config.getString("region");
      const issuer = config.getOptionalString("iss");
      if ((options == null ? void 0 : options.signIn.resolver) === void 0) {
        throw new Error("SignInResolver is required to use this authentication provider");
      }
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile }) => ({
        profile: makeProfileInfo(fullProfile)
      });
      return new AwsAlbAuthProvider({
        region,
        issuer,
        signInResolver: options == null ? void 0 : options.signIn.resolver,
        authHandler,
        resolverContext
      });
    };
  }
});
const createAwsAlbProvider = awsAlb.create;

class BitbucketAuthProvider {
  constructor(options) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this._strategy = new passportBitbucketOauth2.Strategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      passReqToCallback: false
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, {
        fullProfile,
        params,
        accessToken,
        refreshToken
      }, {
        refreshToken
      });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this._strategy, {
      accessType: "offline",
      prompt: "consent",
      scope: req.scope,
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this._strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    const { accessToken, refreshToken, params } = await executeRefreshTokenStrategy(this._strategy, req.refreshToken, req.scope);
    const fullProfile = await executeFetchUserProfileStrategy(this._strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
  async handleResult(result) {
    result.fullProfile.avatarUrl = result.fullProfile._json.links.avatar.href;
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
}
const bitbucket = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile, params }) => ({
        profile: makeProfileInfo(fullProfile, params.id_token)
      });
      const provider = new BitbucketAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        signInResolver: (_a = options == null ? void 0 : options.signIn) == null ? void 0 : _a.resolver,
        authHandler,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  },
  resolvers: {
    usernameMatchingUserEntityAnnotation() {
      return async (info, ctx) => {
        const { result } = info;
        if (!result.fullProfile.username) {
          throw new Error("Bitbucket profile contained no Username");
        }
        return ctx.signInWithCatalogUser({
          annotations: {
            "bitbucket.org/username": result.fullProfile.username
          }
        });
      };
    },
    userIdMatchingUserEntityAnnotation() {
      return async (info, ctx) => {
        const { result } = info;
        if (!result.fullProfile.id) {
          throw new Error("Bitbucket profile contained no User ID");
        }
        return ctx.signInWithCatalogUser({
          annotations: {
            "bitbucket.org/user-id": result.fullProfile.id
          }
        });
      };
    }
  }
});
const createBitbucketProvider = bitbucket.create;
const bitbucketUsernameSignInResolver = bitbucket.resolvers.usernameMatchingUserEntityAnnotation();
const bitbucketUserIdSignInResolver = bitbucket.resolvers.userIdMatchingUserEntityAnnotation();

const ACCESS_TOKEN_PREFIX = "access-token.";
const BACKSTAGE_SESSION_EXPIRATION = 3600;
class GithubAuthProvider {
  constructor(options) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.stateEncoder = options.stateEncoder;
    this.resolverContext = options.resolverContext;
    this._strategy = new passportGithub2.Strategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      tokenURL: options.tokenUrl,
      userProfileURL: options.userProfileUrl,
      authorizationURL: options.authorizationUrl
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, { fullProfile, params, accessToken }, { refreshToken });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this._strategy, {
      scope: req.scope,
      state: (await this.stateEncoder(req)).encodedState
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this._strategy);
    let refreshToken = privateInfo.refreshToken;
    if (!refreshToken && !result.params.expires_in) {
      refreshToken = ACCESS_TOKEN_PREFIX + result.accessToken;
    }
    return {
      response: await this.handleResult(result),
      refreshToken
    };
  }
  async refresh(req) {
    const { scope, refreshToken } = req;
    if (refreshToken == null ? void 0 : refreshToken.startsWith(ACCESS_TOKEN_PREFIX)) {
      const accessToken = refreshToken.slice(ACCESS_TOKEN_PREFIX.length);
      const fullProfile = await executeFetchUserProfileStrategy(this._strategy, accessToken).catch((error) => {
        var _a;
        if (((_a = error.oauthError) == null ? void 0 : _a.statusCode) === 401) {
          throw new Error("Invalid access token");
        }
        throw error;
      });
      return {
        response: await this.handleResult({
          fullProfile,
          params: { scope },
          accessToken
        }),
        refreshToken
      };
    }
    const result = await executeRefreshTokenStrategy(this._strategy, refreshToken, scope);
    return {
      response: await this.handleResult({
        fullProfile: await executeFetchUserProfileStrategy(this._strategy, result.accessToken),
        params: { ...result.params, scope },
        accessToken: result.accessToken
      }),
      refreshToken: result.refreshToken
    };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const expiresInStr = result.params.expires_in;
    let expiresInSeconds = expiresInStr === void 0 ? void 0 : Number(expiresInStr);
    let backstageIdentity = void 0;
    if (this.signInResolver) {
      backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
      if (expiresInSeconds) {
        expiresInSeconds = Math.min(expiresInSeconds, BACKSTAGE_SESSION_EXPIRATION);
      } else {
        expiresInSeconds = BACKSTAGE_SESSION_EXPIRATION;
      }
    }
    return {
      backstageIdentity,
      providerInfo: {
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds
      },
      profile
    };
  }
}
const github = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a, _b, _c;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const enterpriseInstanceUrl = (_a = envConfig.getOptionalString("enterpriseInstanceUrl")) == null ? void 0 : _a.replace(/\/$/, "");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const authorizationUrl = enterpriseInstanceUrl ? `${enterpriseInstanceUrl}/login/oauth/authorize` : void 0;
      const tokenUrl = enterpriseInstanceUrl ? `${enterpriseInstanceUrl}/login/oauth/access_token` : void 0;
      const userProfileUrl = enterpriseInstanceUrl ? `${enterpriseInstanceUrl}/api/v3/user` : void 0;
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile }) => ({
        profile: makeProfileInfo(fullProfile)
      });
      const stateEncoder = (_b = options == null ? void 0 : options.stateEncoder) != null ? _b : async (req) => {
        return { encodedState: encodeState(req.state) };
      };
      const provider = new GithubAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        tokenUrl,
        userProfileUrl,
        authorizationUrl,
        signInResolver: (_c = options == null ? void 0 : options.signIn) == null ? void 0 : _c.resolver,
        authHandler,
        stateEncoder,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        persistScopes: true,
        providerId,
        callbackUrl
      });
    });
  },
  resolvers: {
    usernameMatchingUserEntityName: () => {
      return async (info, ctx) => {
        const { fullProfile } = info.result;
        const userId = fullProfile.username;
        if (!userId) {
          throw new Error(`GitHub user profile does not contain a username`);
        }
        return ctx.signInWithCatalogUser({ entityRef: { name: userId } });
      };
    }
  }
});
const createGithubProvider = github.create;

const gitlabDefaultAuthHandler = async ({
  fullProfile,
  params
}) => ({
  profile: makeProfileInfo(fullProfile, params.id_token)
});
class GitlabAuthProvider {
  constructor(options) {
    this.resolverContext = options.resolverContext;
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this._strategy = new passportGitlab2.Strategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      baseURL: options.baseUrl
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, { fullProfile, params, accessToken }, {
        refreshToken
      });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this._strategy, {
      scope: req.scope,
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this._strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    const { accessToken, refreshToken, params } = await executeRefreshTokenStrategy(this._strategy, req.refreshToken, req.scope);
    const fullProfile = await executeFetchUserProfileStrategy(this._strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
}
const gitlab = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a, _b;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const audience = envConfig.getOptionalString("audience");
      const baseUrl = audience || "https://gitlab.com";
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authHandler = (_a = options == null ? void 0 : options.authHandler) != null ? _a : gitlabDefaultAuthHandler;
      const provider = new GitlabAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        baseUrl,
        authHandler,
        signInResolver: (_b = options == null ? void 0 : options.signIn) == null ? void 0 : _b.resolver,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  }
});
const createGitlabProvider = gitlab.create;

const commonByEmailLocalPartResolver = async (info, ctx) => {
  const { profile } = info;
  if (!profile.email) {
    throw new Error("Login failed, user profile does not contain an email");
  }
  const [localPart] = profile.email.split("@");
  return ctx.signInWithCatalogUser({
    entityRef: { name: localPart }
  });
};
const commonByEmailResolver = async (info, ctx) => {
  const { profile } = info;
  if (!profile.email) {
    throw new Error("Login failed, user profile does not contain an email");
  }
  return ctx.signInWithCatalogUser({
    filter: {
      "spec.profile.email": profile.email
    }
  });
};

class GoogleAuthProvider {
  constructor(options) {
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this.resolverContext = options.resolverContext;
    this.strategy = new passportGoogleOauth20.Strategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      passReqToCallback: false
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, {
        fullProfile,
        params,
        accessToken,
        refreshToken
      }, {
        refreshToken
      });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this.strategy, {
      accessType: "offline",
      prompt: "consent",
      scope: req.scope,
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this.strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    const { accessToken, refreshToken, params } = await executeRefreshTokenStrategy(this.strategy, req.refreshToken, req.scope);
    const fullProfile = await executeFetchUserProfileStrategy(this.strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
}
const google = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile, params }) => ({
        profile: makeProfileInfo(fullProfile, params.id_token)
      });
      const provider = new GoogleAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        signInResolver: (_a = options == null ? void 0 : options.signIn) == null ? void 0 : _a.resolver,
        authHandler,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  },
  resolvers: {
    emailLocalPartMatchingUserEntityName: () => commonByEmailLocalPartResolver,
    emailMatchingUserEntityProfileEmail: () => commonByEmailResolver,
    emailMatchingUserEntityAnnotation() {
      return async (info, ctx) => {
        const { profile } = info;
        if (!profile.email) {
          throw new Error("Google profile contained no email");
        }
        return ctx.signInWithCatalogUser({
          annotations: {
            "google.com/email": profile.email
          }
        });
      };
    }
  }
});
const createGoogleProvider = google.create;
const googleEmailSignInResolver = google.resolvers.emailMatchingUserEntityAnnotation();

class MicrosoftAuthProvider {
  constructor(options) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.logger = options.logger;
    this.resolverContext = options.resolverContext;
    this._strategy = new passportMicrosoft.Strategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      authorizationURL: options.authorizationUrl,
      tokenURL: options.tokenUrl,
      passReqToCallback: false
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, { fullProfile, accessToken, params }, { refreshToken });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this._strategy, {
      scope: req.scope,
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this._strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    const { accessToken, refreshToken, params } = await executeRefreshTokenStrategy(this._strategy, req.refreshToken, req.scope);
    const fullProfile = await executeFetchUserProfileStrategy(this._strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
  async handleResult(result) {
    const photo = await this.getUserPhoto(result.accessToken);
    result.fullProfile.photos = photo ? [{ value: photo }] : void 0;
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
  async getUserPhoto(accessToken) {
    try {
      const res = await fetch__default["default"]("https://graph.microsoft.com/v1.0/me/photos/48x48/$value", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await res.buffer();
      return `data:image/jpeg;base64,${data.toString("base64")}`;
    } catch (error) {
      this.logger.warn(`Could not retrieve user profile photo from Microsoft Graph API: ${error}`);
      return void 0;
    }
  }
}
const microsoft = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, logger, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const tenantId = envConfig.getString("tenantId");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authorizationUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
      const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile, params }) => ({
        profile: makeProfileInfo(fullProfile, params.id_token)
      });
      const provider = new MicrosoftAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        authorizationUrl,
        tokenUrl,
        authHandler,
        signInResolver: (_a = options == null ? void 0 : options.signIn) == null ? void 0 : _a.resolver,
        logger,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  },
  resolvers: {
    emailLocalPartMatchingUserEntityName: () => commonByEmailLocalPartResolver,
    emailMatchingUserEntityProfileEmail: () => commonByEmailResolver,
    emailMatchingUserEntityAnnotation() {
      return async (info, ctx) => {
        const { profile } = info;
        if (!profile.email) {
          throw new Error("Microsoft profile contained no email");
        }
        return ctx.signInWithCatalogUser({
          annotations: {
            "microsoft.com/email": profile.email
          }
        });
      };
    }
  }
});
const createMicrosoftProvider = microsoft.create;
const microsoftEmailSignInResolver = microsoft.resolvers.emailMatchingUserEntityAnnotation();

class OAuth2AuthProvider {
  constructor(options) {
    var _a;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this.disableRefresh = (_a = options.disableRefresh) != null ? _a : false;
    this._strategy = new OAuth2Strategy.Strategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      authorizationURL: options.authorizationUrl,
      tokenURL: options.tokenUrl,
      passReqToCallback: false,
      scope: options.scope,
      customHeaders: options.includeBasicAuth ? {
        Authorization: `Basic ${this.encodeClientCredentials(options.clientId, options.clientSecret)}`
      } : void 0
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, {
        fullProfile,
        accessToken,
        refreshToken,
        params
      }, {
        refreshToken
      });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this._strategy, {
      accessType: "offline",
      prompt: "consent",
      scope: req.scope,
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this._strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    if (this.disableRefresh) {
      throw new errors.InputError("Session refreshes have been disabled");
    }
    const refreshTokenResponse = await executeRefreshTokenStrategy(this._strategy, req.refreshToken, req.scope);
    const { accessToken, params, refreshToken } = refreshTokenResponse;
    const fullProfile = await executeFetchUserProfileStrategy(this._strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
  encodeClientCredentials(clientID, clientSecret) {
    return Buffer.from(`${clientID}:${clientSecret}`).toString("base64");
  }
}
const oauth2 = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a, _b;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authorizationUrl = envConfig.getString("authorizationUrl");
      const tokenUrl = envConfig.getString("tokenUrl");
      const scope = envConfig.getOptionalString("scope");
      const includeBasicAuth = envConfig.getOptionalBoolean("includeBasicAuth");
      const disableRefresh = (_a = envConfig.getOptionalBoolean("disableRefresh")) != null ? _a : false;
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile, params }) => ({
        profile: makeProfileInfo(fullProfile, params.id_token)
      });
      const provider = new OAuth2AuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        signInResolver: (_b = options == null ? void 0 : options.signIn) == null ? void 0 : _b.resolver,
        authHandler,
        authorizationUrl,
        tokenUrl,
        scope,
        includeBasicAuth,
        resolverContext,
        disableRefresh
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  }
});
const createOAuth2Provider = oauth2.create;

const OAUTH2_PROXY_JWT_HEADER = "X-OAUTH2-PROXY-ID-TOKEN";
class Oauth2ProxyAuthProvider {
  constructor(options) {
    this.resolverContext = options.resolverContext;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
  }
  frameHandler() {
    return Promise.resolve(void 0);
  }
  async refresh(req, res) {
    try {
      const authHeader = req.header(OAUTH2_PROXY_JWT_HEADER);
      const jwt = pluginAuthNode.getBearerTokenFromAuthorizationHeader(authHeader);
      const decodedJWT = jwt && jose.decodeJwt(jwt);
      const result = {
        fullProfile: decodedJWT || {},
        accessToken: jwt || "",
        headers: req.headers,
        getHeader(name) {
          if (name.toLocaleLowerCase("en-US") === "set-cookie") {
            throw new Error("Access Set-Cookie via the headers object instead");
          }
          return req.get(name);
        }
      };
      const response = await this.handleResult(result);
      res.json(response);
    } catch (e) {
      throw new errors.AuthenticationError("Refresh failed", e);
    }
  }
  start() {
    return Promise.resolve(void 0);
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const backstageSignInResult = await this.signInResolver({
      result,
      profile
    }, this.resolverContext);
    return {
      providerInfo: {
        accessToken: result.accessToken
      },
      backstageIdentity: prepareBackstageIdentityResponse(backstageSignInResult),
      profile
    };
  }
}
async function defaultAuthHandler$1(result) {
  return {
    profile: {
      email: result.getHeader("x-forwarded-email"),
      displayName: result.getHeader("x-forwarded-preferred-username") || result.getHeader("x-forwarded-user")
    }
  };
}
const oauth2Proxy = createAuthProviderIntegration({
  create(options) {
    return ({ resolverContext }) => {
      const signInResolver = options.signIn.resolver;
      const authHandler = options.authHandler;
      return new Oauth2ProxyAuthProvider({
        resolverContext,
        signInResolver,
        authHandler: authHandler != null ? authHandler : defaultAuthHandler$1
      });
    };
  }
});
const createOauth2ProxyProvider = oauth2Proxy.create;

class OidcAuthProvider {
  constructor(options) {
    this.implementation = this.setupStrategy(options);
    this.scope = options.scope;
    this.prompt = options.prompt;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
  }
  async start(req) {
    const { strategy } = await this.implementation;
    const options = {
      scope: req.scope || this.scope || "openid profile email",
      state: encodeState(req.state)
    };
    const prompt = this.prompt || "none";
    if (prompt !== "auto") {
      options.prompt = prompt;
    }
    return await executeRedirectStrategy(req, strategy, options);
  }
  async handler(req) {
    const { strategy } = await this.implementation;
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    const { client } = await this.implementation;
    const tokenset = await client.refresh(req.refreshToken);
    if (!tokenset.access_token) {
      throw new Error("Refresh failed");
    }
    const userinfo = await client.userinfo(tokenset.access_token);
    return {
      response: await this.handleResult({ tokenset, userinfo }),
      refreshToken: tokenset.refresh_token
    };
  }
  async setupStrategy(options) {
    const issuer = await openidClient.Issuer.discover(options.metadataUrl);
    const client = new issuer.Client({
      access_type: "offline",
      client_id: options.clientId,
      client_secret: options.clientSecret,
      redirect_uris: [options.callbackUrl],
      response_types: ["code"],
      id_token_signed_response_alg: options.tokenSignedResponseAlg || "RS256",
      scope: options.scope || ""
    });
    const strategy = new openidClient.Strategy({
      client,
      passReqToCallback: false
    }, (tokenset, userinfo, done) => {
      if (typeof done !== "function") {
        throw new Error("OIDC IdP must provide a userinfo_endpoint in the metadata response");
      }
      done(void 0, { tokenset, userinfo }, {
        refreshToken: tokenset.refresh_token
      });
    });
    strategy.error = console.error;
    return { strategy, client };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.tokenset.id_token,
        accessToken: result.tokenset.access_token,
        scope: result.tokenset.scope,
        expiresInSeconds: result.tokenset.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
}
const oidc = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const metadataUrl = envConfig.getString("metadataUrl");
      const tokenSignedResponseAlg = envConfig.getOptionalString("tokenSignedResponseAlg");
      const scope = envConfig.getOptionalString("scope");
      const prompt = envConfig.getOptionalString("prompt");
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ userinfo }) => ({
        profile: {
          displayName: userinfo.name,
          email: userinfo.email,
          picture: userinfo.picture
        }
      });
      const provider = new OidcAuthProvider({
        clientId,
        clientSecret,
        callbackUrl,
        tokenSignedResponseAlg,
        metadataUrl,
        scope,
        prompt,
        signInResolver: (_a = options == null ? void 0 : options.signIn) == null ? void 0 : _a.resolver,
        authHandler,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  }
});
const createOidcProvider = oidc.create;

class OktaAuthProvider {
  constructor(options) {
    this.store = {
      store(_req, cb) {
        cb(null, null);
      },
      verify(_req, _state, cb) {
        cb(null, true);
      }
    };
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this.strategy = new passportOktaOauth.Strategy({
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      audience: options.audience,
      passReqToCallback: false,
      store: this.store,
      response_type: "code"
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, {
        accessToken,
        refreshToken,
        params,
        fullProfile
      }, {
        refreshToken
      });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this.strategy, {
      accessType: "offline",
      prompt: "consent",
      scope: req.scope,
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this.strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    const { accessToken, refreshToken, params } = await executeRefreshTokenStrategy(this.strategy, req.refreshToken, req.scope);
    const fullProfile = await executeFetchUserProfileStrategy(this.strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
}
const okta = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const audience = envConfig.getString("audience");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      if (!audience.startsWith("https://")) {
        throw new Error("URL for 'audience' must start with 'https://'.");
      }
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile, params }) => ({
        profile: makeProfileInfo(fullProfile, params.id_token)
      });
      const provider = new OktaAuthProvider({
        audience,
        clientId,
        clientSecret,
        callbackUrl,
        authHandler,
        signInResolver: (_a = options == null ? void 0 : options.signIn) == null ? void 0 : _a.resolver,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  },
  resolvers: {
    emailLocalPartMatchingUserEntityName: () => commonByEmailLocalPartResolver,
    emailMatchingUserEntityProfileEmail: () => commonByEmailResolver,
    emailMatchingUserEntityAnnotation() {
      return async (info, ctx) => {
        const { profile } = info;
        if (!profile.email) {
          throw new Error("Okta profile contained no email");
        }
        return ctx.signInWithCatalogUser({
          annotations: {
            "okta.com/email": profile.email
          }
        });
      };
    }
  }
});
const createOktaProvider = okta.create;
const oktaEmailSignInResolver = okta.resolvers.emailMatchingUserEntityAnnotation();

class OneLoginProvider {
  constructor(options) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this._strategy = new passportOneloginOauth.Strategy({
      issuer: options.issuer,
      clientID: options.clientId,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackUrl,
      passReqToCallback: false
    }, (accessToken, refreshToken, params, fullProfile, done) => {
      done(void 0, {
        accessToken,
        refreshToken,
        params,
        fullProfile
      }, {
        refreshToken
      });
    });
  }
  async start(req) {
    return await executeRedirectStrategy(req, this._strategy, {
      accessType: "offline",
      prompt: "consent",
      scope: "openid",
      state: encodeState(req.state)
    });
  }
  async handler(req) {
    const { result, privateInfo } = await executeFrameHandlerStrategy(req, this._strategy);
    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken
    };
  }
  async refresh(req) {
    const { accessToken, refreshToken, params } = await executeRefreshTokenStrategy(this._strategy, req.refreshToken, req.scope);
    const fullProfile = await executeFetchUserProfileStrategy(this._strategy, accessToken);
    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken
      }),
      refreshToken
    };
  }
  async handleResult(result) {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const response = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in
      },
      profile
    };
    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver({
        result,
        profile
      }, this.resolverContext);
    }
    return response;
  }
}
const onelogin = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => OAuthEnvironmentHandler.mapConfig(config, (envConfig) => {
      var _a;
      const clientId = envConfig.getString("clientId");
      const clientSecret = envConfig.getString("clientSecret");
      const issuer = envConfig.getString("issuer");
      const customCallbackUrl = envConfig.getOptionalString("callbackUrl");
      const callbackUrl = customCallbackUrl || `${globalConfig.baseUrl}/${providerId}/handler/frame`;
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile, params }) => ({
        profile: makeProfileInfo(fullProfile, params.id_token)
      });
      const provider = new OneLoginProvider({
        clientId,
        clientSecret,
        callbackUrl,
        issuer,
        authHandler,
        signInResolver: (_a = options == null ? void 0 : options.signIn) == null ? void 0 : _a.resolver,
        resolverContext
      });
      return OAuthAdapter.fromConfig(globalConfig, provider, {
        providerId,
        callbackUrl
      });
    });
  }
});
const createOneLoginProvider = onelogin.create;

class SamlAuthProvider {
  constructor(options) {
    this.appUrl = options.appUrl;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this.strategy = new passportSaml.Strategy({ ...options }, (fullProfile, done) => {
      done(void 0, { fullProfile });
    });
  }
  async start(req, res) {
    const { url } = await executeRedirectStrategy(req, this.strategy, {});
    res.redirect(url);
  }
  async frameHandler(req, res) {
    try {
      const { result } = await executeFrameHandlerStrategy(req, this.strategy);
      const { profile } = await this.authHandler(result, this.resolverContext);
      const response = {
        profile,
        providerInfo: {}
      };
      if (this.signInResolver) {
        const signInResponse = await this.signInResolver({
          result,
          profile
        }, this.resolverContext);
        response.backstageIdentity = prepareBackstageIdentityResponse(signInResponse);
      }
      return postMessageResponse(res, this.appUrl, {
        type: "authorization_response",
        response
      });
    } catch (error) {
      const { name, message } = errors.isError(error) ? error : new Error("Encountered invalid error");
      return postMessageResponse(res, this.appUrl, {
        type: "authorization_response",
        error: { name, message }
      });
    }
  }
  async logout(_req, res) {
    res.end();
  }
}
const saml = createAuthProviderIntegration({
  create(options) {
    return ({ providerId, globalConfig, config, resolverContext }) => {
      var _a;
      const authHandler = (options == null ? void 0 : options.authHandler) ? options.authHandler : async ({ fullProfile }) => ({
        profile: {
          email: fullProfile.email,
          displayName: fullProfile.displayName
        }
      });
      return new SamlAuthProvider({
        callbackUrl: `${globalConfig.baseUrl}/${providerId}/handler/frame`,
        entryPoint: config.getString("entryPoint"),
        logoutUrl: config.getOptionalString("logoutUrl"),
        audience: config.getOptionalString("audience"),
        issuer: config.getString("issuer"),
        cert: config.getString("cert"),
        privateKey: config.getOptionalString("privateKey"),
        authnContext: config.getOptionalStringArray("authnContext"),
        identifierFormat: config.getOptionalString("identifierFormat"),
        decryptionPvk: config.getOptionalString("decryptionPvk"),
        signatureAlgorithm: config.getOptionalString("signatureAlgorithm"),
        digestAlgorithm: config.getOptionalString("digestAlgorithm"),
        acceptedClockSkewMs: config.getOptionalNumber("acceptedClockSkewMs"),
        appUrl: globalConfig.appUrl,
        authHandler,
        signInResolver: (_a = options == null ? void 0 : options.signIn) == null ? void 0 : _a.resolver,
        resolverContext
      });
    };
  },
  resolvers: {
    nameIdMatchingUserEntityName() {
      return async (info, ctx) => {
        const id = info.result.fullProfile.nameID;
        if (!id) {
          throw new errors.AuthenticationError("No nameID found in SAML response");
        }
        return ctx.signInWithCatalogUser({
          entityRef: { name: id }
        });
      };
    }
  }
});
const createSamlProvider = saml.create;
const samlNameIdEntityNameSignInResolver = saml.resolvers.nameIdMatchingUserEntityName();

const IAP_JWT_HEADER = "x-goog-iap-jwt-assertion";

function createTokenValidator(audience, mockClient) {
  const client = mockClient != null ? mockClient : new googleAuthLibrary.OAuth2Client();
  return async function tokenValidator(token) {
    const response = await client.getIapPublicKeys();
    const ticket = await client.verifySignedJwtWithCertsAsync(token, response.pubkeys, audience, ["https://cloud.google.com/iap"]);
    const payload = ticket.getPayload();
    if (!payload) {
      throw new TypeError("Token had no payload");
    }
    return payload;
  };
}
async function parseRequestToken(jwtToken, tokenValidator) {
  if (typeof jwtToken !== "string" || !jwtToken) {
    throw new errors.AuthenticationError(`Missing Google IAP header: ${IAP_JWT_HEADER}`);
  }
  let payload;
  try {
    payload = await tokenValidator(jwtToken);
  } catch (e) {
    throw new errors.AuthenticationError(`Google IAP token verification failed, ${e}`);
  }
  if (!payload.sub || !payload.email) {
    throw new errors.AuthenticationError("Google IAP token payload is missing sub and/or email claim");
  }
  return {
    iapToken: {
      ...payload,
      sub: payload.sub,
      email: payload.email
    }
  };
}
const defaultAuthHandler = async ({
  iapToken
}) => ({ profile: { email: iapToken.email } });

class GcpIapProvider {
  constructor(options) {
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this.tokenValidator = options.tokenValidator;
    this.resolverContext = options.resolverContext;
  }
  async start() {
  }
  async frameHandler() {
  }
  async refresh(req, res) {
    const result = await parseRequestToken(req.header(IAP_JWT_HEADER), this.tokenValidator);
    const { profile } = await this.authHandler(result, this.resolverContext);
    const backstageIdentity = await this.signInResolver({ profile, result }, this.resolverContext);
    const response = {
      providerInfo: { iapToken: result.iapToken },
      profile,
      backstageIdentity: prepareBackstageIdentityResponse(backstageIdentity)
    };
    res.json(response);
  }
}
const gcpIap = createAuthProviderIntegration({
  create(options) {
    return ({ config, resolverContext }) => {
      var _a;
      const audience = config.getString("audience");
      const authHandler = (_a = options.authHandler) != null ? _a : defaultAuthHandler;
      const signInResolver = options.signIn.resolver;
      const tokenValidator = createTokenValidator(audience);
      return new GcpIapProvider({
        authHandler,
        signInResolver,
        tokenValidator,
        resolverContext
      });
    };
  }
});
const createGcpIapProvider = gcpIap.create;

const providers = Object.freeze({
  atlassian,
  auth0,
  awsAlb,
  bitbucket,
  gcpIap,
  github,
  gitlab,
  google,
  microsoft,
  oauth2,
  oauth2Proxy,
  oidc,
  okta,
  onelogin,
  saml
});

const factories = {
  google: createGoogleProvider(),
  github: createGithubProvider(),
  gitlab: createGitlabProvider(),
  saml: createSamlProvider(),
  okta: createOktaProvider(),
  auth0: createAuth0Provider(),
  microsoft: createMicrosoftProvider(),
  oauth2: createOAuth2Provider(),
  oidc: createOidcProvider(),
  onelogin: createOneLoginProvider(),
  awsalb: createAwsAlbProvider(),
  bitbucket: createBitbucketProvider(),
  atlassian: createAtlassianProvider()
};

function createOidcRouter(options) {
  const { baseUrl, tokenIssuer } = options;
  const router = Router__default["default"]();
  const config = {
    issuer: baseUrl,
    token_endpoint: `${baseUrl}/v1/token`,
    userinfo_endpoint: `${baseUrl}/v1/userinfo`,
    jwks_uri: `${baseUrl}/.well-known/jwks.json`,
    response_types_supported: ["id_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid"],
    token_endpoint_auth_methods_supported: [],
    claims_supported: ["sub"],
    grant_types_supported: []
  };
  router.get("/.well-known/openid-configuration", (_req, res) => {
    res.json(config);
  });
  router.get("/.well-known/jwks.json", async (_req, res) => {
    const { keys } = await tokenIssuer.listPublicKeys();
    res.json({ keys });
  });
  router.get("/v1/token", (_req, res) => {
    res.status(501).send("Not Implemented");
  });
  router.get("/v1/userinfo", (_req, res) => {
    res.status(501).send("Not Implemented");
  });
  return router;
}

const MS_IN_S = 1e3;
class TokenFactory {
  constructor(options) {
    var _a;
    this.issuer = options.issuer;
    this.logger = options.logger;
    this.keyStore = options.keyStore;
    this.keyDurationSeconds = options.keyDurationSeconds;
    this.algorithm = (_a = options.algorithm) != null ? _a : "ES256";
  }
  async issueToken(params) {
    const key = await this.getKey();
    const iss = this.issuer;
    const sub = params.claims.sub;
    const ent = params.claims.ent;
    const aud = "backstage";
    const iat = Math.floor(Date.now() / MS_IN_S);
    const exp = iat + this.keyDurationSeconds;
    try {
      catalogModel.parseEntityRef(sub);
    } catch (error) {
      throw new Error('"sub" claim provided by the auth resolver is not a valid EntityRef.');
    }
    this.logger.info(`Issuing token for ${sub}, with entities ${ent != null ? ent : []}`);
    if (!key.alg) {
      throw new errors.AuthenticationError("No algorithm was provided in the key");
    }
    return new jose.SignJWT({ iss, sub, ent, aud, iat, exp }).setProtectedHeader({ alg: key.alg, kid: key.kid }).setIssuer(iss).setAudience(aud).setSubject(sub).setIssuedAt(iat).setExpirationTime(exp).sign(await jose.importJWK(key));
  }
  async listPublicKeys() {
    const { items: keys } = await this.keyStore.listKeys();
    const validKeys = [];
    const expiredKeys = [];
    for (const key of keys) {
      const expireAt = luxon.DateTime.fromJSDate(key.createdAt).plus({
        seconds: 3 * this.keyDurationSeconds
      });
      if (expireAt < luxon.DateTime.local()) {
        expiredKeys.push(key);
      } else {
        validKeys.push(key);
      }
    }
    if (expiredKeys.length > 0) {
      const kids = expiredKeys.map(({ key }) => key.kid);
      this.logger.info(`Removing expired signing keys, '${kids.join("', '")}'`);
      this.keyStore.removeKeys(kids).catch((error) => {
        this.logger.error(`Failed to remove expired keys, ${error}`);
      });
    }
    return { keys: validKeys.map(({ key }) => key) };
  }
  async getKey() {
    if (this.privateKeyPromise) {
      if (this.keyExpiry && luxon.DateTime.fromJSDate(this.keyExpiry) > luxon.DateTime.local()) {
        return this.privateKeyPromise;
      }
      this.logger.info(`Signing key has expired, generating new key`);
      delete this.privateKeyPromise;
    }
    this.keyExpiry = luxon.DateTime.utc().plus({
      seconds: this.keyDurationSeconds
    }).toJSDate();
    const promise = (async () => {
      const key = await jose.generateKeyPair(this.algorithm);
      const publicKey = await jose.exportJWK(key.publicKey);
      const privateKey = await jose.exportJWK(key.privateKey);
      publicKey.kid = privateKey.kid = uuid.v4();
      publicKey.alg = privateKey.alg = this.algorithm;
      this.logger.info(`Created new signing key ${publicKey.kid}`);
      await this.keyStore.addKey(publicKey);
      return privateKey;
    })();
    this.privateKeyPromise = promise;
    try {
      await promise;
    } catch (error) {
      this.logger.error(`Failed to generate new signing key, ${error}`);
      delete this.keyExpiry;
      delete this.privateKeyPromise;
    }
    return promise;
  }
}

const migrationsDir = backendCommon.resolvePackagePath("@backstage/plugin-auth-backend", "migrations");
const TABLE = "signing_keys";
const parseDate = (date) => {
  const parsedDate = typeof date === "string" ? luxon.DateTime.fromSQL(date, { zone: "UTC" }) : luxon.DateTime.fromJSDate(date);
  if (!parsedDate.isValid) {
    throw new Error(`Failed to parse date, reason: ${parsedDate.invalidReason}, explanation: ${parsedDate.invalidExplanation}`);
  }
  return parsedDate.toJSDate();
};
class DatabaseKeyStore {
  static async create(options) {
    const { database } = options;
    await database.migrate.latest({
      directory: migrationsDir
    });
    return new DatabaseKeyStore(options);
  }
  constructor(options) {
    this.database = options.database;
  }
  async addKey(key) {
    await this.database(TABLE).insert({
      kid: key.kid,
      key: JSON.stringify(key)
    });
  }
  async listKeys() {
    const rows = await this.database(TABLE).select();
    return {
      items: rows.map((row) => ({
        key: JSON.parse(row.key),
        createdAt: parseDate(row.created_at)
      }))
    };
  }
  async removeKeys(kids) {
    await this.database(TABLE).delete().whereIn("kid", kids);
  }
}

class MemoryKeyStore {
  constructor() {
    this.keys = /* @__PURE__ */ new Map();
  }
  async addKey(key) {
    this.keys.set(key.kid, {
      createdAt: luxon.DateTime.utc().toJSDate(),
      key: JSON.stringify(key)
    });
  }
  async removeKeys(kids) {
    for (const kid of kids) {
      this.keys.delete(kid);
    }
  }
  async listKeys() {
    return {
      items: Array.from(this.keys).map(([, { createdAt, key: keyStr }]) => ({
        createdAt,
        key: JSON.parse(keyStr)
      }))
    };
  }
}

const DEFAULT_TIMEOUT_MS = 1e4;
const DEFAULT_DOCUMENT_PATH = "sessions";
class FirestoreKeyStore {
  constructor(database, path, timeout) {
    this.database = database;
    this.path = path;
    this.timeout = timeout;
  }
  static async create(settings) {
    const { path, timeout, ...firestoreSettings } = settings != null ? settings : {};
    const database = new firestore.Firestore(firestoreSettings);
    return new FirestoreKeyStore(database, path != null ? path : DEFAULT_DOCUMENT_PATH, timeout != null ? timeout : DEFAULT_TIMEOUT_MS);
  }
  static async verifyConnection(keyStore, logger) {
    try {
      await keyStore.verify();
    } catch (error) {
      if (process.env.NODE_ENV !== "development") {
        throw new Error(`Failed to connect to database: ${error.message}`);
      }
      logger == null ? void 0 : logger.warn(`Failed to connect to database: ${error.message}`);
    }
  }
  async addKey(key) {
    await this.withTimeout(this.database.collection(this.path).doc(key.kid).set({
      kid: key.kid,
      key: JSON.stringify(key)
    }));
  }
  async listKeys() {
    const keys = await this.withTimeout(this.database.collection(this.path).get());
    return {
      items: keys.docs.map((key) => ({
        key: key.data(),
        createdAt: key.createTime.toDate()
      }))
    };
  }
  async removeKeys(kids) {
    for (const kid of kids) {
      await this.withTimeout(this.database.collection(this.path).doc(kid).delete());
    }
  }
  async withTimeout(operation) {
    const timer = new Promise((_, reject) => setTimeout(() => {
      reject(new Error(`Operation timed out after ${this.timeout}ms`));
    }, this.timeout));
    return Promise.race([operation, timer]);
  }
  async verify() {
    await this.withTimeout(this.database.collection(this.path).limit(1).get());
  }
}

class KeyStores {
  static async fromConfig(config, options) {
    var _a;
    const { logger, database } = options != null ? options : {};
    const ks = config.getOptionalConfig("auth.keyStore");
    const provider = (_a = ks == null ? void 0 : ks.getOptionalString("provider")) != null ? _a : "database";
    logger == null ? void 0 : logger.info(`Configuring "${provider}" as KeyStore provider`);
    if (provider === "database") {
      if (!database) {
        throw new Error("This KeyStore provider requires a database");
      }
      return await DatabaseKeyStore.create({
        database: await database.getClient()
      });
    }
    if (provider === "memory") {
      return new MemoryKeyStore();
    }
    if (provider === "firestore") {
      const settings = ks == null ? void 0 : ks.getConfig(provider);
      const keyStore = await FirestoreKeyStore.create(lodash.pickBy({
        projectId: settings == null ? void 0 : settings.getOptionalString("projectId"),
        keyFilename: settings == null ? void 0 : settings.getOptionalString("keyFilename"),
        host: settings == null ? void 0 : settings.getOptionalString("host"),
        port: settings == null ? void 0 : settings.getOptionalNumber("port"),
        ssl: settings == null ? void 0 : settings.getOptionalBoolean("ssl"),
        path: settings == null ? void 0 : settings.getOptionalString("path"),
        timeout: settings == null ? void 0 : settings.getOptionalNumber("timeout")
      }, (value) => value !== void 0));
      await FirestoreKeyStore.verifyConnection(keyStore, logger);
      return keyStore;
    }
    throw new Error(`Unknown KeyStore provider: ${provider}`);
  }
}

class CatalogIdentityClient {
  constructor(options) {
    this.catalogApi = options.catalogApi;
    this.tokenManager = options.tokenManager;
  }
  async findUser(query) {
    const filter = {
      kind: "user"
    };
    for (const [key, value] of Object.entries(query.annotations)) {
      filter[`metadata.annotations.${key}`] = value;
    }
    const { token } = await this.tokenManager.getToken();
    const { items } = await this.catalogApi.getEntities({ filter }, { token });
    if (items.length !== 1) {
      if (items.length > 1) {
        throw new errors.ConflictError("User lookup resulted in multiple matches");
      } else {
        throw new errors.NotFoundError("User not found");
      }
    }
    return items[0];
  }
  async resolveCatalogMembership(query) {
    const { entityRefs, logger } = query;
    const resolvedEntityRefs = entityRefs.map((ref) => {
      try {
        const parsedRef = catalogModel.parseEntityRef(ref.toLocaleLowerCase("en-US"), {
          defaultKind: "user",
          defaultNamespace: "default"
        });
        return parsedRef;
      } catch {
        logger == null ? void 0 : logger.warn(`Failed to parse entityRef from ${ref}, ignoring`);
        return null;
      }
    }).filter((ref) => ref !== null);
    const filter = resolvedEntityRefs.map((ref) => ({
      kind: ref.kind,
      "metadata.namespace": ref.namespace,
      "metadata.name": ref.name
    }));
    const { token } = await this.tokenManager.getToken();
    const entities = await this.catalogApi.getEntities({ filter }, { token }).then((r) => r.items);
    if (entityRefs.length !== entities.length) {
      const foundEntityNames = entities.map(catalogModel.stringifyEntityRef);
      const missingEntityNames = resolvedEntityRefs.map(catalogModel.stringifyEntityRef).filter((s) => !foundEntityNames.includes(s));
      logger == null ? void 0 : logger.debug(`Entities not found for refs ${missingEntityNames.join()}`);
    }
    const memberOf = entities.flatMap((e) => {
      var _a, _b;
      return (_b = (_a = e.relations) == null ? void 0 : _a.filter((r) => r.type === catalogModel.RELATION_MEMBER_OF).map((r) => r.targetRef)) != null ? _b : [];
    });
    const newEntityRefs = [
      ...new Set(resolvedEntityRefs.map(catalogModel.stringifyEntityRef).concat(memberOf))
    ];
    logger == null ? void 0 : logger.debug(`Found catalog membership: ${newEntityRefs.join()}`);
    return newEntityRefs;
  }
}

function getEntityClaims(entity) {
  var _a, _b;
  const userRef = catalogModel.stringifyEntityRef(entity);
  const membershipRefs = (_b = (_a = entity.relations) == null ? void 0 : _a.filter((r) => r.type === catalogModel.RELATION_MEMBER_OF && r.targetRef.startsWith("group:")).map((r) => r.targetRef)) != null ? _b : [];
  return {
    sub: userRef,
    ent: [userRef, ...membershipRefs]
  };
}

function getDefaultOwnershipEntityRefs(entity) {
  var _a, _b;
  const membershipRefs = (_b = (_a = entity.relations) == null ? void 0 : _a.filter((r) => r.type === catalogModel.RELATION_MEMBER_OF && r.targetRef.startsWith("group:")).map((r) => r.targetRef)) != null ? _b : [];
  return Array.from(/* @__PURE__ */ new Set([catalogModel.stringifyEntityRef(entity), ...membershipRefs]));
}
class CatalogAuthResolverContext {
  constructor(logger, tokenIssuer, catalogIdentityClient, catalogApi, tokenManager) {
    this.logger = logger;
    this.tokenIssuer = tokenIssuer;
    this.catalogIdentityClient = catalogIdentityClient;
    this.catalogApi = catalogApi;
    this.tokenManager = tokenManager;
  }
  static create(options) {
    const catalogIdentityClient = new CatalogIdentityClient({
      catalogApi: options.catalogApi,
      tokenManager: options.tokenManager
    });
    return new CatalogAuthResolverContext(options.logger, options.tokenIssuer, catalogIdentityClient, options.catalogApi, options.tokenManager);
  }
  async issueToken(params) {
    const token = await this.tokenIssuer.issueToken(params);
    return { token };
  }
  async findCatalogUser(query) {
    let result = void 0;
    const { token } = await this.tokenManager.getToken();
    if ("entityRef" in query) {
      const entityRef = catalogModel.parseEntityRef(query.entityRef, {
        defaultKind: "User",
        defaultNamespace: catalogModel.DEFAULT_NAMESPACE
      });
      result = await this.catalogApi.getEntityByRef(entityRef, { token });
    } else if ("annotations" in query) {
      const filter = {
        kind: "user"
      };
      for (const [key, value] of Object.entries(query.annotations)) {
        filter[`metadata.annotations.${key}`] = value;
      }
      const res = await this.catalogApi.getEntities({ filter }, { token });
      result = res.items;
    } else if ("filter" in query) {
      const res = await this.catalogApi.getEntities({ filter: query.filter }, { token });
      result = res.items;
    } else {
      throw new errors.InputError("Invalid user lookup query");
    }
    if (Array.isArray(result)) {
      if (result.length > 1) {
        throw new errors.ConflictError("User lookup resulted in multiple matches");
      }
      result = result[0];
    }
    if (!result) {
      throw new errors.NotFoundError("User not found");
    }
    return { entity: result };
  }
  async signInWithCatalogUser(query) {
    const { entity } = await this.findCatalogUser(query);
    const ownershipRefs = getDefaultOwnershipEntityRefs(entity);
    const token = await this.tokenIssuer.issueToken({
      claims: {
        sub: catalogModel.stringifyEntityRef(entity),
        ent: ownershipRefs
      }
    });
    return { token };
  }
}

async function createRouter(options) {
  const {
    logger,
    config,
    discovery,
    database,
    tokenManager,
    providerFactories
  } = options;
  const router = Router__default["default"]();
  const appUrl = config.getString("app.baseUrl");
  const authUrl = await discovery.getExternalBaseUrl("auth");
  const keyStore = await KeyStores.fromConfig(config, { logger, database });
  const keyDurationSeconds = 3600;
  const tokenIssuer = new TokenFactory({
    issuer: authUrl,
    keyStore,
    keyDurationSeconds,
    logger: logger.child({ component: "token-factory" })
  });
  const catalogApi = new catalogClient.CatalogClient({ discoveryApi: discovery });
  const secret = config.getOptionalString("auth.session.secret");
  if (secret) {
    router.use(cookieParser__default["default"](secret));
    const enforceCookieSSL = authUrl.startsWith("https");
    router.use(session__default["default"]({
      secret,
      saveUninitialized: false,
      resave: false,
      cookie: { secure: enforceCookieSSL ? "auto" : false }
    }));
    router.use(passport__default["default"].initialize());
    router.use(passport__default["default"].session());
  } else {
    router.use(cookieParser__default["default"]());
  }
  router.use(express__default["default"].urlencoded({ extended: false }));
  router.use(express__default["default"].json());
  const allProviderFactories = {
    ...factories,
    ...providerFactories
  };
  const providersConfig = config.getConfig("auth.providers");
  const configuredProviders = providersConfig.keys();
  const isOriginAllowed = createOriginFilter(config);
  for (const [providerId, providerFactory] of Object.entries(allProviderFactories)) {
    if (configuredProviders.includes(providerId)) {
      logger.info(`Configuring provider, ${providerId}`);
      try {
        const provider = providerFactory({
          providerId,
          globalConfig: {
            baseUrl: authUrl,
            appUrl,
            isOriginAllowed
          },
          config: providersConfig.getConfig(providerId),
          logger,
          tokenManager,
          tokenIssuer,
          discovery,
          catalogApi,
          resolverContext: CatalogAuthResolverContext.create({
            logger,
            catalogApi,
            tokenIssuer,
            tokenManager
          })
        });
        const r = Router__default["default"]();
        r.get("/start", provider.start.bind(provider));
        r.get("/handler/frame", provider.frameHandler.bind(provider));
        r.post("/handler/frame", provider.frameHandler.bind(provider));
        if (provider.logout) {
          r.post("/logout", provider.logout.bind(provider));
        }
        if (provider.refresh) {
          r.get("/refresh", provider.refresh.bind(provider));
        }
        router.use(`/${providerId}`, r);
      } catch (e) {
        errors.assertError(e);
        if (process.env.NODE_ENV !== "development") {
          throw new Error(`Failed to initialize ${providerId} auth provider, ${e.message}`);
        }
        logger.warn(`Skipping ${providerId} auth provider, ${e.message}`);
        router.use(`/${providerId}`, () => {
          throw new errors.NotFoundError(`Auth provider registered for '${providerId}' is misconfigured. This could mean the configs under auth.providers.${providerId} are missing or the environment variables used are not defined. Check the auth backend plugin logs when the backend starts to see more details.`);
        });
      }
    } else {
      router.use(`/${providerId}`, () => {
        throw new errors.NotFoundError(`No auth provider registered for '${providerId}'`);
      });
    }
  }
  router.use(createOidcRouter({
    tokenIssuer,
    baseUrl: authUrl
  }));
  router.use("/:provider/", (req) => {
    const { provider } = req.params;
    throw new errors.NotFoundError(`Unknown auth provider '${provider}'`);
  });
  return router;
}
function createOriginFilter(config) {
  var _a;
  const appUrl = config.getString("app.baseUrl");
  const { origin: appOrigin } = new URL(appUrl);
  const allowedOrigins = config.getOptionalStringArray("auth.experimentalExtraAllowedOrigins");
  const allowedOriginPatterns = (_a = allowedOrigins == null ? void 0 : allowedOrigins.map((pattern) => new minimatch.Minimatch(pattern, { nocase: true, noglobstar: true }))) != null ? _a : [];
  return (origin) => {
    if (origin === appOrigin) {
      return true;
    }
    return allowedOriginPatterns.some((pattern) => pattern.match(origin));
  };
}

exports.CatalogIdentityClient = CatalogIdentityClient;
exports.OAuthAdapter = OAuthAdapter;
exports.OAuthEnvironmentHandler = OAuthEnvironmentHandler;
exports.bitbucketUserIdSignInResolver = bitbucketUserIdSignInResolver;
exports.bitbucketUsernameSignInResolver = bitbucketUsernameSignInResolver;
exports.createAtlassianProvider = createAtlassianProvider;
exports.createAuth0Provider = createAuth0Provider;
exports.createAwsAlbProvider = createAwsAlbProvider;
exports.createBitbucketProvider = createBitbucketProvider;
exports.createGcpIapProvider = createGcpIapProvider;
exports.createGithubProvider = createGithubProvider;
exports.createGitlabProvider = createGitlabProvider;
exports.createGoogleProvider = createGoogleProvider;
exports.createMicrosoftProvider = createMicrosoftProvider;
exports.createOAuth2Provider = createOAuth2Provider;
exports.createOauth2ProxyProvider = createOauth2ProxyProvider;
exports.createOidcProvider = createOidcProvider;
exports.createOktaProvider = createOktaProvider;
exports.createOneLoginProvider = createOneLoginProvider;
exports.createOriginFilter = createOriginFilter;
exports.createRouter = createRouter;
exports.createSamlProvider = createSamlProvider;
exports.defaultAuthProviderFactories = factories;
exports.encodeState = encodeState;
exports.ensuresXRequestedWith = ensuresXRequestedWith;
exports.getDefaultOwnershipEntityRefs = getDefaultOwnershipEntityRefs;
exports.getEntityClaims = getEntityClaims;
exports.googleEmailSignInResolver = googleEmailSignInResolver;
exports.microsoftEmailSignInResolver = microsoftEmailSignInResolver;
exports.oktaEmailSignInResolver = oktaEmailSignInResolver;
exports.postMessageResponse = postMessageResponse;
exports.prepareBackstageIdentityResponse = prepareBackstageIdentityResponse;
exports.providers = providers;
exports.readState = readState;
exports.samlNameIdEntityNameSignInResolver = samlNameIdEntityNameSignInResolver;
exports.verifyNonce = verifyNonce;
//# sourceMappingURL=index.cjs.js.map
