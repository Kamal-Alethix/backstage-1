import { DatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { PluginTaskScheduler } from './types';
/**
 * Deals with the scheduling of distributed tasks.
 *
 * @public
 */
export declare class TaskScheduler {
    private readonly databaseManager;
    private readonly logger;
    static fromConfig(config: Config, options?: {
        databaseManager?: DatabaseManager;
        logger?: Logger;
    }): TaskScheduler;
    constructor(databaseManager: DatabaseManager, logger: Logger);
    /**
     * Instantiates a task manager instance for the given plugin.
     *
     * @param pluginId - The unique ID of the plugin, for example "catalog"
     * @returns A {@link PluginTaskScheduler} instance
     */
    forPlugin(pluginId: string): PluginTaskScheduler;
}
