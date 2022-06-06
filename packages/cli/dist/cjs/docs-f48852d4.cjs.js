'use strict';

var configLoader = require('@backstage/config-loader');
var openBrowser = require('react-dev-utils/openBrowser');
var config = require('./config-0d75b175.cjs.js');
require('@backstage/config');
require('./index-a5d56062.cjs.js');
require('commander');
require('chalk');
require('fs-extra');
require('semver');
require('@backstage/cli-common');
require('@backstage/errors');
require('@manypkg/get-packages');
require('./PackageGraph-89852111.cjs.js');
require('path');
require('child_process');
require('util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var openBrowser__default = /*#__PURE__*/_interopDefaultLegacy(openBrowser);

const DOCS_URL = "https://config.backstage.io";
var docs = async (opts) => {
  const { schema: appSchemas } = await config.loadCliConfig({
    args: [],
    fromPackage: opts.package,
    mockEnv: true
  });
  const schema = configLoader.mergeConfigSchemas(appSchemas.serialize().schemas.map((_) => _.value));
  openBrowser__default["default"](`${DOCS_URL}#schema=${JSON.stringify(schema)}`);
};

exports["default"] = docs;
//# sourceMappingURL=docs-f48852d4.cjs.js.map
