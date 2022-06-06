/// <reference types="node" />
import { GerritIntegration } from '@backstage/integration';
import { ReaderFactory, ReadTreeOptions, ReadTreeResponse, ReadTreeResponseFactory, ReadUrlOptions, ReadUrlResponse, SearchResponse, UrlReader } from './types';
/**
 * Implements a {@link UrlReader} for files in Gerrit.
 *
 * @remarks
 * To be able to link to Git contents for Gerrit providers in a user friendly
 * way we are depending on that there is a Gitiles installation somewhere
 * that we can link to. It is perfectly possible to integrate Gerrit with
 * Backstage without Gitiles since all API calls goes directly to Gerrit.
 *
 * The "host" variable in the config is the Gerrit host. The address where
 * Gitiles is installed may be on the same host but it could be on a
 * separate host. For example a Gerrit instance could be hosted on
 * "gerrit-review.company.com" but the repos could be browsable on a separate
 * host, e.g. "gerrit.company.com" and the human readable URL would then
 * not point to the API host.
 *
 * @public
 */
export declare class GerritUrlReader implements UrlReader {
    private readonly integration;
    private readonly deps;
    private readonly workDir;
    static factory: ReaderFactory;
    constructor(integration: GerritIntegration, deps: {
        treeResponseFactory: ReadTreeResponseFactory;
    }, workDir: string);
    read(url: string): Promise<Buffer>;
    readUrl(url: string, options?: ReadUrlOptions): Promise<ReadUrlResponse>;
    readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
    search(): Promise<SearchResponse>;
    toString(): string;
}
