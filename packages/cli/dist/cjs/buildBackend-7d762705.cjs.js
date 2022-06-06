'use strict';

var fs = require('fs-extra');
var path = require('path');
require('webpack');
require('fork-ts-checker-webpack-plugin');
require('html-webpack-plugin');
require('react-dev-utils/ModuleScopePlugin');
require('run-script-webpack-plugin');
require('webpack-node-externals');
require('@backstage/cli-common');
require('@manypkg/get-packages');
require('./paths-fed28365.cjs.js');
require('mini-css-extract-plugin');
require('./index-a5d56062.cjs.js');
require('./run-3d0b00b7.cjs.js');
require('eslint-webpack-plugin');
require('lodash/pickBy');
var bundle = require('./bundle-b7f6e748.cjs.js');
require('webpack-dev-server');
require('react-dev-utils/openBrowser');
var parallel = require('./parallel-8286d3fa.cjs.js');
var config = require('./config-0d75b175.cjs.js');
var os = require('os');
var tar = require('tar');
var createDistWorkspace = require('./createDistWorkspace-22a8caf6.cjs.js');
var packager = require('./packager-255a36da.cjs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var tar__default = /*#__PURE__*/_interopDefaultLegacy(tar);

async function buildFrontend(options) {
  const { targetDir, writeStats, configPaths } = options;
  const { name } = await fs__default["default"].readJson(path.resolve(targetDir, "package.json"));
  await bundle.buildBundle({
    targetDir,
    entry: "src/index",
    parallelism: parallel.getEnvironmentParallelism(),
    statsJsonEnabled: writeStats,
    ...await config.loadCliConfig({
      args: configPaths,
      fromPackage: name
    })
  });
}

const BUNDLE_FILE = "bundle.tar.gz";
const SKELETON_FILE = "skeleton.tar.gz";
async function buildBackend(options) {
  const { targetDir, skipBuildDependencies } = options;
  const pkg = await fs__default["default"].readJson(path.resolve(targetDir, "package.json"));
  await packager.buildPackage({
    targetDir: options.targetDir,
    outputs: /* @__PURE__ */ new Set([packager.Output.cjs])
  });
  const tmpDir = await fs__default["default"].mkdtemp(path.resolve(os__default["default"].tmpdir(), "backstage-bundle"));
  try {
    await createDistWorkspace.createDistWorkspace([pkg.name], {
      targetDir: tmpDir,
      buildDependencies: !skipBuildDependencies,
      buildExcludes: [pkg.name],
      parallelism: parallel.getEnvironmentParallelism(),
      skeleton: SKELETON_FILE
    });
    const distDir = path.resolve(targetDir, "dist");
    await fs__default["default"].remove(distDir);
    await fs__default["default"].mkdir(distDir);
    await fs__default["default"].move(path.resolve(tmpDir, SKELETON_FILE), path.resolve(distDir, SKELETON_FILE));
    await tar__default["default"].create({
      file: path.resolve(distDir, BUNDLE_FILE),
      cwd: tmpDir,
      portable: true,
      noMtime: true,
      gzip: true
    }, [""]);
  } finally {
    await fs__default["default"].remove(tmpDir);
  }
}

exports.buildBackend = buildBackend;
exports.buildFrontend = buildFrontend;
//# sourceMappingURL=buildBackend-7d762705.cjs.js.map
