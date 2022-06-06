import { JsonRuleBooleanCheckResult, TechInsightJsonRuleCheck } from '../types';
import { FactChecker, TechInsightCheckRegistry, TechInsightsStore, CheckValidationResponse } from '@backstage/plugin-tech-insights-node';
import { Operator } from 'json-rules-engine';
import { Logger } from 'winston';
/**
 * @public
 * Should actually be at-internal
 *
 * Constructor options for JsonRulesEngineFactChecker
 */
export declare type JsonRulesEngineFactCheckerOptions = {
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
export declare class JsonRulesEngineFactChecker implements FactChecker<TechInsightJsonRuleCheck, JsonRuleBooleanCheckResult> {
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
export declare type JsonRulesEngineFactCheckerFactoryOptions = {
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
export declare class JsonRulesEngineFactCheckerFactory {
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
