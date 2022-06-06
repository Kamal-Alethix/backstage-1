import { ErrorRequestHandler } from 'express';
import { Logger } from 'winston';
/**
 * Options passed to the {@link errorHandler} middleware.
 *
 * @public
 */
export declare type ErrorHandlerOptions = {
    /**
     * Whether error response bodies should show error stack traces or not.
     *
     * If not specified, by default shows stack traces only in development mode.
     */
    showStackTraces?: boolean;
    /**
     * Logger instance to log errors.
     *
     * If not specified, the root logger will be used.
     */
    logger?: Logger;
    /**
     * Whether any 4xx errors should be logged or not.
     *
     * If not specified, default to only logging 5xx errors.
     */
    logClientErrors?: boolean;
};
/**
 * Express middleware to handle errors during request processing.
 *
 * This is commonly the very last middleware in the chain.
 *
 * Its primary purpose is not to do translation of business logic exceptions,
 * but rather to be a global catch-all for uncaught "fatal" errors that are
 * expected to result in a 500 error. However, it also does handle some common
 * error types (such as http-error exceptions) and returns the enclosed status
 * code accordingly.
 *
 * @public
 * @returns An Express error request handler
 */
export declare function errorHandler(options?: ErrorHandlerOptions): ErrorRequestHandler;
