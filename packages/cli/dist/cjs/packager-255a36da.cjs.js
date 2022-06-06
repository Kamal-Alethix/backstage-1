'use strict';

var fs = require('fs-extra');
var rollup = require('rollup');
var chalk = require('chalk');
var path = require('path');
var index = require('./index-a5d56062.cjs.js');
var commonjs = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');
var postcss = require('rollup-plugin-postcss');
var esbuild = require('rollup-plugin-esbuild');
var svgr = require('@svgr/rollup');
var dts = require('rollup-plugin-dts');
var json = require('@rollup/plugin-json');
var yaml = require('@rollup/plugin-yaml');
var rollupPluginutils = require('rollup-pluginutils');
var svgrTemplate = require('./svgrTemplate-550efce6.cjs.js');
var parallel = require('./parallel-8286d3fa.cjs.js');
var packageRoles = require('./packageRoles-d9141e1e.cjs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var commonjs__default = /*#__PURE__*/_interopDefaultLegacy(commonjs);
var resolve__default = /*#__PURE__*/_interopDefaultLegacy(resolve);
var postcss__default = /*#__PURE__*/_interopDefaultLegacy(postcss);
var esbuild__default = /*#__PURE__*/_interopDefaultLegacy(esbuild);
var svgr__default = /*#__PURE__*/_interopDefaultLegacy(svgr);
var dts__default = /*#__PURE__*/_interopDefaultLegacy(dts);
var json__default = /*#__PURE__*/_interopDefaultLegacy(json);
var yaml__default = /*#__PURE__*/_interopDefaultLegacy(yaml);

function forwardFileImports(options) {
  const filter = rollupPluginutils.createFilter(options.include, options.exclude);
  const exportedFiles = /* @__PURE__ */ new Set();
  const generatedFor = /* @__PURE__ */ new Set();
  return {
    name: "forward-file-imports",
    async generateBundle(outputOptions, bundle, isWrite) {
      if (!isWrite) {
        return;
      }
      const dir = outputOptions.dir || path.dirname(outputOptions.file);
      if (generatedFor.has(dir)) {
        return;
      }
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") {
          continue;
        }
        const chunk = output;
        if (!chunk.facadeModuleId) {
          continue;
        }
        generatedFor.add(dir);
        const srcRoot = path.dirname(chunk.facadeModuleId);
        await Promise.all(Array.from(exportedFiles).map(async (exportedFile) => {
          const outputPath = path.relative(srcRoot, exportedFile);
          const targetFile = path.resolve(dir, outputPath);
          await fs__default["default"].ensureDir(path.dirname(targetFile));
          await fs__default["default"].copyFile(exportedFile, targetFile);
        }));
        return;
      }
    },
    options(inputOptions) {
      const origExternal = inputOptions.external;
      const external = (id, importer, isResolved) => {
        if (typeof origExternal === "function" && origExternal(id, importer, isResolved)) {
          return true;
        }
        if (Array.isArray(origExternal) && origExternal.includes(id)) {
          return true;
        }
        if (!filter(id)) {
          return false;
        }
        if (!importer) {
          throw new Error(`Unknown importer of file module ${id}`);
        }
        const fullId = isResolved ? id : path.resolve(path.dirname(importer), id);
        exportedFiles.add(fullId);
        return true;
      };
      return { ...inputOptions, external };
    }
  };
}

var Output = /* @__PURE__ */ ((Output2) => {
  Output2[Output2["esm"] = 0] = "esm";
  Output2[Output2["cjs"] = 1] = "cjs";
  Output2[Output2["types"] = 2] = "types";
  return Output2;
})(Output || {});

