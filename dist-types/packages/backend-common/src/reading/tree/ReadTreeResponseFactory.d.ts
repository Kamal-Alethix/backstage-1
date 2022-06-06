import { Config } from '@backstage/config';
import { ReadTreeResponse, ReadTreeResponseFactoryOptions, ReadTreeResponseFactory, FromReadableArrayOptions } from '../types';
export declare class DefaultReadTreeResponseFactory implements ReadTreeResponseFactory {
    private readonly workDir;
    static create(options: {
        config: Config;
    }): DefaultReadTreeResponseFactory;
    constructor(workDir: string);
    fromTarArchive(options: ReadTreeResponseFactoryOptions): Promise<ReadTreeResponse>;
    fromZipArchive(options: ReadTreeResponseFactoryOptions): Promise<ReadTreeResponse>;
    fromReadableArray(options: FromReadableArrayOptions): Promise<ReadTreeResponse>;
}
