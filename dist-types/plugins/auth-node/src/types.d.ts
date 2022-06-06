/**
 * A representation of a successful Backstage sign-in.
 *
 * Compared to the {@link BackstageIdentityResponse} this type omits
 * the decoded identity information embedded in the token.
 *
 * @public
 */
export interface BackstageSignInResult {
    /**
     * The token used to authenticate the user within Backstage.
     */
    token: string;
}
/**
 * Response object containing the {@link BackstageUserIdentity} and the token
 * from the authentication provider.
 *
 * @public
 */
export interface BackstageIdentityResponse extends BackstageSignInResult {
    /**
     * A plaintext description of the identity that is encapsulated within the token.
     */
    identity: BackstageUserIdentity;
}
/**
 * User identity information within Backstage.
 *
 * @public
 */
export declare type BackstageUserIdentity = {
    /**
     * The type of identity that this structure represents. In the frontend app
     * this will currently always be 'user'.
     */
    type: 'user';
    /**
     * The entityRef of the user in the catalog.
     * For example User:default/sandra
     */
    userEntityRef: string;
    /**
     * The user and group entities that the user claims ownership through
     */
    ownershipEntityRefs: string[];
};
