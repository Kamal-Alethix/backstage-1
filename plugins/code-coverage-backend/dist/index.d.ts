import express from 'express';
import { Logger } from 'winston';
import { PluginEndpointDiscovery, PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';

interface RouterOptions {
    config: Config;
    discovery: PluginEndpointDiscovery;
    database: PluginDatabaseManager;
    urlReader: UrlReader;
    logger: Logger;
}
interface CodeCoverageApi {
    name: string;
}
declare const makeRouter: (options: RouterOptions) => Promise<express.Router>;
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { CodeCoverageApi, RouterOptions, createRouter, makeRouter };
