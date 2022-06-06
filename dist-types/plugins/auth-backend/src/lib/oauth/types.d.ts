import express from 'express';
import { Profile as PassportProfile } from 'passport';
import { BackstageSignInResult } from '@backstage/plugin-auth-node';
import { RedirectInfo, ProfileInfo } from '../../providers/types';
/**
 * Common options for passport.js-based OAuth providers
 */
export declare type OAuthProviderOptions = {
    /**
     * Client ID of the auth provider.
     */
    clientId: string;
    /**
     * Client Secret of the auth provider.
     */
    clientSecret: string;
    /**
     * Callback URL to be passed to the auth provider to redirect to after the user signs in.
     */
    callbackUrl: string;
};
export declare type OAuthResult = {
    fullProfile: PassportProfile;
    params: {
        id_token?: string;
        scope: string;
        expires_in: number;
    };
    accessToken: string;
    refreshToken?: string;
};
/**
 * The expected response from an OAuth flow.
 *
 * @public
 */
export declare type OAuthResponse = {
    profile: ProfileInfo;
    providerInfo: OAuthProviderInfo;
    backstageIdentity?: BackstageSignInResult;
};
export declare type OAuthProviderInfo = {
    /**
     * An access token issued for the signed in user.
     */
    accessToken: string;
    /**
     * (Optional) Id token issued for the signed in user.
     */
    idToken?: string;
    /**
     * Expiry of the access token in seconds.
     */
    expiresInSeconds?: number;
    /**
     * Scopes granted for the access token.
     */
    scope: string;
};
export declare type OAuthState = {
    nonce: string;
    env: string;
    origin?: string;
    scope?: string;
};
export declare type OAuthStartRequest = express.Request<{}> & {
    scope: string;
    state: OAuthState;
};
export declare type OAuthRefreshRequest = express.Request<{}> & {
    scope: string;
    refreshToken: string;
};
/**
 * Any OAuth provider needs to implement this interface which has provider specific
 * handlers for different methods to perform authentication, get access tokens,
 * refresh tokens and perform sign out.
 *
 * @public
 */
export interface OAuthHandlers {
    /**
     * Initiate a sign in request with an auth provider.
     */
    start(req: OAuthStartRequest): Promise<RedirectInfo>;
    /**
     * Handle the redirect from the auth provider when the user has signed in.
     */
    handler(req: express.Request): Promise<{
        response: OAuthResponse;
        refreshToken?: string;
    }>;
    /**
     * (Optional) Given a refresh token and scope fetches a new access token from the auth provider.
     */
    refresh?(req: OAuthRefreshRequest): Promise<{
        response: OAuthResponse;
        refreshToken?: string;
    }>;
    /**
     * (Optional) Sign out of the auth provider.
     */
    logout?(): Promise<void>;
}
