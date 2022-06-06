import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { BackstageIdentityResponse } from './types';
/**
 * An identity client options object which allows extra configurations
 *
 * @experimental This is not a stable API yet
 * @public
 */
export declare type IdentityClientOptions = {
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
export declare class IdentityClient {
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
