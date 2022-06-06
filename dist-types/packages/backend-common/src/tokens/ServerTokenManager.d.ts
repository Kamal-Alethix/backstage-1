import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { TokenManager } from './types';
/**
 * Options for {@link ServerTokenManager}.
 *
 * @public
 */
export interface ServerTokenManagerOptions {
    /**
     * The logger to use.
     */
    logger: Logger;
}
/**
 * Creates and validates tokens for use during backend-to-backend
 * authentication.
 *
 * @public
 */
export declare class ServerTokenManager implements TokenManager {
    private readonly options;
    private readonly verificationKeys;
    private signingKey;
    private privateKeyPromise;
    private currentTokenPromise;
    /**
     * Creates a token manager that issues static dummy tokens and never fails
     * authentication. This can be useful for testing.
     */
    static noop(): TokenManager;
    static fromConfig(config: Config, options: ServerTokenManagerOptions): ServerTokenManager;
    private constructor();
    private generateKeys;
    getToken(): Promise<{
        token: string;
    }>;
    authenticate(token: string): Promise<void>;
}
