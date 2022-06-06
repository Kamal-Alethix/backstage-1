'use strict';

var fs = require('fs-extra');
var createDistWorkspace = require('./createDistWorkspace-22a8caf6.cjs.js');
require('chalk');
require('path');
require('os');
require('tar');
require('lodash/partition');
require('./index-a5d56062.cjs.js');
require('commander');
require('semver');
require('@backstage/cli-common');
require('@backstage/errors');
require('./run-3d0b00b7.cjs.js');
require('child_process');
require('util');
require('./PackageGraph-89852111.cjs.js');
require('@manypkg/get-packages');
require('./packager-255a36da.cjs.js');
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
require('./parallel-8286d3fa.cjs.js');
require('worker_threads');
require('./packageRoles-d9141e1e.cjs.js');
require('zod');
require('npm-packlist');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

var buildWorkspace = async (dir, packages) => {
  if (!await fs__default["default"].pathExists(dir)) {
    throw new Error(`Target workspace directory doesn't exist, '${dir}'`);
  }
  await createDistWorkspace.createDistWorkspace(packages, {
    targetDir: dir
  });
};

exports["default"] = buildWorkspace;
//# sourceMappingURL=buildWorkspace-ad4f3eb5.cjs.js.map
