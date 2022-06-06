import express from 'express';
import { SamlConfig } from 'passport-saml/lib/passport-saml/types';
import { AuthProviderRouteHandlers, AuthHandler, SignInResolver, AuthResolverContext } from '../types';
/** @public */
export declare type SamlAuthResult = {
    fullProfile: any;
};
declare type Options = SamlConfig & {
    signInResolver?: SignInResolver<SamlAuthResult>;
    authHandler: AuthHandler<SamlAuthResult>;
    resolverContext: AuthResolverContext;
    appUrl: string;
};
export declare class SamlAuthProvider implements AuthProviderRouteHandlers {
    private readonly strategy;
    private readonly signInResolver?;
    private readonly authHandler;
    private readonly resolverContext;
    private readonly appUrl;
    constructor(options: Options);
    start(req: express.Request, res: express.Response): Promise<void>;
    frameHandler(req: express.Request, res: express.Response): Promise<void>;
    logout(_req: express.Request, res: express.Response): Promise<void>;
}
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export declare type SamlProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<SamlAuthResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<SamlAuthResult>;
    };
};
/**
 * Auth provider integration for SAML auth
 *
 * @public
 */
export declare const saml: Readonly<{
    create: (options?: {
        /**
         * The profile transformation function used to verify and convert the auth response
         * into the profile that will be presented to the user.
         */
        authHandler?: AuthHandler<SamlAuthResult> | undefined;
        /**
         * Configure sign-in for this provider, without it the provider can not be used to sign users in.
         */
        signIn?: {
            /**
             * Maps an auth result to a Backstage identity for the user.
             */
            resolver: SignInResolver<SamlAuthResult>;
        } | undefined;
    } | undefined) => import("../types").AuthProviderFactory;
    resolvers: Readonly<{
        /**
         * Looks up the user by matching their nameID to the entity name.
         */
        nameIdMatchingUserEntityName(): SignInResolver<SamlAuthResult>;
    }>;
}>;
/**
 * @public
 * @deprecated Use `providers.saml.create` instead
 */
export declare const createSamlProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<SamlAuthResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<SamlAuthResult>;
    } | undefined;
} | undefined) => import("../types").AuthProviderFactory;
/**
 * @public
 * @deprecated Use `providers.saml.resolvers.nameIdMatchingUserEntityName()` instead.
 */
export declare const samlNameIdEntityNameSignInResolver: SignInResolver<SamlAuthResult>;
export {};