function isFileImport(source) {
  if (source.startsWith(".")) {
    return true;
  }
  if (source.startsWith("/")) {
    return true;
  }
  if (source.match(/[a-z]:/i)) {
    return true;
  }
  return false;
}
async function makeRollupConfigs(options) {
  var _a;
  const configs = new Array();
  const targetDir = (_a = options.targetDir) != null ? _a : index.paths.targetDir;
  const onwarn = ({ code, message }) => {
    if (code === "EMPTY_BUNDLE") {
      return;
    }
    if (options.logPrefix) {
      console.log(options.logPrefix + message);
    } else {
      console.log(message);
    }
  };
  const distDir = path.resolve(targetDir, "dist");
  if (options.outputs.has(Output.cjs) || options.outputs.has(Output.esm)) {
    const output = new Array();
    const mainFields = ["module", "main"];
    if (options.outputs.has(Output.cjs)) {
      output.push({
        dir: distDir,
        entryFileNames: "index.cjs.js",
        chunkFileNames: "cjs/[name]-[hash].cjs.js",
        format: "commonjs",
        sourcemap: true
      });
    }
    if (options.outputs.has(Output.esm)) {
      output.push({
        dir: distDir,
        entryFileNames: "index.esm.js",
        chunkFileNames: "esm/[name]-[hash].esm.js",
        format: "module",
        sourcemap: true
      });
      mainFields.unshift("browser");
    }
    configs.push({
      input: path.resolve(targetDir, "src/index.ts"),
      output,
      onwarn,
      preserveEntrySignatures: "strict",
      external: (source, importer, isResolved) => Boolean(importer && !isResolved && !isFileImport(source)),
      plugins: [
        resolve__default["default"]({ mainFields }),
        commonjs__default["default"]({
          include: /node_modules/,
          exclude: [/\/[^/]+\.(?:stories|test)\.[^/]+$/]
        }),
        postcss__default["default"](),
        forwardFileImports({
          exclude: /\.icon\.svg$/,
          include: [
            /\.svg$/,
            /\.png$/,
            /\.gif$/,
            /\.jpg$/,
            /\.jpeg$/,
            /\.eot$/,
            /\.woff$/,
            /\.woff2$/,
            /\.ttf$/
          ]
        }),
        json__default["default"](),
        yaml__default["default"](),
        svgr__default["default"]({
          include: /\.icon\.svg$/,
          template: svgrTemplate.svgrTemplate
        }),
        esbuild__default["default"]({
          target: "es2019",
          minify: options.minify
        })
      ]
    });
  }
  if (options.outputs.has(Output.types) && !options.useApiExtractor) {
    const typesInput = index.paths.resolveTargetRoot("dist-types", path.relative(index.paths.targetRoot, targetDir), "src/index.d.ts");
    const declarationsExist = await fs__default["default"].pathExists(typesInput);
    if (!declarationsExist) {
      const path$1 = path.relative(targetDir, typesInput);
      throw new Error(`No declaration files found at ${path$1}, be sure to run ${chalk__default["default"].bgRed.white("yarn tsc")} to generate .d.ts files before packaging`);
    }
    configs.push({
      input: typesInput,
      output: {
        file: path.resolve(distDir, "index.d.ts"),
        format: "es"
      },
      external: [
        /\.css$/,
        /\.scss$/,
        /\.sass$/,
        /\.svg$/,
        /\.eot$/,
        /\.woff$/,
        /\.woff2$/,
        /\.ttf$/
      ],
      onwarn,
      plugins: [dts__default["default"]()]
    });
  }
  return configs;
}

async function buildTypeDefinitionsWorker(workerData, sendMessage) {
  try {
    require("@microsoft/api-extractor");
  } catch (error) {
    throw new Error("Failed to resolve @microsoft/api-extractor, it must best installed as a dependency of your project in order to use experimental type builds");
  }
  const { dirname } = require("path");
  const { entryPoints, workerConfigs, typescriptCompilerFolder } = workerData;
  const apiExtractor = require("@microsoft/api-extractor");
  const { Extractor, ExtractorConfig, CompilerState } = apiExtractor;
  const {
    PackageJsonLookup
  } = require("@rushstack/node-core-library/lib/PackageJsonLookup");
  const old = PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor;
  PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor = function tryGetPackageJsonFilePathForPatch(path) {
    if (path.includes("@material-ui") && !dirname(path).endsWith("@material-ui")) {
      return void 0;
    }
    return old.call(this, path);
  };
  let compilerState;
  for (const { extractorOptions, targetTypesDir } of workerConfigs) {
    const extractorConfig = ExtractorConfig.prepare(extractorOptions);
    if (!compilerState) {
      compilerState = CompilerState.create(extractorConfig, {
        additionalEntryPoints: entryPoints
      });
    }
    const extractorResult = Extractor.invoke(extractorConfig, {
      compilerState,
      localBuild: false,
      typescriptCompilerFolder,
      showVerboseMessages: false,
      showDiagnostics: false,
      messageCallback: (message) => {
        message.handled = true;
        sendMessage({ message, targetTypesDir });
      }
    });
    if (!extractorResult.succeeded) {
      throw new Error(`Type definition build completed with ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`);
    }
  }
}

