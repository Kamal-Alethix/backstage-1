'use strict';

var chalk = require('chalk');
var path = require('path');
var packager = require('./packager-255a36da.cjs.js');
var PackageGraph = require('./PackageGraph-89852111.cjs.js');
var parallel = require('./parallel-8286d3fa.cjs.js');
var index = require('./index-a5d56062.cjs.js');
var packageRoles = require('./packageRoles-d9141e1e.cjs.js');
var buildBackend = require('./buildBackend-7d762705.cjs.js');
require('fs-extra');
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
require('@manypkg/get-packages');
require('@backstage/errors');
require('child_process');
require('util');
require('os');
require('worker_threads');
require('commander');
require('semver');
require('@backstage/cli-common');
require('zod');
require('webpack');
require('fork-ts-checker-webpack-plugin');
require('html-webpack-plugin');
require('react-dev-utils/ModuleScopePlugin');
require('run-script-webpack-plugin');
require('webpack-node-externals');
require('./paths-fed28365.cjs.js');
require('mini-css-extract-plugin');
require('./run-3d0b00b7.cjs.js');
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
require('tar');
require('./createDistWorkspace-22a8caf6.cjs.js');
require('lodash/partition');
require('npm-packlist');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

function createScriptOptionsParser(anyCmd, commandPath) {
  let rootCmd = anyCmd;
  while (rootCmd.parent) {
    rootCmd = rootCmd.parent;
  }
  let targetCmd = rootCmd;
  for (const name of commandPath) {
    targetCmd = targetCmd == null ? void 0 : targetCmd.commands.find((c) => c.name() === name);
  }
  if (!targetCmd) {
    throw new Error(`Could not find package command '${commandPath.join(" ")}'`);
  }
  const cmd = targetCmd;
  const expectedScript = `backstage-cli ${commandPath.join(" ")}`;
  return (scriptStr) => {
    if (!scriptStr || !scriptStr.startsWith(expectedScript)) {
      return void 0;
    }
    const argsStr = scriptStr.slice(expectedScript.length).trim();
    const currentOpts = cmd._optionValues;
    const currentStore = cmd._storeOptionsAsProperties;
    const result = {};
    cmd._storeOptionsAsProperties = false;
    cmd._optionValues = result;
    cmd.parseOptions(argsStr.split(" "));
    cmd._storeOptionsAsProperties = currentOpts;
    cmd._optionValues = currentStore;
    return result;
  };
}
async function command(opts, cmd) {
  let packages = await PackageGraph.PackageGraph.listTargetPackages();
  if (opts.since) {
    const graph = PackageGraph.PackageGraph.fromPackages(packages);
    const changedPackages = await graph.listChangedPackages({
      ref: opts.since
    });
    const withDevDependents = graph.collectPackageNames(changedPackages.map((pkg) => pkg.name), (pkg) => pkg.localDevDependents.keys());
    packages = Array.from(withDevDependents).map((name) => graph.get(name));
  }
  const apps = new Array();
  const backends = new Array();
  const parseBuildScript = createScriptOptionsParser(cmd, ["package", "build"]);
  const options = packages.flatMap((pkg) => {
    var _a, _b, _c;
    const role = (_b = (_a = pkg.packageJson.backstage) == null ? void 0 : _a.role) != null ? _b : packageRoles.detectRoleFromPackage(pkg.packageJson);
    if (!role) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no role`);
      return [];
    }
    if (role === "frontend") {
      apps.push(pkg);
      return [];
    } else if (role === "backend") {
      backends.push(pkg);
      return [];
    }
    const outputs = packager.getOutputsForRole(role);
    if (outputs.size === 0) {
      console.warn(`Ignored ${pkg.packageJson.name} because it has no output`);
      return [];
    }
    const buildOptions = parseBuildScript((_c = pkg.packageJson.scripts) == null ? void 0 : _c.build);
    if (!buildOptions) {
      console.warn(`Ignored ${pkg.packageJson.name} because it does not have a matching build script`);
      return [];
    }
    return {
      targetDir: pkg.dir,
      outputs,
      logPrefix: `${chalk__default["default"].cyan(path.relative(index.paths.targetRoot, pkg.dir))}: `,
      minify: buildOptions.minify,
      useApiExtractor: buildOptions.experimentalTypeBuild
    };
  });
  console.log("Building packages");
  await packager.buildPackages(options);
  if (opts.all) {
    console.log("Building apps");
    await parallel.runParallelWorkers({
      items: apps,
      parallelismFactor: 1 / 2,
      worker: async (pkg) => {
        var _a, _b;
        const buildOptions = parseBuildScript((_a = pkg.packageJson.scripts) == null ? void 0 : _a.build);
        if (!buildOptions) {
          console.warn(`Ignored ${pkg.packageJson.name} because it does not have a matching build script`);
          return;
        }
        await buildBackend.buildFrontend({
          targetDir: pkg.dir,
          configPaths: (_b = buildOptions.config) != null ? _b : [],
          writeStats: Boolean(buildOptions.stats)
        });
      }
    });
    console.log("Building backends");
    await parallel.runParallelWorkers({
      items: backends,
      parallelismFactor: 1 / 2,
      worker: async (pkg) => {
        var _a;
        const buildOptions = parseBuildScript((_a = pkg.packageJson.scripts) == null ? void 0 : _a.build);
        if (!buildOptions) {
          console.warn(`Ignored ${pkg.packageJson.name} because it does not have a matching build script`);
          return;
        }
        await buildBackend.buildBackend({
          targetDir: pkg.dir,
          skipBuildDependencies: true
        });
      }
    });
  }
}

exports.command = command;
//# sourceMappingURL=build-b21d11dc.cjs.js.map
