'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginPermissionCommon = require('@backstage/plugin-permission-common');
var express = require('express');
var Router = require('express-promise-router');
var zod = require('zod');
var errors = require('@backstage/errors');
var backendCommon = require('@backstage/backend-common');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var Router__default = /*#__PURE__*/_interopDefaultLegacy(Router);

const createConditionFactory = (rule) => (...params) => ({
  rule: rule.name,
  resourceType: rule.resourceType,
  params
});

const createConditionExports = (options) => {
  const { pluginId, resourceType, rules } = options;
  return {
    conditions: Object.entries(rules).reduce((acc, [key, rule]) => ({
      ...acc,
      [key]: createConditionFactory(rule)
    }), {}),
    createConditionalDecision: (_permission, conditions) => ({
      result: pluginPermissionCommon.AuthorizeResult.CONDITIONAL,
      pluginId,
      resourceType,
      conditions
    })
  };
};

const isAndCriteria = (criteria) => Object.prototype.hasOwnProperty.call(criteria, "allOf");
const isOrCriteria = (criteria) => Object.prototype.hasOwnProperty.call(criteria, "anyOf");
const isNotCriteria = (criteria) => Object.prototype.hasOwnProperty.call(criteria, "not");
const createGetRule = (rules) => {
  const rulesMap = new Map(Object.values(rules).map((rule) => [rule.name, rule]));
  return (name) => {
    const rule = rulesMap.get(name);
    if (!rule) {
      throw new Error(`Unexpected permission rule: ${name}`);
    }
    return rule;
  };
};

const mapConditions = (criteria, getRule) => {
  if (isAndCriteria(criteria)) {
    return {
      allOf: criteria.allOf.map((child) => mapConditions(child, getRule))
    };
  } else if (isOrCriteria(criteria)) {
    return {
      anyOf: criteria.anyOf.map((child) => mapConditions(child, getRule))
    };
  } else if (isNotCriteria(criteria)) {
    return {
      not: mapConditions(criteria.not, getRule)
    };
  }
  return getRule(criteria.rule).toQuery(...criteria.params);
};
const createConditionTransformer = (permissionRules) => {
  const getRule = createGetRule(permissionRules);
  return (conditions) => mapConditions(conditions, getRule);
};

const permissionCriteriaSchema = zod.z.lazy(() => zod.z.union([
  zod.z.object({ anyOf: zod.z.array(permissionCriteriaSchema).nonempty() }),
  zod.z.object({ allOf: zod.z.array(permissionCriteriaSchema).nonempty() }),
  zod.z.object({ not: permissionCriteriaSchema }),
  zod.z.object({
    rule: zod.z.string(),
    resourceType: zod.z.string(),
    params: zod.z.array(zod.z.unknown())
  })
]));
const applyConditionsRequestSchema = zod.z.object({
  items: zod.z.array(zod.z.object({
    id: zod.z.string(),
    resourceRef: zod.z.string(),
    resourceType: zod.z.string(),
    conditions: permissionCriteriaSchema
  }))
});
const applyConditions = (criteria, resource, getRule) => {
  if (resource === void 0) {
    return false;
  }
  if (isAndCriteria(criteria)) {
    return criteria.allOf.every((child) => applyConditions(child, resource, getRule));
  } else if (isOrCriteria(criteria)) {
    return criteria.anyOf.some((child) => applyConditions(child, resource, getRule));
  } else if (isNotCriteria(criteria)) {
    return !applyConditions(criteria.not, resource, getRule);
  }
  return getRule(criteria.rule).apply(resource, ...criteria.params);
};
const createPermissionIntegrationRouter = (options) => {
  const { resourceType, rules, getResources } = options;
  const router = Router__default["default"]();
  const getRule = createGetRule(rules);
  const assertValidResourceTypes = (requests) => {
    const invalidResourceTypes = requests.filter((request) => request.resourceType !== resourceType).map((request) => request.resourceType);
    if (invalidResourceTypes.length) {
      throw new errors.InputError(`Unexpected resource types: ${invalidResourceTypes.join(", ")}.`);
    }
  };
  router.use(express__default["default"].json());
  router.post("/.well-known/backstage/permissions/apply-conditions", async (req, res) => {
    const parseResult = applyConditionsRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new errors.InputError(parseResult.error.toString());
    }
    const body = parseResult.data;
    assertValidResourceTypes(body.items);
    const resourceRefs = Array.from(new Set(body.items.map(({ resourceRef }) => resourceRef)));
    const resourceArray = await getResources(resourceRefs);
    const resources = resourceRefs.reduce((acc, resourceRef, index) => {
      acc[resourceRef] = resourceArray[index];
      return acc;
    }, {});
    return res.status(200).json({
      items: body.items.map((request) => ({
        id: request.id,
        result: applyConditions(request.conditions, resources[request.resourceRef], getRule) ? pluginPermissionCommon.AuthorizeResult.ALLOW : pluginPermissionCommon.AuthorizeResult.DENY
      }))
    });
  });
  router.use(backendCommon.errorHandler());
  return router;
};

const createPermissionRule = (rule) => rule;
const makeCreatePermissionRule = () => (rule) => createPermissionRule(rule);

class ServerPermissionClient {
  static fromConfig(config, options) {
    var _a;
    const { discovery, tokenManager } = options;
    const permissionClient = new pluginPermissionCommon.PermissionClient({ discovery, config });
    const permissionEnabled = (_a = config.getOptionalBoolean("permission.enabled")) != null ? _a : false;
    if (permissionEnabled && tokenManager.isInsecureServerTokenManager) {
      throw new Error("Backend-to-backend authentication must be configured before enabling permissions. Read more here https://backstage.io/docs/tutorials/backend-to-backend-auth");
    }
    return new ServerPermissionClient({
      permissionClient,
      tokenManager,
      permissionEnabled
    });
  }
  constructor(options) {
    this.permissionClient = options.permissionClient;
    this.tokenManager = options.tokenManager;
    this.permissionEnabled = options.permissionEnabled;
  }
  async authorizeConditional(queries, options) {
    return await this.isEnabled(options == null ? void 0 : options.token) ? this.permissionClient.authorizeConditional(queries, options) : queries.map((_) => ({ result: pluginPermissionCommon.AuthorizeResult.ALLOW }));
  }
  async authorize(requests, options) {
    return await this.isEnabled(options == null ? void 0 : options.token) ? this.permissionClient.authorize(requests, options) : requests.map((_) => ({ result: pluginPermissionCommon.AuthorizeResult.ALLOW }));
  }
  async isValidServerToken(token) {
    if (!token) {
      return false;
    }
    return this.tokenManager.authenticate(token).then(() => true).catch(() => false);
  }
  async isEnabled(token) {
    return this.permissionEnabled && !await this.isValidServerToken(token);
  }
}

exports.ServerPermissionClient = ServerPermissionClient;
exports.createConditionExports = createConditionExports;
exports.createConditionFactory = createConditionFactory;
exports.createConditionTransformer = createConditionTransformer;
exports.createPermissionIntegrationRouter = createPermissionIntegrationRouter;
exports.createPermissionRule = createPermissionRule;
exports.isAndCriteria = isAndCriteria;
exports.isNotCriteria = isNotCriteria;
exports.isOrCriteria = isOrCriteria;
exports.makeCreatePermissionRule = makeCreatePermissionRule;
//# sourceMappingURL=index.cjs.js.map
