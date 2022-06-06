import express from 'express';
import { Config } from '@backstage/config';
import { TechInsightsStore, TechInsightCheck, FactChecker, FactRetrieverRegistration, FactCheckerFactory, FactRetriever, FactLifecycle } from '@backstage/plugin-tech-insights-node';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { Logger } from 'winston';
import { PluginEndpointDiscovery, PluginDatabaseManager, TokenManager } from '@backstage/backend-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';

/**
 * A Container for persistence related components in TechInsights
 *
 * @public
 */
declare type PersistenceContext = {
    techInsightsStore: TechInsightsStore;
};

/**
 * @public
 *
 * RouterOptions to construct TechInsights endpoints
 * @typeParam CheckType - Type of the check for the fact checker this builder returns
 * @typeParam CheckResultType - Type of the check result for the fact checker this builder returns
 */
interface RouterOptions<CheckType extends TechInsightCheck, CheckResultType extends CheckResult> {
    /**
     * Optional FactChecker implementation. If omitted, endpoints are not constructed
     */
    factChecker?: FactChecker<CheckType, CheckResultType>;
    /**
     * TechInsights PersistenceContext. Should contain an implementation of TechInsightsStore
     */
    persistenceContext: PersistenceContext;
    /**
     * Backstage config object
     */
    config: Config;
    /**
     * Implementation of Winston logger
     */
    logger: Logger;
}
/**
 * @public
 *
 * Constructs a tech-insights router.
 *
 * Exposes endpoints to handle facts
 * Exposes optional endpoints to handle checks if a FactChecker implementation is passed in
 *
 * @param options - RouterOptions object
 */
declare function createRouter<CheckType extends TechInsightCheck, CheckResultType extends CheckResult>(options: RouterOptions<CheckType, CheckResultType>): Promise<express.Router>;

/**
 * @public
 * @typeParam CheckType - Type of the check for the fact checker this builder returns
 * @typeParam CheckResultType - Type of the check result for the fact checker this builder returns
 *
 * Configuration options to initialize TechInsightsBuilder. Generic types params are needed if FactCheckerFactory
 * is included for FactChecker creation.
 */
interface TechInsightsOptions<CheckType extends TechInsightCheck, CheckResultType extends CheckResult> {
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
declare type TechInsightsContext<CheckType extends TechInsightCheck, CheckResultType extends CheckResult> = {
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
declare const buildTechInsightsContext: <CheckType extends TechInsightCheck, CheckResultType extends CheckResult>(options: TechInsightsOptions<CheckType, CheckResultType>) => Promise<TechInsightsContext<CheckType, CheckResultType>>;

/**
 * @public
 *
 * @param cadence - cron expression to indicate when the fact retriever should be triggered
 * @param factRetriever - Implementation of fact retriever consisting of at least id, version, schema and handler
 * @param lifecycle - Optional lifecycle definition indicating the cleanup logic of facts when this retriever is run
 *
 */
declare type FactRetrieverRegistrationOptions = {
    cadence: string;
    factRetriever: FactRetriever;
    lifecycle?: FactLifecycle;
};
/**
 * @public
 *
 * A helper function to construct fact retriever registrations.
 *
 * @param cadence - cron expression to indicate when the fact retriever should be triggered
 * @param factRetriever - Implementation of fact retriever consisting of at least id, version, schema and handler
 * @param lifecycle - Optional lifecycle definition indicating the cleanup logic of facts when this retriever is run
 *
 *
 * @remarks
 *
 * Cron expressions help:
 * ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 *
 * Valid lifecycle values:
 * \{ ttl: \{ weeks: 2 \} \} -- This fact retriever will remove items that are older than 2 weeks when it is run
 * \{ maxItems: 7 \} -- This fact retriever will leave 7 newest items in the database when it is run
 *
 */
declare function createFactRetrieverRegistration(options: FactRetrieverRegistrationOptions): FactRetrieverRegistration;

/**
 * Generates facts which indicate the quality of data in the spec.owner field.
 *
 * @public
 */
declare const entityOwnershipFactRetriever: FactRetriever;

/**
 * Generates facts which indicate the completeness of entity metadata.
 *
 * @public
 */
declare const entityMetadataFactRetriever: FactRetriever;

/**
 * Generates facts related to the completeness of techdocs configuration for entities.
 *
 * @public
 */
declare const techdocsFactRetriever: FactRetriever;

export { FactRetrieverRegistrationOptions, PersistenceContext, RouterOptions, TechInsightsContext, TechInsightsOptions, buildTechInsightsContext, createFactRetrieverRegistration, createRouter, entityMetadataFactRetriever, entityOwnershipFactRetriever, techdocsFactRetriever };
