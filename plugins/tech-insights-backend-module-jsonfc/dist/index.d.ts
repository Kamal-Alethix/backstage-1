import { TopLevelCondition, Operator } from 'json-rules-engine';
import { TechInsightCheck, TechInsightsStore, TechInsightCheckRegistry, FactChecker, CheckValidationResponse } from '@backstage/plugin-tech-insights-node';
import { CheckResponse, BooleanCheckResult } from '@backstage/plugin-tech-insights-common';
import { Logger } from 'winston';

/**
 * @public
 */
declare type Rule = {
    conditions: TopLevelCondition;
    name?: string;
    priority?: number;
};
/**
 * @public
 */
interface TechInsightJsonRuleCheck extends TechInsightCheck {
    rule: Rule;
}
/**
 * @public
 */
declare type CheckCondition = {
    operator: string;
    fact: string;
    factValue: any;
    factResult: any;
    result: boolean;
};
/**
 * @public
 */
declare type ResponseTopLevelCondition = {
    all: CheckCondition[];
} | {
    any: CheckCondition[];
};
/**
 * @public
 */
interface JsonRuleCheckResponse extends CheckResponse {
    rule: {
        conditions: ResponseTopLevelCondition & {
            priority: number;
        };
    };
}
/**
 * @public
 */
interface JsonRuleBooleanCheckResult extends BooleanCheckResult {
    check: JsonRuleCheckResponse;
}

/**
 * @public
 * Should actually be at-internal
 *
 * Constructor options for JsonRulesEngineFactChecker
 */
declare type JsonRulesEngineFactCheckerOptions = {
    checks: TechInsightJsonRuleCheck[];
    repository: TechInsightsStore;
    logger: Logger;
    checkRegistry?: TechInsightCheckRegistry<any>;
    operators?: Operator[];
};
/**
 * @public
 * Should actually be at-internal
 *
 * FactChecker implementation using json-rules-engine
 */
declare class JsonRulesEngineFactChecker implements FactChecker<TechInsightJsonRuleCheck, JsonRuleBooleanCheckResult> {
    private readonly checkRegistry;
    private repository;
    private readonly logger;
    private readonly validationSchema;
    private readonly operators;
    constructor({ checks, repository, logger, checkRegistry, operators, }: JsonRulesEngineFactCheckerOptions);
    runChecks(entity: string, checks?: string[]): Promise<JsonRuleBooleanCheckResult[]>;
    validate(check: TechInsightJsonRuleCheck): Promise<CheckValidationResponse>;
    getChecks(): Promise<TechInsightJsonRuleCheck[]>;
    private retrieveIndividualFactReferences;
    private ruleEngineResultsToCheckResponse;
    private static constructCheckResponse;
    private constructFactInformationResponse;
}
/**
 * @public
 *
 * Constructor options for JsonRulesEngineFactCheckerFactory
 *
 * Implementation of checkRegistry is optional.
 * If there is a need to use persistent storage for checks, it is recommended to inject a storage implementation here.
 * Otherwise an in-memory option is instantiated and used.
 */
declare type JsonRulesEngineFactCheckerFactoryOptions = {
    checks: TechInsightJsonRuleCheck[];
    logger: Logger;
    checkRegistry?: TechInsightCheckRegistry<TechInsightJsonRuleCheck>;
    operators?: Operator[];
};
/**
 * @public
 *
 * Factory to construct JsonRulesEngineFactChecker
 * Can be constructed with optional implementation of CheckInsightCheckRegistry if needed.
 * Otherwise defaults to using in-memory CheckRegistry
 */
declare class JsonRulesEngineFactCheckerFactory {
    private readonly checks;
    private readonly logger;
    private readonly checkRegistry?;
    private readonly operators?;
    constructor({ checks, logger, checkRegistry, operators, }: JsonRulesEngineFactCheckerFactoryOptions);
    /**
     * @param repository - Implementation of TechInsightsStore. Used by the returned JsonRulesEngineFactChecker
     *                     to retrieve fact and fact schema data
     * @returns JsonRulesEngineFactChecker implementation
     */
    construct(repository: TechInsightsStore): JsonRulesEngineFactChecker;
}

/**
 * @public
 */
declare const JSON_RULE_ENGINE_CHECK_TYPE = "json-rules-engine";

export { CheckCondition, JSON_RULE_ENGINE_CHECK_TYPE, JsonRuleBooleanCheckResult, JsonRuleCheckResponse, JsonRulesEngineFactChecker, JsonRulesEngineFactCheckerFactory, JsonRulesEngineFactCheckerFactoryOptions, JsonRulesEngineFactCheckerOptions, ResponseTopLevelCondition, Rule, TechInsightJsonRuleCheck };
