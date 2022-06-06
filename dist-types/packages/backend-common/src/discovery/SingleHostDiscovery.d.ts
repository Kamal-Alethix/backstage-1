import { Config } from '@backstage/config';
import { PluginEndpointDiscovery } from './types';
/**
 * SingleHostDiscovery is a basic PluginEndpointDiscovery implementation
 * that assumes that all plugins are hosted in a single deployment.
 *
 * The deployment may be scaled horizontally, as long as the external URL
 * is the same for all instances. However, internal URLs will always be
 * resolved to the same host, so there won't be any balancing of internal traffic.
 *
 * @public
 */
export declare class SingleHostDiscovery implements PluginEndpointDiscovery {
    private readonly internalBaseUrl;
    private readonly externalBaseUrl;
    /**
     * Creates a new SingleHostDiscovery discovery instance by reading
     * from the `backend` config section, specifically the `.baseUrl` for
     * discovering the external URL, and the `.listen` and `.https` config
     * for the internal one.
     *
     * The basePath defaults to `/api`, meaning the default full internal
     * path for the `catalog` plugin will be `http://localhost:7007/api/catalog`.
     */
    static fromConfig(config: Config, options?: {
        basePath?: string;
    }): SingleHostDiscovery;
    private constructor();
    getBaseUrl(pluginId: string): Promise<string>;
    getExternalBaseUrl(pluginId: string): Promise<string>;
}
