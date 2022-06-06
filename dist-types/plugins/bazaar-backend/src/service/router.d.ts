import { PluginDatabaseManager } from '@backstage/backend-common';
import express from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
export interface RouterOptions {
    logger: Logger;
    database: PluginDatabaseManager;
    config: Config;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
