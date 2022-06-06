import { PluginDatabaseManager } from '@backstage/backend-common';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import { SearchQuery, IndexableResultSet } from '@backstage/plugin-search-common';
import { PgSearchEngineIndexer } from './PgSearchEngineIndexer';
import { DatabaseStore, PgSearchQuery } from '../database';
export declare type ConcretePgSearchQuery = {
    pgQuery: PgSearchQuery;
    pageSize: number;
};
export declare class PgSearchEngine implements SearchEngine {
    private readonly databaseStore;
    constructor(databaseStore: DatabaseStore);
    static from(options: {
        database: PluginDatabaseManager;
    }): Promise<PgSearchEngine>;
    static supported(database: PluginDatabaseManager): Promise<boolean>;
    translator(query: SearchQuery): ConcretePgSearchQuery;
    setTranslator(translator: (query: SearchQuery) => ConcretePgSearchQuery): void;
    getIndexer(type: string): Promise<PgSearchEngineIndexer>;
    query(query: SearchQuery): Promise<IndexableResultSet>;
}
export declare function decodePageCursor(pageCursor?: string): {
    page: number;
};
export declare function encodePageCursor({ page }: {
    page: number;
}): string;
