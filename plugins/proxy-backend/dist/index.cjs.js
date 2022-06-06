'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Router = require('express-promise-router');
var httpProxyMiddleware = require('http-proxy-middleware');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

const safeForwardHeaders = [
  "cache-control",
  "content-language",
  "content-length",
  "content-type",
  "expires",
  "last-modified",
  "pragma",
  "host",
  "accept",
  "accept-language",
  "user-agent"
];
function buildMiddleware(pathPrefix, logger, route, config) {
  var _a;
  const fullConfig = typeof config === "string" ? { target: config } : { ...config };
  if (typeof fullConfig.target !== "string") {
    throw new Error(`Proxy target must be a string`);
  }
  try {
    new URL(fullConfig.target);
  } catch {
    throw new Error(`Proxy target is not a valid URL: ${(_a = fullConfig.target) != null ? _a : ""}`);
  }
  if (fullConfig.pathRewrite === void 0) {
    let routeWithSlash = route.endsWith("/") ? route : `${route}/`;
    if (!pathPrefix.endsWith("/") && !routeWithSlash.startsWith("/")) {
      routeWithSlash = `/${routeWithSlash}`;
    } else if (pathPrefix.endsWith("/") && routeWithSlash.startsWith("/")) {
      routeWithSlash = routeWithSlash.substring(1);
    }
    fullConfig.pathRewrite = {
      [`^${pathPrefix}${routeWithSlash}?`]: "/"
    };
  }
  if (fullConfig.changeOrigin === void 0) {
    fullConfig.changeOrigin = true;
  }
  fullConfig.logProvider = () => logger;
  const requestHeaderAllowList = new Set([
    ...safeForwardHeaders,
    ...fullConfig.headers && Object.keys(fullConfig.headers) || [],
    ...fullConfig.allowedHeaders || []
  ].map((h) => h.toLocaleLowerCase()));
  const filter = (_pathname, req) => {
    var _a2, _b;
    const headerNames = Object.keys(req.headers);
    headerNames.forEach((h) => {
      if (!requestHeaderAllowList.has(h.toLocaleLowerCase())) {
        delete req.headers[h];
      }
    });
    return (_b = (_a2 = fullConfig == null ? void 0 : fullConfig.allowedMethods) == null ? void 0 : _a2.includes(req.method)) != null ? _b : true;
  };
  filter.toString = () => route;
  const responseHeaderAllowList = new Set([
    ...safeForwardHeaders,
    ...fullConfig.allowedHeaders || []
  ].map((h) => h.toLocaleLowerCase()));
  fullConfig.onProxyRes = (proxyRes) => {
    const headerNames = Object.keys(proxyRes.headers);
    headerNames.forEach((h) => {
      if (!responseHeaderAllowList.has(h.toLocaleLowerCase())) {
        delete proxyRes.headers[h];
      }
    });
  };
  return httpProxyMiddleware.createProxyMiddleware(filter, fullConfig);
}
async function createRouter(options) {
  var _a;
  const router = Router__default["default"]();
  const externalUrl = await options.discovery.getExternalBaseUrl("proxy");
  const { pathname: pathPrefix } = new URL(externalUrl);
  const proxyConfig = (_a = options.config.getOptional("proxy")) != null ? _a : {};
  Object.entries(proxyConfig).forEach(([route, proxyRouteConfig]) => {
    try {
      router.use(route, buildMiddleware(pathPrefix, options.logger, route, proxyRouteConfig));
    } catch (e) {
      if (options.skipInvalidProxies) {
        options.logger.warn(`skipped configuring ${route} due to ${e.message}`);
      } else {
        throw e;
      }
    }
  });
  return router;
}

exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
