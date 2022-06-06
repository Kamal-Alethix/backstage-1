import { RequestHandler } from 'express';
export declare function metricsInit(): void;
/**
 * Adds a /metrics endpoint, register default runtime metrics and instrument the router.
 */
export declare function metricsHandler(): RequestHandler;
