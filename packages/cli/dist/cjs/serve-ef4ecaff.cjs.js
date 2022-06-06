'use strict';

var fs = require('fs-extra');
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
require('chalk');
var server = require('./server-2f47c254.cjs.js');
var config = require('./config-0d75b175.cjs.js');
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

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

var serve = async (opts) => {
  const { name } = await fs__default["default"].readJson(index.paths.resolveTarget("package.json"));
  const waitForExit = await server.serveBundle({
    entry: "dev/index",
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
//# sourceMappingURL=serve-ef4ecaff.cjs.js.map
