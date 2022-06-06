'use strict';

var configLoader = require('@backstage/config-loader');
var config = require('@backstage/config');
var index = require('./index-a5d56062.cjs.js');
var getPackages = require('@manypkg/get-packages');
var PackageGraph = require('./PackageGraph-89852111.cjs.js');

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function loadCliConfig(options) {
  const configTargets = [];
  options.args.forEach((arg) => {
    if (!isValidUrl(arg)) {
      configTargets.push({ path: index.paths.resolveTarget(arg) });
    }
  });
  const { packages } = await getPackages.getPackages(index.paths.targetDir);
  let localPackageNames;
  if (options.fromPackage) {
    if (packages.length) {
      const graph = PackageGraph.PackageGraph.fromPackages(packages);
      localPackageNames = Array.from(graph.collectPackageNames([options.fromPackage], (node) => {
        if (node.name === "@backstage/cli") {
          return void 0;
        }
        return node.localDependencies.keys();
      }));
    } else {
      localPackageNames = [options.fromPackage];
    }
  } else {
    localPackageNames = packages.map((p) => p.packageJson.name);
  }
  const schema = await configLoader.loadConfigSchema({
    dependencies: localPackageNames,
    packagePaths: [index.paths.resolveTargetRoot("package.json")]
  });
  const { appConfigs } = await configLoader.loadConfig({
    experimentalEnvFunc: options.mockEnv ? async (name) => process.env[name] || "x" : void 0,
    configRoot: index.paths.targetRoot,
    configTargets
  });
  process.stderr.write(`Loaded config from ${appConfigs.map((c) => c.context).join(", ")}
`);
  try {
    const frontendAppConfigs = schema.process(appConfigs, {
      visibility: options.fullVisibility ? ["frontend", "backend", "secret"] : ["frontend"],
      withFilteredKeys: options.withFilteredKeys,
      withDeprecatedKeys: options.withDeprecatedKeys
    });
    const frontendConfig = config.ConfigReader.fromConfigs(frontendAppConfigs);
    return {
      schema,
      appConfigs,
      frontendConfig,
      frontendAppConfigs
    };
  } catch (error) {
    const maybeSchemaError = error;
    if (maybeSchemaError.messages) {
      const messages = maybeSchemaError.messages.join("\n  ");
      throw new Error(`Configuration does not match schema

  ${messages}`);
    }
    throw error;
  }
}

exports.loadCliConfig = loadCliConfig;
//# sourceMappingURL=config-0d75b175.cjs.js.map
