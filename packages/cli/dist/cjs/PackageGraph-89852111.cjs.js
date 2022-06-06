'use strict';

var path = require('path');
var getPackages = require('@manypkg/get-packages');
var index = require('./index-a5d56062.cjs.js');
var errors = require('@backstage/errors');
var child_process = require('child_process');
var util = require('util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const execFile = util.promisify(child_process.execFile);
async function runGit(...args) {
  var _a, _b;
  try {
    const { stdout } = await execFile("git", args, {
      shell: true,
      cwd: index.paths.targetRoot
    });
    return stdout.trim().split(/\r\n|\r|\n/);
  } catch (error) {
    errors.assertError(error);
    if (error.stderr || typeof error.code === "number") {
      const stderr = (_a = error.stderr) == null ? void 0 : _a.toString("utf8");
      const msg = (_b = stderr == null ? void 0 : stderr.trim()) != null ? _b : `with exit code ${error.code}`;
      throw new Error(`git ${args[0]} failed, ${msg}`);
    }
    throw new errors.ForwardedError("Unknown execution error", error);
  }
}
async function listChangedFiles(ref) {
  if (!ref) {
    throw new Error("ref is required");
  }
  let diffRef = ref;
  try {
    const [base] = await runGit("merge-base", "HEAD", ref);
    diffRef = base;
  } catch {
  }
  const tracked = await runGit("diff", "--name-only", diffRef);
  const untracked = await runGit("ls-files", "--others", "--exclude-standard");
  return Array.from(/* @__PURE__ */ new Set([...tracked, ...untracked]));
}

class PackageGraph extends Map {
  static async listTargetPackages() {
    const { packages } = await getPackages.getPackages(index.paths.targetDir);
    return packages;
  }
  static fromPackages(packages) {
    const graph = new PackageGraph();
    for (const pkg of packages) {
      const name = pkg.packageJson.name;
      const existingPkg = graph.get(name);
      if (existingPkg) {
        throw new Error(`Duplicate package name '${name}' at ${pkg.dir} and ${existingPkg.dir}`);
      }
      graph.set(name, {
        name,
        dir: pkg.dir,
        packageJson: pkg.packageJson,
        allLocalDependencies: /* @__PURE__ */ new Map(),
        publishedLocalDependencies: /* @__PURE__ */ new Map(),
        localDependencies: /* @__PURE__ */ new Map(),
        localDevDependencies: /* @__PURE__ */ new Map(),
        localOptionalDependencies: /* @__PURE__ */ new Map(),
        allLocalDependents: /* @__PURE__ */ new Map(),
        publishedLocalDependents: /* @__PURE__ */ new Map(),
        localDependents: /* @__PURE__ */ new Map(),
        localDevDependents: /* @__PURE__ */ new Map(),
        localOptionalDependents: /* @__PURE__ */ new Map()
      });
    }
    for (const node of graph.values()) {
      for (const depName of Object.keys(node.packageJson.dependencies || {})) {
        const depPkg = graph.get(depName);
        if (depPkg) {
          node.allLocalDependencies.set(depName, depPkg);
          node.publishedLocalDependencies.set(depName, depPkg);
          node.localDependencies.set(depName, depPkg);
          depPkg.allLocalDependents.set(node.name, node);
          depPkg.publishedLocalDependents.set(node.name, node);
          depPkg.localDependents.set(node.name, node);
        }
      }
      for (const depName of Object.keys(node.packageJson.devDependencies || {})) {
        const depPkg = graph.get(depName);
        if (depPkg) {
          node.allLocalDependencies.set(depName, depPkg);
          node.localDevDependencies.set(depName, depPkg);
          depPkg.allLocalDependents.set(node.name, node);
          depPkg.localDevDependents.set(node.name, node);
        }
      }
      for (const depName of Object.keys(node.packageJson.optionalDependencies || {})) {
        const depPkg = graph.get(depName);
        if (depPkg) {
          node.allLocalDependencies.set(depName, depPkg);
          node.publishedLocalDependencies.set(depName, depPkg);
          node.localOptionalDependencies.set(depName, depPkg);
          depPkg.allLocalDependents.set(node.name, node);
          depPkg.publishedLocalDependents.set(node.name, node);
          depPkg.localOptionalDependents.set(node.name, node);
        }
      }
    }
    return graph;
  }
  collectPackageNames(startingPackageNames, collectFn) {
    const targets = /* @__PURE__ */ new Set();
    const searchNames = startingPackageNames.slice();
    while (searchNames.length) {
      const name = searchNames.pop();
      if (targets.has(name)) {
        continue;
      }
      const node = this.get(name);
      if (!node) {
        throw new Error(`Package '${name}' not found`);
      }
      targets.add(name);
      const collected = collectFn(node);
      if (collected) {
        searchNames.push(...collected);
      }
    }
    return targets;
  }
  async listChangedPackages(options) {
    var _a, _b;
    const changedFiles = await listChangedFiles(options.ref);
    const dirMap = new Map(Array.from(this.values()).map((pkg) => [
      path__default["default"].relative(index.paths.targetRoot, pkg.dir).split(path__default["default"].sep).join(path__default["default"].posix.sep) + path__default["default"].posix.sep,
      pkg
    ]));
    const packageDirs = Array.from(dirMap.keys());
    const result = new Array();
    let searchIndex = 0;
    changedFiles.sort();
    packageDirs.sort();
    for (const packageDir of packageDirs) {
      while (searchIndex < changedFiles.length && changedFiles[searchIndex] < packageDir) {
        searchIndex += 1;
      }
      if ((_a = changedFiles[searchIndex]) == null ? void 0 : _a.startsWith(packageDir)) {
        searchIndex += 1;
        result.push(dirMap.get(packageDir));
        while ((_b = changedFiles[searchIndex]) == null ? void 0 : _b.startsWith(packageDir)) {
          searchIndex += 1;
        }
      }
    }
    return result;
  }
}

exports.PackageGraph = PackageGraph;
//# sourceMappingURL=PackageGraph-89852111.cjs.js.map
