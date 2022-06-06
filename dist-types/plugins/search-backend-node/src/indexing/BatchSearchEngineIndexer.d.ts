/// <reference types="node" />
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Writable } from 'stream';
/**
 * Options for {@link BatchSearchEngineIndexer}
 * @public
 */
export declare type BatchSearchEngineOptions = {
    batchSize: number;
};
/**
 * Base class encapsulating batch-based stream processing. Useful as a base
 * class for search engine indexers.
 * @public
 */
export declare abstract class BatchSearchEngineIndexer extends Writable {
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
