import { PluginEndpointDiscovery, TokenManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { CatalogApi, GetEntitiesRequest } from '@backstage/catalog-client';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { Permission } from '@backstage/plugin-permission-common';
/**
 * @public
 * @deprecated Upgrade to a more recent `@backstage/plugin-search-backend-node` and
 * use `DefaultCatalogCollatorFactory` instead.
 */
export declare class DefaultCatalogCollator {
    protected discovery: PluginEndpointDiscovery;
    protected locationTemplate: string;
    protected filter?: GetEntitiesRequest['filter'];
    protected readonly catalogClient: CatalogApi;
    readonly type: string;
    readonly visibilityPermission: Permission;
    protected tokenManager: TokenManager;
    static fromConfig(_config: Config, options: {
        discovery: PluginEndpointDiscovery;
        tokenManager: TokenManager;
        filter?: GetEntitiesRequest['filter'];
    }): DefaultCatalogCollator;
    constructor(options: {
        discovery: PluginEndpointDiscovery;
        tokenManager: TokenManager;
        locationTemplate?: string;
        filter?: GetEntitiesRequest['filter'];
        catalogClient?: CatalogApi;
    });
    protected applyArgsToFormat(format: string, args: Record<string, string>): string;
    private isUserEntity;
    private getDocumentText;
    execute(): Promise<CatalogEntityDocument[]>;
}
