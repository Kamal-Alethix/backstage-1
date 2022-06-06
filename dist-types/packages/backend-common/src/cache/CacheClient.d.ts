import { JsonValue } from '@backstage/types';
import Keyv from 'keyv';
declare type CacheClientArgs = {
    client: Keyv;
};
/**
 * Options passed to {@link CacheClient.set}.
 *
 * @public
 */
export declare type CacheClientSetOptions = {
    /**
     * Optional TTL in milliseconds. Defaults to the TTL provided when the client
     * was set up (or no TTL if none are provided).
     */
    ttl?: number;
};
/**
 * A pre-configured, storage agnostic cache client suitable for use by
 * Backstage plugins.
 *
 * @public
 */
export interface CacheClient {
    /**
     * Reads data from a cache store for the given key. If no data was found,
     * returns undefined.
     */
    get(key: string): Promise<JsonValue | undefined>;
    /**
     * Writes the given data to a cache store, associated with the given key. An
     * optional TTL may also be provided, otherwise it defaults to the TTL that
     * was provided when the client was instantiated.
     */
    set(key: string, value: JsonValue, options?: CacheClientSetOptions): Promise<void>;
    /**
     * Removes the given key from the cache store.
     */
    delete(key: string): Promise<void>;
}
/**
 * A basic, concrete implementation of the CacheClient, suitable for almost
 * all uses in Backstage.
 */
export declare class DefaultCacheClient implements CacheClient {
    private readonly client;
    constructor({ client }: CacheClientArgs);
    get(key: string): Promise<JsonValue | undefined>;
    set(key: string, value: JsonValue, opts?: CacheClientSetOptions): Promise<void>;
    delete(key: string): Promise<void>;
    /**
     * Ensures keys are well-formed for any/all cache stores.
     */
    private getNormalizedKey;
}
export {};
