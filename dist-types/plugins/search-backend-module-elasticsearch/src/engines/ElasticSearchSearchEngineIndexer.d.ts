import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
/**
 * Options for instansiate ElasticSearchSearchEngineIndexer
 * @public
 */
export declare type ElasticSearchSearchEngineIndexerOptions = {
    type: string;
    indexPrefix: string;
    indexSeparator: string;
    alias: string;
    logger: Logger;
    elasticSearchClient: Client;
};
/**
 * Elasticsearch specific search engine indexer.
 * @public
 */
export declare class ElasticSearchSearchEngineIndexer extends BatchSearchEngineIndexer {
    private received;
    private processed;
    private removableIndices;
    private readonly startTimestamp;
    private readonly type;
    readonly indexName: string;
    private readonly indexPrefix;
    private readonly indexSeparator;
    private readonly alias;
    private readonly removableAlias;
    private readonly logger;
    private readonly sourceStream;
    private readonly elasticSearchClient;
    private bulkResult;
    constructor(options: ElasticSearchSearchEngineIndexerOptions);
    initialize(): Promise<void>;
    index(documents: IndexableDocument[]): Promise<void>;
    finalize(): Promise<void>;
    /**
     * Ensures that the number of documents sent over the wire to ES matches the
     * number of documents this stream has received so far. This helps manage
     * backpressure in other parts of the indexing pipeline.
     */
    private isReady;
    private constructIndexName;
}
