'use strict';

var yn = require('yn');
var fs = require('fs-extra');
var path = require('path');
var webpack = require('webpack');
var FileSizeReporter = require('react-dev-utils/FileSizeReporter');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
var paths = require('./paths-fed28365.cjs.js');
var chalk = require('chalk');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var yn__default = /*#__PURE__*/_interopDefaultLegacy(yn);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var webpack__default = /*#__PURE__*/_interopDefaultLegacy(webpack);
var formatWebpackMessages__default = /*#__PURE__*/_interopDefaultLegacy(formatWebpackMessages);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
async function buildBundle(options) {
  const { statsJsonEnabled, schema: configSchema } = options;
  const paths$1 = paths.resolveBundlingPaths(options);
  const config = await paths.createConfig(paths$1, {
    ...options,
    checksEnabled: false,
    isDev: false,
    baseUrl: paths.resolveBaseUrl(options.frontendConfig)
  });
  const compiler = webpack__default["default"](config);
  const isCi = yn__default["default"](process.env.CI, { default: false });
  const previousFileSizes = await FileSizeReporter.measureFileSizesBeforeBuild(paths$1.targetDist);
  await fs__default["default"].emptyDir(paths$1.targetDist);
  if (paths$1.targetPublic) {
    await fs__default["default"].copy(paths$1.targetPublic, paths$1.targetDist, {
      dereference: true,
      filter: (file) => file !== paths$1.targetHtml
    });
  }
  if (configSchema) {
    await fs__default["default"].writeJson(path.resolve(paths$1.targetDist, ".config-schema.json"), configSchema.serialize(), { spaces: 2 });
  }
  const { stats } = await build(compiler, isCi).catch((error) => {
    console.log(chalk__default["default"].red("Failed to compile.\n"));
    throw new Error(`Failed to compile.
${error.message || error}`);
  });
  if (!stats) {
    throw new Error("No stats returned");
  }
  if (statsJsonEnabled) {
    await require("bfj").write(path.resolve(paths$1.targetDist, "bundle-stats.json"), stats.toJson());
  }
  FileSizeReporter.printFileSizesAfterBuild(stats, previousFileSizes, paths$1.targetDist, WARN_AFTER_BUNDLE_GZIP_SIZE, WARN_AFTER_CHUNK_GZIP_SIZE);
}
async function build(compiler, isCi) {
  var _a, _b;
  const stats = await new Promise((resolve, reject) => {
    compiler.run((err, buildStats) => {
      if (err) {
        if (err.message) {
          const { errors: errors2 } = formatWebpackMessages__default["default"]({
            errors: [err.message],
            warnings: new Array(),
            _showErrors: true,
            _showWarnings: true
          });
          throw new Error(errors2[0]);
        } else {
          reject(err);
        }
      } else {
        resolve(buildStats);
      }
    });
  });
  if (!stats) {
    throw new Error("No stats provided");
  }
  const serializedStats = stats.toJson({
    all: false,
    warnings: true,
    errors: true
  });
  const { errors, warnings } = formatWebpackMessages__default["default"]({
    errors: (_a = serializedStats.errors) == null ? void 0 : _a.map((e) => e.message ? e.message : e),
    warnings: (_b = serializedStats.warnings) == null ? void 0 : _b.map((e) => e.message ? e.message : e)
  });
  if (errors.length) {
    throw new Error(errors[0]);
  }
  if (isCi && warnings.length) {
    console.log(chalk__default["default"].yellow("\nTreating warnings as errors because process.env.CI = true.\n"));
    throw new Error(warnings.join("\n\n"));
  }
  return { stats };
}

exports.buildBundle = buildBundle;
//# sourceMappingURL=bundle-b7f6e748.cjs.js.map
