import { AzureDevOpsApi } from '../api';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import express from 'express';
export interface RouterOptions {
    azureDevOpsApi?: AzureDevOpsApi;
    logger: Logger;
    config: Config;
}
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
