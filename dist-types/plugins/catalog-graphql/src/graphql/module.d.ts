import { Logger } from 'winston';
import { Module } from 'graphql-modules';
import { Config } from '@backstage/config';
export interface ModuleOptions {
    logger: Logger;
    config: Config;
}
export declare function createModule(options: ModuleOptions): Promise<Module>;
