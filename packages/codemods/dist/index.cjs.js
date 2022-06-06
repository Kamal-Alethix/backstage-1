'use strict';

var commander = require('commander');
var chalk = require('chalk');
var path = require('path');
var child_process = require('child_process');
var cliCommon = require('@backstage/cli-common');
var os = require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

const codemods = [
  {
    name: "core-imports",
    description: "Updates @backstage/core imports to use @backstage/core-* imports instead."
  },
  {
    name: "extension-names",
    description: 'Adds a "name" property to all core extensions provided by plugins.'
  }
];

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

const paths = cliCommon.findPaths(__dirname);
function createCodemodAction(name) {
  return async (dirs, opts) => {
    const transformPath = path.relative(process.cwd(), paths.resolveOwn("transforms", `${name}.js`));
    const args = [
      "--parser=tsx",
      "--extensions=tsx,js,ts,tsx",
      "--transform",
      transformPath,
      "--ignore-pattern=**/node_modules/**"
    ];
    if (opts.dry) {
      args.push("--dry");
    }
    if (dirs.length) {
      args.push(...dirs);
    } else {
      args.push(".");
    }
    console.log(`Running jscodeshift with these arguments: ${args.join(" ")}`);
    let command;
    if (os.platform() === "win32") {
      command = "jscodeshift";
    } else {
      command = process.argv0;
      args.unshift(require.resolve(".bin/jscodeshift"));
    }
    const child = child_process.spawn(command, args, {
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        FORCE_COLOR: "true"
      }
    });
    if (typeof child.exitCode === "number") {
      if (child.exitCode) {
        throw new ExitCodeError(child.exitCode, name);
      }
      return;
    }
    await new Promise((resolve, reject) => {
      child.once("error", (error) => reject(error));
      child.once("exit", (code) => {
        if (code) {
          reject(new ExitCodeError(code, name));
        } else {
          resolve();
        }
      });
    });
  };
}

var version = "0.1.38";

async function main(argv) {
  commander.program.name("backstage-codemods").version(version);
  const applyCommand = commander.program.command("apply <codemod> [target-dirs...]").description("Apply a codemod to target directories, defaulting to the current directory");
  for (const codemod of codemods) {
    applyCommand.command(`${codemod.name} [target-dirs...]`).description(codemod.description).option("-d, --dry", "Dry run, no changes written to files").action(createCodemodAction(codemod.name));
  }
  commander.program.command("list").description("List available codemods").action(() => {
    const maxNameLength = Math.max(...codemods.map((m) => m.name.length));
    for (const codemod of codemods) {
      const paddedName = codemod.name.padEnd(maxNameLength, " ");
      console.log(`${paddedName} - ${codemod.description}`);
    }
  });
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
  if (rejection instanceof Error) {
    exitWithError(rejection);
  } else {
    exitWithError(new Error(`Unknown rejection: '${rejection}'`));
  }
});
main(process.argv).catch(exitWithError);
//# sourceMappingURL=index.cjs.js.map
