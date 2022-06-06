import express from 'express';
import { Profile as PassportProfile } from 'passport';
import { RedirectInfo, AuthHandler, SignInResolver, StateEncoder, AuthResolverContext } from '../types';
import { OAuthProviderOptions, OAuthHandlers, OAuthStartRequest, OAuthRefreshRequest } from '../../lib/oauth';
export declare type GithubOAuthResult = {
    fullProfile: PassportProfile;
    params: {
        scope: string;
        expires_in?: string;
        refresh_token_expires_in?: string;
    };
    accessToken: string;
    refreshToken?: string;
};
export declare type GithubAuthProviderOptions = OAuthProviderOptions & {
    tokenUrl?: string;
    userProfileUrl?: string;
    authorizationUrl?: string;
    signInResolver?: SignInResolver<GithubOAuthResult>;
    authHandler: AuthHandler<GithubOAuthResult>;
    stateEncoder: StateEncoder;
    resolverContext: AuthResolverContext;
};
export declare class GithubAuthProvider implements OAuthHandlers {
    private readonly _strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    private readonly stateEncoder;
    constructor(options: GithubAuthProviderOptions);
    start(req: OAuthStartRequest): Promise<RedirectInfo>;
    handler(req: express.Request): Promise<{
        response: {
            backstageIdentity: import("@backstage/plugin-auth-node").BackstageSignInResult | undefined;
            providerInfo: {
                accessToken: string;
                scope: string;
                expiresInSeconds: number | undefined;
            };
            profile: import("../types").ProfileInfo;
        };
        refreshToken: string | undefined;
    }>;
    refresh(req: OAuthRefreshRequest): Promise<{
        response: {
            backstageIdentity: import("@backstage/plugin-auth-node").BackstageSignInResult | undefined;
            providerInfo: {
                accessToken: string;
                scope: string;
                expiresInSeconds: number | undefined;
            };
            profile: import("../types").ProfileInfo;
        };
        refreshToken: string | undefined;
    }>;
    private handleResult;
}
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export declare type GithubProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<GithubOAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<GithubOAuthResult>;
    };
    /**
     * The state encoder used to encode the 'state' parameter on the OAuth request.
     *
     * It should return a string that takes the state params (from the request), url encodes the params
     * and finally base64 encodes them.
     *
     * Providing your own stateEncoder will allow you to add addition parameters to the state field.
     *
     * It is typed as follows:
     *   `export type StateEncoder = (input: OAuthState) => Promise<{encodedState: string}>;`
     *
     * Note: the stateEncoder must encode a 'nonce' value and an 'env' value. Without this, the OAuth flow will fail
     * (These two values will be set by the req.state by default)
     *
     * For more information, please see the helper module in ../../oauth/helpers #readState
     */
    stateEncoder?: StateEncoder;
};
/**
 * Auth provider integration for GitHub auth
 *
 * @public
 */
export declare const github: Readonly<{
    create: (options?: {
        /**
         * The profile transformation function used to verify and convert the auth response
         * into the profile that will be presented to the user.
         */
        authHandler?: AuthHandler<GithubOAuthResult> | undefined;
        /**
         * Configure sign-in for this provider, without it the provider can not be used to sign users in.
         */
        signIn?: {
            /**
             * Maps an auth result to a Backstage identity for the user.
             */
            resolver: SignInResolver<GithubOAuthResult>;
        } | undefined;
        /**
         * The state encoder used to encode the 'state' parameter on the OAuth request.
         *
         * It should return a string that takes the state params (from the request), url encodes the params
         * and finally base64 encodes them.
         *
         * Providing your own stateEncoder will allow you to add addition parameters to the state field.
         *
         * It is typed as follows:
         *   `export type StateEncoder = (input: OAuthState) => Promise<{encodedState: string}>;`
         *
         * Note: the stateEncoder must encode a 'nonce' value and an 'env' value. Without this, the OAuth flow will fail
         * (These two values will be set by the req.state by default)
         *
         * For more information, please see the helper module in ../../oauth/helpers #readState
         */
        stateEncoder?: StateEncoder | undefined;
    } | undefined) => import("../types").AuthProviderFactory;
    resolvers: Readonly<{
        /**
         * Looks up the user by matching their GitHub username to the entity name.
         */
        usernameMatchingUserEntityName: () => SignInResolver<GithubOAuthResult>;
    }>;
}>;
/**
 * @public
 * @deprecated Use `providers.github.create` instead
 */
export declare const createGithubProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<GithubOAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<GithubOAuthResult>;
    } | undefined;
    /**
     * The state encoder used to encode the 'state' parameter on the OAuth request.
     *
     * It should return a string that takes the state params (from the request), url encodes the params
     * and finally base64 encodes them.
     *
     * Providing your own stateEncoder will allow you to add addition parameters to the state field.
     *
     * It is typed as follows:
     *   `export type StateEncoder = (input: OAuthState) => Promise<{encodedState: string}>;`
     *
     * Note: the stateEncoder must encode a 'nonce' value and an 'env' value. Without this, the OAuth flow will fail
     * (These two values will be set by the req.state by default)
     *
     * For more information, please see the helper module in ../../oauth/helpers #readState
     */
    stateEncoder?: StateEncoder | undefined;
} | undefined) => import("../types").AuthProviderFactory;
