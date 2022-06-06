import express from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
export interface RouterOptions {
    logger: Logger;
    config: Config;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
