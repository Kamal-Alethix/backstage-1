/**
 * Interface for creating and validating tokens.
 *
 * @public
 */
export interface TokenManager {
    /**
     * Fetches a valid token.
     *
     * @remarks
     *
     * Tokens are valid for roughly one hour; the actual deadline is set in the
     * payload `exp` claim. Never hold on to tokens for reuse; always ask for a
     * new one for each outgoing request. This ensures that you always get a
     * valid, fresh one.
     */
    getToken(): Promise<{
        token: string;
    }>;
    /**
     * Validates a given token.
     */
    authenticate(token: string): Promise<void>;
}
