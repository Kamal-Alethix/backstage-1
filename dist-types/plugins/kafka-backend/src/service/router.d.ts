import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { KafkaApi } from './KafkaApi';
export interface RouterOptions {
    logger: Logger;
    config: Config;
}
export interface ClusterApi {
    name: string;
    api: KafkaApi;
}
export declare const makeRouter: (logger: Logger, kafkaApis: ClusterApi[]) => express.Router;
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
