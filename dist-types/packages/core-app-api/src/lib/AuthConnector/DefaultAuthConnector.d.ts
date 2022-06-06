import { OAuthRequestApi, AuthProviderInfo, DiscoveryApi } from '@backstage/core-plugin-api';
import { AuthConnector, CreateSessionOptions } from './types';
declare type Options<AuthSession> = {
    /**
     * DiscoveryApi instance used to locate the auth backend endpoint.
     */
    discoveryApi: DiscoveryApi;
    /**
     * Environment hint passed on to auth backend, for example 'production' or 'development'
     */
    environment: string;
    /**
     * Information about the auth provider to be shown to the user.
     * The ID Must match the backend auth plugin configuration, for example 'google'.
     */
    provider: AuthProviderInfo;
    /**
     * API used to instantiate an auth requester.
     */
    oauthRequestApi: OAuthRequestApi;
    /**
     * Function used to join together a set of scopes, defaults to joining with a space character.
     */
    joinScopes?: (scopes: Set<string>) => string;
    /**
     * Function used to transform an auth response into the session type.
     */
    sessionTransform?(response: any): AuthSession | Promise<AuthSession>;
};
/**
 * DefaultAuthConnector is the default auth connector in Backstage. It talks to the
 * backend auth plugin through the standardized API, and requests user permission
 * via the OAuthRequestApi.
 */
export declare class DefaultAuthConnector<AuthSession> implements AuthConnector<AuthSession> {
    private readonly discoveryApi;
    private readonly environment;
    private readonly provider;
    private readonly joinScopesFunc;
    private readonly authRequester;
    private readonly sessionTransform;
    constructor(options: Options<AuthSession>);
    createSession(options: CreateSessionOptions): Promise<AuthSession>;
    refreshSession(): Promise<any>;
    removeSession(): Promise<void>;
    private showPopup;
    private buildUrl;
    private buildQueryString;
}
export {};
