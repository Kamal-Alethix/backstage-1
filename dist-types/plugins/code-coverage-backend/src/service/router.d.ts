import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { PluginDatabaseManager, PluginEndpointDiscovery, UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';
export interface RouterOptions {
    config: Config;
    discovery: PluginEndpointDiscovery;
    database: PluginDatabaseManager;
    urlReader: UrlReader;
    logger: Logger;
}
export interface CodeCoverageApi {
    name: string;
}
export declare const makeRouter: (options: RouterOptions) => Promise<express.Router>;
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
