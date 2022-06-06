import express from 'express';
import { AuthProviderRouteHandlers, AuthProviderConfig } from '../../providers/types';
import { TokenIssuer } from '../../identity/types';
import { OAuthHandlers } from './types';
export declare const THOUSAND_DAYS_MS: number;
export declare const TEN_MINUTES_MS: number;
export declare type Options = {
    providerId: string;
    secure: boolean;
    persistScopes?: boolean;
    cookieDomain: string;
    cookiePath: string;
    appOrigin: string;
    /** @deprecated This option is no longer needed */
    tokenIssuer?: TokenIssuer;
    isOriginAllowed: (origin: string) => boolean;
    callbackUrl: string;
};
export declare class OAuthAdapter implements AuthProviderRouteHandlers {
    private readonly handlers;
    private readonly options;
    static fromConfig(config: AuthProviderConfig, handlers: OAuthHandlers, options: Pick<Options, 'providerId' | 'persistScopes' | 'tokenIssuer' | 'callbackUrl'>): OAuthAdapter;
    private readonly baseCookieOptions;
    constructor(handlers: OAuthHandlers, options: Options);
    start(req: express.Request, res: express.Response): Promise<void>;
    frameHandler(req: express.Request, res: express.Response): Promise<void>;
    logout(req: express.Request, res: express.Response): Promise<void>;
    refresh(req: express.Request, res: express.Response): Promise<void>;
    /**
     * If the response from the OAuth provider includes a Backstage identity, we
     * make sure it's populated with all the information we can derive from the user ID.
     */
    private populateIdentity;
    private setNonceCookie;
    private setGrantedScopeCookie;
    private getGrantedScopeFromCookie;
    private setRefreshTokenCookie;
    private removeRefreshTokenCookie;
}
