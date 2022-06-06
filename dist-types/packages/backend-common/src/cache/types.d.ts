import { Logger } from 'winston';
import { CacheClient } from './CacheClient';
/**
 * Options given when constructing a {@link CacheClient}.
 *
 * @public
 */
export declare type CacheClientOptions = {
    /**
     * An optional default TTL (in milliseconds) to be set when getting a client
     * instance. If not provided, data will persist indefinitely by default (or
     * can be configured per entry at set-time).
     */
    defaultTtl?: number;
};
/**
 * Options given when constructing a {@link CacheManager}.
 *
 * @public
 */
export declare type CacheManagerOptions = {
    /**
     * An optional logger for use by the PluginCacheManager.
     */
    logger?: Logger;
    /**
     * An optional handler for connection errors emitted from the underlying data
     * store.
     */
    onError?: (err: Error) => void;
};
/**
 * Manages access to cache stores that plugins get.
 *
 * @public
 */
export declare type PluginCacheManager = {
    /**
     * Provides backend plugins cache connections for themselves.
     *
     * @remarks
     *
     * The purpose of this method is to allow plugins to get isolated data stores
     * so that plugins are discouraged from cache-level integration and/or cache
     * key collisions.
     */
    getClient: (options?: CacheClientOptions) => CacheClient;
};
