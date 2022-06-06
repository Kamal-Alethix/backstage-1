'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var express = require('express');
var Router = require('express-promise-router');
var httpProxyMiddleware = require('http-proxy-middleware');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

const generateAirbrakePathRewrite = (options) => {
  const apiKey = options.airbrakeConfig.apiKey;
  return (path) => {
    let newPath = path.replace(/.+?(\/api)/g, "");
    if (newPath.includes("?")) {
      newPath += `&key=${apiKey}`;
    } else {
      newPath += `?key=${apiKey}`;
    }
    return newPath;
  };
};
async function createRouter(options) {
  const { logger } = options;
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/health", (_, response) => {
    logger.info("PONG!");
    response.send({ status: "ok" });
  });
  router.use("/api", httpProxyMiddleware.createProxyMiddleware({
    target: "https://api.airbrake.io/api",
    changeOrigin: true,
    pathRewrite: generateAirbrakePathRewrite(options)
  }));
  router.use(backendCommon.errorHandler());
  return router;
}

function extractAirbrakeConfig(config) {
  return {
    apiKey: config.getString("airbrake.apiKey")
  };
}

exports.createRouter = createRouter;
exports.extractAirbrakeConfig = extractAirbrakeConfig;
exports.generateAirbrakePathRewrite = generateAirbrakePathRewrite;
//# sourceMappingURL=index.cjs.js.map
