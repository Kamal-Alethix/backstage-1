/// <reference types="node" />
import { SearchEngine, DocumentCollatorFactory, DocumentDecoratorFactory, DocumentTypeInfo, IndexableDocument, SearchQuery, QueryTranslator, IndexableResultSet } from '@backstage/plugin-search-common';
export { SearchEngine } from '@backstage/plugin-search-common';
import { Logger } from 'winston';
import { TaskFunction, TaskRunner } from '@backstage/backend-tasks';
import { UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Permission } from '@backstage/plugin-permission-common';
import { Readable, Writable, Transform } from 'stream';
import lunr from 'lunr';

/**
 * ScheduleTaskParameters
 * @public
 */
declare type ScheduleTaskParameters = {
    id: string;
    task: TaskFunction;
    scheduledRunner: TaskRunner;
};
/**
 * Scheduler responsible for all search tasks.
 * @public
 */
declare class Scheduler {
    private logger;
    private schedule;
    private abortController;
    private isRunning;
    constructor({ logger }: {
        logger: Logger;
    });
    /**
     * Adds each task and interval to the schedule.
     * When running the tasks, the scheduler waits at least for the time specified
     * in the interval once the task was completed, before running it again.
     */
    addToSchedule({ id, task, scheduledRunner }: ScheduleTaskParameters): void;
    /**
     * Starts the scheduling process for each task
     */
    start(): void;
    /**
     * Stop all scheduled tasks.
     */
    stop(): void;
}

/**
 * Options required to instantiate the index builder.
 * @public
 */
declare type IndexBuilderOptions = {
    searchEngine: SearchEngine;
    logger: Logger;
};
/**
 * Parameters required to register a collator.
 * @public
 */
interface RegisterCollatorParameters {
    /**
     * The schedule for which the provided collator will be called, commonly the result of
     * {@link @backstage/backend-tasks#PluginTaskScheduler.createScheduledTaskRunner}
     */
    schedule: TaskRunner;
    /**
     * The class responsible for returning the document collator of the given type.
     */
    factory: DocumentCollatorFactory;
}
/**
 * Parameters required to register a decorator
 * @public
 */
interface RegisterDecoratorParameters {
    /**
     * The class responsible for returning the decorator which appends, modifies, or filters documents.
     */
    factory: DocumentDecoratorFactory;
}

/**
 * Used for adding collators, decorators and compile them into tasks which are added to a scheduler returned to the caller.
 * @public
 */
declare class IndexBuilder {
    private collators;
    private decorators;
    private documentTypes;
    private searchEngine;
    private logger;
    constructor({ logger, searchEngine }: IndexBuilderOptions);
    /**
     * Responsible for returning the registered search engine.
     */
    getSearchEngine(): SearchEngine;
    /**
     * Responsible for returning the registered document types.
     */
    getDocumentTypes(): Record<string, DocumentTypeInfo>;
    /**
     * Makes the index builder aware of a collator that should be executed at the
     * given refresh interval.
     */
    addCollator({ factory, schedule }: RegisterCollatorParameters): void;
    /**
     * Makes the index builder aware of a decorator. If no types are provided on
     * the decorator, it will be applied to documents from all known collators,
     * otherwise it will only be applied to documents of the given types.
     */
    addDecorator({ factory }: RegisterDecoratorParameters): void;
    /**
     * Compiles collators and decorators into tasks, which are added to a
     * scheduler returned to the caller.
     */
    build(): Promise<{
        scheduler: Scheduler;
    }>;
}

/**
 * Options for instansiate NewlineDelimitedJsonCollatorFactory
 * @public
 */
declare type NewlineDelimitedJsonCollatorFactoryOptions = {
    type: string;
    searchPattern: string;
    reader: UrlReader;
    logger: Logger;
    visibilityPermission?: Permission;
};
/**
 * Factory class producing a collator that can be used to index documents
 * sourced from the latest newline delimited JSON file matching a given search
 * pattern. "Latest" is determined by the name of the file (last alphabetically
 * is considered latest).
 *
 * @remarks
 * The reader provided must implement the `search()` method as well as the
 * `readUrl` method whose response includes the `stream()` method. Naturally,
 * the reader must also be configured to understand the given search pattern.
 *
 * @example
 * Here's an example configuration using Google Cloud Storage, which would
 * return the latest file under the `bucket` GCS bucket with files like
 * `xyz-2021.ndjson` or `xyz-2022.ndjson`.
 * ```ts
 * indexBuilder.addCollator({
 *   schedule,
 *   factory: NewlineDelimitedJsonCollatorFactory.fromConfig(env.config, {
 *     type: 'techdocs',
 *     searchPattern: 'https://storage.cloud.google.com/bucket/xyz-*',
 *     reader: env.reader,
 *     logger: env.logger,
 *   })
 * });
 * ```
 *
 * @public
 */
declare class NewlineDelimitedJsonCollatorFactory implements DocumentCollatorFactory {
    private readonly searchPattern;
    private readonly reader;
    private readonly logger;
    readonly type: string;
    readonly visibilityPermission: Permission | undefined;
    private constructor();
    /**
     * Returns a NewlineDelimitedJsonCollatorFactory instance from configuration
     * and a set of options.
     */
    static fromConfig(_config: Config, options: NewlineDelimitedJsonCollatorFactoryOptions): NewlineDelimitedJsonCollatorFactory;
    /**
     * Returns the "latest" URL for the given search pattern (e.g. the one at the
     * end of the list, sorted alphabetically).
     */
    private lastUrl;
    getCollator(): Promise<Readable>;
}

