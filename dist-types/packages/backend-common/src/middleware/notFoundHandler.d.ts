import { RequestHandler } from 'express';
/**
 * Express middleware to handle requests for missing routes.
 *
 * Should be used as the very last handler in the chain, as it unconditionally
 * returns a 404 status.
 *
 * @public
 * @returns An Express request handler
 */
export declare function notFoundHandler(): RequestHandler;
