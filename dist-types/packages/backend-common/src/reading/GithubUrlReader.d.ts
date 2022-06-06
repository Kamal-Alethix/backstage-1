/// <reference types="node" />
import { GithubCredentialsProvider, GitHubIntegration } from '@backstage/integration';
import { RestEndpointMethodTypes } from '@octokit/rest';
import { ReadTreeResponseFactory, ReaderFactory, ReadTreeOptions, ReadTreeResponse, SearchOptions, SearchResponse, UrlReader, ReadUrlOptions, ReadUrlResponse } from './types';
export declare type GhRepoResponse = RestEndpointMethodTypes['repos']['get']['response']['data'];
export declare type GhBranchResponse = RestEndpointMethodTypes['repos']['getBranch']['response']['data'];
export declare type GhTreeResponse = RestEndpointMethodTypes['git']['getTree']['response']['data'];
export declare type GhBlobResponse = RestEndpointMethodTypes['git']['getBlob']['response']['data'];
/**
 * Implements a {@link UrlReader} for files through the GitHub v3 APIs, such as
 * the one exposed by GitHub itself.
 *
 * @public
 */
export declare class GithubUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    static factory: ReaderFactory;
    constructor(integration: GitHubIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
        credentialsProvider: GithubCredentialsProvider;
    });
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(url: string, options?: SearchOptions): Promise<SearchResponse>;
    toString(): string;
    private doReadTree;
    private doSearch;
    private getRepoDetails;
    private fetchResponse;
    private fetchJson;
}
