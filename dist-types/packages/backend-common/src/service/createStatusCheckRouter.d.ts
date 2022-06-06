import { Logger } from 'winston';
import express from 'express';
import { StatusCheck } from '../middleware';
/**
 * Creates a default status checking router, that you can add to your express
 * app.
 *
 * @remarks
 *
 * This adds a `/healthcheck` route (or any other path, if given as an
 * argument), which your infra can call to see if the service is ready to serve
 * requests.
 *
 * @public
 */
export declare function createStatusCheckRouter(options: {
    logger: Logger;
    /**
     * The path (including a leading slash) that the health check should be
     * mounted on.
     *
     * @defaultValue '/healthcheck'
     */
    path?: string;
    /**
     * If not implemented, the default express middleware always returns 200.
     * Override this to implement your own logic for a health check.
     */
    statusCheck?: StatusCheck;
}): Promise<express.Router>;
