'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var express = require('express');
var Router = require('express-promise-router');
var fetch = require('node-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

class PeriskopApi {
  constructor(options) {
    this.instances = options.config.getConfigArray("periskop.instances").flatMap((locConf) => {
      const name = locConf.getString("name");
      const url = locConf.getString("url");
      return { name, url };
    });
  }
  getApiUrl(instanceName) {
    var _a;
    return (_a = this.instances.find((instance) => instance.name === instanceName)) == null ? void 0 : _a.url;
  }
  async getErrors(instanceName, serviceName) {
    const apiUrl = this.getApiUrl(instanceName);
    if (!apiUrl) {
      throw new Error(`failed to fetch data, no periskop instance with name ${instanceName}`);
    }
    const response = await fetch__default["default"](`${apiUrl}/services/${serviceName}/errors/`);
    if (!response.ok) {
      if (response.status === 404) {
        return {
          body: await response.text()
        };
      }
      throw new Error(`failed to fetch data, status ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
}

async function createRouter(options) {
  const { logger, config } = options;
  const periskopApi = new PeriskopApi({ config });
  const router = Router__default["default"]();
  router.use(express__default["default"].json());
  router.get("/health", (_, response) => {
    logger.info("PONG!");
    response.send({ status: "ok" });
  });
  router.get("/:locationName/:serviceName", async (request, response) => {
    const { locationName, serviceName } = request.params;
    logger.info(`Periskop got queried for ${serviceName} in ${locationName}`);
    const errors = await periskopApi.getErrors(locationName, serviceName);
    response.status(200).json(errors);
  });
  router.use(backendCommon.errorHandler());
  return router;
}

exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
