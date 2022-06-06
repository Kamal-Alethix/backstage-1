import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { EntitiesCatalog } from '../catalog/types';
import { LocationAnalyzer } from '../ingestion/types';
import { LocationService, RefreshService } from './types';
import { CatalogProcessingOrchestrator } from '../processing/types';
/**
 * Options used by {@link createRouter}.
 *
 * @public
 */
export interface RouterOptions {
    entitiesCatalog?: EntitiesCatalog;
    locationAnalyzer?: LocationAnalyzer;
    locationService: LocationService;
    orchestrator?: CatalogProcessingOrchestrator;
    refreshService?: RefreshService;
    logger: Logger;
    config: Config;
    permissionIntegrationRouter?: express.Router;
}
/**
 * Creates a catalog router.
 *
 * @public
 */
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
