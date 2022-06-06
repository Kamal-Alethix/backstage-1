import express from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

/**
 * @public
 */
interface RouterOptions {
    logger: Logger;
    config: Config;
}
/**
 * @public
 */
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { RouterOptions, createRouter };
