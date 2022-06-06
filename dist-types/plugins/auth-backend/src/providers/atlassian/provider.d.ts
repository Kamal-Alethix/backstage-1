import { OAuthHandlers, OAuthProviderOptions, OAuthRefreshRequest, OAuthResponse, OAuthResult, OAuthStartRequest } from '../../lib/oauth';
import { AuthHandler, AuthResolverContext, RedirectInfo, SignInResolver } from '../types';
import express from 'express';
export declare type AtlassianAuthProviderOptions = OAuthProviderOptions & {
    scopes: string;
    signInResolver?: SignInResolver<OAuthResult>;
    authHandler: AuthHandler<OAuthResult>;
    resolverContext: AuthResolverContext;
};
export declare const atlassianDefaultAuthHandler: AuthHandler<OAuthResult>;
export declare class AtlassianAuthProvider implements OAuthHandlers {
    private readonly _strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    constructor(options: AtlassianAuthProviderOptions);
    start(req: OAuthStartRequest): Promise<RedirectInfo>;
    handler(req: express.Request): Promise<{
        response: OAuthResponse;
        refreshToken: string | undefined;
    }>;
    private handleResult;
    refresh(req: OAuthRefreshRequest): Promise<{
        response: OAuthResponse;
        refreshToken: string | undefined;
    }>;
}
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export declare type AtlassianProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * Auth provider integration for atlassian auth
 *
 * @public
 */
export declare const atlassian: Readonly<{
    create: (options?: {
        /**
         * The profile transformation function used to verify and convert the auth response
         * into the profile that will be presented to the user.
         */
        authHandler?: AuthHandler<OAuthResult> | undefined;
        /**
         * Configure sign-in for this provider, without it the provider can not be used to sign users in.
         */
        signIn?: {
            resolver: SignInResolver<OAuthResult>;
        } | undefined;
    } | undefined) => import("../types").AuthProviderFactory;
    resolvers: never;
}>;
/**
 * @public
 * @deprecated Use `providers.atlassian.create` instead
 */
export declare const createAtlassianProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => import("../types").AuthProviderFactory;
