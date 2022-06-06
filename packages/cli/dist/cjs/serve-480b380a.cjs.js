'use strict';

var fs = require('fs-extra');
var chalk = require('chalk');
var uniq = require('lodash/uniq');
require('webpack');
require('path');
require('fork-ts-checker-webpack-plugin');
require('html-webpack-plugin');
require('react-dev-utils/ModuleScopePlugin');
require('run-script-webpack-plugin');
require('webpack-node-externals');
require('@backstage/cli-common');
require('@manypkg/get-packages');
require('./paths-fed28365.cjs.js');
require('mini-css-extract-plugin');
var index = require('./index-a5d56062.cjs.js');
require('./run-3d0b00b7.cjs.js');
require('eslint-webpack-plugin');
require('lodash/pickBy');
require('yn');
require('react-dev-utils/FileSizeReporter');
require('react-dev-utils/formatWebpackMessages');
var server = require('./server-2f47c254.cjs.js');
var config = require('./config-0d75b175.cjs.js');
var Lockfile = require('./Lockfile-48dc675e.cjs.js');
require('minimatch');
var lint = require('./lint-1d93fc0e.cjs.js');
require('./svgrTemplate-550efce6.cjs.js');
require('commander');
require('semver');
require('@backstage/errors');
require('child_process');
require('util');
require('webpack-dev-server');
require('react-dev-utils/openBrowser');
require('@backstage/config-loader');
require('@backstage/config');
require('./PackageGraph-89852111.cjs.js');
require('@yarnpkg/parsers');
require('@yarnpkg/lockfile');
require('lodash/partition');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);

var serve = async (opts) => {
  const lockFilePath = index.paths.resolveTargetRoot("yarn.lock");
  if (fs__default["default"].existsSync(lockFilePath)) {
    try {
      const lockfile = await Lockfile.Lockfile.load(lockFilePath);
      const result = lockfile.analyze({
        filter: lint.includedFilter
      });
      const problemPackages = [...result.newVersions, ...result.newRanges].map(({ name: name2 }) => name2).filter((name2) => lint.forbiddenDuplicatesFilter(name2));
      if (problemPackages.length > 0) {
        console.log(chalk__default["default"].yellow(`\u26A0\uFE0F Some of the following packages may be outdated or have duplicate installations:

              ${uniq__default["default"](problemPackages).join(", ")}
            `));
        console.log(chalk__default["default"].yellow(`\u26A0\uFE0F The following command may fix the issue, but it could also be an issue within one of your dependencies:

              yarn backstage-cli versions:check --fix
            `));
      }
    } catch (error) {
      console.log(chalk__default["default"].yellow(`\u26A0\uFE0F Unable to parse yarn.lock file properly:

            ${error}

            skipping analyzer for outdated or duplicate installations
          `));
    }
  } else {
    console.log(chalk__default["default"].yellow(`\u26A0\uFE0F Unable to find yarn.lock file:

          skipping analyzer for outdated or duplicate installations
        `));
  }
  const { name } = await fs__default["default"].readJson(index.paths.resolveTarget("package.json"));
  const waitForExit = await server.serveBundle({
    entry: "src/index",
    checksEnabled: opts.check,
    ...await config.loadCliConfig({
      args: opts.config,
      fromPackage: name,
      withFilteredKeys: true
    })
  });
  await waitForExit();
};

exports["default"] = serve;
//# sourceMappingURL=serve-480b380a.cjs.js.map
