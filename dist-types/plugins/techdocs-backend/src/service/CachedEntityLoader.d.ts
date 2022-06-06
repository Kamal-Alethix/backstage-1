import { CatalogClient } from '@backstage/catalog-client';
import { CacheClient } from '@backstage/backend-common';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
export declare type CachedEntityLoaderOptions = {
    catalog: CatalogClient;
    cache: CacheClient;
};
export declare class CachedEntityLoader {
    private readonly catalog;
    private readonly cache;
    private readonly readTimeout;
    constructor({ catalog, cache }: CachedEntityLoaderOptions);
    load(entityRef: CompoundEntityRef, token: string | undefined): Promise<Entity | undefined>;
    private getFromCache;
    private getCacheKey;
}
