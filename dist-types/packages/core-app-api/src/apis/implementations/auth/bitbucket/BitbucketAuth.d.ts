import { BackstageIdentityResponse, bitbucketAuthApiRef, ProfileInfo } from '@backstage/core-plugin-api';
import { OAuthApiCreateOptions } from '../types';
export declare type BitbucketAuthResponse = {
    providerInfo: {
        accessToken: string;
        scope: string;
        expiresInSeconds: number;
    };
    profile: ProfileInfo;
    backstageIdentity: BackstageIdentityResponse;
};
/**
 * Implements the OAuth flow to Bitbucket products.
 *
 * @public
 */
export default class BitbucketAuth {
    static create(options: OAuthApiCreateOptions): typeof bitbucketAuthApiRef.T;
}
