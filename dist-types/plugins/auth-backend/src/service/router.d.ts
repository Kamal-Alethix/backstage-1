import express from 'express';
import { Logger } from 'winston';
import { AuthProviderFactory } from '../providers';
import { PluginDatabaseManager, PluginEndpointDiscovery, TokenManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
declare type ProviderFactories = {
    [s: string]: AuthProviderFactory;
};
export interface RouterOptions {
    logger: Logger;
    database: PluginDatabaseManager;
    config: Config;
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    providerFactories?: ProviderFactories;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
export declare function createOriginFilter(config: Config): (origin: string) => boolean;
export {};
