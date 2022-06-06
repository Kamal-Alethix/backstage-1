'use strict';

var commander = require('commander');
var chalk = require('chalk');
var fs = require('fs-extra');
var semver = require('semver');
var cliCommon = require('@backstage/cli-common');
var errors = require('@backstage/errors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var semver__default = /*#__PURE__*/_interopDefaultLegacy(semver);

class CustomError extends Error {
  get name() {
    return this.constructor.name;
  }
}
class ExitCodeError extends CustomError {
  constructor(code, command) {
    super(command ? `Command '${command}' exited with code ${code}` : `Child exited with code ${code}`);
    this.code = code;
  }
}
function exitWithError(error) {
  if (error instanceof ExitCodeError) {
    process.stderr.write(`
${chalk__default["default"].red(error.message)}

`);
    process.exit(error.code);
  } else {
    process.stderr.write(`
${chalk__default["default"].red(`${error}`)}

`);
    process.exit(1);
  }
}
class NotFoundError extends CustomError {
}

const paths = cliCommon.findPaths(__dirname);

var version$a = "0.13.6-next.1";

var version$9 = "0.17.2-next.1";
var dependencies = {
	"@backstage/cli-common": "^0.1.9",
	"@backstage/config": "^1.0.1",
	"@backstage/config-loader": "^1.1.2-next.0",
	"@backstage/errors": "^1.0.0",
	"@backstage/release-manifests": "^0.0.4-next.0",
	"@backstage/types": "^1.0.0",
	"@hot-loader/react-dom-v16": "npm:@hot-loader/react-dom@^16.0.2",
	"@hot-loader/react-dom-v17": "npm:@hot-loader/react-dom@^17.0.2",
	"@manypkg/get-packages": "^1.1.3",
	"@octokit/request": "^5.4.12",
	"@rollup/plugin-commonjs": "^22.0.0",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^13.0.0",
	"@rollup/plugin-yaml": "^3.1.0",
	"@spotify/eslint-config-base": "^13.0.0",
	"@spotify/eslint-config-react": "^13.0.0",
	"@spotify/eslint-config-typescript": "^13.0.0",
	"@sucrase/jest-plugin": "^2.1.1",
	"@sucrase/webpack-loader": "^2.0.0",
	"@svgr/plugin-jsx": "6.2.x",
	"@svgr/plugin-svgo": "6.2.x",
	"@svgr/rollup": "6.2.x",
	"@svgr/webpack": "6.2.x",
	"@types/webpack-env": "^1.15.2",
	"@typescript-eslint/eslint-plugin": "^5.9.0",
	"@typescript-eslint/parser": "^5.9.0",
	"@yarnpkg/lockfile": "^1.1.0",
	"@yarnpkg/parsers": "^3.0.0-rc.4",
	bfj: "^7.0.2",
	buffer: "^6.0.3",
	chalk: "^4.0.0",
	chokidar: "^3.3.1",
	commander: "^9.1.0",
	"css-loader": "^6.5.1",
	diff: "^5.0.0",
	esbuild: "^0.14.10",
	"esbuild-loader": "^2.18.0",
	eslint: "^8.6.0",
	"eslint-config-prettier": "^8.3.0",
	"eslint-formatter-friendly": "^7.0.0",
	"eslint-plugin-deprecation": "^1.3.2",
	"eslint-plugin-import": "^2.25.4",
	"eslint-plugin-jest": "^26.1.2",
	"eslint-plugin-jsx-a11y": "^6.5.1",
	"eslint-plugin-monorepo": "^0.3.2",
	"eslint-plugin-react": "^7.28.0",
	"eslint-plugin-react-hooks": "^4.3.0",
	"eslint-webpack-plugin": "^3.1.1",
	express: "^4.17.1",
	"fork-ts-checker-webpack-plugin": "^7.0.0-alpha.8",
	"fs-extra": "10.1.0",
	glob: "^7.1.7",
	"global-agent": "^3.0.0",
	handlebars: "^4.7.3",
	"html-webpack-plugin": "^5.3.1",
	inquirer: "^8.2.0",
	jest: "^27.5.1",
	"jest-runtime": "^27.5.1",
	"jest-css-modules": "^2.1.0",
	"jest-transform-yaml": "^1.0.0",
	"json-schema": "^0.4.0",
	lodash: "^4.17.21",
	"mini-css-extract-plugin": "^2.4.2",
	minimatch: "5.1.0",
	"node-fetch": "^2.6.7",
	"node-libs-browser": "^2.2.1",
	"npm-packlist": "^5.0.0",
	ora: "^5.3.0",
	postcss: "^8.1.0",
	process: "^0.11.10",
	"react-dev-utils": "^12.0.0-next.60",
	"react-hot-loader": "^4.13.0",
	"recursive-readdir": "^2.2.2",
	"replace-in-file": "^6.0.0",
	rollup: "^2.60.2",
	"rollup-plugin-dts": "^4.0.1",
	"rollup-plugin-esbuild": "^4.7.2",
	"rollup-plugin-postcss": "^4.0.0",
	"rollup-pluginutils": "^2.8.2",
	"run-script-webpack-plugin": "^0.0.14",
	semver: "^7.3.2",
	"style-loader": "^3.3.1",
	sucrase: "^3.20.2",
	tar: "^6.1.2",
	"terser-webpack-plugin": "^5.1.3",
	util: "^0.12.3",
	webpack: "^5.66.0",
	"webpack-dev-server": "^4.7.3",
	"webpack-node-externals": "^3.0.0",
	yaml: "^1.10.0",
	"yml-loader": "^2.1.0",
	yn: "^4.0.0",
	zod: "^3.11.6"
};
var devDependencies = {
	"@backstage/backend-common": "^0.13.6-next.1",
	"@backstage/config": "^1.0.1",
	"@backstage/core-app-api": "^1.0.3-next.0",
	"@backstage/core-components": "^0.9.5-next.1",
	"@backstage/core-plugin-api": "^1.0.3-next.0",
	"@backstage/dev-utils": "^1.0.3-next.1",
	"@backstage/test-utils": "^1.1.1-next.0",
	"@backstage/theme": "^0.2.15",
	"@types/diff": "^5.0.0",
	"@types/express": "^4.17.6",
	"@types/fs-extra": "^9.0.1",
	"@types/http-proxy": "^1.17.4",
	"@types/inquirer": "^8.1.3",
	"@types/minimatch": "^3.0.5",
	"@types/mock-fs": "^4.13.0",
	"@types/node": "^16.11.26",
	"@types/npm-packlist": "^3.0.0",
	"@types/recursive-readdir": "^2.2.0",
	"@types/rollup-plugin-peer-deps-external": "^2.2.0",
	"@types/rollup-plugin-postcss": "^3.1.4",
	"@types/svgo": "^2.6.2",
	"@types/tar": "^6.1.1",
	"@types/terser-webpack-plugin": "^5.0.4",
	"@types/yarnpkg__lockfile": "^1.1.4",
	del: "^6.0.0",
	"mock-fs": "^5.1.0",
	msw: "^0.42.0",
	nodemon: "^2.0.2",
	"ts-node": "^10.0.0"
};

var version$8 = "1.0.1";

var version$7 = "1.0.3-next.0";

var version$6 = "0.9.5-next.1";

var version$5 = "1.0.3-next.0";

var version$4 = "1.0.3-next.1";

var version$3 = "1.1.1-next.0";

var version$2 = "0.2.15";

var version$1 = "1.3.0-next.1";

const packageVersions = {
  "@backstage/backend-common": version$a,
  "@backstage/cli": version$9,
  "@backstage/config": version$8,
  "@backstage/core-app-api": version$7,
  "@backstage/core-components": version$6,
  "@backstage/core-plugin-api": version$5,
  "@backstage/dev-utils": version$4,
  "@backstage/test-utils": version$3,
  "@backstage/theme": version$2,
  "@backstage/plugin-scaffolder-backend": version$1
};
function findVersion() {
  const pkgContent = fs__default["default"].readFileSync(paths.resolveOwn("package.json"), "utf8");
  return JSON.parse(pkgContent).version;
}
const version = findVersion();
fs__default["default"].pathExistsSync(paths.resolveOwn("src"));
function createPackageVersionProvider(lockfile) {
  return (name, versionHint) => {
    var _a;
    const packageVersion = packageVersions[name];
    const targetVersion = versionHint || packageVersion;
    if (!targetVersion) {
      throw new Error(`No version available for package ${name}`);
    }
    const lockfileEntries = lockfile == null ? void 0 : lockfile.get(name);
    if (name.startsWith("@types/") && (lockfileEntries == null ? void 0 : lockfileEntries.some((entry) => entry.range === "*"))) {
      return "*";
    }
    const validRanges = lockfileEntries == null ? void 0 : lockfileEntries.filter((entry) => semver__default["default"].satisfies(targetVersion, entry.range));
    const highestRange = validRanges == null ? void 0 : validRanges.slice(-1)[0];
    if (highestRange == null ? void 0 : highestRange.range) {
      return highestRange == null ? void 0 : highestRange.range;
    }
    if (packageVersion) {
      return `^${packageVersion}`;
    }
    if ((_a = semver__default["default"].parse(versionHint)) == null ? void 0 : _a.prerelease.length) {
      return versionHint;
    }
    return (versionHint == null ? void 0 : versionHint.match(/^[\d\.]+$/)) ? `^${versionHint}` : versionHint;
  };
}

const configOption = [
  "--config <path>",
  "Config files to load instead of app-config.yaml",
  (opt, opts) => opts ? [...opts, opt] : [opt],
  Array()
];
function registerRepoCommand(program) {
  const command = program.command("repo [command]").description("Command that run across an entire Backstage project");
  command.command("build").description("Build packages in the project, excluding bundled app and backend packages.").option("--all", "Build all packages, including bundled app and backend packages.").option("--since <ref>", "Only build packages and their dev dependents that changed since the specified ref").action(lazy(() => Promise.resolve().then(function () { return require('./build-b21d11dc.cjs.js'); }).then((m) => m.command)));
  command.command("lint").description("Lint all packages in the project").option("--format <format>", "Lint report output format", "eslint-formatter-friendly").option("--since <ref>", "Only lint packages that changed since the specified ref").option("--fix", "Attempt to automatically fix violations").action(lazy(() => Promise.resolve().then(function () { return require('./lint-3510eb94.cjs.js'); }).then((m) => m.command)));
  command.command("list-deprecations", { hidden: true }).description("List deprecations. [EXPERIMENTAL]").option("--json", "Output as JSON").action(lazy(() => Promise.resolve().then(function () { return require('./list-deprecations-9b9f1219.cjs.js'); }).then((m) => m.command)));
}
function registerScriptCommand(program) {
  const command = program.command("package [command]").description("Lifecycle scripts for individual packages");
  command.command("start").description("Start a package for local development").option(...configOption).option("--role <name>", "Run the command with an explicit package role").option("--check", "Enable type checking and linting if available").option("--inspect", "Enable debugger in Node.js environments").option("--inspect-brk", "Enable debugger in Node.js environments, breaking before code starts").action(lazy(() => Promise.resolve().then(function () { return require('./index-7053ecd8.cjs.js'); }).then((m) => m.command)));
  command.command("build").description("Build a package for production deployment or publishing").option("--role <name>", "Run the command with an explicit package role").option("--minify", "Minify the generated code. Does not apply to app or backend packages.").option("--experimental-type-build", "Enable experimental type build. Does not apply to app or backend packages.").option("--skip-build-dependencies", "Skip the automatic building of local dependencies. Applies to backend packages only.").option("--stats", "If bundle stats are available, write them to the output directory. Applies to app packages only.").option("--config <path>", "Config files to load instead of app-config.yaml. Applies to app packages only.", (opt, opts) => opts ? [...opts, opt] : [opt], Array()).action(lazy(() => Promise.resolve().then(function () { return require('./index-eb87de3b.cjs.js'); }).then((m) => m.command)));
  command.command("lint [directories...]").option("--format <format>", "Lint report output format", "eslint-formatter-friendly").option("--fix", "Attempt to automatically fix violations").description("Lint a package").action(lazy(() => Promise.resolve().then(function () { return require('./lint-b7c189ac.cjs.js'); }).then((m) => m.default)));
  command.command("test").allowUnknownOption(true).helpOption(", --backstage-cli-help").description("Run tests, forwarding args to Jest, defaulting to watch mode").action(lazy(() => Promise.resolve().then(function () { return require('./test-d40d6d84.cjs.js'); }).then((m) => m.default)));
  command.command("fix", { hidden: true }).description("Applies automated fixes to the package. [EXPERIMENTAL]").option("--deps", "Only fix monorepo dependencies in package.json").action(lazy(() => Promise.resolve().then(function () { return require('./fix-807e0935.cjs.js'); }).then((m) => m.command)));
  command.command("clean").description("Delete cache directories").action(lazy(() => Promise.resolve().then(function () { return require('./clean-3b3ffa30.cjs.js'); }).then((m) => m.default)));
  command.command("prepack").description("Prepares a package for packaging before publishing").action(lazy(() => Promise.resolve().then(function () { return require('./pack-af68598a.cjs.js'); }).then((m) => m.pre)));
  command.command("postpack").description("Restores the changes made by the prepack command").action(lazy(() => Promise.resolve().then(function () { return require('./pack-af68598a.cjs.js'); }).then((m) => m.post)));
}
function registerMigrateCommand(program) {
  const command = program.command("migrate [command]").description("Migration utilities");
  command.command("package-roles").description(`Add package role field to packages that don't have it`).action(lazy(() => Promise.resolve().then(function () { return require('./packageRole-171a5797.cjs.js'); }).then((m) => m.default)));
  command.command("package-scripts").description("Set package scripts according to each package role").action(lazy(() => Promise.resolve().then(function () { return require('./packageScripts-e500e2cc.cjs.js'); }).then((m) => m.command)));
  command.command("package-lint-configs").description("Migrates all packages to use @backstage/cli/config/eslint-factory").action(lazy(() => Promise.resolve().then(function () { return require('./packageLintConfigs-feff4d05.cjs.js'); }).then((m) => m.command)));
}
function registerCommands(program) {
  program.command("app:build").description("Build an app for a production release [DEPRECATED]").option("--stats", "Write bundle stats to output directory").option(...configOption).action(lazy(() => Promise.resolve().then(function () { return require('./build-5b26243c.cjs.js'); }).then((m) => m.default)));
  program.command("app:serve").description("Serve an app for local development [DEPRECATED]").option("--check", "Enable type checking and linting").option(...configOption).action(lazy(() => Promise.resolve().then(function () { return require('./serve-480b380a.cjs.js'); }).then((m) => m.default)));
  program.command("backend:build").description("Build a backend plugin [DEPRECATED]").option("--minify", "Minify the generated code").option("--experimental-type-build", "Enable experimental type build").action(lazy(() => Promise.resolve().then(function () { return require('./build-30a50392.cjs.js'); }).then((m) => m.default)));
  program.command("backend:bundle").description("Bundle the backend into a deployment archive [DEPRECATED]").option("--build-dependencies", "Build all local package dependencies before bundling the backend").action(lazy(() => Promise.resolve().then(function () { return require('./bundle-4164d185.cjs.js'); }).then((m) => m.default)));
  program.command("backend:dev").description("Start local development server with HMR for the backend [DEPRECATED]").option("--check", "Enable type checking and linting").option("--inspect", "Enable debugger").option("--inspect-brk", "Enable debugger with await to attach debugger").option(...configOption).action(lazy(() => Promise.resolve().then(function () { return require('./dev-c50b4f38.cjs.js'); }).then((m) => m.default)));
  program.command("create").storeOptionsAsProperties(false).description("Open up an interactive guide to creating new things in your app").option("--select <name>", "Select the thing you want to be creating upfront").option("--option <name>=<value>", "Pre-fill options for the creation process", (opt, arr) => [...arr, opt], []).option("--scope <scope>", "The scope to use for new packages").option("--npm-registry <URL>", "The package registry to use for new packages").option("--no-private", "Do not mark new packages as private").action(lazy(() => Promise.resolve().then(function () { return require('./create-7541d142.cjs.js'); }).then((m) => m.default)));
  program.command("create-plugin").option("--backend", "Create plugin with the backend dependencies as default").description("Creates a new plugin in the current repository").option("--scope <scope>", "npm scope").option("--npm-registry <URL>", "npm registry URL").option("--no-private", "Public npm package").action(lazy(() => Promise.resolve().then(function () { return require('./createPlugin-41209fec.cjs.js'); }).then((m) => m.default)));
  program.command("plugin:build").description("Build a plugin [DEPRECATED]").option("--minify", "Minify the generated code").option("--experimental-type-build", "Enable experimental type build").action(lazy(() => Promise.resolve().then(function () { return require('./build-e62d3a47.cjs.js'); }).then((m) => m.default)));
  program.command("plugin:serve").description("Serves the dev/ folder of a plugin [DEPRECATED]").option("--check", "Enable type checking and linting").option(...configOption).action(lazy(() => Promise.resolve().then(function () { return require('./serve-ef4ecaff.cjs.js'); }).then((m) => m.default)));
  program.command("plugin:diff").option("--check", "Fail if changes are required").option("--yes", "Apply all changes").description("Diff an existing plugin with the creation template").action(lazy(() => Promise.resolve().then(function () { return require('./diff-d3552cdd.cjs.js'); }).then((m) => m.default)));
  program.command("build").description("Build a package for publishing [DEPRECATED]").option("--outputs <formats>", "List of formats to output [types,cjs,esm]").option("--minify", "Minify the generated code").option("--experimental-type-build", "Enable experimental type build").action(lazy(() => Promise.resolve().then(function () { return require('./oldBuild-864d6fa7.cjs.js'); }).then((m) => m.default)));
  program.command("lint [directories...]").option("--format <format>", "Lint report output format", "eslint-formatter-friendly").option("--fix", "Attempt to automatically fix violations").description("Lint a package [DEPRECATED]").action(lazy(() => Promise.resolve().then(function () { return require('./lint-b7c189ac.cjs.js'); }).then((m) => m.default)));
  program.command("test").allowUnknownOption(true).helpOption(", --backstage-cli-help").description("Run tests, forwarding args to Jest, defaulting to watch mode [DEPRECATED]").action(lazy(() => Promise.resolve().then(function () { return require('./test-d40d6d84.cjs.js'); }).then((m) => m.default)));
  program.command("config:docs").option("--package <name>", "Only include the schema that applies to the given package").description("Browse the configuration reference documentation").action(lazy(() => Promise.resolve().then(function () { return require('./docs-f48852d4.cjs.js'); }).then((m) => m.default)));
  program.command("config:print").option("--package <name>", "Only load config schema that applies to the given package").option("--lax", "Do not require environment variables to be set").option("--frontend", "Print only the frontend configuration").option("--with-secrets", "Include secrets in the printed configuration").option("--format <format>", "Format to print the configuration in, either json or yaml [yaml]").option(...configOption).description("Print the app configuration for the current package").action(lazy(() => Promise.resolve().then(function () { return require('./print-e302d7bc.cjs.js'); }).then((m) => m.default)));
  program.command("config:check").option("--package <name>", "Only load config schema that applies to the given package").option("--lax", "Do not require environment variables to be set").option("--frontend", "Only validate the frontend configuration").option("--deprecated", "Output deprecated configuration settings").option(...configOption).description("Validate that the given configuration loads and matches schema").action(lazy(() => Promise.resolve().then(function () { return require('./validate-b29274cb.cjs.js'); }).then((m) => m.default)));
  program.command("config:schema").option("--package <name>", "Only output config schema that applies to the given package").option("--format <format>", "Format to print the schema in, either json or yaml [yaml]").description("Print configuration schema").action(lazy(() => Promise.resolve().then(function () { return require('./schema-fc355904.cjs.js'); }).then((m) => m.default)));
  registerRepoCommand(program);
  registerScriptCommand(program);
  registerMigrateCommand(program);
  program.command("versions:bump").option("--pattern <glob>", "Override glob for matching packages to upgrade").option("--release <version|next|main>", "Bump to a specific Backstage release line or version", "main").description("Bump Backstage packages to the latest versions").action(lazy(() => Promise.resolve().then(function () { return require('./bump-9f978731.cjs.js'); }).then((m) => m.default)));
  program.command("versions:check").option("--fix", "Fix any auto-fixable versioning problems").description("Check Backstage package versioning").action(lazy(() => Promise.resolve().then(function () { return require('./lint-1d93fc0e.cjs.js'); }).then((m) => m.default)));
  program.command("prepack").description("Prepares a package for packaging before publishing [DEPRECATED]").action(lazy(() => Promise.resolve().then(function () { return require('./pack-af68598a.cjs.js'); }).then((m) => m.pre)));
  program.command("postpack").description("Restores the changes made by the prepack command [DEPRECATED]").action(lazy(() => Promise.resolve().then(function () { return require('./pack-af68598a.cjs.js'); }).then((m) => m.post)));
  program.command("clean").description("Delete cache directories [DEPRECATED]").action(lazy(() => Promise.resolve().then(function () { return require('./clean-3b3ffa30.cjs.js'); }).then((m) => m.default)));
  program.command("build-workspace <workspace-dir> [packages...]").description("Builds a temporary dist workspace from the provided packages").action(lazy(() => Promise.resolve().then(function () { return require('./buildWorkspace-ad4f3eb5.cjs.js'); }).then((m) => m.default)));
  program.command("create-github-app <github-org>").description("Create new GitHub App in your organization.").action(lazy(() => Promise.resolve().then(function () { return require('./index-be0f39da.cjs.js'); }).then((m) => m.default)));
  program.command("info").description("Show helpful information for debugging and reporting bugs").action(lazy(() => Promise.resolve().then(function () { return require('./info-7726f87a.cjs.js'); }).then((m) => m.default)));
  program.command("install [plugin-id]", { hidden: true }).option("--from <packageJsonFilePath>", "Install from a local package.json containing the installation recipe").description("Install a Backstage plugin [EXPERIMENTAL]").action(lazy(() => Promise.resolve().then(function () { return require('./install-d962d8ff.cjs.js'); }).then((m) => m.default)));
}
function lazy(getActionFunc) {
  return async (...args) => {
    try {
      const actionFunc = await getActionFunc();
      await actionFunc(...args);
      process.exit(0);
    } catch (error) {
      errors.assertError(error);
      exitWithError(error);
    }
  };
}

const main = (argv) => {
  commander.program.name("backstage-cli").version(version);
  registerCommands(commander.program);
  commander.program.on("command:*", () => {
    console.log();
    console.log(chalk__default["default"].red(`Invalid command: ${commander.program.args.join(" ")}`));
    console.log();
    commander.program.outputHelp();
    process.exit(1);
  });
  commander.program.parse(argv);
};
process.on("unhandledRejection", (rejection) => {
  if (rejection instanceof Error) {
    exitWithError(rejection);
  } else {
    exitWithError(new Error(`Unknown rejection: '${rejection}'`));
  }
});
main(process.argv);

exports.ExitCodeError = ExitCodeError;
exports.NotFoundError = NotFoundError;
exports.createPackageVersionProvider = createPackageVersionProvider;
exports.dependencies = dependencies;
exports.devDependencies = devDependencies;
exports.paths = paths;
exports.version = version;
exports.version$1 = version$9;
//# sourceMappingURL=index-a5d56062.cjs.js.map
