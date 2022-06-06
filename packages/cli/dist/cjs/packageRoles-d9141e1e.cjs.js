'use strict';

var zod = require('zod');
var fs = require('fs-extra');
var index = require('./index-a5d56062.cjs.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

const packageRoleInfos = [
  {
    role: "frontend",
    platform: "web",
    output: ["bundle"]
  },
  {
    role: "backend",
    platform: "node",
    output: ["bundle"]
  },
  {
    role: "cli",
    platform: "node",
    output: ["cjs"]
  },
  {
    role: "web-library",
    platform: "web",
    output: ["types", "esm"]
  },
  {
    role: "node-library",
    platform: "node",
    output: ["types", "cjs"]
  },
  {
    role: "common-library",
    platform: "common",
    output: ["types", "esm", "cjs"]
  },
  {
    role: "frontend-plugin",
    platform: "web",
    output: ["types", "esm"]
  },
  {
    role: "frontend-plugin-module",
    platform: "web",
    output: ["types", "esm"]
  },
  {
    role: "backend-plugin",
    platform: "node",
    output: ["types", "cjs"]
  },
  {
    role: "backend-plugin-module",
    platform: "node",
    output: ["types", "cjs"]
  }
];
function getRoleInfo(role) {
  const roleInfo = packageRoleInfos.find((r) => r.role === role);
  if (!roleInfo) {
    throw new Error(`Unknown package role '${role}'`);
  }
  return roleInfo;
}
const readSchema = zod.z.object({
  name: zod.z.string().optional(),
  backstage: zod.z.object({
    role: zod.z.string().optional()
  }).optional()
});
function getRoleFromPackage(pkgJson) {
  const pkg = readSchema.parse(pkgJson);
  if (pkg.backstage) {
    const { role } = pkg.backstage;
    if (!role) {
      throw new Error(`Package ${pkg.name} must specify a role in the "backstage" field`);
    }
    return getRoleInfo(role).role;
  }
  return void 0;
}
async function findRoleFromCommand(opts) {
  var _a;
  if (opts.role) {
    return (_a = getRoleInfo(opts.role)) == null ? void 0 : _a.role;
  }
  const pkg = await fs__default["default"].readJson(index.paths.resolveTarget("package.json"));
  const info = getRoleFromPackage(pkg);
  if (!info) {
    throw new Error(`Target package must have 'backstage.role' set`);
  }
  return info;
}
const detectionSchema = zod.z.object({
  name: zod.z.string().optional(),
  scripts: zod.z.object({
    start: zod.z.string().optional(),
    build: zod.z.string().optional()
  }).optional(),
  publishConfig: zod.z.object({
    main: zod.z.string().optional(),
    types: zod.z.string().optional(),
    module: zod.z.string().optional()
  }).optional(),
  main: zod.z.string().optional(),
  types: zod.z.string().optional(),
  module: zod.z.string().optional()
});
function detectRoleFromPackage(pkgJson) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  const pkg = detectionSchema.parse(pkgJson);
  if ((_b = (_a = pkg.scripts) == null ? void 0 : _a.start) == null ? void 0 : _b.includes("app:serve")) {
    return "frontend";
  }
  if ((_d = (_c = pkg.scripts) == null ? void 0 : _c.build) == null ? void 0 : _d.includes("backend:bundle")) {
    return "backend";
  }
  if (((_e = pkg.name) == null ? void 0 : _e.includes("plugin-")) && ((_f = pkg.name) == null ? void 0 : _f.includes("-backend-module-"))) {
    return "backend-plugin-module";
  }
  if (((_g = pkg.name) == null ? void 0 : _g.includes("plugin-")) && ((_h = pkg.name) == null ? void 0 : _h.includes("-module-"))) {
    return "frontend-plugin-module";
  }
  if ((_j = (_i = pkg.scripts) == null ? void 0 : _i.start) == null ? void 0 : _j.includes("plugin:serve")) {
    return "frontend-plugin";
  }
  if ((_l = (_k = pkg.scripts) == null ? void 0 : _k.start) == null ? void 0 : _l.includes("backend:dev")) {
    return "backend-plugin";
  }
  const mainEntry = ((_m = pkg.publishConfig) == null ? void 0 : _m.main) || pkg.main;
  const moduleEntry = ((_n = pkg.publishConfig) == null ? void 0 : _n.module) || pkg.module;
  const typesEntry = ((_o = pkg.publishConfig) == null ? void 0 : _o.types) || pkg.types;
  if (typesEntry) {
    if (mainEntry && moduleEntry) {
      return "common-library";
    }
    if (moduleEntry || (mainEntry == null ? void 0 : mainEntry.endsWith(".esm.js"))) {
      return "web-library";
    }
    if (mainEntry) {
      return "node-library";
    }
  } else if (mainEntry) {
    return "cli";
  }
  return void 0;
}

exports.detectRoleFromPackage = detectRoleFromPackage;
exports.findRoleFromCommand = findRoleFromCommand;
exports.getRoleFromPackage = getRoleFromPackage;
exports.getRoleInfo = getRoleInfo;
//# sourceMappingURL=packageRoles-d9141e1e.cjs.js.map
