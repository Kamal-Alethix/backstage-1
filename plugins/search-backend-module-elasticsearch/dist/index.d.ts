/// <reference types="node" />
import { Config } from '@backstage/config';
import { IndexableDocument, SearchQuery, SearchEngine, IndexableResultSet } from '@backstage/plugin-search-common';
import { Logger } from 'winston';
import { ConnectionOptions } from 'tls';
import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { Client } from '@elastic/elasticsearch';

/**
 * Options used to configure the `@elastic/elasticsearch` client and
 * are what will be passed as an argument to the
 * {@link ElasticSearchSearchEngine.newClient} method
 *
 * They are drawn from the `ClientOptions` class of `@elastic/elasticsearch`,
 * but are maintained separately so that this interface is not coupled to
 *
 * @public
 */
interface ElasticSearchClientOptions {
    provider?: 'aws' | 'elastic';
    node?: string | string[] | ElasticSearchNodeOptions | ElasticSearchNodeOptions[];
    nodes?: string | string[] | ElasticSearchNodeOptions | ElasticSearchNodeOptions[];
    Transport?: ElasticSearchTransportConstructor;
    Connection?: ElasticSearchConnectionConstructor;
    maxRetries?: number;
    requestTimeout?: number;
    pingTimeout?: number;
    sniffInterval?: number | boolean;
    sniffOnStart?: boolean;
    sniffEndpoint?: string;
    sniffOnConnectionFault?: boolean;
    resurrectStrategy?: 'ping' | 'optimistic' | 'none';
    suggestCompression?: boolean;
    compression?: 'gzip';
    ssl?: ConnectionOptions;
    agent?: ElasticSearchAgentOptions | ((opts?: any) => unknown) | false;
    nodeFilter?: (connection: any) => boolean;
    nodeSelector?: ((connections: any[]) => any) | string;
    headers?: Record<string, any>;
    opaqueIdPrefix?: string;
    name?: string | symbol;
    auth?: ElasticSearchAuth;
    proxy?: string | URL;
    enableMetaHeader?: boolean;
    cloud?: {
        id: string;
        username?: string;
        password?: string;
    };
    disablePrototypePoisoningProtection?: boolean | 'proto' | 'constructor';
}
/**
 * @public
 */
declare type ElasticSearchAuth = {
    username: string;
    password: string;
} | {
    apiKey: string | {
        id: string;
        api_key: string;
    };
};
/**
 * @public
 */
interface ElasticSearchNodeOptions {
    url: URL;
    id?: string;
    agent?: ElasticSearchAgentOptions;
    ssl?: ConnectionOptions;
    headers?: Record<string, any>;
    roles?: {
        master: boolean;
        data: boolean;
        ingest: boolean;
        ml: boolean;
    };
}
/**
 * @public
 */
interface ElasticSearchAgentOptions {
    keepAlive?: boolean;
    keepAliveMsecs?: number;
    maxSockets?: number;
    maxFreeSockets?: number;
}
/**
 * @public
 */
interface ElasticSearchConnectionConstructor {
    new (opts?: any): any;
    statuses: {
        ALIVE: string;
        DEAD: string;
    };
    roles: {
        MASTER: string;
        DATA: string;
        INGEST: string;
        ML: string;
    };
}
/**
 * @public
 */
interface ElasticSearchTransportConstructor {
    new (opts?: any): any;
    sniffReasons: {
        SNIFF_ON_START: string;
        SNIFF_INTERVAL: string;
        SNIFF_ON_CONNECTION_FAULT: string;
        DEFAULT: string;
    };
}

/**
 * Options for instansiate ElasticSearchSearchEngineIndexer
 * @public
 */
declare type ElasticSearchSearchEngineIndexerOptions = {
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
declare class ElasticSearchSearchEngineIndexer extends BatchSearchEngineIndexer {
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

/**
 * Search query that the elasticsearch engine understands.
 * @public
 */
declare type ElasticSearchConcreteQuery = {
    documentTypes?: string[];
    elasticSearchQuery: Object;
    pageSize: number;
};
/**
 * Options available for the Elasticsearch specific query translator.
 * @public
 */
declare type ElasticSearchQueryTranslatorOptions = {
    highlightOptions?: ElasticSearchHighlightConfig;
};
/**
 * Elasticsearch specific query translator.
 * @public
 */
declare type ElasticSearchQueryTranslator = (query: SearchQuery, options?: ElasticSearchQueryTranslatorOptions) => ElasticSearchConcreteQuery;
/**
 * Options for instansiate ElasticSearchSearchEngine
 * @public
 */
declare type ElasticSearchOptions = {
    logger: Logger;
    config: Config;
    aliasPostfix?: string;
    indexPrefix?: string;
};
/**
 * @public
 */
declare type ElasticSearchHighlightOptions = {
    fragmentDelimiter?: string;
    fragmentSize?: number;
    numFragments?: number;
};
/**
 * @public
 */
declare type ElasticSearchHighlightConfig = {
    fragmentDelimiter: string;
    fragmentSize: number;
    numFragments: number;
    preTag: string;
    postTag: string;
};
/**
 * @public
 */
declare class ElasticSearchSearchEngine implements SearchEngine {
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

export { ElasticSearchAgentOptions, ElasticSearchAuth, ElasticSearchClientOptions, ElasticSearchConcreteQuery, ElasticSearchConnectionConstructor, ElasticSearchHighlightConfig, ElasticSearchHighlightOptions, ElasticSearchNodeOptions, ElasticSearchOptions, ElasticSearchQueryTranslator, ElasticSearchQueryTranslatorOptions, ElasticSearchSearchEngine, ElasticSearchSearchEngineIndexer, ElasticSearchSearchEngineIndexerOptions, ElasticSearchTransportConstructor };
