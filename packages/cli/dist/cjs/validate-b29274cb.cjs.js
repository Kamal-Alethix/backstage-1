'use strict';

var config = require('./config-0d75b175.cjs.js');
require('@backstage/config-loader');
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

var validate = async (opts) => {
  await config.loadCliConfig({
    args: opts.config,
    fromPackage: opts.package,
    mockEnv: opts.lax,
    fullVisibility: !opts.frontend,
    withDeprecatedKeys: opts.deprecated
  });
};

exports["default"] = validate;
//# sourceMappingURL=validate-b29274cb.cjs.js.map
