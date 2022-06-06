import { SessionState } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { SessionManager, MutableSessionManager, GetSessionOptions } from './types';
declare type Options<T> = {
    /**
     * A callback that is called to determine whether a given session supports refresh
     */
    sessionCanRefresh: (session: T) => boolean;
    /**
     * The session manager that is used if the a session does not support refresh.
     */
    staticSessionManager: MutableSessionManager<T>;
    /**
     * The session manager that is used if the a session supports refresh.
     */
    refreshingSessionManager: SessionManager<T>;
};
/**
 * OptionalRefreshSessionManagerMux wraps two different session managers, one for
 * static session storage and another one that supports refresh. For each session
 * that is retrieved is checked for whether it supports refresh. If it does, the
 * refreshing session manager is used, otherwise the static session manager is used.
 */
export declare class OptionalRefreshSessionManagerMux<T> implements SessionManager<T> {
    private readonly stateTracker;
    private readonly sessionCanRefresh;
    private readonly staticSessionManager;
    private readonly refreshingSessionManager;
    constructor(options: Options<T>);
    getSession(options: GetSessionOptions): Promise<T | undefined>;
    removeSession(): Promise<void>;
    sessionState$(): Observable<SessionState>;
}
export {};
