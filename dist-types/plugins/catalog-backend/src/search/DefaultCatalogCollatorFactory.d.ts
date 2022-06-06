/// <reference types="node" />
import { PluginEndpointDiscovery, TokenManager } from '@backstage/backend-common';
import { CatalogApi, GetEntitiesRequest } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Permission } from '@backstage/plugin-permission-common';
import { Readable } from 'stream';
/** @public */
export declare type DefaultCatalogCollatorFactoryOptions = {
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    locationTemplate?: string;
    filter?: GetEntitiesRequest['filter'];
    batchSize?: number;
    catalogClient?: CatalogApi;
};
/** @public */
export declare class DefaultCatalogCollatorFactory implements DocumentCollatorFactory {
    readonly type: string;
    readonly visibilityPermission: Permission;
    private locationTemplate;
    private filter?;
    private batchSize;
    private readonly catalogClient;
    private tokenManager;
    static fromConfig(_config: Config, options: DefaultCatalogCollatorFactoryOptions): DefaultCatalogCollatorFactory;
    private constructor();
    getCollator(): Promise<Readable>;
    private applyArgsToFormat;
    private execute;
}
