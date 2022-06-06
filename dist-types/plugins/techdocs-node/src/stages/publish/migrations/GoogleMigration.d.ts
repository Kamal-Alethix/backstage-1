/// <reference types="node" />
import { File } from '@google-cloud/storage';
import { Writable } from 'stream';
import { Logger } from 'winston';
/**
 * Writable stream to handle object copy/move operations. This implementation
 * ensures we don't read in files from GCS faster than GCS can copy/move them.
 */
export declare class MigrateWriteStream extends Writable {
    protected logger: Logger;
    protected removeOriginal: boolean;
    protected maxConcurrency: number;
    protected inFlight: number;
    constructor(logger: Logger, removeOriginal: boolean, concurrency: number);
    _write(file: File, _encoding: BufferEncoding, next: Function): void;
}
