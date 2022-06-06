import { ReadTreeResponse, ReadTreeResponseFile, ReadTreeResponseDirOptions, FromReadableArrayOptions } from '../types';
/**
 * Wraps a array of Readable objects into a tree response reader.
 */
export declare class ReadableArrayResponse implements ReadTreeResponse {
    private readonly stream;
    private readonly workDir;
    readonly etag: string;
    private read;
    constructor(stream: FromReadableArrayOptions, workDir: string, etag: string);
    private onlyOnce;
    files(): Promise<ReadTreeResponseFile[]>;
    archive(): Promise<NodeJS.ReadableStream>;
    dir(options?: ReadTreeResponseDirOptions): Promise<string>;
}
