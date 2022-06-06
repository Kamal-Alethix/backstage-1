'use strict';

var commander = require('commander');
var chalk = require('chalk');
var inquirer = require('inquirer');
var path = require('path');
var cliCommon = require('@backstage/cli-common');
var os = require('os');
var fs = require('fs-extra');
var handlebars = require('handlebars');
var ora = require('ora');
var recursive = require('recursive-readdir');
var child_process = require('child_process');
var util = require('util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var handlebars__default = /*#__PURE__*/_interopDefaultLegacy(handlebars);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
var recursive__default = /*#__PURE__*/_interopDefaultLegacy(recursive);

class CustomError extends Error {
  get name() {
    return this.constructor.name;
  }
}
class ExitCodeError extends CustomError {
  constructor(code, command) {
    var __super = (...args) => {
      super(...args);
    };
    if (command) {
      __super(`Command '${command}' exited with code ${code}`);
    } else {
      __super(`Child exited with code ${code}`);
    }
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

var version$K = "1.3.0-next.1";

var version$J = "1.0.3-next.1";

var version$I = "0.13.6-next.1";

var version$H = "0.3.2-next.1";

var version$G = "1.0.3-next.0";

var version$F = "1.0.3-next.0";

var version$E = "0.17.2-next.1";

var version$D = "1.0.1";

var version$C = "1.0.3-next.0";

var version$B = "0.9.5-next.1";

var version$A = "1.0.3-next.0";

var version$z = "1.0.0";

var version$y = "1.1.1-next.1";

var version$x = "1.1.1-next.0";

var version$w = "0.2.15";

var version$v = "0.8.6-next.1";

var version$u = "0.3.33-next.1";

var version$t = "0.14.1-next.1";

var version$s = "1.2.1-next.1";

var version$r = "1.0.3-next.0";

var version$q = "1.1.1-next.1";

var version$p = "1.2.0-next.1";

var version$o = "0.2.18-next.1";

var version$n = "0.8.9-next.1";

var version$m = "0.3.6-next.1";

var version$l = "0.3.37-next.1";

var version$k = "0.5.6-next.1";

var version$j = "0.3.6-next.1";

var version$i = "0.5.6-next.1";

var version$h = "0.6.2-next.0";

var version$g = "0.4.2-next.0";

var version$f = "0.6.2-next.1";

var version$e = "0.2.27-next.0";

var version$d = "0.1.30-next.1";

var version$c = "1.3.0-next.1";

var version$b = "1.3.0-next.1";

var version$a = "0.8.2-next.1";

var version$9 = "0.2.1-next.0";

var version$8 = "0.5.3-next.1";

var version$7 = "0.3.4-next.1";

var version$6 = "0.6.2-next.1";

var version$5 = "0.5.13-next.1";

var version$4 = "1.1.2-next.1";

var version$3 = "1.0.1-next.1";

var version$2 = "1.0.1-next.1";

var version$1 = "1.1.2-next.1";

var version = "0.4.5-next.1";

const packageVersions = {
  root: version$K,
  "@backstage/app-defaults": version$J,
  "@backstage/backend-common": version$I,
  "@backstage/backend-tasks": version$H,
  "@backstage/catalog-client": version$G,
  "@backstage/catalog-model": version$F,
  "@backstage/cli": version$E,
  "@backstage/config": version$D,
  "@backstage/core-app-api": version$C,
  "@backstage/core-components": version$B,
  "@backstage/core-plugin-api": version$A,
  "@backstage/errors": version$z,
  "@backstage/integration-react": version$y,
  "@backstage/plugin-api-docs": version$v,
  "@backstage/plugin-app-backend": version$u,
  "@backstage/plugin-auth-backend": version$t,
  "@backstage/plugin-catalog": version$s,
  "@backstage/plugin-catalog-common": version$r,
  "@backstage/plugin-catalog-react": version$q,
  "@backstage/plugin-catalog-backend": version$p,
  "@backstage/plugin-catalog-graph": version$o,
  "@backstage/plugin-catalog-import": version$n,
  "@backstage/plugin-circleci": version$m,
  "@backstage/plugin-explore": version$l,
  "@backstage/plugin-github-actions": version$k,
  "@backstage/plugin-lighthouse": version$j,
  "@backstage/plugin-org": version$i,
  "@backstage/plugin-permission-common": version$h,
  "@backstage/plugin-permission-node": version$f,
  "@backstage/plugin-permission-react": version$g,
  "@backstage/plugin-proxy-backend": version$e,
  "@backstage/plugin-rollbar-backend": version$d,
  "@backstage/plugin-scaffolder": version$c,
  "@backstage/plugin-scaffolder-backend": version$b,
  "@backstage/plugin-search": version$a,
  "@backstage/plugin-search-react": version$9,
  "@backstage/plugin-search-backend": version$8,
  "@backstage/plugin-search-backend-module-pg": version$7,
  "@backstage/plugin-search-backend-node": version$6,
  "@backstage/plugin-tech-radar": version$5,
  "@backstage/plugin-techdocs": version$4,
  "@backstage/plugin-techdocs-react": version$3,
  "@backstage/plugin-techdocs-module-addons-contrib": version$2,
  "@backstage/plugin-techdocs-backend": version$1,
  "@backstage/plugin-user-settings": version,
  "@backstage/test-utils": version$x,
  "@backstage/theme": version$w
};

const TASK_NAME_MAX_LENGTH = 14;
const exec = util.promisify(child_process.exec);
class Task {
  static log(name = "") {
    process.stdout.write(`${chalk__default["default"].green(name)}
`);
  }
  static error(message = "") {
    process.stdout.write(`
${chalk__default["default"].red(message)}

`);
  }
  static section(name) {
    const title = chalk__default["default"].green(`${name}:`);
    process.stdout.write(`
 ${title}
`);
  }
  static exit(code = 0) {
    process.exit(code);
  }
  static async forItem(task, item, taskFunc) {
    const paddedTask = chalk__default["default"].green(task.padEnd(TASK_NAME_MAX_LENGTH));
    const spinner = ora__default["default"]({
      prefixText: chalk__default["default"].green(`  ${paddedTask}${chalk__default["default"].cyan(item)}`),
      spinner: "arc",
      color: "green"
    }).start();
    try {
      await taskFunc();
      spinner.succeed();
    } catch (error) {
      spinner.fail();
      throw error;
    }
  }
}
async function templatingTask(templateDir, destinationDir, context) {
  const files = await recursive__default["default"](templateDir).catch((error) => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });
  for (const file of files) {
    const destinationFile = path.resolve(destinationDir, path.relative(templateDir, file));
    await fs__default["default"].ensureDir(path.dirname(destinationFile));
    if (file.endsWith(".hbs")) {
      await Task.forItem("templating", path.basename(file), async () => {
        const destination = destinationFile.replace(/\.hbs$/, "");
        const template = await fs__default["default"].readFile(file);
        const compiled = handlebars__default["default"].compile(template.toString());
        const contents = compiled({ name: path.basename(destination), ...context }, {
          helpers: {
            version(name) {
              if (name in packageVersions) {
                return packageVersions[name];
              }
              throw new Error(`No version available for package ${name}`);
            }
          }
        });
        await fs__default["default"].writeFile(destination, contents).catch((error) => {
          throw new Error(`Failed to create file: ${destination}: ${error.message}`);
        });
      });
    } else {
      await Task.forItem("copying", path.basename(file), async () => {
        await fs__default["default"].copyFile(file, destinationFile).catch((error) => {
          const destination = destinationFile;
          throw new Error(`Failed to copy file to ${destination} : ${error.message}`);
        });
      });
    }
  }
}
async function checkAppExistsTask(rootDir, name) {
  await Task.forItem("checking", name, async () => {
    const destination = path.resolve(rootDir, name);
    if (await fs__default["default"].pathExists(destination)) {
      const existing = chalk__default["default"].cyan(destination.replace(`${rootDir}/`, ""));
      throw new Error(`A directory with the same name already exists: ${existing}
Please try again with a different app name`);
    }
  });
}
async function checkPathExistsTask(path) {
  await Task.forItem("checking", path, async () => {
    try {
      await fs__default["default"].mkdirs(path);
    } catch (error) {
      throw new Error(`Failed to create app directory: ${error.message}`);
    }
  });
}
async function createTemporaryAppFolderTask(tempDir) {
  await Task.forItem("creating", "temporary directory", async () => {
    try {
      await fs__default["default"].mkdir(tempDir);
    } catch (error) {
      throw new Error(`Failed to create temporary app directory, ${error}`);
    }
  });
}
async function buildAppTask(appDir) {
  const runCmd = async (cmd) => {
    await Task.forItem("executing", cmd, async () => {
      process.chdir(appDir);
      await exec(cmd).catch((error) => {
        process.stdout.write(error.stderr);
        process.stdout.write(error.stdout);
        throw new Error(`Could not execute command ${chalk__default["default"].cyan(cmd)}`);
      });
    });
  };
  await runCmd("yarn install");
  await runCmd("yarn tsc");
}
async function moveAppTask(tempDir, destination, id) {
  await Task.forItem("moving", id, async () => {
    await fs__default["default"].move(tempDir, destination).catch((error) => {
      throw new Error(`Failed to move app from ${tempDir} to ${destination}: ${error.message}`);
    }).finally(() => {
      fs__default["default"].removeSync(tempDir);
    });
  });
}

var createApp = async (opts) => {
  const paths = cliCommon.findPaths(__dirname);
  const answers = await inquirer__default["default"].prompt([
    {
      type: "input",
      name: "name",
      message: chalk__default["default"].blue("Enter a name for the app [required]"),
      validate: (value) => {
        if (!value) {
          return chalk__default["default"].red("Please enter a name for the app");
        } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
          return chalk__default["default"].red("App name must be lowercase and contain only letters, digits, and dashes.");
        }
        return true;
      }
    }
  ]);
  const templateDir = paths.resolveOwn("templates/default-app");
  const tempDir = path.resolve(os__default["default"].tmpdir(), answers.name);
  const appDir = opts.path ? path.resolve(paths.targetDir, opts.path) : path.resolve(paths.targetDir, answers.name);
  Task.log();
  Task.log("Creating the app...");
  try {
    if (opts.path) {
      Task.section("Checking that supplied path exists");
      await checkPathExistsTask(appDir);
      Task.section("Preparing files");
      await templatingTask(templateDir, opts.path, answers);
    } else {
      Task.section("Checking if the directory is available");
      await checkAppExistsTask(paths.targetDir, answers.name);
      Task.section("Creating a temporary app directory");
      await createTemporaryAppFolderTask(tempDir);
      Task.section("Preparing files");
      await templatingTask(templateDir, tempDir, answers);
      Task.section("Moving to final location");
      await moveAppTask(tempDir, appDir, answers.name);
    }
    if (!opts.skipInstall) {
      Task.section("Building the app");
      await buildAppTask(appDir);
    }
    Task.log();
    Task.log(chalk__default["default"].green(`\u{1F947}  Successfully created ${chalk__default["default"].cyan(answers.name)}`));
    Task.log();
    Task.section("All set! Now you might want to");
    Task.log(`  Run the app: ${chalk__default["default"].cyan(`cd ${answers.name} && yarn dev`)}`);
    Task.log("  Set up the software catalog: https://backstage.io/docs/features/software-catalog/configuration");
    Task.log("  Add authentication: https://backstage.io/docs/auth/");
    Task.log();
    Task.exit();
  } catch (error) {
    Task.error(String(error));
    Task.log("It seems that something went wrong when creating the app \u{1F914}");
    Task.error("\u{1F525}  Failed to create app!");
    Task.exit(1);
  }
};

const main = (argv) => {
  commander.program.name("backstage-create-app").version(version$K).description("Creates a new app in a new directory or specified path").option("--path [directory]", "Location to store the app defaulting to a new folder with the app name").option("--skip-install", "Skip the install and builds steps after creating the app").action((cmd) => createApp(cmd));
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
//# sourceMappingURL=index.cjs.js.map
