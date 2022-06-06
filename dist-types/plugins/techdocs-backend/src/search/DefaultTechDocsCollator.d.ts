import { PluginEndpointDiscovery, TokenManager } from '@backstage/backend-common';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { Permission } from '@backstage/plugin-permission-common';
import { CatalogApi } from '@backstage/catalog-client';
import { TechDocsDocument } from '@backstage/plugin-techdocs-node';
/**
 * Options to configure the TechDocs collator
 *
 * @public
 */
export declare type TechDocsCollatorOptions = {
    discovery: PluginEndpointDiscovery;
    logger: Logger;
    tokenManager: TokenManager;
    locationTemplate?: string;
    catalogClient?: CatalogApi;
    parallelismLimit?: number;
    legacyPathCasing?: boolean;
};
/**
 * A search collator responsible for gathering and transforming TechDocs documents.
 *
 * @public
 * @deprecated Upgrade to a more recent `@backstage/plugin-search-backend-node` and
 * use `DefaultTechDocsCollatorFactory` instead.
 */
export declare class DefaultTechDocsCollator {
    private readonly legacyPathCasing;
    private readonly options;
    readonly type: string;
    readonly visibilityPermission: Permission;
    private constructor();
    static fromConfig(config: Config, options: TechDocsCollatorOptions): DefaultTechDocsCollator;
    execute(): Promise<TechDocsDocument[]>;
    protected applyArgsToFormat(format: string, args: Record<string, string>): string;
    private static constructDocsIndexUrl;
    private static handleEntityInfoCasing;
}
