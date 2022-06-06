import { Config } from '@backstage/config';
import express from 'express';
import { Logger } from 'winston';
import { PluginEndpointDiscovery } from '@backstage/backend-common';

interface RouterOptions {
    logger: Logger;
    config: Config;
    discovery: PluginEndpointDiscovery;
    skipInvalidProxies?: boolean;
}
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { createRouter };
