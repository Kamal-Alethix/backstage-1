import { Logger } from 'winston';
import { AnyJWK, KeyStore, TokenIssuer, TokenParams } from './types';
declare type Options = {
    logger: Logger;
    /** Value of the issuer claim in issued tokens */
    issuer: string;
    /** Key store used for storing signing keys */
    keyStore: KeyStore;
    /** Expiration time of signing keys in seconds */
    keyDurationSeconds: number;
    /** JWS "alg" (Algorithm) Header Parameter value. Defaults to ES256.
     * Must match one of the algorithms defined for IdentityClient.
     * When setting a different algorithm, check if the `key` field
     * of the `signing_keys` table can fit the length of the generated keys.
     * If not, add a knex migration file in the migrations folder.
     * More info on supported algorithms: https://github.com/panva/jose */
    algorithm?: string;
};
/**
 * A token issuer that is able to issue tokens in a distributed system
 * backed by a single database. Tokens are issued using lazily generated
 * signing keys, where each running instance of the auth service uses its own
 * signing key.
 *
 * The public parts of the keys are all stored in the shared key storage,
 * and any of the instances of the auth service will return the full list
 * of public keys that are currently in storage.
 *
 * Signing keys are automatically rotated at the same interval as the token
 * duration. Expired keys are kept in storage until there are no valid tokens
 * in circulation that could have been signed by that key.
 */
export declare class TokenFactory implements TokenIssuer {
    private readonly issuer;
    private readonly logger;
    private readonly keyStore;
    private readonly keyDurationSeconds;
    private readonly algorithm;
    private keyExpiry?;
    private privateKeyPromise?;
    constructor(options: Options);
    issueToken(params: TokenParams): Promise<string>;
    listPublicKeys(): Promise<{
        keys: AnyJWK[];
    }>;
    private getKey;
}
export {};
