'use strict';

var webpack = require('webpack');
var paths = require('./paths-fed28365.cjs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var webpack__default = /*#__PURE__*/_interopDefaultLegacy(webpack);

async function serveBackend(options) {
  const paths$1 = paths.resolveBundlingPaths(options);
  const config = await paths.createBackendConfig(paths$1, {
    ...options,
    isDev: true
  });
  const compiler = webpack__default["default"](config, (err) => {
    if (err) {
      console.error(err);
    } else
      console.log("Build succeeded");
  });
  const waitForExit = async () => {
    for (const signal of ["SIGINT", "SIGTERM"]) {
      process.on(signal, () => {
        compiler.close(() => process.exit());
      });
    }
    return new Promise(() => {
    });
  };
  return waitForExit;
}

exports.serveBackend = serveBackend;
//# sourceMappingURL=backend-591925af.cjs.js.map
