export declare type CreateSessionOptions = {
    scopes: Set<string>;
    instantPopup?: boolean;
};
/**
 * An AuthConnector is responsible for realizing auth session actions
 * by for example communicating with a backend or interacting with the user.
 */
export declare type AuthConnector<AuthSession> = {
    createSession(options: CreateSessionOptions): Promise<AuthSession>;
    refreshSession(): Promise<AuthSession>;
    removeSession(): Promise<void>;
};
