'use strict';

var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var tar = require('tar');
var createDistWorkspace = require('./createDistWorkspace-22a8caf6.cjs.js');
var index = require('./index-a5d56062.cjs.js');
var parallel = require('./parallel-8286d3fa.cjs.js');
var packager = require('./packager-255a36da.cjs.js');
require('chalk');
require('lodash/partition');
require('./run-3d0b00b7.cjs.js');
require('child_process');
require('util');
require('@backstage/errors');
require('./PackageGraph-89852111.cjs.js');
require('@manypkg/get-packages');
require('npm-packlist');
require('./packageRoles-d9141e1e.cjs.js');
require('zod');
require('commander');
require('semver');
require('@backstage/cli-common');
require('worker_threads');
require('rollup');
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

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var tar__default = /*#__PURE__*/_interopDefaultLegacy(tar);

const BUNDLE_FILE = "bundle.tar.gz";
const SKELETON_FILE = "skeleton.tar.gz";
var bundle = async (opts) => {
  const targetDir = index.paths.resolveTarget("dist");
  const pkg = await fs__default["default"].readJson(index.paths.resolveTarget("package.json"));
  await packager.buildPackage({ outputs: /* @__PURE__ */ new Set([packager.Output.cjs]) });
  const tmpDir = await fs__default["default"].mkdtemp(path.resolve(os__default["default"].tmpdir(), "backstage-bundle"));
  try {
    await createDistWorkspace.createDistWorkspace([pkg.name], {
      targetDir: tmpDir,
      buildDependencies: Boolean(opts.buildDependencies),
      buildExcludes: [pkg.name],
      parallelism: parallel.getEnvironmentParallelism(),
      skeleton: SKELETON_FILE
    });
    await fs__default["default"].remove(targetDir);
    await fs__default["default"].mkdir(targetDir);
    await fs__default["default"].move(path.resolve(tmpDir, SKELETON_FILE), path.resolve(targetDir, SKELETON_FILE));
    await tar__default["default"].create({
      file: path.resolve(targetDir, BUNDLE_FILE),
      cwd: tmpDir,
      portable: true,
      noMtime: true,
      gzip: true
    }, [""]);
  } finally {
    await fs__default["default"].remove(tmpDir);
  }
};

exports["default"] = bundle;
//# sourceMappingURL=bundle-4164d185.cjs.js.map