/**
 * Options for {@link BatchSearchEngineIndexer}
 * @public
 */
declare type BatchSearchEngineOptions = {
    batchSize: number;
};
/**
 * Base class encapsulating batch-based stream processing. Useful as a base
 * class for search engine indexers.
 * @public
 */
declare abstract class BatchSearchEngineIndexer extends Writable {
    private batchSize;
    private currentBatch;
    private initialized;
    constructor(options: BatchSearchEngineOptions);
    /**
     * Receives an array of indexable documents (of size this.batchSize) which
     * should be written to the search engine. This method won't be called again
     * at least until it resolves.
     */
    abstract index(documents: IndexableDocument[]): Promise<void>;
    /**
     * Any asynchronous setup tasks can be performed here.
     */
    abstract initialize(): Promise<void>;
    /**
     * Any asynchronous teardown tasks can be performed here.
     */
    abstract finalize(): Promise<void>;
}

/**
 * Base class encapsulating simple async transformations. Useful as a base
 * class for Backstage search decorators.
 * @public
 */
declare abstract class DecoratorBase extends Transform {
    private initialized;
    constructor();
    /**
     * Any asynchronous setup tasks can be performed here.
     */
    abstract initialize(): Promise<void>;
    /**
     * Receives a single indexable document. In your decorate method, you can:
     *
     * - Resolve `undefined` to indicate the record should be omitted.
     * - Resolve a single modified document, which could contain new fields,
     *   edited fields, or removed fields.
     * - Resolve an array of indexable documents, if the purpose if the decorator
     *   is to convert one document into multiple derivative documents.
     */
    abstract decorate(document: IndexableDocument): Promise<IndexableDocument | IndexableDocument[] | undefined>;
    /**
     * Any asynchronous teardown tasks can be performed here.
     */
    abstract finalize(): Promise<void>;
}

/**
 * Lunr specific search engine indexer
 * @public
 */
declare class LunrSearchEngineIndexer extends BatchSearchEngineIndexer {
    private schemaInitialized;
    private builder;
    private docStore;
    constructor();
    initialize(): Promise<void>;
    finalize(): Promise<void>;
    index(documents: IndexableDocument[]): Promise<void>;
    buildIndex(): lunr.Index;
    getDocumentStore(): Record<string, IndexableDocument>;
}

/**
 * Type of translated query for the Lunr Search Engine.
 * @public
 */
declare type ConcreteLunrQuery = {
    lunrQueryBuilder: lunr.Index.QueryBuilder;
    documentTypes?: string[];
    pageSize: number;
};
/**
 * Translator repsonsible for translating search term and filters to a query that the Lunr Search Engine understands.
 * @public
 */
declare type LunrQueryTranslator = (query: SearchQuery) => ConcreteLunrQuery;
/**
 * Lunr specific search engine implementation.
 * @public
 */
declare class LunrSearchEngine implements SearchEngine {
    protected lunrIndices: Record<string, lunr.Index>;
    protected docStore: Record<string, IndexableDocument>;
    protected logger: Logger;
    protected highlightPreTag: string;
    protected highlightPostTag: string;
    constructor({ logger }: {
        logger: Logger;
    });
    protected translator: QueryTranslator;
    setTranslator(translator: LunrQueryTranslator): void;
    getIndexer(type: string): Promise<LunrSearchEngineIndexer>;
    query(query: SearchQuery): Promise<IndexableResultSet>;
}

/**
 * Object resolved after a test pipeline is executed.
 * @public
 */
declare type TestPipelineResult = {
    /**
     * If an error was emitted by the pipeline, it will be set here.
     */
    error: unknown;
    /**
     * A list of documents collected at the end of the pipeline. If the subject
     * under test is an indexer, this will be an empty array (because your
     * indexer should have received the documents instead).
     */
    documents: IndexableDocument[];
};
/**
 * Test utility for Backstage Search collators, decorators, and indexers.
 * @public
 */
declare class TestPipeline {
    private collator?;
    private decorator?;
    private indexer?;
    private constructor();
    /**
     * Provide the collator, decorator, or indexer to be tested.
     */
    static withSubject(subject: Readable | Transform | Writable): TestPipeline;
    /**
     * Provide documents for testing decorators and indexers.
     */
    withDocuments(documents: IndexableDocument[]): TestPipeline;
    /**
     * Execute the test pipeline so that you can make assertions about the result
     * or behavior of the given test subject.
     */
    execute(): Promise<TestPipelineResult>;
}

export { BatchSearchEngineIndexer, BatchSearchEngineOptions, ConcreteLunrQuery, DecoratorBase, IndexBuilder, IndexBuilderOptions, LunrQueryTranslator, LunrSearchEngine, LunrSearchEngineIndexer, NewlineDelimitedJsonCollatorFactory, NewlineDelimitedJsonCollatorFactoryOptions, RegisterCollatorParameters, RegisterDecoratorParameters, ScheduleTaskParameters, Scheduler, TestPipeline, TestPipelineResult };
