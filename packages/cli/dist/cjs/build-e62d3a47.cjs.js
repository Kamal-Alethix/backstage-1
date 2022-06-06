'use strict';

var packager = require('./packager-255a36da.cjs.js');
require('fs-extra');
require('rollup');
require('chalk');
require('path');
require('./index-a5d56062.cjs.js');
require('commander');
require('semver');
require('@backstage/cli-common');
require('@backstage/errors');
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
require('./packageRoles-d9141e1e.cjs.js');
require('zod');

var build = async (opts) => {
  await packager.buildPackage({
    outputs: /* @__PURE__ */ new Set([packager.Output.esm, packager.Output.types]),
    minify: opts.minify,
    useApiExtractor: opts.experimentalTypeBuild
  });
};

exports["default"] = build;
//# sourceMappingURL=build-e62d3a47.cjs.js.map
