'use strict';

var chalk = require('chalk');
var fs = require('fs-extra');
var path = require('path');
var os = require('os');
var tar = require('tar');
var partition = require('lodash/partition');
var index = require('./index-a5d56062.cjs.js');
var run = require('./run-3d0b00b7.cjs.js');
var PackageGraph = require('./PackageGraph-89852111.cjs.js');
var packager = require('./packager-255a36da.cjs.js');
var npmPackList = require('npm-packlist');
var packageRoles = require('./packageRoles-d9141e1e.cjs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var tar__default = /*#__PURE__*/_interopDefaultLegacy(tar);
var partition__default = /*#__PURE__*/_interopDefaultLegacy(partition);
var npmPackList__default = /*#__PURE__*/_interopDefaultLegacy(npmPackList);

const SKIPPED_KEYS = ["access", "registry", "tag", "alphaTypes", "betaTypes"];
function resolveEntrypoint(pkg, name) {
  const targetEntry = pkg.publishConfig[name] || pkg[name];
  return targetEntry && path.join("..", targetEntry);
}
async function writeReleaseStageEntrypoint(pkg, stage, targetDir) {
  await fs__default["default"].ensureDir(path.resolve(targetDir, stage));
  await fs__default["default"].writeJson(path.resolve(targetDir, stage, "package.json"), {
    name: pkg.name,
    version: pkg.version,
    main: resolveEntrypoint(pkg, "main"),
    module: resolveEntrypoint(pkg, "module"),
    browser: resolveEntrypoint(pkg, "browser"),
    types: path.join("..", pkg.publishConfig[`${stage}Types`])
  }, { encoding: "utf8", spaces: 2 });
}
async function copyPackageDist(packageDir, targetDir) {
  var _a;
  const pkgPath = path.resolve(packageDir, "package.json");
  const pkgContent = await fs__default["default"].readFile(pkgPath, "utf8");
  const pkg = JSON.parse(pkgContent);
  const publishConfig = (_a = pkg.publishConfig) != null ? _a : {};
  for (const key of Object.keys(publishConfig)) {
    if (!SKIPPED_KEYS.includes(key)) {
      pkg[key] = publishConfig[key];
    }
  }
  if (pkg.bundled) {
    delete pkg.dependencies;
    delete pkg.devDependencies;
    delete pkg.peerDependencies;
    delete pkg.optionalDependencies;
  }
  await fs__default["default"].writeJson(pkgPath, pkg, { encoding: "utf8", spaces: 2 });
  const filePaths = await npmPackList__default["default"]({ path: packageDir });
  await fs__default["default"].ensureDir(targetDir);
  for (const filePath of filePaths.sort()) {
    await fs__default["default"].copy(path.resolve(packageDir, filePath), path.resolve(targetDir, filePath));
  }
  if (publishConfig.alphaTypes) {
    await writeReleaseStageEntrypoint(pkg, "alpha", targetDir);
  }
  if (publishConfig.betaTypes) {
    await writeReleaseStageEntrypoint(pkg, "beta", targetDir);
  }
  await fs__default["default"].writeFile(pkgPath, pkgContent, "utf8");
}

const UNSAFE_PACKAGES = [
  ...Object.keys(index.dependencies),
  ...Object.keys(index.devDependencies)
];
async function createDistWorkspace(packageNames, options = {}) {
  var _a, _b, _c, _d, _e;
  const targetDir = (_a = options.targetDir) != null ? _a : await fs__default["default"].mkdtemp(path.resolve(os.tmpdir(), "dist-workspace"));
  const packages = await PackageGraph.PackageGraph.listTargetPackages();
  const packageGraph = PackageGraph.PackageGraph.fromPackages(packages);
  const targetNames = packageGraph.collectPackageNames(packageNames, (node) => {
    if (node.packageJson.bundled) {
      return void 0;
    }
    return node.publishedLocalDependencies.keys();
  });
  const targets = Array.from(targetNames).map((name) => packageGraph.get(name));
  if (options.buildDependencies) {
    const exclude = (_b = options.buildExcludes) != null ? _b : [];
    const toBuild = new Set(targets.map((_) => _.name).filter((name) => !exclude.includes(name)));
    const standardBuilds = new Array();
    const customBuild = new Array();
    for (const pkg of packages) {
      if (!toBuild.has(pkg.packageJson.name)) {
        continue;
      }
      const role = (_c = pkg.packageJson.backstage) == null ? void 0 : _c.role;
      if (!role) {
        console.warn(`Building ${pkg.packageJson.name} separately because it has no role`);
        customBuild.push(pkg.packageJson.name);
        continue;
      }
      const buildScript = (_d = pkg.packageJson.scripts) == null ? void 0 : _d.build;
      if (!buildScript) {
        customBuild.push(pkg.packageJson.name);
        continue;
      }
      if (!buildScript.startsWith("backstage-cli package build")) {
        console.warn(`Building ${pkg.packageJson.name} separately because it has a custom build script, '${buildScript}'`);
        customBuild.push(pkg.packageJson.name);
        continue;
      }
      if (packageRoles.getRoleInfo(role).output.includes("bundle")) {
        console.warn(`Building ${pkg.packageJson.name} separately because it is a bundled package`);
        customBuild.push(pkg.packageJson.name);
        continue;
      }
      const outputs = packager.getOutputsForRole(role);
      outputs.delete(packager.Output.types);
      if (outputs.size > 0) {
        standardBuilds.push({
          targetDir: pkg.dir,
          outputs,
          logPrefix: `${chalk__default["default"].cyan(path.relative(index.paths.targetRoot, pkg.dir))}: `,
          minify: false,
          useApiExtractor: false
        });
      }
    }
    await packager.buildPackages(standardBuilds);
    if (customBuild.length > 0) {
      const scopeArgs = customBuild.flatMap((name) => ["--scope", name]);
      const lernaArgs = options.parallelism && Number.isInteger(options.parallelism) ? ["--concurrency", options.parallelism.toString()] : [];
      await run.run("yarn", ["lerna", ...lernaArgs, "run", ...scopeArgs, "build"], {
        cwd: index.paths.targetRoot
      });
    }
  }
  await moveToDistWorkspace(targetDir, targets);
  const files = (_e = options.files) != null ? _e : ["yarn.lock", "package.json"];
  for (const file of files) {
    const src = typeof file === "string" ? file : file.src;
    const dest = typeof file === "string" ? file : file.dest;
    await fs__default["default"].copy(index.paths.resolveTargetRoot(src), path.resolve(targetDir, dest));
  }
  if (options.skeleton) {
    const skeletonFiles = targets.map((target) => {
      const dir = path.relative(index.paths.targetRoot, target.dir);
      return path.join(dir, "package.json");
    });
    await tar__default["default"].create({
      file: path.resolve(targetDir, options.skeleton),
      cwd: targetDir,
      portable: true,
      noMtime: true,
      gzip: options.skeleton.endsWith(".gz")
    }, skeletonFiles);
  }
  return targetDir;
}
const FAST_PACK_SCRIPTS = [
  void 0,
  "backstage-cli prepack",
  "backstage-cli package prepack"
];
async function moveToDistWorkspace(workspaceDir, localPackages) {
  const [fastPackPackages, slowPackPackages] = partition__default["default"](localPackages, (pkg) => {
    var _a;
    return FAST_PACK_SCRIPTS.includes((_a = pkg.packageJson.scripts) == null ? void 0 : _a.prepack);
  });
  await Promise.all(fastPackPackages.map(async (target) => {
    console.log(`Moving ${target.name} into dist workspace`);
    const outputDir = path.relative(index.paths.targetRoot, target.dir);
    const absoluteOutputPath = path.resolve(workspaceDir, outputDir);
    await copyPackageDist(target.dir, absoluteOutputPath);
  }));
  async function pack(target, archive) {
    var _a, _b;
    console.log(`Repacking ${target.name} into dist workspace`);
    const archivePath = path.resolve(workspaceDir, archive);
    await run.run("yarn", ["pack", "--filename", archivePath], {
      cwd: target.dir
    });
    if ((_b = (_a = target.packageJson) == null ? void 0 : _a.scripts) == null ? void 0 : _b.postpack) {
      await run.run("yarn", ["postpack"], { cwd: target.dir });
    }
    const outputDir = path.relative(index.paths.targetRoot, target.dir);
    const absoluteOutputPath = path.resolve(workspaceDir, outputDir);
    await fs__default["default"].ensureDir(absoluteOutputPath);
    await tar__default["default"].extract({
      file: archivePath,
      cwd: absoluteOutputPath,
      strip: 1
    });
    await fs__default["default"].remove(archivePath);
    if (target.packageJson.bundled) {
      const pkgJson = await fs__default["default"].readJson(path.resolve(absoluteOutputPath, "package.json"));
      delete pkgJson.dependencies;
      delete pkgJson.devDependencies;
      delete pkgJson.peerDependencies;
      delete pkgJson.optionalDependencies;
      await fs__default["default"].writeJson(path.resolve(absoluteOutputPath, "package.json"), pkgJson, {
        spaces: 2
      });
    }
  }
  const [unsafePackages, safePackages] = partition__default["default"](slowPackPackages, (p) => UNSAFE_PACKAGES.includes(p.name));
  for (const target of unsafePackages) {
    await pack(target, `temp-package.tgz`);
  }
  await Promise.all(safePackages.map(async (target, index) => pack(target, `temp-package-${index}.tgz`)));
}

exports.createDistWorkspace = createDistWorkspace;
//# sourceMappingURL=createDistWorkspace-22a8caf6.cjs.js.map
