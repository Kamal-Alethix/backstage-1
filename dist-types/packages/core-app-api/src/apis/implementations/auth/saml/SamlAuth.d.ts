import { AuthRequestOptions, BackstageIdentityApi, ProfileInfo, ProfileInfoApi, SessionApi, SessionState, BackstageIdentityResponse } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { AuthApiCreateOptions } from '../types';
export declare type SamlAuthResponse = {
    profile: ProfileInfo;
    backstageIdentity: BackstageIdentityResponse;
};
/**
 * Implements a general SAML based auth flow.
 *
 * @public
 */
export default class SamlAuth implements ProfileInfoApi, BackstageIdentityApi, SessionApi {
    private readonly sessionManager;
    static create(options: AuthApiCreateOptions): SamlAuth;
    sessionState$(): Observable<SessionState>;
    private constructor();
    signIn(): Promise<void>;
    signOut(): Promise<void>;
    getBackstageIdentity(options?: AuthRequestOptions): Promise<BackstageIdentityResponse | undefined>;
    getProfile(options?: AuthRequestOptions): Promise<ProfileInfo | undefined>;
}
