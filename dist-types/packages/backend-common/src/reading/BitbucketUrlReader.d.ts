/// <reference types="node" />
import { BitbucketIntegration } from '@backstage/integration';
import { Logger } from 'winston';
import { ReaderFactory, ReadTreeOptions, ReadTreeResponse, ReadTreeResponseFactory, ReadUrlOptions, ReadUrlResponse, SearchOptions, SearchResponse, UrlReader } from './types';
/**
 * Implements a {@link UrlReader} for files from Bitbucket v1 and v2 APIs, such
 * as the one exposed by Bitbucket Cloud itself.
 *
 * @public
 * @deprecated in favor of BitbucketCloudUrlReader and BitbucketServerUrlReader
 */
export declare class BitbucketUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: BitbucketIntegration, logger: Logger, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
    private getLastCommitShortHash;
}
