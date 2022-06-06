import { RequestHandler } from 'express';
/**
 * A custom status checking function, passed to {@link statusCheckHandler} and
 * {@link createStatusCheckRouter}.
 *
 * @public
 */
export declare type StatusCheck = () => Promise<any>;
/**
 * Options passed to {@link statusCheckHandler}.
 *
 * @public
 */
export interface StatusCheckHandlerOptions {
    /**
     * Optional status function which returns a message.
     */
    statusCheck?: StatusCheck;
}
/**
 * Express middleware for status checks.
 *
 * This is commonly used to implement healthcheck and readiness routes.
 *
 * @public
 * @param options - An optional configuration object.
 * @returns An Express error request handler
 */
export declare function statusCheckHandler(options?: StatusCheckHandlerOptions): Promise<RequestHandler>;
