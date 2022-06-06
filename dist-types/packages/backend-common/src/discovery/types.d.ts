/**
 * The PluginEndpointDiscovery is used to provide a mechanism for backend
 * plugins to discover the endpoints for itself or other backend plugins.
 *
 * The purpose of the discovery API is to allow for many different deployment
 * setups and routing methods through a central configuration, instead
 * of letting each individual plugin manage that configuration.
 *
 * Implementations of the discovery API can be as simple as a URL pattern
 * using the pluginId, but could also have overrides for individual plugins,
 * or query a separate discovery service.
 *
 * @public
 */
export declare type PluginEndpointDiscovery = {
    /**
     * Returns the internal HTTP base URL for a given plugin, without a trailing slash.
     *
     * The returned URL should point to an internal endpoint for the plugin, with
     * the shortest route possible. The URL should be used for service-to-service
     * communication within a Backstage backend deployment.
     *
     * This method must always be called just before making a request, as opposed to
     * fetching the URL when constructing an API client. That is to ensure that more
     * flexible routing patterns can be supported.
     *
     * For example, asking for the URL for `catalog` may return something
     * like `http://10.1.2.3/api/catalog`
     */
    getBaseUrl(pluginId: string): Promise<string>;
    /**
     * Returns the external HTTP base backend URL for a given plugin, without a trailing slash.
     *
     * The returned URL should point to an external endpoint for the plugin, such that
     * it is reachable from the Backstage frontend and other external services. The returned
     * URL should be usable for example as a callback / webhook URL.
     *
     * The returned URL should be stable and in general not change unless other static
     * or external configuration is changed. Changes should not come as a surprise
     * to an operator of the Backstage backend.
     *
     * For example, asking for the URL for `catalog` may return something
     * like `https://backstage.example.com/api/catalog`
     */
    getExternalBaseUrl(pluginId: string): Promise<string>;
};
