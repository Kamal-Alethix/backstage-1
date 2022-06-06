'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var graphqlModules = require('graphql-modules');
var fetch = require('node-fetch');
var GraphQLJSON = require('graphql-type-json');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
var GraphQLJSON__default = /*#__PURE__*/_interopDefaultLegacy(GraphQLJSON);

class CatalogClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async list() {
    const res = await fetch__default["default"](`${this.baseUrl}/api/catalog/entities`);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const entities = await res.json();
    return entities;
  }
}

const schema = `
  scalar JSON
  scalar JSONObject

  interface EntityMetadata {
    name: String!
    annotations: JSONObject!
    annotation(name: String!): JSON
    labels: JSONObject!
    label(name: String!): JSON
    uid: String!
    etag: String!
  }

  type DefaultEntityMetadata implements EntityMetadata {
    name: String!
    annotations: JSONObject!
    annotation(name: String!): JSON
    labels: JSONObject!
    label(name: String!): JSON
    uid: String!
    etag: String!
  }

  type ComponentMetadata implements EntityMetadata {
    name: String!
    annotations: JSONObject!
    annotation(name: String!): JSON
    labels: JSONObject!
    label(name: String!): JSON
    uid: String!
    etag: String!
    # mock field to prove extensions working
    relationships: String
  }

  type TemplateMetadata implements EntityMetadata {
    name: String!
    annotations: JSONObject!
    annotation(name: String!): JSON
    labels: JSONObject!
    label(name: String!): JSON
    uid: String!
    etag: String!
    # mock field to prove extensions working
    updatedBy: String
  }

  # TODO: move this definition into plugin-scaffolder-graphql
  type TemplateEntitySpec {
    type: String!
    path: String
    schema: JSONObject!
    templater: String!
  }

  type ComponentEntitySpec {
    type: String!
    lifecycle: String!
    owner: String!
  }

  type DefaultEntitySpec {
    raw: JSONObject
  }

  union EntitySpec =
      DefaultEntitySpec
    | TemplateEntitySpec
    | ComponentEntitySpec

  type CatalogEntity {
    apiVersion: String!
    kind: String!
    metadata: EntityMetadata
    spec: EntitySpec!
  }

  type CatalogQuery {
    list: [CatalogEntity!]!
  }

  type Query {
    catalog: CatalogQuery!
  }
`;

async function createModule(options) {
  const catalogClient = new CatalogClient(options.config.getString("backend.baseUrl"));
  const resolvers = {
    JSON: GraphQLJSON__default["default"],
    JSONObject: GraphQLJSON.GraphQLJSONObject,
    DefaultEntitySpec: {
      raw: (rootValue) => {
        var _a;
        const { entity } = rootValue;
        return (_a = entity.spec) != null ? _a : null;
      }
    },
    Query: {
      catalog: () => ({})
    },
    CatalogQuery: {
      list: async () => {
        return await catalogClient.list();
      }
    },
    CatalogEntity: {
      metadata: (entity) => ({ ...entity.metadata, entity }),
      spec: (entity) => ({ ...entity.spec, entity })
    },
    EntityMetadata: {
      __resolveType: (rootValue) => {
        const {
          entity: { kind }
        } = rootValue;
        switch (kind) {
          case "Component":
            return "ComponentMetadata";
          case "Template":
            return "TemplateMetadata";
          default:
            return "DefaultEntityMetadata";
        }
      },
      annotation: (e, { name }) => {
        var _a, _b;
        return (_b = (_a = e.annotations) == null ? void 0 : _a[name]) != null ? _b : null;
      },
      labels: (e) => {
        var _a;
        return (_a = e.labels) != null ? _a : {};
      },
      annotations: (e) => {
        var _a;
        return (_a = e.annotations) != null ? _a : {};
      },
      label: (e, { name }) => {
        var _a, _b;
        return (_b = (_a = e.labels) == null ? void 0 : _a[name]) != null ? _b : null;
      }
    },
    EntitySpec: {
      __resolveType: (rootValue) => {
        const {
          entity: { kind }
        } = rootValue;
        switch (kind) {
          case "Component":
            return "ComponentEntitySpec";
          case "Template":
            return "TemplateEntitySpec";
          default:
            return "DefaultEntitySpec";
        }
      }
    }
  };
  return graphqlModules.createModule({
    id: "plugin-catalog-graphql",
    typeDefs: graphqlModules.gql(schema),
    resolvers
  });
}

exports.createModule = createModule;
//# sourceMappingURL=index.cjs.js.map
