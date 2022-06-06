import { SessionState } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
export declare type GetSessionOptions = {
    optional?: boolean;
    instantPopup?: boolean;
    scopes?: Set<string>;
};
/**
 * A sessions manager keeps track of the current session and makes sure that
 * multiple simultaneous requests for sessions with different scope are handled
 * in a correct way.
 */
export declare type SessionManager<T> = {
    getSession(options: GetSessionOptions): Promise<T | undefined>;
    removeSession(): Promise<void>;
    sessionState$(): Observable<SessionState>;
};
/**
 * An extension of the session manager where the session can also be pushed from the manager.
 */
export interface MutableSessionManager<T> extends SessionManager<T> {
    setSession(session: T | undefined): void;
}
/**
 * A function called to determine the scopes of a session.
 */
export declare type SessionScopesFunc<T> = (session: T) => Set<string>;
/**
 * A function called to determine whether it's time for a session to refresh.
 *
 * This should return true before the session expires, for example, if a session
 * expires after 60 minutes, you could return true if the session is older than 45 minutes.
 */
export declare type SessionShouldRefreshFunc<T> = (session: T) => boolean;
