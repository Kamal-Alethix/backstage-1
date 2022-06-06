import { PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { TemplateFilter } from '../lib';
import { TaskBroker, TemplateAction } from '../scaffolder';
/**
 * RouterOptions
 *
 * @public
 */
export interface RouterOptions {
    logger: Logger;
    config: Config;
    reader: UrlReader;
    database: PluginDatabaseManager;
    catalogClient: CatalogApi;
    actions?: TemplateAction<any>[];
    taskWorkers?: number;
    taskBroker?: TaskBroker;
    additionalTemplateFilters?: Record<string, TemplateFilter>;
}
/**
 * A method to create a router for the scaffolder backend plugin.
 * @public
 */
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
