'use strict';

var commander = require('commander');
var chalk = require('chalk');
var os = require('os');
var fs = require('fs-extra');
var fetch = require('cross-fetch');
var handlebars = require('handlebars');
var killTree = require('tree-kill');
var path = require('path');
var puppeteer = require('puppeteer');
var errors = require('@backstage/errors');
var child_process = require('child_process');
var util = require('util');
var pgtools = require('pgtools');
var cliCommon = require('@backstage/cli-common');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var handlebars__default = /*#__PURE__*/_interopDefaultLegacy(handlebars);
var killTree__default = /*#__PURE__*/_interopDefaultLegacy(killTree);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var puppeteer__default = /*#__PURE__*/_interopDefaultLegacy(puppeteer);
var pgtools__default = /*#__PURE__*/_interopDefaultLegacy(pgtools);

const execFile = util.promisify(child_process.execFile);
function spawnPiped(cmd, options) {
  var _a, _b;
  function pipeWithPrefix(stream, prefix = "") {
    return (data) => {
      const prefixedMsg = data.toString("utf8").trimRight().replace(/^/gm, prefix);
      stream.write(`${prefixedMsg}
`, "utf8");
    };
  }
  const child = child_process.spawn(cmd[0], cmd.slice(1), {
    stdio: "pipe",
    shell: true,
    ...options
  });
  child.on("error", exitWithError);
  const logPrefix = cmd.map((s) => s.replace(/.+\//, "")).join(" ");
  (_a = child.stdout) == null ? void 0 : _a.on("data", pipeWithPrefix(process.stdout, `[${logPrefix}].out: `));
  (_b = child.stderr) == null ? void 0 : _b.on("data", pipeWithPrefix(process.stderr, `[${logPrefix}].err: `));
  return child;
}
async function runPlain(cmd, options) {
  try {
    const { stdout } = await execFile(cmd[0], cmd.slice(1), {
      ...options,
      shell: true
    });
    return stdout.trim();
  } catch (error) {
    errors.assertError(error);
    if (error.stdout) {
      process.stdout.write(error.stdout);
    }
    if (error.stderr) {
      process.stderr.write(error.stderr);
    }
    throw error;
  }
}
function exitWithError(err) {
  process.stdout.write(`${err.name}: ${err.stack || err.message}
`);
  if (typeof err.code === "number") {
    process.exit(err.code);
  } else {
    process.exit(1);
  }
}
function waitFor(fn, maxSeconds = 120) {
  let count = 0;
  return new Promise((resolve, reject) => {
    const handle = setInterval(() => {
      if (count++ > maxSeconds * 10) {
        reject(new Error("Timed out while waiting for condition"));
        return;
      }
      if (fn()) {
        clearInterval(handle);
        resolve();
        return;
      }
    }, 100);
  });
}
async function waitForExit(child) {
  if (child.exitCode !== null) {
    throw new Error(`Child already exited with code ${child.exitCode}`);
  }
  await new Promise((resolve, reject) => child.once("exit", (code) => {
    if (code) {
      reject(new Error(`Child exited with code ${code}`));
    } else {
      print("Child finished");
      resolve();
    }
  }));
}
async function waitForPageWithText(page, path, text, { intervalMs = 1e3, maxFindAttempts = 50 } = {}) {
  let findAttempts = 0;
  for (; ; ) {
    try {
      const waitTimeMs = intervalMs * (findAttempts + 1);
      console.log(`Attempting to load page at ${path}, waiting ${waitTimeMs}`);
      await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
      await page.goto(`http://localhost:3000${path}`, {
        waitUntil: "networkidle0"
      });
      const match = await page.evaluate((textContent) => Array.from(document.querySelectorAll("*")).some((el) => el.textContent === textContent), text);
      if (!match) {
        throw new Error(`Expected to find text ${text}`);
      }
      break;
    } catch (error) {
      console.log(error);
      errors.assertError(error);
      findAttempts++;
      if (findAttempts >= maxFindAttempts) {
        throw new Error(`Failed to load page '${path}', max number of attempts reached`);
      }
    }
  }
}
function print(msg) {
  return process.stdout.write(`${msg}
`);
}

const paths = cliCommon.findPaths(__dirname);
const templatePackagePaths = [
  "packages/cli/templates/default-plugin/package.json.hbs",
  "packages/create-app/templates/default-app/packages/app/package.json.hbs",
  "packages/create-app/templates/default-app/packages/backend/package.json.hbs"
];
async function run() {
  const rootDir = await fs__default["default"].mkdtemp(path.resolve(os__default["default"].tmpdir(), "backstage-e2e-"));
  print(`CLI E2E test root: ${rootDir}
`);
  print("Building dist workspace");
  const workspaceDir = await buildDistWorkspace("workspace", rootDir);
  print("Creating a Backstage App");
  const appDir = await createApp("test-app", workspaceDir, rootDir);
  print("Creating a Backstage Plugin");
  const pluginName = await createPlugin("test-plugin", appDir);
  print("Creating a Backstage Backend Plugin");
  await createPlugin("test-plugin", appDir, ["--backend"]);
  print("Starting the app");
  await testAppServe(pluginName, appDir);
  if (Boolean(process.env.POSTGRES_USER)) {
    print("Testing the PostgreSQL backend startup");
    await preCleanPostgres();
    const appConfig = path__default["default"].resolve(appDir, "app-config.yaml");
    const productionConfig = path__default["default"].resolve(appDir, "app-config.production.yaml");
    await testBackendStart(appDir, "--config", appConfig, "--config", productionConfig);
  }
  print("Testing the SQLite backend startup");
  await testBackendStart(appDir);
  if (process.env.CI) {
    print("All tests successful");
  } else {
    print("All tests successful, removing test dir");
    await fs__default["default"].remove(rootDir);
  }
  process.exit(0);
}
async function buildDistWorkspace(workspaceName, rootDir) {
  const workspaceDir = path.resolve(rootDir, workspaceName);
  await fs__default["default"].ensureDir(workspaceDir);
  const createAppDeps = /* @__PURE__ */ new Set();
  function appendDeps(pkg) {
    var _a, _b, _c;
    Array().concat(Object.keys((_a = pkg.dependencies) != null ? _a : {}), Object.keys((_b = pkg.devDependencies) != null ? _b : {}), Object.keys((_c = pkg.peerDependencies) != null ? _c : {})).filter((name) => name.startsWith("@backstage/")).forEach((dep) => createAppDeps.add(dep));
  }
  for (const pkgJsonPath of templatePackagePaths) {
    const jsonPath = paths.resolveOwnRoot(pkgJsonPath);
    const pkgTemplate = await fs__default["default"].readFile(jsonPath, "utf8");
    const pkg = JSON.parse(handlebars__default["default"].compile(pkgTemplate)({
      privatePackage: true,
      scopeName: "@backstage"
    }, {
      helpers: {
        version(name) {
          if (!name.startsWith("@backstage/")) {
            return "^0.0.0";
          }
          const pkge = require(`${name}/package.json`);
          if (!pkge) {
            throw new Error(`No version available for package ${name}`);
          }
          return pkge.version;
        },
        versionQuery(name, hint) {
          if (!name.startsWith("@backstage/")) {
            return "^0.0.0";
          }
          const pkgData = require(`${name}/package.json`);
          if (!pkgData) {
            if (typeof hint !== "string") {
              throw new Error(`No version available for package ${name}`);
            }
            return `^${hint}`;
          }
          return `^${pkgData.version}`;
        }
      }
    }));
    appendDeps(pkg);
  }
  appendDeps(require("@backstage/create-app/package.json"));
  print(`Preparing workspace`);
  await runPlain([
    "yarn",
    "backstage-cli",
    "build-workspace",
    workspaceDir,
    "@backstage/create-app",
    ...createAppDeps
  ]);
  print("Pinning yarn version in workspace");
  await pinYarnVersion(workspaceDir);
  print("Installing workspace dependencies");
  await runPlain(["yarn", "install", "--production", "--frozen-lockfile"], {
    cwd: workspaceDir
  });
  return workspaceDir;
}
async function pinYarnVersion(dir) {
  const yarnRc = await fs__default["default"].readFile(paths.resolveOwnRoot(".yarnrc"), "utf8");
  const yarnRcLines = yarnRc.split("\n");
  const yarnPathLine = yarnRcLines.find((line) => line.startsWith("yarn-path"));
  if (!yarnPathLine) {
    throw new Error(`Unable to find 'yarn-path' in ${yarnRc}`);
  }
  const match = yarnPathLine.match(/"(.*)"/);
  if (!match) {
    throw new Error(`Invalid 'yarn-path' in ${yarnRc}`);
  }
  const [, localYarnPath] = match;
  const yarnPath = paths.resolveOwnRoot(localYarnPath);
  await fs__default["default"].writeFile(path.resolve(dir, ".yarnrc"), `yarn-path "${yarnPath}"
`);
}
async function createApp(appName, workspaceDir, rootDir) {
  var _a, _b;
  const child = spawnPiped([
    "node",
    path.resolve(workspaceDir, "packages/create-app/bin/backstage-create-app"),
    "--skip-install"
  ], {
    cwd: rootDir
  });
  try {
    let stdout = "";
    (_a = child.stdout) == null ? void 0 : _a.on("data", (data) => {
      stdout = stdout + data.toString("utf8");
    });
    await waitFor(() => stdout.includes("Enter a name for the app"));
    (_b = child.stdin) == null ? void 0 : _b.write(`${appName}
`);
    print("Waiting for app create script to be done");
    await waitForExit(child);
    const appDir = path.resolve(rootDir, appName);
    print("Rewriting module resolutions of app to use workspace packages");
    await overrideModuleResolutions(appDir, workspaceDir);
    print("Pinning yarn version and registry in app");
    await pinYarnVersion(appDir);
    await fs__default["default"].writeFile(path.resolve(appDir, ".npmrc"), "registry=https://registry.npmjs.org/\n");
    print("Test app created");
    for (const cmd of [
      "install",
      "tsc:full",
      "build",
      "lint:all",
      "prettier:check",
      "test:all"
    ]) {
      print(`Running 'yarn ${cmd}' in newly created app`);
      await runPlain(["yarn", cmd], { cwd: appDir });
    }
    print(`Running 'yarn test:e2e:ci' in newly created app`);
    await runPlain(["yarn", "test:e2e:ci"], {
      cwd: path.resolve(appDir, "packages", "app"),
      env: {
        ...process.env,
        APP_CONFIG_app_baseUrl: '"http://localhost:3001"'
      }
    });
    return appDir;
  } finally {
    child.kill();
  }
}
async function overrideModuleResolutions(appDir, workspaceDir) {
  const pkgJsonPath = path.resolve(appDir, "package.json");
  const pkgJson = await fs__default["default"].readJson(pkgJsonPath);
  pkgJson.resolutions = pkgJson.resolutions || {};
  pkgJson.dependencies = pkgJson.dependencies || {};
  for (const dir of ["packages", "plugins"]) {
    const packageNames = await fs__default["default"].readdir(path.resolve(workspaceDir, dir));
    for (const pkgDir of packageNames) {
      const pkgPath = path.join("..", "workspace", dir, pkgDir);
      const { name } = await fs__default["default"].readJson(path.resolve(workspaceDir, dir, pkgDir, "package.json"));
      pkgJson.dependencies[name] = `file:${pkgPath}`;
      pkgJson.resolutions[name] = `file:${pkgPath}`;
      delete pkgJson.devDependencies[name];
    }
  }
  fs__default["default"].writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
}
async function createPlugin(pluginName, appDir, options = []) {
  var _a, _b;
  const child = spawnPiped(["yarn", "create-plugin", ...options], {
    cwd: appDir
  });
  try {
    let stdout = "";
    (_a = child.stdout) == null ? void 0 : _a.on("data", (data) => {
      stdout = stdout + data.toString("utf8");
    });
    await waitFor(() => stdout.includes("Enter an ID for the plugin"));
    (_b = child.stdin) == null ? void 0 : _b.write(`${pluginName}
`);
    print("Waiting for plugin create script to be done");
    await waitForExit(child);
    const canonicalName = options.includes("--backend") ? `${pluginName}-backend` : pluginName;
    const pluginDir = path.resolve(appDir, "plugins", canonicalName);
    for (const cmd of [["tsc"], ["lint"], ["test", "--no-watch"]]) {
      print(`Running 'yarn ${cmd.join(" ")}' in newly created plugin`);
      await runPlain(["yarn", ...cmd], { cwd: pluginDir });
    }
    return canonicalName;
  } finally {
    child.kill();
  }
}
async function testAppServe(pluginName, appDir) {
  const startApp = spawnPiped(["yarn", "start"], {
    cwd: appDir,
    env: {
      ...process.env,
      GITHUB_TOKEN: "abc"
    }
  });
  let successful = false;
  let browser;
  try {
    for (let attempts = 1; ; attempts++) {
      try {
        browser = await puppeteer__default["default"].launch();
        const page = await browser.newPage();
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
        await waitForPageWithText(page, "/", "My Company Catalog");
        await waitForPageWithText(page, `/${pluginName}`, `Welcome to ${pluginName}!`);
        print("Both App and Plugin loaded correctly");
        successful = true;
        break;
      } catch (error) {
        if (attempts >= 20) {
          throw new Error(`App serve test failed, ${error}`);
        }
        print(`App serve failed, trying again, ${error}`);
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      }
    }
  } finally {
    await new Promise((res, rej) => {
      killTree__default["default"](startApp.pid, (err) => err ? rej(err) : res());
    });
  }
  try {
    await waitForExit(startApp);
  } catch (error) {
    if (!successful) {
      throw error;
    }
  }
}
async function dropDB(database) {
  const config = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  };
  try {
    await pgtools__default["default"].dropdb(config, database);
  } catch (_) {
  }
}
async function preCleanPostgres() {
  print("Dropping old DBs");
  await Promise.all([
    "catalog",
    "scaffolder",
    "auth",
    "identity",
    "proxy",
    "techdocs",
    "search"
  ].map((name) => dropDB(`backstage_plugin_${name}`)));
  print("Created DBs");
}
async function testBackendStart(appDir, ...args) {
  var _a, _b;
  const child = spawnPiped(["yarn", "workspace", "backend", "start", ...args], {
    cwd: appDir,
    env: {
      ...process.env,
      GITHUB_TOKEN: "abc"
    }
  });
  let stdout = "";
  let stderr = "";
  (_a = child.stdout) == null ? void 0 : _a.on("data", (data) => {
    stdout = stdout + data.toString("utf8");
  });
  (_b = child.stderr) == null ? void 0 : _b.on("data", (data) => {
    stderr = stderr + data.toString("utf8");
  });
  let successful = false;
  const stdErrorHasErrors = (input) => {
    const lines = input.split("\n").filter(Boolean);
    return lines.filter((l) => !l.includes("Use of deprecated folder mapping") && !l.includes("Update this package.json to use a subpath") && !l.includes("(Use `node --trace-deprecation ...` to show where the warning was created)")).length !== 0;
  };
  try {
    await waitFor(() => stdout.includes("Listening on ") || stdErrorHasErrors(stderr));
    if (stdErrorHasErrors(stderr)) {
      print(`Expected stderr to be clean, got ${stderr}`);
      throw new Error(stderr);
    }
    print("Try to fetch entities from the backend");
    await fetch__default["default"]("http://localhost:7007/api/catalog/entities").then((res) => res.json());
    print("Entities fetched successfully");
    successful = true;
  } catch (error) {
    print("");
    throw new Error(`Backend failed to startup: ${error}`);
  } finally {
    print("Stopping the child process");
    await new Promise((res, rej) => {
      killTree__default["default"](child.pid, (err) => err ? rej(err) : res());
    });
  }
  try {
    await waitForExit(child);
  } catch (error) {
    if (!successful) {
      throw new Error(`Backend failed to startup: ${stderr}`);
    }
    print("Backend startup test finished successfully");
  }
}

function registerCommands(program) {
  program.command("run").description("Run e2e tests").action(run);
}

var version = "0.2.0";

async function main(argv) {
  commander.program.name("e2e-test").version(version);
  registerCommands(commander.program);
  commander.program.on("command:*", () => {
    console.log();
    console.log(chalk__default["default"].red(`Invalid command: ${commander.program.args.join(" ")}`));
    console.log();
    commander.program.outputHelp();
    process.exit(1);
  });
  commander.program.parse(argv);
}
process.on("unhandledRejection", (rejection) => {
  var _a, _b;
  if (rejection instanceof Error && ((_a = rejection == null ? void 0 : rejection.stack) == null ? void 0 : _a.includes("node_modules/jsdom/lib"))) {
    console.log(`Ignored error inside jsdom, ${(_b = rejection == null ? void 0 : rejection.stack) != null ? _b : rejection}`);
  } else {
    if (rejection instanceof Error) {
      exitWithError(rejection);
    } else {
      exitWithError(new Error(`Unknown rejection: '${rejection}'`));
    }
  }
});
main(process.argv).catch(exitWithError);
//# sourceMappingURL=index.cjs.js.map
