import express from 'express';
import { OAuthProviderOptions, OAuthHandlers, OAuthResponse, OAuthStartRequest, OAuthRefreshRequest, OAuthResult } from '../../lib/oauth';
import { AuthHandler, RedirectInfo, SignInResolver, AuthResolverContext } from '../types';
export declare type OktaAuthProviderOptions = OAuthProviderOptions & {
    audience: string;
    signInResolver?: SignInResolver<OAuthResult>;
    authHandler: AuthHandler<OAuthResult>;
    resolverContext: AuthResolverContext;
};
export declare class OktaAuthProvider implements OAuthHandlers {
    private readonly strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    /**
     * Due to passport-okta-oauth forcing options.state = true,
     * passport-oauth2 requires express-session to be installed
     * so that the 'state' parameter of the oauth2 flow can be stored.
     * This implementation of StateStore matches the NullStore found within
     * passport-oauth2, which is the StateStore implementation used when options.state = false,
     * allowing us to avoid using express-session in order to integrate with Okta.
     */
    private store;
    constructor(options: OktaAuthProviderOptions);
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
export declare type OktaProviderOptions = {
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
 * Auth provider integration for Okta auth
 *
 * @public
 */
export declare const okta: Readonly<{
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
         * Looks up the user by matching their email to the `okta.com/email` annotation.
         */
        emailMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
    }>;
}>;
/**
 * @public
 * @deprecated Use `providers.okta.create` instead
 */
export declare const createOktaProvider: (options?: {
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
 * @deprecated Use `providers.okta.resolvers.emailMatchingUserEntityAnnotation()` instead.
 */
export declare const oktaEmailSignInResolver: SignInResolver<OAuthResult>;
