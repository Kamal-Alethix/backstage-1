/// <reference types="node" />
import { BitbucketServerIntegration } from '@backstage/integration';
import { ReaderFactory, ReadTreeOptions, ReadTreeResponse, ReadTreeResponseFactory, ReadUrlOptions, ReadUrlResponse, SearchOptions, SearchResponse, UrlReader } from './types';
/**
 * Implements a {@link UrlReader} for files from Bitbucket Server APIs.
 *
 * @public
 */
export declare class BitbucketServerUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: BitbucketServerIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
    private getLastCommitShortHash;
}
