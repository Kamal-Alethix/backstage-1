import { Router } from 'express';
import { Logger } from 'winston';
import { TechDocsCache } from './TechDocsCache';
declare type CacheMiddlewareOptions = {
    cache: TechDocsCache;
    logger: Logger;
};
export declare const createCacheMiddleware: ({ cache, }: CacheMiddlewareOptions) => Router;
export {};
