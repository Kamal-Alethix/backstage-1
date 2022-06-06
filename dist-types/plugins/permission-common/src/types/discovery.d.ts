/**
 * This is a copy of the core DiscoveryApi, to avoid importing core.
 *
 * @public
 */
export declare type DiscoveryApi = {
    getBaseUrl(pluginId: string): Promise<string>;
};
