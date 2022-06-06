/// <reference types="node" />
import { GitLabIntegration } from '@backstage/integration';
import { ReadTreeResponseFactory, ReaderFactory, ReadTreeOptions, ReadTreeResponse, SearchOptions, SearchResponse, UrlReader, ReadUrlResponse, ReadUrlOptions } from './types';
/**
 * Implements a {@link UrlReader} for files on GitLab.
 *
 * @public
 */
export declare class GitlabUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: GitLabIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
}
