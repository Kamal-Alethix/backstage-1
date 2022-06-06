import { AuthProviderInfo, DiscoveryApi, OAuthRequestApi } from '@backstage/core-plugin-api';
/**
 * Create options for OAuth APIs.
 * @public
 */
export declare type OAuthApiCreateOptions = AuthApiCreateOptions & {
    oauthRequestApi: OAuthRequestApi;
    defaultScopes?: string[];
};
/**
 * Generic create options for auth APIs.
 * @public
 */
export declare type AuthApiCreateOptions = {
    discoveryApi: DiscoveryApi;
    environment?: string;
    provider?: AuthProviderInfo;
};
