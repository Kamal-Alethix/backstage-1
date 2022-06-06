import { DiscoveryApi } from '@backstage/core-plugin-api';
import { FetchMiddleware } from './types';
/**
 * Handles translation from plugin://some-plugin-id/<path> to concrete http(s)
 * URLs.
 */
export declare class PluginProtocolResolverFetchMiddleware implements FetchMiddleware {
    private readonly discoveryApi;
    constructor(discoveryApi: DiscoveryApi);
    apply(next: typeof fetch): typeof fetch;
}
