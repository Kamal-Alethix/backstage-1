import { IdentityApi, ProfileInfo, BackstageUserIdentity } from '@backstage/core-plugin-api';
declare type CompatibilityIdentityApi = IdentityApi & {
    getUserId?(): string;
    getIdToken?(): Promise<string | undefined>;
    getProfile?(): ProfileInfo;
};
/**
 * Implementation of the connection between the App-wide IdentityApi
 * and sign-in page.
 */
export declare class AppIdentityProxy implements IdentityApi {
    private target?;
    private waitForTarget;
    private resolveTarget;
    constructor();
    setTarget(identityApi: CompatibilityIdentityApi): void;
    getUserId(): string;
    getProfile(): ProfileInfo;
    getProfileInfo(): Promise<ProfileInfo>;
    getBackstageIdentity(): Promise<BackstageUserIdentity>;
    getCredentials(): Promise<{
        token?: string | undefined;
    }>;
    getIdToken(): Promise<string | undefined>;
    signOut(): Promise<void>;
}
export {};
