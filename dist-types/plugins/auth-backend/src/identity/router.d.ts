/// <reference types="express" />
import { TokenIssuer } from './types';
export declare type Options = {
    baseUrl: string;
    tokenIssuer: TokenIssuer;
};
export declare function createOidcRouter(options: Options): import("express").Router;
