/// <reference types="node" />
import { AzureIntegration } from '@backstage/integration';
import { ReadTreeResponseFactory, ReaderFactory, ReadTreeOptions, ReadTreeResponse, SearchOptions, SearchResponse, UrlReader, ReadUrlOptions, ReadUrlResponse } from './types';
/**
 * Implements a {@link UrlReader} for Azure repos.
 *
 * @public
 */
export declare class AzureUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: AzureIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
}
