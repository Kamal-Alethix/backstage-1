'use strict';

var fs = require('fs-extra');
var path = require('path');
var index = require('./index-a5d56062.cjs.js');
var chalk = require('chalk');
var handlebars = require('handlebars');
var ora = require('ora');
var util = require('util');
var recursive = require('recursive-readdir');
var child_process = require('child_process');
var errors = require('@backstage/errors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var handlebars__default = /*#__PURE__*/_interopDefaultLegacy(handlebars);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
var recursive__default = /*#__PURE__*/_interopDefaultLegacy(recursive);

const TEAM_ID_RE = /^@[-\w]+\/[-\w]+$/;
const USER_ID_RE = /^@[-\w]+$/;
const EMAIL_RE = /^[^@]+@[-.\w]+\.[-\w]+$/i;
const DEFAULT_OWNER = "@backstage/maintainers";
async function getCodeownersFilePath(rootDir) {
  const possiblePaths = [
    path__default["default"].join(rootDir, ".github", "CODEOWNERS"),
    path__default["default"].join(rootDir, ".gitlab", "CODEOWNERS"),
    path__default["default"].join(rootDir, "docs", "CODEOWNERS"),
    path__default["default"].join(rootDir, "CODEOWNERS")
  ];
  for (const p of possiblePaths) {
    if (await fs__default["default"].pathExists(p)) {
      return p;
    }
  }
  return void 0;
}
function isValidSingleOwnerId(id) {
  if (!id || typeof id !== "string") {
    return false;
  }
  return TEAM_ID_RE.test(id) || USER_ID_RE.test(id) || EMAIL_RE.test(id);
}
function parseOwnerIds(spaceSeparatedOwnerIds) {
  if (!spaceSeparatedOwnerIds || typeof spaceSeparatedOwnerIds !== "string") {
    return void 0;
  }
  const ids = spaceSeparatedOwnerIds.split(" ").filter(Boolean);
  if (!ids.every(isValidSingleOwnerId)) {
    return void 0;
  }
  return ids;
}
async function addCodeownersEntry(ownedPath, ownerStr, codeownersFilePath) {
  const ownerIds = parseOwnerIds(ownerStr);
  if (!ownerIds || ownerIds.length === 0) {
    return false;
  }
  let filePath = codeownersFilePath;
  if (!filePath) {
    filePath = await getCodeownersFilePath(index.paths.targetRoot);
    if (!filePath) {
      return false;
    }
  }
  const allLines = (await fs__default["default"].readFile(filePath, "utf8")).split("\n");
  const commentLines = [];
  for (const line of allLines) {
    if (line[0] !== "#") {
      break;
    }
    commentLines.push(line);
  }
  const oldDeclarationEntries = allLines.filter((line) => line[0] !== "#").map((line) => line.split(/\s+/).filter(Boolean)).filter((tokens) => tokens.length >= 2).map((tokens) => ({
    ownedPath: tokens[0],
    ownerIds: tokens.slice(1)
  }));
  const newDeclarationEntries = oldDeclarationEntries.filter((entry) => entry.ownedPath !== "*").concat([{ ownedPath, ownerIds }]).sort((l1, l2) => l1.ownedPath.localeCompare(l2.ownedPath));
  newDeclarationEntries.unshift({
    ownedPath: "*",
    ownerIds: [DEFAULT_OWNER]
  });
  const longestOwnedPath = newDeclarationEntries.reduce((length, entry) => Math.max(length, entry.ownedPath.length), 0);
  const newDeclarationLines = newDeclarationEntries.map((entry) => {
    const entryPath = entry.ownedPath + " ".repeat(longestOwnedPath - entry.ownedPath.length);
    return [entryPath, ...entry.ownerIds].join(" ");
  });
  const newLines = [...commentLines, "", ...newDeclarationLines, ""];
  await fs__default["default"].writeFile(filePath, newLines.join("\n"), "utf8");
  return true;
}

const exec = util.promisify(child_process.exec);
const TASK_NAME_MAX_LENGTH = 14;
class Task {
  static log(name = "") {
    process.stderr.write(`${chalk__default["default"].green(name)}
`);
  }
  static error(message = "") {
    process.stderr.write(`
${chalk__default["default"].red(message)}

`);
  }
  static section(name) {
    const title = chalk__default["default"].green(`${name}:`);
    process.stderr.write(`
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
      const result = await taskFunc();
      spinner.succeed();
      return result;
    } catch (error) {
      spinner.fail();
      throw error;
    }
  }
  static async forCommand(command, options) {
    try {
      await Task.forItem("executing", command, async () => {
        await exec(command, { cwd: options == null ? void 0 : options.cwd });
      });
    } catch (error) {
      errors.assertError(error);
      if (error.stderr) {
        process.stderr.write(error.stderr);
      }
      if (error.stdout) {
        process.stdout.write(error.stdout);
      }
      if (options == null ? void 0 : options.optional) {
        Task.error(`Warning: Failed to execute command ${chalk__default["default"].cyan(command)}`);
      } else {
        throw new Error(`Failed to execute command '${chalk__default["default"].cyan(command)}', ${error}`);
      }
    }
  }
}
async function templatingTask(templateDir, destinationDir, context, versionProvider) {
  const files = await recursive__default["default"](templateDir).catch((error) => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });
  const isMonoRepo = await fs__default["default"].pathExists(index.paths.resolveTargetRoot("lerna.json"));
  for (const file of files) {
    const destinationFile = file.replace(templateDir, destinationDir);
    await fs__default["default"].ensureDir(path.dirname(destinationFile));
    if (file.endsWith(".hbs")) {
      await Task.forItem("templating", path.basename(file), async () => {
        const destination = destinationFile.replace(/\.hbs$/, "");
        const template = await fs__default["default"].readFile(file);
        const compiled = handlebars__default["default"].compile(template.toString(), {
          strict: true
        });
        const contents = compiled({ name: path.basename(destination), ...context }, {
          helpers: {
            versionQuery(name, versionHint) {
              return versionProvider(name, typeof versionHint === "string" ? versionHint : void 0);
            }
          }
        });
        await fs__default["default"].writeFile(destination, contents).catch((error) => {
          throw new Error(`Failed to create file: ${destination}: ${error.message}`);
        });
      });
    } else {
      if (isMonoRepo && file.match("tsconfig.json")) {
        continue;
      }
      await Task.forItem("copying", path.basename(file), async () => {
        await fs__default["default"].copyFile(file, destinationFile).catch((error) => {
          const destination = destinationFile;
          throw new Error(`Failed to copy file to ${destination} : ${error.message}`);
        });
      });
    }
  }
}
async function addPackageDependency(path, options) {
  try {
    const pkgJson = await fs__default["default"].readJson(path);
    const normalize = (obj) => {
      if (Object.keys(obj).length === 0) {
        return void 0;
      }
      return Object.fromEntries(Object.keys(obj).sort().map((key) => [key, obj[key]]));
    };
    pkgJson.dependencies = normalize({
      ...pkgJson.dependencies,
      ...options.dependencies
    });
    pkgJson.devDependencies = normalize({
      ...pkgJson.devDependencies,
      ...options.devDependencies
    });
    pkgJson.peerDependencies = normalize({
      ...pkgJson.peerDependencies,
      ...options.peerDependencies
    });
    await fs__default["default"].writeJson(path, pkgJson, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to add package dependencies, ${error}`);
  }
}

exports.Task = Task;
exports.addCodeownersEntry = addCodeownersEntry;
exports.addPackageDependency = addPackageDependency;
exports.getCodeownersFilePath = getCodeownersFilePath;
exports.parseOwnerIds = parseOwnerIds;
exports.templatingTask = templatingTask;
//# sourceMappingURL=tasks-ff51899d.cjs.js.map
