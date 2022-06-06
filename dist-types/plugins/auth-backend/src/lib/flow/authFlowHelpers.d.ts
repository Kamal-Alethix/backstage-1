import express from 'express';
import { WebMessageResponse } from './types';
export declare const safelyEncodeURIComponent: (value: string) => string;
export declare const postMessageResponse: (res: express.Response, appOrigin: string, response: WebMessageResponse) => void;
export declare const ensuresXRequestedWith: (req: express.Request) => boolean;
