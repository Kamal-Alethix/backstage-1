import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { DatabaseStore } from '../database';
export declare type PgSearchEngineIndexerOptions = {
    batchSize: number;
    type: string;
    databaseStore: DatabaseStore;
};
export declare class PgSearchEngineIndexer extends BatchSearchEngineIndexer {
    private store;
    private type;
    private tx;
    constructor(options: PgSearchEngineIndexerOptions);
    initialize(): Promise<void>;
    index(documents: IndexableDocument[]): Promise<void>;
    finalize(): Promise<void>;
}
