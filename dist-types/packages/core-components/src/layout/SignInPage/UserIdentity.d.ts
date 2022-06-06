import { IdentityApi, ProfileInfo, ProfileInfoApi, BackstageUserIdentity, BackstageIdentityApi, SessionApi } from '@backstage/core-plugin-api';
/**
 * An implementation of the IdentityApi that is constructed using
 * various backstage user identity representations.
 *
 * @public
 */
export declare class UserIdentity implements IdentityApi {
    private readonly identity;
    private readonly authApi;
    private readonly profile?;
    private profilePromise?;
    /**
     * Creates a new IdentityApi that acts as a Guest User.
     *
     * @public
     */
    static createGuest(): IdentityApi;
    /**
     * Creates a new IdentityApi using a legacy SignInResult object.
     *
     * @public
     */
    static fromLegacy(result: {
        /**
         * User ID that will be returned by the IdentityApi
         */
        userId: string;
        profile: ProfileInfo;
        /**
         * Function used to retrieve an ID token for the signed in user.
         */
        getIdToken?: () => Promise<string>;
        /**
         * Sign out handler that will be called if the user requests to sign out.
         */
        signOut?: () => Promise<void>;
    }): IdentityApi;
    /**
     * Creates a new IdentityApi implementation using a user identity
     * and an auth API that will be used to request backstage tokens.
     *
     * @public
     */
    static create(options: {
        identity: BackstageUserIdentity;
        authApi: ProfileInfoApi & BackstageIdentityApi & SessionApi;
        /**
         * Passing a profile synchronously allows the deprecated `getProfile` method to be
         * called by consumers of the {@link @backstage/core-plugin-api#IdentityApi}. If you
         * do not have any consumers of that method then this is safe to leave out.
         *
         * @deprecated Only provide this if you have plugins that call the synchronous `getProfile` method, which is also deprecated.
         */
        profile?: ProfileInfo;
    }): IdentityApi;
    private constructor();
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
}
