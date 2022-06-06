/// <reference types="node" />
import express from 'express';
import { AuthHandler, SignInResolver, AuthProviderRouteHandlers, AuthResolverContext } from '../types';
import { IncomingHttpHeaders } from 'http';
export declare const OAUTH2_PROXY_JWT_HEADER = "X-OAUTH2-PROXY-ID-TOKEN";
/**
 * JWT header extraction result, containing the raw value and the parsed JWT
 * payload.
 *
 * @public
 */
export declare type OAuth2ProxyResult<JWTPayload = {}> = {
    /**
     * The parsed payload of the `accessToken`. The token is only parsed, not verified.
     *
     * @deprecated Access through the `headers` instead. This will be removed in a future release.
     */
    fullProfile: JWTPayload;
    /**
     * The token received via the X-OAUTH2-PROXY-ID-TOKEN header. Will be an empty string
     * if the header is not set. Note the this is typically an OpenID Connect token.
     *
     * @deprecated Access through the `headers` instead. This will be removed in a future release.
     */
    accessToken: string;
    /**
     * The headers of the incoming request from the OAuth2 proxy. This will include
     * both the headers set by the client as well as the ones added by the OAuth2 proxy.
     * You should only trust the headers that are injected by the OAuth2 proxy.
     *
     * Useful headers to use to complete the sign-in are for example `x-forwarded-user`
     * and `x-forwarded-email`. See the OAuth2 proxy documentation for more information
     * about the available headers and how to enable them. In particular it is possible
     * to forward access and identity tokens, which can be user for additional verification
     * and lookups.
     */
    headers: IncomingHttpHeaders;
    /**
     * Provides convenient access to the request headers.
     *
     * This call is simply forwarded to `req.get(name)`.
     */
    getHeader(name: string): string | undefined;
};
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export declare type Oauth2ProxyProviderOptions<JWTPayload> = {
    /**
     * Configure an auth handler to generate a profile for the user.
     */
    authHandler: AuthHandler<OAuth2ProxyResult<JWTPayload>>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuth2ProxyResult<JWTPayload>>;
    };
};
interface Options<JWTPayload> {
    resolverContext: AuthResolverContext;
    signInResolver: SignInResolver<OAuth2ProxyResult<JWTPayload>>;
    authHandler: AuthHandler<OAuth2ProxyResult<JWTPayload>>;
}
export declare class Oauth2ProxyAuthProvider<JWTPayload> implements AuthProviderRouteHandlers {
    private readonly resolverContext;
    private readonly signInResolver;
    private readonly authHandler;
    constructor(options: Options<JWTPayload>);
    frameHandler(): Promise<void>;
    refresh(req: express.Request, res: express.Response): Promise<void>;
    start(): Promise<void>;
    private handleResult;
}
/**
 * Auth provider integration for oauth2-proxy auth
 *
 * @public
 */
export declare const oauth2Proxy: Readonly<{
    create: (options: {
        /**
         * Configure an auth handler to generate a profile for the user.
         *
         * The default implementation uses the value of the `X-Forwarded-Preferred-Username`
         * header as the display name, falling back to `X-Forwarded-User`, and the value of
         * the `X-Forwarded-Email` header as the email address.
         */
        authHandler?: AuthHandler<OAuth2ProxyResult<unknown>> | undefined;
        /**
         * Configure sign-in for this provider, without it the provider can not be used to sign users in.
         */
        signIn: {
            /**
             * Maps an auth result to a Backstage identity for the user.
             */
            resolver: SignInResolver<OAuth2ProxyResult<unknown>>;
        };
    }) => import("../types").AuthProviderFactory;
    resolvers: never;
}>;
/**
 * @public
 * @deprecated Use `providers.oauth2Proxy.create` instead
 */
export declare const createOauth2ProxyProvider: (options: {
    /**
     * Configure an auth handler to generate a profile for the user.
     *
     * The default implementation uses the value of the `X-Forwarded-Preferred-Username`
     * header as the display name, falling back to `X-Forwarded-User`, and the value of
     * the `X-Forwarded-Email` header as the email address.
     */
    authHandler?: AuthHandler<OAuth2ProxyResult<unknown>> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<OAuth2ProxyResult<unknown>>;
    };
}) => import("../types").AuthProviderFactory;
export {};