const ignoredMessages = /* @__PURE__ */ new Set(["tsdoc-undefined-tag", "ae-forgotten-export"]);
async function buildTypeDefinitions(targetDirs = [index.paths.targetDir]) {
  const packageDirs = targetDirs.map((dir) => path.relative(index.paths.targetRoot, dir));
  const entryPoints = await Promise.all(packageDirs.map(async (dir) => {
    const entryPoint = index.paths.resolveTargetRoot("dist-types", dir, "src/index.d.ts");
    const declarationsExist = await fs__default["default"].pathExists(entryPoint);
    if (!declarationsExist) {
      throw new Error(`No declaration files found at ${entryPoint}, be sure to run ${chalk__default["default"].bgRed.white("yarn tsc")} to generate .d.ts files before packaging`);
    }
    return entryPoint;
  }));
  const workerConfigs = packageDirs.map((packageDir) => {
    const targetDir = index.paths.resolveTargetRoot(packageDir);
    const targetTypesDir = index.paths.resolveTargetRoot("dist-types", packageDir);
    const extractorOptions = {
      configObject: {
        mainEntryPointFilePath: path.resolve(targetTypesDir, "src/index.d.ts"),
        bundledPackages: [],
        compiler: {
          skipLibCheck: true,
          tsconfigFilePath: index.paths.resolveTargetRoot("tsconfig.json")
        },
        dtsRollup: {
          enabled: true,
          untrimmedFilePath: path.resolve(targetDir, "dist/index.alpha.d.ts"),
          betaTrimmedFilePath: path.resolve(targetDir, "dist/index.beta.d.ts"),
          publicTrimmedFilePath: path.resolve(targetDir, "dist/index.d.ts")
        },
        newlineKind: "lf",
        projectFolder: targetDir
      },
      configObjectFullPath: targetDir,
      packageJsonFullPath: path.resolve(targetDir, "package.json")
    };
    return { extractorOptions, targetTypesDir };
  });
  const typescriptDir = index.paths.resolveTargetRoot("node_modules/typescript");
  const hasTypescript = await fs__default["default"].pathExists(typescriptDir);
  const typescriptCompilerFolder = hasTypescript ? typescriptDir : void 0;
  await parallel.runWorkerThreads({
    threadCount: 1,
    workerData: {
      entryPoints,
      workerConfigs,
      typescriptCompilerFolder
    },
    worker: buildTypeDefinitionsWorker,
    onMessage: ({
      message,
      targetTypesDir
    }) => {
      if (ignoredMessages.has(message.messageId)) {
        return;
      }
      let text = `${message.text} (${message.messageId})`;
      if (message.sourceFilePath) {
        text += " at ";
        text += path.relative(targetTypesDir, message.sourceFilePath);
        if (message.sourceFileLine) {
          text += `:${message.sourceFileLine}`;
          if (message.sourceFileColumn) {
            text += `:${message.sourceFileColumn}`;
          }
        }
      }
      if (message.logLevel === "error") {
        console.error(chalk__default["default"].red(`Error: ${text}`));
      } else if (message.logLevel === "warning" || message.category === "Extractor") {
        console.warn(`Warning: ${text}`);
      } else {
        console.log(text);
      }
    }
  });
}

