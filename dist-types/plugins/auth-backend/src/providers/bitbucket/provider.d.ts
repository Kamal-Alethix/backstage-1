import express from 'express';
import { Profile as PassportProfile } from 'passport';
import { OAuthHandlers, OAuthProviderOptions, OAuthRefreshRequest, OAuthResponse, OAuthResult, OAuthStartRequest } from '../../lib/oauth';
import { AuthHandler, RedirectInfo, SignInResolver, AuthResolverContext } from '../types';
declare type Options = OAuthProviderOptions & {
    signInResolver?: SignInResolver<OAuthResult>;
    authHandler: AuthHandler<BitbucketOAuthResult>;
    resolverContext: AuthResolverContext;
};
export declare type BitbucketOAuthResult = {
    fullProfile: BitbucketPassportProfile;
    params: {
        id_token?: string;
        scope: string;
        expires_in: number;
    };
    accessToken: string;
    refreshToken?: string;
};
export declare type BitbucketPassportProfile = PassportProfile & {
    id?: string;
    displayName?: string;
    username?: string;
    avatarUrl?: string;
    _json?: {
        links?: {
            avatar?: {
                href?: string;
            };
        };
    };
};
export declare class BitbucketAuthProvider implements OAuthHandlers {
    private readonly _strategy;
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
export declare type BitbucketProviderOptions = {
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
 * Auth provider integration for BitBucket auth
 *
 * @public
 */
export declare const bitbucket: Readonly<{
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
         * Looks up the user by matching their username to the `bitbucket.org/username` annotation.
         */
        usernameMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
        /**
         * Looks up the user by matching their user ID to the `bitbucket.org/user-id` annotation.
         */
        userIdMatchingUserEntityAnnotation(): SignInResolver<OAuthResult>;
    }>;
}>;
/**
 * @public
 * @deprecated Use `providers.bitbucket.create` instead
 */
export declare const createBitbucketProvider: (options?: {
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
 * @deprecated Use `providers.bitbucket.resolvers.usernameMatchingUserEntityAnnotation()` instead.
 */
export declare const bitbucketUsernameSignInResolver: SignInResolver<OAuthResult>;
/**
 * @public
 * @deprecated Use `providers.bitbucket.resolvers.userIdMatchingUserEntityAnnotation()` instead.
 */
export declare const bitbucketUserIdSignInResolver: SignInResolver<OAuthResult>;
export {};
