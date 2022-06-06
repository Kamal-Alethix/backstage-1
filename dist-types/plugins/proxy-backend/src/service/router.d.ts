import { Config } from '@backstage/config';
import express from 'express';
import { Options, RequestHandler } from 'http-proxy-middleware';
import { Logger } from 'winston';
import { PluginEndpointDiscovery } from '@backstage/backend-common';
export interface RouterOptions {
    logger: Logger;
    config: Config;
    discovery: PluginEndpointDiscovery;
    skipInvalidProxies?: boolean;
}
export interface ProxyConfig extends Options {
    allowedMethods?: string[];
    allowedHeaders?: string[];
}
export declare function buildMiddleware(pathPrefix: string, logger: Logger, route: string, config: string | ProxyConfig): RequestHandler;
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
