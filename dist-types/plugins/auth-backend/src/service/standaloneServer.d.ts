/// <reference types="node" />
import { Server } from 'http';
import { Logger } from 'winston';
export interface ServerOptions {
    logger: Logger;
}
export declare function startStandaloneServer(options: ServerOptions): Promise<Server>;
