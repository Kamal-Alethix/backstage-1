import { MutableSessionManager, GetSessionOptions } from './types';
import { AuthConnector } from '../AuthConnector';
declare type Options<T> = {
    /** The connector used for acting on the auth session */
    connector: AuthConnector<T>;
    /** Used to get the scope of the session */
    sessionScopes?: (session: T) => Set<string>;
    /** The default scopes that should always be present in a session, defaults to none. */
    defaultScopes?: Set<string>;
};
/**
 * StaticAuthSessionManager manages an underlying session that does not expire.
 */
export declare class StaticAuthSessionManager<T> implements MutableSessionManager<T> {
    private readonly connector;
    private readonly helper;
    private readonly stateTracker;
    private currentSession;
    constructor(options: Options<T>);
    setSession(session: T | undefined): void;
    getSession(options: GetSessionOptions): Promise<T | undefined>;
    /**
     * We don't call this.connector.removeSession here, since this session manager
     * is intended to be static. As such there's no need to hit the remote logout
     * endpoint - simply discarding the local session state when signing out is
     * enough.
     */
    removeSession(): Promise<void>;
    sessionState$(): import("@backstage/types").Observable<import("@backstage/core-plugin-api").SessionState>;
}
export {};
