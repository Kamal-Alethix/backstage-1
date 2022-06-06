import express from 'express';
import { Logger } from 'winston';
export interface ApplicationOptions {
    enableCors: boolean;
    logger: Logger;
}
export declare function createStandaloneApplication(options: ApplicationOptions): Promise<express.Application>;
