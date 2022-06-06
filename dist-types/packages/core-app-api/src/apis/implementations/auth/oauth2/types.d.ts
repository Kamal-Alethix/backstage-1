import { ProfileInfo, BackstageIdentityResponse } from '@backstage/core-plugin-api';
export type { OAuth2CreateOptions } from './OAuth2';
/**
 * Session information for generic OAuth2 auth.
 *
 * @public
 */
export declare type OAuth2Session = {
    providerInfo: {
        idToken: string;
        accessToken: string;
        scopes: Set<string>;
        expiresAt: Date;
    };
    profile: ProfileInfo;
    backstageIdentity: BackstageIdentityResponse;
};
