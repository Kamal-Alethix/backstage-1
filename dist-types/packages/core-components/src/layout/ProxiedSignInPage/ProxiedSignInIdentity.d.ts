import { BackstageUserIdentity, discoveryApiRef, IdentityApi, ProfileInfo } from '@backstage/core-plugin-api';
import { ProxiedSession } from './types';
export declare const DEFAULTS: {
    readonly defaultTokenExpiryMillis: number;
    readonly tokenExpiryMarginMillis: number;
};
export declare function tokenToExpiry(jwtToken: string | undefined): Date;
declare type ProxiedSignInIdentityOptions = {
    provider: string;
    discoveryApi: typeof discoveryApiRef.T;
};
/**
 * An identity API that gets the user auth information solely based on a
 * provider's `/refresh` endpoint.
 */
export declare class ProxiedSignInIdentity implements IdentityApi {
    private readonly options;
    private readonly abortController;
    private state;
    constructor(options: ProxiedSignInIdentityOptions);
    start(): Promise<void>;
    /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getUserId} */
    getUserId(): string;
    /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getIdToken} */
    getIdToken(): Promise<string | undefined>;
    /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getProfile} */
    getProfile(): ProfileInfo;
    /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getProfileInfo} */
    getProfileInfo(): Promise<ProfileInfo>;
    /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getBackstageIdentity} */
    getBackstageIdentity(): Promise<BackstageUserIdentity>;
    /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getCredentials} */
    getCredentials(): Promise<{
        token?: string | undefined;
    }>;
    /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.signOut} */
    signOut(): Promise<void>;
    getSessionSync(): ProxiedSession;
    getSessionAsync(): Promise<ProxiedSession>;
    fetchSession(): Promise<ProxiedSession>;
}
export {};
