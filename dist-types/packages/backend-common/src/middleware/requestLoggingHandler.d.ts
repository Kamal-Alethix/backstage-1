import { RequestHandler } from 'express';
import { Logger } from 'winston';
/**
 * Logs incoming requests.
 *
 * @public
 * @param logger - An optional logger to use. If not specified, the root logger will be used.
 * @returns An Express request handler
 */
export declare function requestLoggingHandler(logger?: Logger): RequestHandler;
