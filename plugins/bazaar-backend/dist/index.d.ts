import { PluginDatabaseManager } from '@backstage/backend-common';
import express from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

interface RouterOptions {
    logger: Logger;
    database: PluginDatabaseManager;
    config: Config;
}
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { RouterOptions, createRouter };
