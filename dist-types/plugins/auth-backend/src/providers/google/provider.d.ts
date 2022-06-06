import express from 'express';
import { OAuthHandlers, OAuthProviderOptions, OAuthRefreshRequest, OAuthResponse, OAuthResult, OAuthStartRequest } from '../../lib/oauth';
import { AuthHandler, AuthResolverContext, RedirectInfo, SignInResolver } from '../types';
declare type Options = OAuthProviderOptions & {
    signInResolver?: SignInResolver<OAuthResult>;
    authHandler: AuthHandler<OAuthResult>;
    resolverContext: AuthResolverContext;
};
export declare class GoogleAuthProvider implements OAuthHandlers {
    private readonly strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    constructor(options: Options);
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
export declare type GoogleProviderOptions = {
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
 * Auth provider integration for Google auth
 *
 * @public
 */
export declare const google: Readonly<{
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
    resolvers: Readonly<{
        /**
         * Looks up the user by matching their email local part to the entity name.
         */
        emailLocalPartMatchingUserEntityName: () => SignInResolver<unknown>;
        /**
         * Looks up the user by matching their email to the entity email.
         */
        emailMatchingUserEntityProfileEmail: () => SignInResolver<unknown>;
        /**
         * Looks up the user by matching their email to the `google.com/email` annotation.
         */
        emailMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
    }>;
}>;
/**
 * @public
 * @deprecated Use `providers.google.create` instead.
 */
export declare const createGoogleProvider: (options?: {
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
/**
 * @public
 * @deprecated Use `providers.google.resolvers.emailMatchingUserEntityAnnotation()` instead.
 */
export declare const googleEmailSignInResolver: SignInResolver<OAuthResult>;
export {};
