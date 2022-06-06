import { DiscoveryApi } from '@backstage/core-plugin-api';
/**
 * UrlPatternDiscovery is a lightweight DiscoveryApi implementation.
 * It uses a single template string to construct URLs for each plugin.
 *
 * @public
 */
export declare class UrlPatternDiscovery implements DiscoveryApi {
    private readonly parts;
    /**
     * Creates a new UrlPatternDiscovery given a template. The the only
     * interpolation done for the template is to replace instances of `{{pluginId}}`
     * with the ID of the plugin being requested.
     *
     * Example pattern: `http://localhost:7007/api/{{ pluginId }}`
     */
    static compile(pattern: string): UrlPatternDiscovery;
    private constructor();
    getBaseUrl(pluginId: string): Promise<string>;
}
