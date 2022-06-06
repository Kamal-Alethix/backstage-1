'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsonRulesEngine = require('json-rules-engine');
var errors = require('@backstage/errors');
var lodash = require('lodash');
var Ajv = require('ajv');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Ajv__default = /*#__PURE__*/_interopDefaultLegacy(Ajv);

class DefaultCheckRegistry {
  constructor(checks) {
    this.checks = /* @__PURE__ */ new Map();
    checks.forEach((check) => {
      this.register(check);
    });
  }
  async register(check) {
    if (this.checks.has(check.id)) {
      throw new errors.ConflictError(`Tech insight check with id ${check.id} has already been registered`);
    }
    this.checks.set(check.id, check);
    return check;
  }
  async get(checkId) {
    const check = this.checks.get(checkId);
    if (!check) {
      throw new errors.NotFoundError(`Tech insight check with id '${checkId}' is not registered.`);
    }
    return check;
  }
  async getAll(checks) {
    return Promise.all(checks.map((checkId) => this.get(checkId)));
  }
  async list() {
    return [...this.checks.values()];
  }
}

var $schema = "http://json-schema.org/draft-07/schema";
var $id = "https://github.com/CacheControl/json-rules-engine/rule-schema.json";
var type = "object";
var title = "Fact Checks";
var description = "Checks contain a set of conditions and a single event. When the engine is run, each check condition is evaluated and results returned";
var required = [
	"conditions"
];
var properties = {
	conditions: {
		$ref: "#/definitions/conditions"
	},
	priority: {
		$id: "#/properties/priority",
		anyOf: [
			{
				type: "integer",
				minimum: 1
			}
		],
		title: "Priority",
		description: "Dictates when check should be run, relative to other check. Higher priority checks are run before lower priority checks. Checks with the same priority are run in parallel. Priority must be a positive, non-zero integer.",
		"default": 1,
		examples: [
			1
		]
	}
};
var definitions = {
	conditions: {
		type: "object",
		title: "Conditions",
		description: "Check conditions are a combination of facts, operators, and values that determine whether the check is a success or a failure. The simplest form of a condition consists of a fact, an operator, and a value. When the engine runs, the operator is used to compare the fact against the value. Each check's conditions must have either an all or an any operator at its root, containing an array of conditions. The all operator specifies that all conditions contained within must be truthy for the check to be considered a success. The any operator only requires one condition to be truthy for the check to succeed.",
		"default": {
		},
		examples: [
			{
				all: [
					{
						value: true,
						fact: "displayMessage",
						operator: "equal"
					}
				]
			}
		],
		oneOf: [
			{
				required: [
					"any"
				]
			},
			{
				required: [
					"all"
				]
			}
		],
		properties: {
			any: {
				$ref: "#/definitions/conditionArray"
			},
			all: {
				$ref: "#/definitions/conditionArray"
			}
		}
	},
	conditionArray: {
		type: "array",
		title: "Condition Array",
		description: "An array of conditions with a possible recursive inclusion of another condition array.",
		"default": [
		],
		items: {
			anyOf: [
				{
					$ref: "#/definitions/conditions"
				},
				{
					$ref: "#/definitions/condition"
				}
			]
		}
	},
	condition: {
		type: "object",
		title: "Condition",
		description: "Check conditions are a combination of facts, operators, and values that determine whether the check is a success or a failure. The simplest form of a condition consists of a fact, an operator, and a value. When the engine runs, the operator is used to compare the fact against the value.",
		"default": {
			fact: "my-fact",
			operator: "lessThanInclusive",
			value: 1
		},
		examples: [
			{
				fact: "gameDuration",
				operator: "equal",
				value: 40
			},
			{
				value: 5,
				fact: "personalFoulCount",
				operator: "greaterThanInclusive"
			},
			{
				fact: "product-price",
				operator: "greaterThan",
				path: "$.price",
				value: 100,
				params: {
					productId: "widget"
				}
			}
		],
		required: [
			"fact",
			"operator",
			"value"
		],
		properties: {
			fact: {
				type: "string",
				title: "Fact",
				description: "Facts are methods or constants registered with the engine prior to runtime and referenced within check conditions. Each fact method should be a pure function that may return a either computed value, or promise that resolves to a computed value. As check conditions are evaluated during runtime, they retrieve fact values dynamically and use the condition operator to compare the fact result with the condition value.",
				"default": "",
				examples: [
					"gameDuration"
				]
			},
			operator: {
				type: "string",
				anyOf: [
					{
						"const": "equal",
						title: "fact must equal value"
					},
					{
						"const": "notEqual",
						title: "fact must not equal value"
					},
					{
						"const": "lessThan",
						title: "fact must be less than value"
					},
					{
						"const": "lessThanInclusive",
						title: "fact must be less than or equal to value"
					},
					{
						"const": "greaterThan",
						title: "fact must be greater than value"
					},
					{
						"const": "greaterThanInclusive",
						title: "fact must be greater than or equal to value"
					},
					{
						"const": "in",
						title: "fact must be included in value (an array)"
					},
					{
						"const": "notIn",
						title: "fact must not be included in value (an array)"
					},
					{
						"const": "contains",
						title: "fact (an array) must include value"
					},
					{
						"const": "doesNotContain",
						title: "fact (an array) must not include value"
					}
				],
				title: "Operator",
				description: "The operator compares the value returned by the fact to what is stored in the value property. If the result is truthy, the condition passes.",
				"default": "",
				examples: [
					"equal"
				]
			},
			value: {
				anyOf: [
					{
						type: "string"
					},
					{
						type: "object"
					},
					{
						type: "array"
					},
					{
						type: "number"
					},
					{
						type: "boolean"
					}
				],
				title: "Value",
				description: "The value the fact should be compared to.",
				"default": 0,
				examples: [
					40
				]
			},
			params: {
				type: "object",
				title: "Event Params",
				description: "Optional helper params to make available to the event processor.",
				"default": {
				},
				examples: [
					{
						customProperty: "customValue"
					}
				]
			},
			path: {
				type: "string",
				title: "Path",
				description: "For more complex data structures, writing a separate fact handler for each object property quickly becomes verbose and unwieldy. To address this, a path property may be provided to traverse fact data using json-path syntax. Json-path support is provided by jsonpath-plus",
				"default": "",
				examples: [
					"$.price"
				]
			}
		}
	}
};
var validationSchema = {
	$schema: $schema,
	$id: $id,
	type: type,
	title: title,
	description: description,
	required: required,
	properties: properties,
	definitions: definitions
};

