import { AuthRequestOptions, BackstageIdentityResponse, OAuthApi, OpenIdConnectApi, ProfileInfo, ProfileInfoApi, SessionState, SessionApi, BackstageIdentityApi } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { OAuthApiCreateOptions } from '../types';
/**
 * OAuth2 create options.
 * @public
 */
export declare type OAuth2CreateOptions = OAuthApiCreateOptions & {
    scopeTransform?: (scopes: string[]) => string[];
};
export declare type OAuth2Response = {
    providerInfo: {
        accessToken: string;
        idToken: string;
        scope: string;
        expiresInSeconds: number;
    };
    profile: ProfileInfo;
    backstageIdentity: BackstageIdentityResponse;
};
/**
 * Implements a generic OAuth2 flow for auth.
 *
 * @public
 */
export default class OAuth2 implements OAuthApi, OpenIdConnectApi, ProfileInfoApi, BackstageIdentityApi, SessionApi {
    static create(options: OAuth2CreateOptions): OAuth2;
    private readonly sessionManager;
    private readonly scopeTransform;
    private constructor();
    signIn(): Promise<void>;
    signOut(): Promise<void>;
    sessionState$(): Observable<SessionState>;
    getAccessToken(scope?: string | string[], options?: AuthRequestOptions): Promise<string>;
    getIdToken(options?: AuthRequestOptions): Promise<string>;
    getBackstageIdentity(options?: AuthRequestOptions): Promise<BackstageIdentityResponse | undefined>;
    getProfile(options?: AuthRequestOptions): Promise<ProfileInfo | undefined>;
    private static normalizeScopes;
}
