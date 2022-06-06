import { PluginEndpointDiscovery } from '@backstage/backend-common';

/**
 * Parses the given authorization header and returns the bearer token, or
 * undefined if no bearer token is given.
 *
 * @remarks
 *
 * This function is explicitly built to tolerate bad inputs safely, so you may
 * call it directly with e.g. the output of `req.header('authorization')`
 * without first checking that it exists.
 *
 * @public
 */
declare function getBearerTokenFromAuthorizationHeader(authorizationHeader: unknown): string | undefined;

/**
 * A representation of a successful Backstage sign-in.
 *
 * Compared to the {@link BackstageIdentityResponse} this type omits
 * the decoded identity information embedded in the token.
 *
 * @public
 */
interface BackstageSignInResult {
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
interface BackstageIdentityResponse extends BackstageSignInResult {
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
declare type BackstageUserIdentity = {
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

/**
 * An identity client options object which allows extra configurations
 *
 * @experimental This is not a stable API yet
 * @public
 */
declare type IdentityClientOptions = {
    discovery: PluginEndpointDiscovery;
    issuer: string;
    /** JWS "alg" (Algorithm) Header Parameter values. Defaults to an array containing just ES256.
     * More info on supported algorithms: https://github.com/panva/jose */
    algorithms?: string[];
};
/**
 * An identity client to interact with auth-backend and authenticate Backstage
 * tokens
 *
 * @experimental This is not a stable API yet
 * @public
 */
declare class IdentityClient {
    private readonly discovery;
    private readonly issuer;
    private readonly algorithms;
    private keyStore?;
    private keyStoreUpdated;
    /**
     * Create a new {@link IdentityClient} instance.
     */
    static create(options: IdentityClientOptions): IdentityClient;
    private constructor();
    /**
     * Verifies the given backstage identity token
     * Returns a BackstageIdentity (user) matching the token.
     * The method throws an error if verification fails.
     */
    authenticate(token: string | undefined): Promise<BackstageIdentityResponse>;
    /**
     * If the last keystore refresh is stale, update the keystore URL to the latest
     */
    private refreshKeyStore;
}

export { BackstageIdentityResponse, BackstageSignInResult, BackstageUserIdentity, IdentityClient, IdentityClientOptions, getBearerTokenFromAuthorizationHeader };
