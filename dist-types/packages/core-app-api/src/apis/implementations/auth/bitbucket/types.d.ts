import { ProfileInfo, BackstageIdentityResponse } from '@backstage/core-plugin-api';
/**
 * Session information for Bitbucket auth.
 *
 * @public
 */
export declare type BitbucketSession = {
    providerInfo: {
        accessToken: string;
        scopes: Set<string>;
        expiresAt?: Date;
    };
    profile: ProfileInfo;
    backstageIdentity: BackstageIdentityResponse;
};
