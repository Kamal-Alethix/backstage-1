'use strict';

var fs = require('fs-extra');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var openBrowser = require('react-dev-utils/openBrowser');
var paths = require('./paths-fed28365.cjs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var webpack__default = /*#__PURE__*/_interopDefaultLegacy(webpack);
var WebpackDevServer__default = /*#__PURE__*/_interopDefaultLegacy(WebpackDevServer);
var openBrowser__default = /*#__PURE__*/_interopDefaultLegacy(openBrowser);

async function serveBundle(options) {
  var _a, _b;
  const url = paths.resolveBaseUrl(options.frontendConfig);
  const host = options.frontendConfig.getOptionalString("app.listen.host") || url.hostname;
  const port = options.frontendConfig.getOptionalNumber("app.listen.port") || Number(url.port) || (url.protocol === "https:" ? 443 : 80);
  const paths$1 = paths.resolveBundlingPaths(options);
  const pkgPath = paths$1.targetPackageJson;
  const pkg = await fs__default["default"].readJson(pkgPath);
  const config = await paths.createConfig(paths$1, {
    ...options,
    isDev: true,
    baseUrl: url
  });
  const compiler = webpack__default["default"](config);
  const server = new WebpackDevServer__default["default"](compiler, {
    hot: !process.env.CI,
    devMiddleware: {
      publicPath: (_a = config.output) == null ? void 0 : _a.publicPath,
      stats: "errors-warnings"
    },
    static: paths$1.targetPublic ? {
      publicPath: (_b = config.output) == null ? void 0 : _b.publicPath,
      directory: paths$1.targetPublic
    } : void 0,
    historyApiFallback: {
      disableDotRule: true
    },
    https: url.protocol === "https:",
    host,
    port,
    proxy: pkg.proxy,
    allowedHosts: [url.hostname],
    client: {
      webSocketURL: "auto://0.0.0.0:0/ws"
    }
  });
  await new Promise((resolve, reject) => {
    server.listen(port, host, (err) => {
      if (err) {
        reject(err);
        return;
      }
      openBrowser__default["default"](url.href);
      resolve();
    });
  });
  const waitForExit = async () => {
    for (const signal of ["SIGINT", "SIGTERM"]) {
      process.on(signal, () => {
        server.close();
        process.exit();
      });
    }
    return new Promise(() => {
    });
  };
  return waitForExit;
}

exports.serveBundle = serveBundle;
//# sourceMappingURL=server-2f47c254.cjs.js.map
