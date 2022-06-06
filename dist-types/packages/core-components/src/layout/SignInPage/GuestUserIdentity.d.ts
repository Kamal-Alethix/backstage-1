import { IdentityApi, ProfileInfo, BackstageUserIdentity } from '@backstage/core-plugin-api';
export declare class GuestUserIdentity implements IdentityApi {
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
