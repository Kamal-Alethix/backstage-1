'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginScaffolderBackend = require('@backstage/plugin-scaffolder-backend');

async function yeomanRun(workspace, namespace, args, opts) {
  const yeoman = require("yeoman-environment");
  const generator = yeoman.lookupGenerator(namespace);
  const env = yeoman.createEnv(void 0, { cwd: workspace });
  env.register(generator, namespace);
  const yeomanArgs = [namespace, ...args != null ? args : []];
  await env.run(yeomanArgs, opts);
}

function createRunYeomanAction() {
  return pluginScaffolderBackend.createTemplateAction({
    id: "run:yeoman",
    description: "Runs Yeoman on an installed Yeoman generator",
    schema: {
      input: {
        type: "object",
        required: ["namespace"],
        properties: {
          namespace: {
            title: "Generator Namespace",
            description: "Yeoman generator namespace, e.g: node:app",
            type: "string"
          },
          args: {
            title: "Generator Arguments",
            description: "Arguments to pass on to Yeoman for templating",
            type: "array",
            items: {
              type: "string"
            }
          },
          options: {
            title: "Generator Options",
            description: "Options to pass on to Yeoman for templating",
            type: "object"
          }
        }
      }
    },
    async handler(ctx) {
      ctx.logger.info(`Templating using Yeoman generator: ${ctx.input.namespace}`);
      await yeomanRun(ctx.workspacePath, ctx.input.namespace, ctx.input.args, ctx.input.options);
    }
  });
}

exports.createRunYeomanAction = createRunYeomanAction;
//# sourceMappingURL=index.cjs.js.map
