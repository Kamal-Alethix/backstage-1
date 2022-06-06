'use strict';

var chalk = require('chalk');
var path = require('path');
var PackageGraph = require('./PackageGraph-89852111.cjs.js');
var parallel = require('./parallel-8286d3fa.cjs.js');
var index = require('./index-a5d56062.cjs.js');
require('@manypkg/get-packages');
require('@backstage/errors');
require('child_process');
require('util');
require('os');
require('worker_threads');
require('commander');
require('fs-extra');
require('semver');
require('@backstage/cli-common');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

function depCount(pkg) {
  const deps = pkg.dependencies ? Object.keys(pkg.dependencies).length : 0;
  const devDeps = pkg.devDependencies ? Object.keys(pkg.devDependencies).length : 0;
  return deps + devDeps;
}
async function command(opts) {
  let packages = await PackageGraph.PackageGraph.listTargetPackages();
  if (opts.since) {
    const graph = PackageGraph.PackageGraph.fromPackages(packages);
    packages = await graph.listChangedPackages({ ref: opts.since });
  }
  packages.sort((a, b) => depCount(b.packageJson) - depCount(a.packageJson));
  if (opts.format === "eslint-formatter-friendly") {
    process.chdir(index.paths.targetRoot);
  }
  if (!process.env.FORCE_COLOR) {
    process.env.FORCE_COLOR = "1";
  }
  const resultsList = await parallel.runWorkerQueueThreads({
    items: packages.map((pkg) => ({
      fullDir: pkg.dir,
      relativeDir: path.relative(index.paths.targetRoot, pkg.dir)
    })),
    workerData: {
      fix: Boolean(opts.fix),
      format: opts.format
    },
    workerFactory: async ({ fix, format }) => {
      const { ESLint } = require("eslint");
      return async ({
        fullDir,
        relativeDir
      }) => {
        process.cwd = () => fullDir;
        const start = Date.now();
        const eslint = new ESLint({
          cwd: fullDir,
          fix,
          extensions: ["js", "jsx", "ts", "tsx", "mjs", "cjs"]
        });
        const formatter = await eslint.loadFormatter(format);
        const results = await eslint.lintFiles(["."]);
        const count = String(results.length).padStart(3);
        const time = ((Date.now() - start) / 1e3).toFixed(2);
        console.log(`Checked ${count} files in ${relativeDir} ${time}s`);
        if (fix) {
          await ESLint.outputFixes(results);
        }
        const resultText = formatter.format(results);
        return { relativeDir, resultText };
      };
    }
  });
  let failed = false;
  for (const { relativeDir, resultText } of resultsList) {
    if (resultText) {
      console.log();
      console.log(chalk__default["default"].red(`Lint failed in ${relativeDir}:`));
      console.log(resultText.trimLeft());
      failed = true;
    }
  }
  if (failed) {
    process.exit(1);
  }
}

exports.command = command;
//# sourceMappingURL=lint-3510eb94.cjs.js.map
