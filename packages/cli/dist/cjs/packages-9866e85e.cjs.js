'use strict';

var minimatch = require('minimatch');
var getPackages = require('@manypkg/get-packages');
var run = require('./run-3d0b00b7.cjs.js');
var index = require('./index-a5d56062.cjs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var minimatch__default = /*#__PURE__*/_interopDefaultLegacy(minimatch);

const DEP_TYPES = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
];
async function fetchPackageInfo(name) {
  const output = await run.runPlain("yarn", "info", "--json", name);
  if (!output) {
    throw new index.NotFoundError(`No package information found for package ${name}`);
  }
  const info = JSON.parse(output);
  if (info.type !== "inspect") {
    throw new Error(`Received unknown yarn info for ${name}, ${output}`);
  }
  return info.data;
}
async function mapDependencies(targetDir, pattern) {
  var _a;
  const { packages, root } = await getPackages.getPackages(targetDir);
  packages.push(root);
  const dependencyMap = /* @__PURE__ */ new Map();
  for (const pkg of packages) {
    const deps = DEP_TYPES.flatMap((t) => {
      var _a2;
      return Object.entries((_a2 = pkg.packageJson[t]) != null ? _a2 : {});
    });
    for (const [name, range] of deps) {
      if (minimatch__default["default"](name, pattern)) {
        dependencyMap.set(name, ((_a = dependencyMap.get(name)) != null ? _a : []).concat({
          range,
          name: pkg.packageJson.name,
          location: pkg.dir
        }));
      }
    }
  }
  return dependencyMap;
}

exports.fetchPackageInfo = fetchPackageInfo;
exports.mapDependencies = mapDependencies;
//# sourceMappingURL=packages-9866e85e.cjs.js.map
