import express from 'express';
import { RedirectInfo, SignInResolver, AuthHandler, AuthResolverContext } from '../types';
import { OAuthProviderOptions, OAuthHandlers, OAuthResponse, OAuthStartRequest, OAuthRefreshRequest, OAuthResult } from '../../lib/oauth';
export declare type GitlabAuthProviderOptions = OAuthProviderOptions & {
    baseUrl: string;
    signInResolver?: SignInResolver<OAuthResult>;
    authHandler: AuthHandler<OAuthResult>;
    resolverContext: AuthResolverContext;
};
export declare const gitlabUsernameEntityNameSignInResolver: SignInResolver<OAuthResult>;
export declare const gitlabDefaultAuthHandler: AuthHandler<OAuthResult>;
export declare class GitlabAuthProvider implements OAuthHandlers {
    private readonly _strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    constructor(options: GitlabAuthProviderOptions);
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
export declare type GitlabProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    /**
     * Maps an auth result to a Backstage identity for the user.
     *
     * Set to `'email'` to use the default email-based sign in resolver, which will search
     * the catalog for a single user entity that has a matching `microsoft.com/email` annotation.
     */
    signIn?: {
        resolver: SignInResolver<OAuthResult>;
    };
};
/**
 * Auth provider integration for GitLab auth
 *
 * @public
 */
export declare const gitlab: Readonly<{
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
 * @deprecated Use `providers.gitlab.create` instead
 */
export declare const createGitlabProvider: (options?: {
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
