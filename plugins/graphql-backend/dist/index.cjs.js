'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendCommon = require('@backstage/backend-common');
var Router = require('express-promise-router');
var graphqlModules = require('graphql-modules');
var apolloServerExpress = require('apollo-server-express');
var pluginCatalogGraphql = require('@backstage/plugin-catalog-graphql');
var helmet = require('helmet');
var schema = require('@graphql-tools/schema');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);
var helmet__default = /*#__PURE__*/_interopDefaultLegacy(helmet);

async function createRouter(options) {
  const catalogModule = await pluginCatalogGraphql.createModule(options);
  const { createSchemaForApollo } = graphqlModules.createApplication({
    modules: [catalogModule],
    schemaBuilder(input) {
      return schema.makeExecutableSchema({
        ...input,
        inheritResolversFromInterfaces: true
      });
    }
  });
  const server = new apolloServerExpress.ApolloServer({
    schema: createSchemaForApollo(),
    logger: options.logger,
    introspection: true
  });
  await server.start();
  const router = Router__default["default"]();
  router.get("/health", (_, response) => {
    response.send({ status: "ok" });
  });
  const apolloMiddleware = server.getMiddleware({ path: "/" });
  if (process.env.NODE_ENV === "development")
    router.use(helmet__default["default"].contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", "'unsafe-inline'", "http://*"]
      }
    }));
  router.use(apolloMiddleware);
  router.use(backendCommon.errorHandler());
  return router;
}

exports.createRouter = createRouter;
//# sourceMappingURL=index.cjs.js.map
