import { oneloginAuthApiRef, OAuthRequestApi, AuthProviderInfo, DiscoveryApi } from '@backstage/core-plugin-api';
/**
 * OneLogin auth provider create options.
 * @public
 */
export declare type OneLoginAuthCreateOptions = {
    discoveryApi: DiscoveryApi;
    oauthRequestApi: OAuthRequestApi;
    environment?: string;
    provider?: AuthProviderInfo;
};
/**
 * Implements a OneLogin OAuth flow.
 *
 * @public
 */
export default class OneLoginAuth {
    static create(options: OneLoginAuthCreateOptions): typeof oneloginAuthApiRef.T;
}
