import express from 'express';
import { TokenPayload } from 'google-auth-library';
import { AuthHandler, AuthProviderRouteHandlers, AuthResolverContext, SignInResolver } from '../types';
import { GcpIapResult } from './types';
export declare class GcpIapProvider implements AuthProviderRouteHandlers {
    private readonly authHandler;
    private readonly signInResolver;
    private readonly tokenValidator;
    private readonly resolverContext;
    constructor(options: {
        authHandler: AuthHandler<GcpIapResult>;
        signInResolver: SignInResolver<GcpIapResult>;
        tokenValidator: (token: string) => Promise<TokenPayload>;
        resolverContext: AuthResolverContext;
    });
    start(): Promise<void>;
    frameHandler(): Promise<void>;
    refresh(req: express.Request, res: express.Response): Promise<void>;
}
/**
 * Auth provider integration for Google Identity-Aware Proxy auth
 *
 * @public
 */
export declare const gcpIap: Readonly<{
    create: (options: {
        /**
         * The profile transformation function used to verify and convert the auth
         * response into the profile that will be presented to the user. The default
         * implementation just provides the authenticated email that the IAP
         * presented.
         */
        authHandler?: AuthHandler<GcpIapResult> | undefined;
        /**
         * Configures sign-in for this provider.
         */
        signIn: {
            /**
             * Maps an auth result to a Backstage identity for the user.
             */
            resolver: SignInResolver<GcpIapResult>;
        };
    }) => import("../types").AuthProviderFactory;
    resolvers: never;
}>;
/**
 * @public
 * @deprecated Use `providers.gcpIap.create` instead
 */
export declare const createGcpIapProvider: (options: {
    /**
     * The profile transformation function used to verify and convert the auth
     * response into the profile that will be presented to the user. The default
     * implementation just provides the authenticated email that the IAP
     * presented.
     */
    authHandler?: AuthHandler<GcpIapResult> | undefined;
    /**
     * Configures sign-in for this provider.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<GcpIapResult>;
    };
}) => import("../types").AuthProviderFactory;
