import express from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
/**
 * @public
 */
export interface RouterOptions {
    logger: Logger;
    config: Config;
}
/**
 * @public
 */
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