var validationSchema$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $schema: $schema,
  $id: $id,
  type: type,
  title: title,
  description: description,
  required: required,
  properties: properties,
  definitions: definitions,
  'default': validationSchema
});

const JSON_RULE_ENGINE_CHECK_TYPE = "json-rules-engine";

const noopEvent = {
  type: "noop"
};
class JsonRulesEngineFactChecker {
  constructor({
    checks,
    repository,
    logger,
    checkRegistry,
    operators
  }) {
    this.repository = repository;
    this.logger = logger;
    this.operators = operators || [];
    this.validationSchema = JSON.parse(JSON.stringify(validationSchema$1));
    this.operators.forEach((op) => {
      this.validationSchema.definitions.condition.properties.operator.anyOf.push({ const: op.name });
    });
    checks.forEach((check) => this.validate(check));
    this.checkRegistry = checkRegistry != null ? checkRegistry : new DefaultCheckRegistry(checks);
  }
  async runChecks(entity, checks) {
    const engine = new jsonRulesEngine.Engine();
    this.operators.forEach((op) => {
      engine.addOperator(op);
    });
    const techInsightChecks = checks ? await this.checkRegistry.getAll(checks) : await this.checkRegistry.list();
    const factIds = techInsightChecks.flatMap((it) => it.factIds);
    const facts = await this.repository.getLatestFactsByIds(factIds, entity);
    techInsightChecks.forEach((techInsightCheck) => {
      const rule = techInsightCheck.rule;
      rule.name = techInsightCheck.id;
      const hasAllFacts = techInsightCheck.factIds.every((factId) => facts[factId]);
      if (hasAllFacts) {
        engine.addRule({ ...techInsightCheck.rule, event: noopEvent });
      } else {
        this.logger.debug(`Skipping ${rule.name} due to missing facts: ${techInsightCheck.factIds.filter((factId) => !facts[factId]).join(", ")}`);
      }
    });
    const factValues = Object.values(facts).reduce((acc, it) => ({ ...acc, ...it.facts }), {});
    try {
      const results = await engine.run(factValues);
      return await this.ruleEngineResultsToCheckResponse(results, techInsightChecks, Object.values(facts));
    } catch (e) {
      if (errors.isError(e)) {
        throw new Error(`Failed to run rules engine, ${e.message}`);
      }
      throw e;
    }
  }
  async validate(check) {
    const ajv = new Ajv__default["default"]({ verbose: true });
    const validator = ajv.compile(this.validationSchema);
    const isValidToSchema = validator(check.rule);
    if (check.type !== JSON_RULE_ENGINE_CHECK_TYPE) {
      const msg = `Only ${JSON_RULE_ENGINE_CHECK_TYPE} checks can be registered to this fact checker`;
      this.logger.warn(msg);
      return {
        valid: false,
        message: msg
      };
    }
    if (!isValidToSchema) {
      const msg = "Failed to to validate conditions against JSON schema";
      this.logger.warn("Failed to to validate conditions against JSON schema", validator.errors);
      return {
        valid: false,
        message: msg,
        errors: validator.errors ? validator.errors : void 0
      };
    }
    const existingSchemas = await this.repository.getLatestSchemas(check.factIds);
    const references = this.retrieveIndividualFactReferences(check.rule.conditions);
    const results = references.map((ref) => ({
      ref,
      result: existingSchemas.some((schema) => schema.hasOwnProperty(ref))
    }));
    const failedReferences = results.filter((it) => !it.result);
    failedReferences.forEach((it) => {
      this.logger.warn(`Validation failed for check ${check.name}. Reference to value ${it.ref} does not exists in referred fact schemas: ${check.factIds.join(",")}`);
    });
    const valid = failedReferences.length === 0;
    return {
      valid,
      ...!valid ? {
        message: `Check is referencing missing values from fact schemas: ${failedReferences.map((it) => it.ref).join(",")}`
      } : {}
    };
  }
  getChecks() {
    return this.checkRegistry.list();
  }
  retrieveIndividualFactReferences(condition) {
    let results = [];
    if ("all" in condition) {
      results = results.concat(condition.all.flatMap((con) => this.retrieveIndividualFactReferences(con)));
    } else if ("any" in condition) {
      results = results.concat(condition.any.flatMap((con) => this.retrieveIndividualFactReferences(con)));
    } else {
      results.push(condition.fact);
    }
    return results;
  }
  async ruleEngineResultsToCheckResponse(results, techInsightChecks, facts) {
    return await Promise.all([
      ...results.results && results.results,
      ...results.failureResults && results.failureResults
    ].map(async (result) => {
      const techInsightCheck = techInsightChecks.find((check) => check.id === result.name);
      if (!techInsightCheck) {
        throw new Error(`Failed to determine tech insight check with id ${result.name}. Discrepancy between ran rule engine and configured checks.`);
      }
      const factResponse = await this.constructFactInformationResponse(facts, techInsightCheck);
      return {
        facts: factResponse,
        result: result.result,
        check: JsonRulesEngineFactChecker.constructCheckResponse(techInsightCheck, result)
      };
    }));
  }
  static constructCheckResponse(techInsightCheck, result) {
    const returnable = {
      id: techInsightCheck.id,
      type: techInsightCheck.type,
      name: techInsightCheck.name,
      description: techInsightCheck.description,
      factIds: techInsightCheck.factIds,
      metadata: result.result ? techInsightCheck.successMetadata : techInsightCheck.failureMetadata,
      rule: { conditions: {} }
    };
    if ("toJSON" in result) {
      const rule = JSON.parse(result.toJSON());
      return { ...returnable, rule: lodash.pick(rule, ["conditions"]) };
    }
    return returnable;
  }
  async constructFactInformationResponse(facts, techInsightCheck) {
    const factSchemas = await this.repository.getLatestSchemas(techInsightCheck.factIds);
    const schemas = factSchemas.reduce((acc, schema) => ({ ...acc, ...schema }), {});
    const individualFacts = this.retrieveIndividualFactReferences(techInsightCheck.rule.conditions);
    const factValues = facts.filter((factContainer) => techInsightCheck.factIds.includes(factContainer.id)).reduce((acc, factContainer) => ({
      ...acc,
      ...lodash.pick(factContainer.facts, individualFacts)
    }), {});
    return Object.entries(factValues).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: {
          value,
          ...schemas[key]
        }
      };
    }, {});
  }
}
class JsonRulesEngineFactCheckerFactory {
  constructor({
    checks,
    logger,
    checkRegistry,
    operators
  }) {
    this.logger = logger;
    this.checks = checks;
    this.checkRegistry = checkRegistry;
    this.operators = operators;
  }
  construct(repository) {
    return new JsonRulesEngineFactChecker({
      checks: this.checks,
      logger: this.logger,
      checkRegistry: this.checkRegistry,
      repository,
      operators: this.operators
    });
  }
}

exports.JSON_RULE_ENGINE_CHECK_TYPE = JSON_RULE_ENGINE_CHECK_TYPE;
exports.JsonRulesEngineFactChecker = JsonRulesEngineFactChecker;
exports.JsonRulesEngineFactCheckerFactory = JsonRulesEngineFactCheckerFactory;
//# sourceMappingURL=index.cjs.js.map
