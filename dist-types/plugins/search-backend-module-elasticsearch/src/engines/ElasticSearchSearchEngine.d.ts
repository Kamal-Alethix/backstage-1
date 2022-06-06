import { Config } from '@backstage/config';
import { IndexableResultSet, SearchEngine, SearchQuery } from '@backstage/plugin-search-common';
import { Logger } from 'winston';
import type { ElasticSearchClientOptions } from './ElasticSearchClientOptions';
import { ElasticSearchSearchEngineIndexer } from './ElasticSearchSearchEngineIndexer';
export type { ElasticSearchClientOptions };
/**
 * Search query that the elasticsearch engine understands.
 * @public
 */
export declare type ElasticSearchConcreteQuery = {
    documentTypes?: string[];
    elasticSearchQuery: Object;
    pageSize: number;
};
/**
 * Options available for the Elasticsearch specific query translator.
 * @public
 */
export declare type ElasticSearchQueryTranslatorOptions = {
    highlightOptions?: ElasticSearchHighlightConfig;
};
/**
 * Elasticsearch specific query translator.
 * @public
 */
export declare type ElasticSearchQueryTranslator = (query: SearchQuery, options?: ElasticSearchQueryTranslatorOptions) => ElasticSearchConcreteQuery;
/**
 * Options for instansiate ElasticSearchSearchEngine
 * @public
 */
export declare type ElasticSearchOptions = {
    logger: Logger;
    config: Config;
    aliasPostfix?: string;
    indexPrefix?: string;
};
/**
 * @public
 */
export declare type ElasticSearchHighlightOptions = {
    fragmentDelimiter?: string;
    fragmentSize?: number;
    numFragments?: number;
};
/**
 * @public
 */
export declare type ElasticSearchHighlightConfig = {
    fragmentDelimiter: string;
    fragmentSize: number;
    numFragments: number;
    preTag: string;
    postTag: string;
};
/**
 * @public
 */
export declare class ElasticSearchSearchEngine implements SearchEngine {
    private readonly elasticSearchClientOptions;
    private readonly aliasPostfix;
    private readonly indexPrefix;
    private readonly logger;
    private readonly elasticSearchClient;
    private readonly highlightOptions;
    constructor(elasticSearchClientOptions: ElasticSearchClientOptions, aliasPostfix: string, indexPrefix: string, logger: Logger, highlightOptions?: ElasticSearchHighlightOptions);
    static fromConfig({ logger, config, aliasPostfix, indexPrefix, }: ElasticSearchOptions): Promise<ElasticSearchSearchEngine>;
    /**
     * Create a custom search client from the derived elastic search
     * configuration. This need not be the same client that the engine uses
     * internally.
     */
    newClient<T>(create: (options: ElasticSearchClientOptions) => T): T;
    protected translator(query: SearchQuery, options?: ElasticSearchQueryTranslatorOptions): ElasticSearchConcreteQuery;
    setTranslator(translator: ElasticSearchQueryTranslator): void;
    getIndexer(type: string): Promise<ElasticSearchSearchEngineIndexer>;
    query(query: SearchQuery): Promise<IndexableResultSet>;
    private readonly indexSeparator;
    private getTypeFromIndex;
    private constructSearchAlias;
}
export declare function decodePageCursor(pageCursor?: string): {
    page: number;
};
export declare function encodePageCursor({ page }: {
    page: number;
}): string;
