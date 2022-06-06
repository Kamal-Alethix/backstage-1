'use strict';

var fs = require('fs-extra');
var index = require('./index-a5d56062.cjs.js');
var path = require('path');
require('commander');
require('chalk');
require('semver');
require('@backstage/cli-common');
require('@backstage/errors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

const SKIPPED_KEYS = ["access", "registry", "tag", "alphaTypes", "betaTypes"];
const PKG_PATH = "package.json";
const PKG_BACKUP_PATH = "package.json-prepack";
function resolveEntrypoint(pkg, name) {
  const targetEntry = pkg.publishConfig[name] || pkg[name];
  return targetEntry && path.join("..", targetEntry);
}
async function writeReleaseStageEntrypoint(pkg, stage) {
  await fs__default["default"].ensureDir(index.paths.resolveTarget(stage));
  await fs__default["default"].writeJson(index.paths.resolveTarget(stage, PKG_PATH), {
    name: pkg.name,
    version: pkg.version,
    main: resolveEntrypoint(pkg, "main"),
    module: resolveEntrypoint(pkg, "module"),
    browser: resolveEntrypoint(pkg, "browser"),
    types: path.join("..", pkg.publishConfig[`${stage}Types`])
  }, { encoding: "utf8", spaces: 2 });
}
const pre = async () => {
  var _a;
  const pkgPath = index.paths.resolveTarget(PKG_PATH);
  const pkgContent = await fs__default["default"].readFile(pkgPath, "utf8");
  const pkg = JSON.parse(pkgContent);
  await fs__default["default"].writeFile(PKG_BACKUP_PATH, pkgContent);
  const publishConfig = (_a = pkg.publishConfig) != null ? _a : {};
  for (const key of Object.keys(publishConfig)) {
    if (!SKIPPED_KEYS.includes(key)) {
      pkg[key] = publishConfig[key];
    }
  }
  await fs__default["default"].writeJson(pkgPath, pkg, { encoding: "utf8", spaces: 2 });
  if (publishConfig.alphaTypes) {
    await writeReleaseStageEntrypoint(pkg, "alpha");
  }
  if (publishConfig.betaTypes) {
    await writeReleaseStageEntrypoint(pkg, "beta");
  }
};
const post = async () => {
  var _a, _b;
  try {
    await fs__default["default"].move(PKG_BACKUP_PATH, PKG_PATH, { overwrite: true });
    const pkg = await fs__default["default"].readJson(PKG_PATH);
    if ((_a = pkg.publishConfig) == null ? void 0 : _a.alphaTypes) {
      await fs__default["default"].remove(index.paths.resolveTarget("alpha"));
    }
    if ((_b = pkg.publishConfig) == null ? void 0 : _b.betaTypes) {
      await fs__default["default"].remove(index.paths.resolveTarget("beta"));
    }
  } catch (error) {
    console.warn(`Failed to restore package.json during postpack, ${error}. Your package will be fine but you may have ended up with some garbage in the repo.`);
  }
};

exports.post = post;
exports.pre = pre;
//# sourceMappingURL=pack-af68598a.cjs.js.map
