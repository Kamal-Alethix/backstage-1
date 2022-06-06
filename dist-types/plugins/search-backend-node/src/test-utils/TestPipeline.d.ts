/// <reference types="node" />
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Readable, Transform, Writable } from 'stream';
/**
 * Object resolved after a test pipeline is executed.
 * @public
 */
export declare type TestPipelineResult = {
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
export declare class TestPipeline {
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
