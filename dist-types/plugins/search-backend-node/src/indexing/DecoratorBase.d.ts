/// <reference types="node" />
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Transform } from 'stream';
/**
 * Base class encapsulating simple async transformations. Useful as a base
 * class for Backstage search decorators.
 * @public
 */
export declare abstract class DecoratorBase extends Transform {
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
