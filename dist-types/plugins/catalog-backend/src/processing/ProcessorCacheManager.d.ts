import { JsonObject } from '@backstage/types';
import { CatalogProcessor, CatalogProcessorCache } from '../api';
export declare class ProcessorCacheManager {
    private readonly existingState;
    private caches;
    constructor(existingState: JsonObject);
    forProcessor(processor: CatalogProcessor, key?: string): CatalogProcessorCache;
    collect(): JsonObject;
}
