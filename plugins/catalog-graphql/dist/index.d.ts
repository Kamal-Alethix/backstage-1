import { Logger } from 'winston';
import { Module } from 'graphql-modules';
import { Config } from '@backstage/config';

interface ModuleOptions {
    logger: Logger;
    config: Config;
}
declare function createModule(options: ModuleOptions): Promise<Module>;

export { ModuleOptions, createModule };
