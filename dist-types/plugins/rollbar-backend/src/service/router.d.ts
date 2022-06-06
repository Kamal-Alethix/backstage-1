import express from 'express';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { RollbarApi } from '../api';
export interface RouterOptions {
    rollbarApi?: RollbarApi;
    logger: Logger;
    config: Config;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
