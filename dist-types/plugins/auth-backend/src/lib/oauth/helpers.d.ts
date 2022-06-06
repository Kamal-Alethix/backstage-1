import express from 'express';
import { OAuthState } from './types';
import { CookieConfigurer } from '../../providers/types';
export declare const readState: (stateString: string) => OAuthState;
export declare const encodeState: (state: OAuthState) => string;
export declare const verifyNonce: (req: express.Request, providerId: string) => void;
export declare const defaultCookieConfigurer: CookieConfigurer;
