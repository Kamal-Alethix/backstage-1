import { IndexableDocument } from '@backstage/plugin-search-common';
import lunr from 'lunr';
import { BatchSearchEngineIndexer } from '../indexing';
/**
 * Lunr specific search engine indexer
 * @public
 */
export declare class LunrSearchEngineIndexer extends BatchSearchEngineIndexer {
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
