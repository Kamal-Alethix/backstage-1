import express from 'express';
import { TokenSet, UserinfoResponse } from 'openid-client';
import { OAuthHandlers, OAuthProviderOptions, OAuthRefreshRequest, OAuthResponse, OAuthStartRequest } from '../../lib/oauth';
import { AuthHandler, AuthResolverContext, RedirectInfo, SignInResolver } from '../types';
/**
 * authentication result for the OIDC which includes the token set and user information (a profile response sent by OIDC server)
 * @public
 */
export declare type OidcAuthResult = {
    tokenset: TokenSet;
    userinfo: UserinfoResponse;
};
export declare type Options = OAuthProviderOptions & {
    metadataUrl: string;
    scope?: string;
    prompt?: string;
    tokenSignedResponseAlg?: string;
    signInResolver?: SignInResolver<OidcAuthResult>;
    authHandler: AuthHandler<OidcAuthResult>;
    resolverContext: AuthResolverContext;
};
export declare class OidcAuthProvider implements OAuthHandlers {
    private readonly implementation;
    private readonly scope?;
    private readonly prompt?;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    constructor(options: Options);
    start(req: OAuthStartRequest): Promise<RedirectInfo>;
    handler(req: express.Request): Promise<{
        response: OAuthResponse;
        refreshToken: string | undefined;
    }>;
    refresh(req: OAuthRefreshRequest): Promise<{
        response: OAuthResponse;
        refreshToken: string | undefined;
    }>;
    private setupStrategy;
    private handleResult;
}
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export declare type OidcProviderOptions = {
    authHandler?: AuthHandler<OidcAuthResult>;
    signIn?: {
        resolver: SignInResolver<OidcAuthResult>;
    };
};
/**
 * Auth provider integration for generic OpenID Connect auth
 *
 * @public
 */
export declare const oidc: Readonly<{
    create: (options?: {
        authHandler?: AuthHandler<OidcAuthResult> | undefined;
        signIn?: {
            resolver: SignInResolver<OidcAuthResult>;
        } | undefined;
    } | undefined) => import("../types").AuthProviderFactory;
    resolvers: never;
}>;
/**
 * @public
 * @deprecated Use `providers.oidc.create` instead
 */
export declare const createOidcProvider: (options?: {
    authHandler?: AuthHandler<OidcAuthResult> | undefined;
    signIn?: {
        resolver: SignInResolver<OidcAuthResult>;
    } | undefined;
} | undefined) => import("../types").AuthProviderFactory;
