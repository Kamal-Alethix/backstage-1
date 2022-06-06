import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginDatabaseManager, PluginEndpointDiscovery, TokenManager } from '@backstage/backend-common';
import { FactChecker, FactCheckerFactory, FactRetrieverRegistration, TechInsightCheck } from '@backstage/plugin-tech-insights-node';
import { PersistenceContext } from './persistence/persistenceContext';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
/**
 * @public
 * @typeParam CheckType - Type of the check for the fact checker this builder returns
 * @typeParam CheckResultType - Type of the check result for the fact checker this builder returns
 *
 * Configuration options to initialize TechInsightsBuilder. Generic types params are needed if FactCheckerFactory
 * is included for FactChecker creation.
 */
export interface TechInsightsOptions<CheckType extends TechInsightCheck, CheckResultType extends CheckResult> {
    /**
     * A collection of FactRetrieverRegistrations.
     * Used to register FactRetrievers and their schemas and schedule an execution loop for them.
     */
    factRetrievers: FactRetrieverRegistration[];
    /**
     * Optional factory exposing a `construct` method to initialize a FactChecker implementation
     */
    factCheckerFactory?: FactCheckerFactory<CheckType, CheckResultType>;
    logger: Logger;
    config: Config;
    discovery: PluginEndpointDiscovery;
    database: PluginDatabaseManager;
    scheduler: PluginTaskScheduler;
    tokenManager: TokenManager;
}
/**
 * @public
 * @typeParam CheckType - Type of the check for the fact checker this builder returns
 * @typeParam CheckResultType - Type of the check result for the fact checker this builder returns
 *
 * A container for exported implementations related to TechInsights.
 * FactChecker is present if an optional FactCheckerFactory is included in the build stage.
 */
export declare type TechInsightsContext<CheckType extends TechInsightCheck, CheckResultType extends CheckResult> = {
    factChecker?: FactChecker<CheckType, CheckResultType>;
    persistenceContext: PersistenceContext;
};
/**
 * @public
 *
 * Constructs needed persistence context, fact retriever engine
 * and optionally fact checker implementations to be used in the tech insights module.
 *
 * @param options - Needed options to construct TechInsightsContext
 * @returns TechInsightsContext with persistence implementations and optionally an implementation of a FactChecker
 */
export declare const buildTechInsightsContext: <CheckType extends TechInsightCheck, CheckResultType extends CheckResult>(options: TechInsightsOptions<CheckType, CheckResultType>) => Promise<TechInsightsContext<CheckType, CheckResultType>>;