function formatErrorMessage(error) {
  var _a;
  let msg = "";
  if (error.code === "PLUGIN_ERROR") {
    if (error.plugin === "esbuild") {
      msg += `${error.message}`;
      if ((_a = error.errors) == null ? void 0 : _a.length) {
        msg += `

`;
        for (const { text, location } of error.errors) {
          const { line, column } = location;
          const path$1 = path.relative(index.paths.targetDir, error.id);
          const loc = chalk__default["default"].cyan(`${path$1}:${line}:${column}`);
          if (text === 'Unexpected "<"' && error.id.endsWith(".js")) {
            msg += `${loc}: ${text}, JavaScript files with JSX should use a .jsx extension`;
          } else {
            msg += `${loc}: ${text}`;
          }
        }
      }
    } else {
      msg += `(plugin ${error.plugin}) ${error}
`;
    }
  } else {
    if (error.loc) {
      const file = `${index.paths.resolveTarget(error.loc.file || error.id)}`;
      const pos = `${error.loc.line}:${error.loc.column}`;
      msg += `${file} [${pos}]
`;
    } else if (error.id) {
      msg += `${index.paths.resolveTarget(error.id)}
`;
    }
    msg += `${error}
`;
    if (error.url) {
      msg += `${chalk__default["default"].cyan(error.url)}
`;
    }
    if (error.frame) {
      msg += `${chalk__default["default"].dim(error.frame)}
`;
    }
  }
  return msg;
}
async function rollupBuild(config) {
  try {
    const bundle = await rollup.rollup(config);
    if (config.output) {
      for (const output of [config.output].flat()) {
        await bundle.generate(output);
        await bundle.write(output);
      }
    }
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
}
const buildPackage = async (options) => {
  try {
    const { resolutions } = await fs__default["default"].readJson(index.paths.resolveTargetRoot("package.json"));
    if (resolutions == null ? void 0 : resolutions.esbuild) {
      console.warn(chalk__default["default"].red('Your root package.json contains a "resolutions" entry for "esbuild". This was included in older @backstage/create-app templates in order to work around build issues that have since been fixed. Please remove the entry and run `yarn install`'));
    }
  } catch {
  }
  const rollupConfigs = await makeRollupConfigs(options);
  await fs__default["default"].remove(index.paths.resolveTarget("dist"));
  const buildTasks = rollupConfigs.map(rollupBuild);
  if (options.outputs.has(Output.types) && options.useApiExtractor) {
    buildTasks.push(buildTypeDefinitions());
  }
  await Promise.all(buildTasks);
};
const buildPackages = async (options) => {
  if (options.some((opt) => !opt.targetDir)) {
    throw new Error("targetDir must be set for all build options");
  }
  const rollupConfigs = await Promise.all(options.map(makeRollupConfigs));
  await Promise.all(options.map(({ targetDir }) => fs__default["default"].remove(path.resolve(targetDir, "dist"))));
  const buildTasks = rollupConfigs.flat().map((opts) => () => rollupBuild(opts));
  const typeDefinitionTargetDirs = options.filter(({ outputs, useApiExtractor }) => outputs.has(Output.types) && useApiExtractor).map((_) => _.targetDir);
  if (typeDefinitionTargetDirs.length > 0) {
    buildTasks.unshift(() => buildTypeDefinitions(typeDefinitionTargetDirs));
  }
  await parallel.runParallelWorkers({
    items: buildTasks,
    worker: async (task) => task()
  });
};
function getOutputsForRole(role) {
  const outputs = /* @__PURE__ */ new Set();
  for (const output of packageRoles.getRoleInfo(role).output) {
    if (output === "cjs") {
      outputs.add(Output.cjs);
    }
    if (output === "esm") {
      outputs.add(Output.esm);
    }
    if (output === "types") {
      outputs.add(Output.types);
    }
  }
  return outputs;
}

exports.Output = Output;
exports.buildPackage = buildPackage;
exports.buildPackages = buildPackages;
exports.getOutputsForRole = getOutputsForRole;
//# sourceMappingURL=packager-255a36da.cjs.js.map
