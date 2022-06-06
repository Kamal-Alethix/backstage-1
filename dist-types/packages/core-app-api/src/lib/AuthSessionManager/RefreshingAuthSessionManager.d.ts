import { SessionManager, SessionScopesFunc, SessionShouldRefreshFunc, GetSessionOptions } from './types';
import { AuthConnector } from '../AuthConnector';
declare type Options<T> = {
    /** The connector used for acting on the auth session */
    connector: AuthConnector<T>;
    /** Used to get the scope of the session */
    sessionScopes: SessionScopesFunc<T>;
    /** Used to check if the session needs to be refreshed */
    sessionShouldRefresh: SessionShouldRefreshFunc<T>;
    /** The default scopes that should always be present in a session, defaults to none. */
    defaultScopes?: Set<string>;
};
/**
 * RefreshingAuthSessionManager manages an underlying session that has
 * and expiration time and needs to be refreshed periodically.
 */
export declare class RefreshingAuthSessionManager<T> implements SessionManager<T> {
    private readonly connector;
    private readonly helper;
    private readonly sessionScopesFunc;
    private readonly sessionShouldRefreshFunc;
    private readonly stateTracker;
    private refreshPromise?;
    private currentSession;
    constructor(options: Options<T>);
    getSession(options: GetSessionOptions): Promise<T | undefined>;
    removeSession(): Promise<void>;
    sessionState$(): import("@backstage/types").Observable<import("@backstage/core-plugin-api").SessionState>;
    private collapsedSessionRefresh;
}
export {};
