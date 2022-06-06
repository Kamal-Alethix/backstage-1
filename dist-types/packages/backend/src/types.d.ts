import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { PluginCacheManager, PluginDatabaseManager, PluginEndpointDiscovery, TokenManager, UrlReader } from '@backstage/backend-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { PermissionAuthorizer, PermissionEvaluator } from '@backstage/plugin-permission-common';
export declare type PluginEnvironment = {
    logger: Logger;
    cache: PluginCacheManager;
    database: PluginDatabaseManager;
    config: Config;
    reader: UrlReader;
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    permissions: PermissionEvaluator | PermissionAuthorizer;
    scheduler: PluginTaskScheduler;
};
