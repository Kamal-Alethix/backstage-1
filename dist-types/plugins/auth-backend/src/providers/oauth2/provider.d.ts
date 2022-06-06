import express from 'express';
import { OAuthHandlers, OAuthProviderOptions, OAuthRefreshRequest, OAuthResponse, OAuthResult, OAuthStartRequest } from '../../lib/oauth';
import { AuthHandler, AuthResolverContext, RedirectInfo, SignInResolver } from '../types';
export declare type OAuth2AuthProviderOptions = OAuthProviderOptions & {
    signInResolver?: SignInResolver<OAuthResult>;
    authHandler: AuthHandler<OAuthResult>;
    authorizationUrl: string;
    tokenUrl: string;
    scope?: string;
    resolverContext: AuthResolverContext;
    includeBasicAuth?: boolean;
    disableRefresh?: boolean;
};
export declare class OAuth2AuthProvider implements OAuthHandlers {
    private readonly _strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    private readonly disableRefresh;
    constructor(options: OAuth2AuthProviderOptions);
    start(req: OAuthStartRequest): Promise<RedirectInfo>;
    handler(req: express.Request): Promise<{
        response: OAuthResponse;
        refreshToken: string;
    }>;
    refresh(req: OAuthRefreshRequest): Promise<{
        response: OAuthResponse;
        refreshToken: string | undefined;
    }>;
    private handleResult;
    encodeClientCredentials(clientID: string, clientSecret: string): string;
}
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export declare type OAuth2ProviderOptions = {
    authHandler?: AuthHandler<OAuthResult>;
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * Auth provider integration for generic OAuth2 auth
 *
 * @public
 */
export declare const oauth2: Readonly<{
    create: (options?: {
        authHandler?: AuthHandler<OAuthResult> | undefined;
        signIn?: {
            resolver: SignInResolver<OAuthResult>;
        } | undefined;
    } | undefined) => import("../types").AuthProviderFactory;
    resolvers: never;
}>;
/**
 * @public
 * @deprecated Use `providers.oauth2.create` instead
 */
export declare const createOAuth2Provider: (options?: {
    authHandler?: AuthHandler<OAuthResult> | undefined;
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => import("../types").AuthProviderFactory;
