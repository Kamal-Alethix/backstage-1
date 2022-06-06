'use strict';

var fs = require('fs-extra');
var index = require('./index-a5d56062.cjs.js');
var backend = require('./backend-591925af.cjs.js');
require('yn');
require('path');
require('webpack');
require('react-dev-utils/FileSizeReporter');
require('react-dev-utils/formatWebpackMessages');
require('fork-ts-checker-webpack-plugin');
require('html-webpack-plugin');
require('react-dev-utils/ModuleScopePlugin');
require('run-script-webpack-plugin');
require('webpack-node-externals');
require('@backstage/cli-common');
require('@manypkg/get-packages');
require('./paths-fed28365.cjs.js');
require('mini-css-extract-plugin');
require('./run-3d0b00b7.cjs.js');
require('eslint-webpack-plugin');
require('lodash/pickBy');
var chalk = require('chalk');
require('webpack-dev-server');
require('react-dev-utils/openBrowser');
var uniq = require('lodash/uniq');
var server = require('./server-2f47c254.cjs.js');
var config = require('./config-0d75b175.cjs.js');
var Lockfile = require('./Lockfile-48dc675e.cjs.js');
require('minimatch');
var lint = require('./lint-1d93fc0e.cjs.js');
var packageRoles = require('./packageRoles-d9141e1e.cjs.js');
require('commander');
require('semver');
require('@backstage/errors');
require('./svgrTemplate-550efce6.cjs.js');
require('child_process');
require('util');
require('@backstage/config-loader');
require('@backstage/config');
require('./PackageGraph-89852111.cjs.js');
require('@yarnpkg/parsers');
require('@yarnpkg/lockfile');
require('lodash/partition');
require('zod');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);

async function startBackend(options) {
  await fs__default["default"].remove(index.paths.resolveTarget("dist"));
  const waitForExit = await backend.serveBackend({
    entry: "src/index",
    checksEnabled: options.checksEnabled,
    inspectEnabled: options.inspectEnabled,
    inspectBrkEnabled: options.inspectBrkEnabled
  });
  await waitForExit();
}

async function startFrontend(options) {
  if (options.verifyVersions) {
    const lockfile = await Lockfile.Lockfile.load(index.paths.resolveTargetRoot("yarn.lock"));
    const result = lockfile.analyze({
      filter: lint.includedFilter
    });
    const problemPackages = [...result.newVersions, ...result.newRanges].map(({ name: name2 }) => name2);
    if (problemPackages.length > 1) {
      console.log(chalk__default["default"].yellow(`\u26A0\uFE0F   Some of the following packages may be outdated or have duplicate installations:

          ${uniq__default["default"](problemPackages).join(", ")}
        `));
      console.log(chalk__default["default"].yellow(`\u26A0\uFE0F   This can be resolved using the following command:

          yarn backstage-cli versions:check --fix
      `));
    }
  }
  const { name } = await fs__default["default"].readJson(index.paths.resolveTarget("package.json"));
  const config$1 = await config.loadCliConfig({
    args: options.configPaths,
    fromPackage: name,
    withFilteredKeys: true
  });
  const appBaseUrl = config$1.frontendConfig.getString("app.baseUrl");
  const backendBaseUrl = config$1.frontendConfig.getString("backend.baseUrl");
  if (appBaseUrl === backendBaseUrl) {
    console.log(chalk__default["default"].yellow(`\u26A0\uFE0F   Conflict between app baseUrl and backend baseUrl:

    app.baseUrl:     ${appBaseUrl}
    backend.baseUrl: ${appBaseUrl}

    Must have unique hostname and/or ports.

    This can be resolved by changing app.baseUrl and backend.baseUrl to point to their respective local development ports.
`));
  }
  const waitForExit = await server.serveBundle({
    entry: options.entry,
    checksEnabled: options.checksEnabled,
    ...config$1
  });
  await waitForExit();
}

async function command(opts) {
  const role = await packageRoles.findRoleFromCommand(opts);
  const options = {
    configPaths: opts.config,
    checksEnabled: Boolean(opts.check),
    inspectEnabled: Boolean(opts.inspect),
    inspectBrkEnabled: Boolean(opts.inspectBrk)
  };
  switch (role) {
    case "backend":
    case "backend-plugin":
    case "backend-plugin-module":
    case "node-library":
      return startBackend(options);
    case "frontend":
      return startFrontend({
        ...options,
        entry: "src/index",
        verifyVersions: true
      });
    case "web-library":
    case "frontend-plugin":
    case "frontend-plugin-module":
      return startFrontend({ entry: "dev/index", ...options });
    default:
      throw new Error(`Start command is not supported for package role '${role}'`);
  }
}

exports.command = command;
//# sourceMappingURL=index-7053ecd8.cjs.js.map
