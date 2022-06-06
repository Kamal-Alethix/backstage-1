import { Knex } from 'knex';
import { Logger } from 'winston';
import { TechInsightsStore } from '@backstage/plugin-tech-insights-node';
/**
 * A Container for persistence related components in TechInsights
 *
 * @public
 */
export declare type PersistenceContext = {
    techInsightsStore: TechInsightsStore;
};
export declare type CreateDatabaseOptions = {
    logger: Logger;
};
/**
 * A factory method to construct persistence context for running implementation.
 *
 * @public
 */
export declare const initializePersistenceContext: (knex: Knex, options?: CreateDatabaseOptions) => Promise<PersistenceContext>;
