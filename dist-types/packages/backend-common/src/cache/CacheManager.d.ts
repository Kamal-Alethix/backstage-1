import { Config } from '@backstage/config';
import { CacheManagerOptions, PluginCacheManager } from './types';
/**
 * Implements a Cache Manager which will automatically create new cache clients
 * for plugins when requested. All requested cache clients are created with the
 * connection details provided.
 *
 * @public
 */
export declare class CacheManager {
    /**
     * Keys represent supported `backend.cache.store` values, mapped to factories
     * that return Keyv instances appropriate to the store.
     */
    private readonly storeFactories;
    /**
     * Shared memory store for the in-memory cache client. Sharing the same Map
     * instance ensures get/set/delete operations hit the same store, regardless
     * of where/when a client is instantiated.
     */
    private readonly memoryStore;
    private readonly logger;
    private readonly store;
    private readonly connection;
    private readonly errorHandler;
    /**
     * Creates a new {@link CacheManager} instance by reading from the `backend`
     * config section, specifically the `.cache` key.
     *
     * @param config - The loaded application configuration.
     */
    static fromConfig(config: Config, options?: CacheManagerOptions): CacheManager;
    private constructor();
    /**
     * Generates a PluginCacheManager for consumption by plugins.
     *
     * @param pluginId - The plugin that the cache manager should be created for.
     *        Plugin names should be unique.
     */
    forPlugin(pluginId: string): PluginCacheManager;
    private getClientWithTtl;
    private getRedisClient;
    private getMemcacheClient;
    private getMemoryClient;
    private getNoneClient;
}
