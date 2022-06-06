import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AuthHandler } from '../types';
import { GcpIapResult } from './types';
export declare function createTokenValidator(audience: string, mockClient?: OAuth2Client): (token: string) => Promise<TokenPayload>;
export declare function parseRequestToken(jwtToken: unknown, tokenValidator: (token: string) => Promise<TokenPayload>): Promise<GcpIapResult>;
export declare const defaultAuthHandler: AuthHandler<GcpIapResult>;
