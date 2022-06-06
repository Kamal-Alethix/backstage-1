import { EntityPolicy } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Logger } from 'winston';
import { CatalogProcessor, CatalogProcessorParser } from '../api';
import { CatalogProcessingOrchestrator, EntityProcessingRequest, EntityProcessingResult } from './types';
import { CatalogRulesEnforcer } from '../ingestion/CatalogRules';
/** @public */
export declare class DefaultCatalogProcessingOrchestrator implements CatalogProcessingOrchestrator {
    private readonly options;
    constructor(options: {
        processors: CatalogProcessor[];
        integrations: ScmIntegrationRegistry;
        logger: Logger;
        parser: CatalogProcessorParser;
        policy: EntityPolicy;
        rulesEnforcer: CatalogRulesEnforcer;
    });
    process(request: EntityProcessingRequest): Promise<EntityProcessingResult>;
    private processSingleEntity;
    private runPreProcessStep;
    /**
     * Enforce entity policies making sure that entities conform to a general schema
     */
    private runPolicyStep;
    /**
     * Validate the given entity
     */
    private runValidateStep;
    /**
     * Backwards compatible processing of location entities
     */
    private runSpecialLocationStep;
    /**
     * Main processing step of the entity
     */
    private runPostProcessStep;
}
