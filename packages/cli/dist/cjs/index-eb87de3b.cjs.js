'use strict';

var packager = require('./packager-255a36da.cjs.js');
var packageRoles = require('./packageRoles-d9141e1e.cjs.js');
var index = require('./index-a5d56062.cjs.js');
var buildBackend = require('./buildBackend-7d762705.cjs.js');
require('fs-extra');
require('rollup');
require('chalk');
require('path');
require('@rollup/plugin-commonjs');
require('@rollup/plugin-node-resolve');
require('rollup-plugin-postcss');
require('rollup-plugin-esbuild');
require('@svgr/rollup');
require('rollup-plugin-dts');
require('@rollup/plugin-json');
require('@rollup/plugin-yaml');
require('rollup-pluginutils');
require('./svgrTemplate-550efce6.cjs.js');
require('./parallel-8286d3fa.cjs.js');
require('os');
require('worker_threads');
require('zod');
require('commander');
require('semver');
require('@backstage/cli-common');
require('@backstage/errors');
require('webpack');
require('fork-ts-checker-webpack-plugin');
require('html-webpack-plugin');
require('react-dev-utils/ModuleScopePlugin');
require('run-script-webpack-plugin');
require('webpack-node-externals');
require('@manypkg/get-packages');
require('./paths-fed28365.cjs.js');
require('mini-css-extract-plugin');
require('./run-3d0b00b7.cjs.js');
require('child_process');
require('util');
require('eslint-webpack-plugin');
require('lodash/pickBy');
require('./bundle-b7f6e748.cjs.js');
require('yn');
require('react-dev-utils/FileSizeReporter');
require('react-dev-utils/formatWebpackMessages');
require('webpack-dev-server');
require('react-dev-utils/openBrowser');
require('./config-0d75b175.cjs.js');
require('@backstage/config-loader');
require('@backstage/config');
require('./PackageGraph-89852111.cjs.js');
require('tar');
require('./createDistWorkspace-22a8caf6.cjs.js');
require('lodash/partition');
require('npm-packlist');

async function command(opts) {
  const role = await packageRoles.findRoleFromCommand(opts);
  if (role === "frontend") {
    return buildBackend.buildFrontend({
      targetDir: index.paths.targetDir,
      configPaths: opts.config,
      writeStats: Boolean(opts.stats)
    });
  }
  if (role === "backend") {
    return buildBackend.buildBackend({
      targetDir: index.paths.targetDir,
      skipBuildDependencies: Boolean(opts.skipBuildDependencies)
    });
  }
  const roleInfo = packageRoles.getRoleInfo(role);
  const outputs = /* @__PURE__ */ new Set();
  if (roleInfo.output.includes("cjs")) {
    outputs.add(packager.Output.cjs);
  }
  if (roleInfo.output.includes("esm")) {
    outputs.add(packager.Output.esm);
  }
  if (roleInfo.output.includes("types")) {
    outputs.add(packager.Output.types);
  }
  return packager.buildPackage({
    outputs,
    minify: Boolean(opts.minify),
    useApiExtractor: Boolean(opts.experimentalTypeBuild)
  });
}

exports.command = command;
//# sourceMappingURL=index-eb87de3b.cjs.js.map
