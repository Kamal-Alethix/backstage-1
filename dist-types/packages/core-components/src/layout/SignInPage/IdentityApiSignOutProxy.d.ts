import { BackstageUserIdentity, IdentityApi, ProfileInfo } from '@backstage/core-plugin-api';
declare type CompatibilityIdentityApi = IdentityApi & {
    getUserId?(): string;
    getIdToken?(): Promise<string | undefined>;
    getProfile?(): ProfileInfo;
};
export declare class IdentityApiSignOutProxy implements IdentityApi {
    private readonly config;
    private constructor();
    static from(config: {
        identityApi: CompatibilityIdentityApi;
        signOut: IdentityApi['signOut'];
    }): IdentityApi;
    getUserId(): string;
    getIdToken(): Promise<string | undefined>;
    getProfile(): ProfileInfo;
    getProfileInfo(): Promise<ProfileInfo>;
    getBackstageIdentity(): Promise<BackstageUserIdentity>;
    getCredentials(): Promise<{
        token?: string | undefined;
    }>;
    signOut(): Promise<void>;
}
export {};
