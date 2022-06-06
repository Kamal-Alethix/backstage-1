import express from 'express';
import passport from 'passport';
import { PassportProfile } from './types';
import { ProfileInfo, RedirectInfo } from '../../providers/types';
export declare type PassportDoneCallback<Res, Private = never> = (err?: Error, response?: Res, privateInfo?: Private) => void;
export declare const makeProfileInfo: (profile: PassportProfile, idToken?: string | undefined) => ProfileInfo;
export declare const executeRedirectStrategy: (req: express.Request, providerStrategy: passport.Strategy, options: Record<string, string>) => Promise<RedirectInfo>;
export declare const executeFrameHandlerStrategy: <Result, PrivateInfo = never>(req: express.Request, providerStrategy: passport.Strategy) => Promise<{
    result: Result;
    privateInfo: PrivateInfo;
}>;
declare type RefreshTokenResponse = {
    /**
     * An access token issued for the signed in user.
     */
    accessToken: string;
    /**
     * Optionally, the server can issue a new Refresh Token for the user
     */
    refreshToken?: string;
    params: any;
};
export declare const executeRefreshTokenStrategy: (providerStrategy: passport.Strategy, refreshToken: string, scope: string) => Promise<RefreshTokenResponse>;
export declare const executeFetchUserProfileStrategy: (providerStrategy: passport.Strategy, accessToken: string) => Promise<PassportProfile>;
export {};
