'use strict';

var yaml = require('yaml');
var config = require('./config-0d75b175.cjs.js');
var configLoader = require('@backstage/config-loader');
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

var schema = async (opts) => {
  const { schema } = await config.loadCliConfig({
    args: [],
    fromPackage: opts.package,
    mockEnv: true
  });
  const merged = configLoader.mergeConfigSchemas(schema.serialize().schemas.map((_) => _.value));
  merged.title = "Application Configuration Schema";
  merged.description = "This is the schema describing the structure of the app-config.yaml configuration file.";
  if (opts.format === "json") {
    process.stdout.write(`${JSON.stringify(merged, null, 2)}
`);
  } else {
    process.stdout.write(`${yaml.stringify(merged)}
`);
  }
};

exports["default"] = schema;
//# sourceMappingURL=schema-fc355904.cjs.js.map
