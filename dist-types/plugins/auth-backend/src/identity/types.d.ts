/** Represents any form of serializable JWK */
export interface AnyJWK extends Record<string, string> {
    use: 'sig';
    alg: string;
    kid: string;
    kty: string;
}
/**
 * Parameters used to issue new ID Tokens
 *
 * @public
 */
export declare type TokenParams = {
    /** The claims that will be embedded within the token */
    claims: {
        /** The token subject, i.e. User ID */
        sub: string;
        /** A list of entity references that the user claims ownership through */
        ent?: string[];
    };
};
/**
 * A TokenIssuer is able to issue verifiable ID Tokens on demand.
 *
 * @public
 * @deprecated This interface is deprecated and will be removed in a future release.
 */
export declare type TokenIssuer = {
    /**
     * Issues a new ID Token
     */
    issueToken(params: TokenParams): Promise<string>;
    /**
     * List all public keys that are currently being used to sign tokens, or have been used
     * in the past within the token expiration time, including a grace period.
     */
    listPublicKeys(): Promise<{
        keys: AnyJWK[];
    }>;
};
/**
 * A JWK stored by a KeyStore
 */
export declare type StoredKey = {
    key: AnyJWK;
    createdAt: Date;
};
/**
 * A KeyStore stores JWKs for later and shared use.
 */
export declare type KeyStore = {
    /**
     * Store a new key to be used for signing.
     */
    addKey(key: AnyJWK): Promise<void>;
    /**
     * Remove all keys with the provided kids.
     */
    removeKeys(kids: string[]): Promise<void>;
    /**
     * List all stored keys.
     */
    listKeys(): Promise<{
        items: StoredKey[];
    }>;
};
