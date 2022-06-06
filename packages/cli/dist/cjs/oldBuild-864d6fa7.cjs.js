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

var oldBuild = async (opts) => {
  let outputs = /* @__PURE__ */ new Set();
  const { outputs: outputsStr } = opts;
  if (outputsStr) {
    for (const output of outputsStr.split(",")) {
      if (output in packager.Output) {
        outputs.add(packager.Output[output]);
      } else {
        throw new Error(`Unknown output format: ${output}`);
      }
    }
  } else {
    outputs = /* @__PURE__ */ new Set([packager.Output.types, packager.Output.esm, packager.Output.cjs]);
  }
  await packager.buildPackage({
    outputs,
    minify: opts.minify,
    useApiExtractor: opts.experimentalTypeBuild
  });
};

exports["default"] = oldBuild;
//# sourceMappingURL=oldBuild-864d6fa7.cjs.js.map
