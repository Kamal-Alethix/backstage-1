import express from 'express';
import { OAuthProviderOptions, OAuthHandlers, OAuthResponse, OAuthStartRequest, OAuthRefreshRequest, OAuthResult } from '../../lib/oauth';
import { RedirectInfo, AuthHandler, SignInResolver, AuthResolverContext } from '../types';
export declare type Auth0AuthProviderOptions = OAuthProviderOptions & {
    domain: string;
    signInResolver?: SignInResolver<OAuthResult>;
    authHandler: AuthHandler<OAuthResult>;
    resolverContext: AuthResolverContext;
};
export declare class Auth0AuthProvider implements OAuthHandlers {
    private readonly _strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    constructor(options: Auth0AuthProviderOptions);
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
}
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export declare type Auth0ProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * Auth provider integration for auth0 auth
 *
 * @public
 */
export declare const auth0: Readonly<{
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
            /**
             * Maps an auth result to a Backstage identity for the user.
             */
            resolver: SignInResolver<OAuthResult>;
        } | undefined;
    } | undefined) => import("../types").AuthProviderFactory;
    resolvers: never;
}>;
/**
 * @public
 * @deprecated Use `providers.auth0.create` instead.
 */
export declare const createAuth0Provider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuthResult>;
    } | undefined;
} | undefined) => import("../types").AuthProviderFactory;
