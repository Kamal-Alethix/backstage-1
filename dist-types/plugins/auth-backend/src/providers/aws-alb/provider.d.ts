import { AuthHandler, AuthProviderRouteHandlers, AuthResolverContext, AuthResponse, SignInResolver } from '../types';
import express from 'express';
import { KeyObject } from 'crypto';
import { JWTHeaderParameters } from 'jose';
import { Profile as PassportProfile } from 'passport';
export declare const ALB_JWT_HEADER = "x-amzn-oidc-data";
export declare const ALB_ACCESS_TOKEN_HEADER = "x-amzn-oidc-accesstoken";
declare type Options = {
    region: string;
    issuer?: string;
    authHandler: AuthHandler<AwsAlbResult>;
    signInResolver: SignInResolver<AwsAlbResult>;
    resolverContext: AuthResolverContext;
};
export declare type AwsAlbHeaders = {
    alg: string;
    kid: string;
    signer: string;
    iss: string;
    client: string;
    exp: number;
};
export declare type AwsAlbClaims = {
    sub: string;
    name: string;
    family_name: string;
    given_name: string;
    picture: string;
    email: string;
    exp: number;
    iss: string;
};
/** @public */
export declare type AwsAlbResult = {
    fullProfile: PassportProfile;
    expiresInSeconds?: number;
    accessToken: string;
};
export declare type AwsAlbProviderInfo = {
    /**
     * An access token issued for the signed in user.
     */
    accessToken: string;
    /**
     * Expiry of the access token in seconds.
     */
    expiresInSeconds?: number;
};
export declare type AwsAlbResponse = AuthResponse<AwsAlbProviderInfo>;
export declare class AwsAlbAuthProvider implements AuthProviderRouteHandlers {
    private readonly region;
    private readonly issuer?;
    private readonly resolverContext;
    private readonly keyCache;
    private readonly authHandler;
    private readonly signInResolver;
    constructor(options: Options);
    frameHandler(): Promise<void>;
    refresh(req: express.Request, res: express.Response): Promise<void>;
    start(): Promise<void>;
    private getResult;
    private handleResult;
    getKey: (header: JWTHeaderParameters) => Promise<KeyObject>;
}
/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export declare type AwsAlbProviderOptions = {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<AwsAlbResult>;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<AwsAlbResult>;
    };
};
/**
 * Auth provider integration for AWS ALB auth
 *
 * @public
 */
export declare const awsAlb: Readonly<{
    create: (options?: {
        /**
         * The profile transformation function used to verify and convert the auth response
         * into the profile that will be presented to the user.
         */
        authHandler?: AuthHandler<AwsAlbResult> | undefined;
        /**
         * Configure sign-in for this provider, without it the provider can not be used to sign users in.
         */
        signIn: {
            /**
             * Maps an auth result to a Backstage identity for the user.
             */
            resolver: SignInResolver<AwsAlbResult>;
        };
    } | undefined) => import("../types").AuthProviderFactory;
    resolvers: never;
}>;
/**
 * @public
 * @deprecated Use `providers.awsAlb.create` instead
 */
export declare const createAwsAlbProvider: (options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<AwsAlbResult> | undefined;
    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
        /**
         * Maps an auth result to a Backstage identity for the user.
         */
        resolver: SignInResolver<AwsAlbResult>;
    };
} | undefined) => import("../types").AuthProviderFactory;
export {};
