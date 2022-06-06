'use strict';

var index = require('./index-a5d56062.cjs.js');
var os = require('os');
var run = require('./run-3d0b00b7.cjs.js');
var Lockfile = require('./Lockfile-48dc675e.cjs.js');
require('minimatch');
require('@manypkg/get-packages');
require('chalk');
require('commander');
require('fs-extra');
require('semver');
require('@backstage/cli-common');
require('@backstage/errors');
require('child_process');
require('util');
require('@yarnpkg/parsers');
require('@yarnpkg/lockfile');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var os__default = /*#__PURE__*/_interopDefaultLegacy(os);

var info = async () => {
  await new Promise(async () => {
    const yarnVersion = await run.runPlain("yarn --version");
    const isLocal = require("fs").existsSync(index.paths.resolveOwn("./src"));
    console.log(`OS:   ${os__default["default"].type} ${os__default["default"].release} - ${os__default["default"].platform}/${os__default["default"].arch}`);
    console.log(`node: ${process.version}`);
    console.log(`yarn: ${yarnVersion}`);
    console.log(`cli:  ${index.version$1} (${isLocal ? "local" : "installed"})`);
    console.log();
    console.log("Dependencies:");
    const lockfilePath = index.paths.resolveTargetRoot("yarn.lock");
    const lockfile = await Lockfile.Lockfile.load(lockfilePath);
    const deps = [...lockfile.keys()].filter((n) => n.startsWith("@backstage/"));
    const maxLength = Math.max(...deps.map((d) => d.length));
    for (const dep of deps) {
      const versions = new Set(lockfile.get(dep).map((i) => i.version));
      console.log(`  ${dep.padEnd(maxLength)} ${[...versions].join(", ")}`);
    }
  });
};

exports["default"] = info;
//# sourceMappingURL=info-7726f87a.cjs.js.map
