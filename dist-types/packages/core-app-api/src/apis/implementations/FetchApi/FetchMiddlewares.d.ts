import { Config } from '@backstage/config';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { FetchMiddleware } from './types';
/**
 * A collection of common middlewares for the FetchApi.
 *
 * @public
 */
export declare class FetchMiddlewares {
    /**
     * Handles translation from `plugin://` URLs to concrete http(s) URLs based on
     * the discovery API.
     *
     * @remarks
     *
     * If the request is for `plugin://catalog/entities?filter=x=y`, the discovery
     * API will be queried for `'catalog'`. If it returned
     * `https://backstage.example.net/api/catalog`, the resulting query would be
     * `https://backstage.example.net/api/catalog/entities?filter=x=y`.
     *
     * If the incoming URL protocol was not `plugin`, the request is just passed
     * through verbatim to the underlying implementation.
     */
    static resolvePluginProtocol(options: {
        discoveryApi: DiscoveryApi;
    }): FetchMiddleware;
    /**
     * Injects a Backstage token header when the user is signed in.
     *
     * @remarks
     *
     * Per default, an `Authorization: Bearer <token>` is generated. This can be
     * customized using the `header` option.
     *
     * The header injection only happens on allowlisted URLs. Per default, if the
     * `config` option is passed in, the `backend.baseUrl` is allowlisted, unless
     * the `urlPrefixAllowlist` or `allowUrl` options are passed in, in which case
     * they take precedence. If you pass in neither config nor an
     * allowlist/callback, the middleware will have no effect since effectively no
     * request will match the (nonexistent) rules.
     */
    static injectIdentityAuth(options: {
        identityApi: IdentityApi;
        config?: Config;
        urlPrefixAllowlist?: string[];
        allowUrl?: (url: string) => boolean;
        header?: {
            name: string;
            value: (backstageToken: string) => string;
        };
    }): FetchMiddleware;
    private constructor();
}
