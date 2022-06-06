'use strict';

var fs = require('fs-extra');
var index = require('./index-a5d56062.cjs.js');
var backend = require('./backend-591925af.cjs.js');
require('commander');
require('chalk');
require('semver');
require('@backstage/cli-common');
require('@backstage/errors');
require('webpack');
require('./paths-fed28365.cjs.js');
require('path');
require('fork-ts-checker-webpack-plugin');
require('html-webpack-plugin');
require('react-dev-utils/ModuleScopePlugin');
require('run-script-webpack-plugin');
require('webpack-node-externals');
require('@manypkg/get-packages');
require('mini-css-extract-plugin');
require('./svgrTemplate-550efce6.cjs.js');
require('./run-3d0b00b7.cjs.js');
require('child_process');
require('util');
require('eslint-webpack-plugin');
require('lodash/pickBy');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

var dev = async (opts) => {
  await fs__default["default"].remove(index.paths.resolveTarget("dist"));
  const waitForExit = await backend.serveBackend({
    entry: "src/index",
    checksEnabled: opts.check,
    inspectEnabled: opts.inspect,
    inspectBrkEnabled: opts.inspectBrk
  });
  await waitForExit();
};

exports["default"] = dev;
//# sourceMappingURL=dev-c50b4f38.cjs.js.map
