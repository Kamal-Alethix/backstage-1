/// <reference types="node" />
import { Readable } from 'stream';
import { ReadTreeResponse, ReadTreeResponseDirOptions, ReadTreeResponseFile } from '../types';
/**
 * Wraps a tar archive stream into a tree response reader.
 */
export declare class TarArchiveResponse implements ReadTreeResponse {
    private readonly stream;
    private readonly subPath;
    private readonly workDir;
    readonly etag: string;
    private readonly filter?;
    private read;
    constructor(stream: Readable, subPath: string, workDir: string, etag: string, filter?: ((path: string, info: {
        size: number;
    }) => boolean) | undefined);
    private onlyOnce;
    files(): Promise<ReadTreeResponseFile[]>;
    archive(): Promise<Readable>;
    dir(options?: ReadTreeResponseDirOptions): Promise<string>;
}
