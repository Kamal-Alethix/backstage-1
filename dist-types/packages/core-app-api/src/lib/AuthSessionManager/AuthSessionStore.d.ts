import { ZodSchema } from 'zod';
import { MutableSessionManager, SessionScopesFunc, SessionShouldRefreshFunc, GetSessionOptions } from './types';
declare type Options<T> = {
    /** The connector used for acting on the auth session */
    manager: MutableSessionManager<T>;
    /** Storage key to use to store sessions */
    storageKey: string;
    /** The schema used to validate the stored data */
    schema: ZodSchema<T>;
    /** Used to get the scope of the session */
    sessionScopes?: SessionScopesFunc<T>;
    /** Used to check if the session needs to be refreshed, defaults to never refresh */
    sessionShouldRefresh?: SessionShouldRefreshFunc<T>;
};
/**
 * AuthSessionStore decorates another SessionManager with a functionality
 * to store the session in local storage.
 *
 * Session is serialized to JSON with special support for following types: Set.
 */
export declare class AuthSessionStore<T> implements MutableSessionManager<T> {
    private readonly manager;
    private readonly storageKey;
    private readonly schema;
    private readonly sessionShouldRefreshFunc;
    private readonly helper;
    constructor(options: Options<T>);
    setSession(session: T | undefined): void;
    getSession(options: GetSessionOptions): Promise<T | undefined>;
    removeSession(): Promise<void>;
    sessionState$(): import("@backstage/types").Observable<import("@backstage/core-plugin-api").SessionState>;
    private loadSession;
    private saveSession;
}
export {};
