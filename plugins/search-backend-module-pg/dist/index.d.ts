import { IndexableDocument, SearchQuery, IndexableResultSet } from '@backstage/plugin-search-common';
import { Knex } from 'knex';
import { PluginDatabaseManager } from '@backstage/backend-common';
import { BatchSearchEngineIndexer, SearchEngine } from '@backstage/plugin-search-backend-node';

interface PgSearchQuery {
    fields?: Record<string, string | string[]>;
    types?: string[];
    pgTerm?: string;
    offset: number;
    limit: number;
}
interface DatabaseStore {
    transaction<T>(fn: (tx: Knex.Transaction) => Promise<T>): Promise<T>;
    getTransaction(): Promise<Knex.Transaction>;
    prepareInsert(tx: Knex.Transaction): Promise<void>;
    insertDocuments(tx: Knex.Transaction, type: string, documents: IndexableDocument[]): Promise<void>;
    completeInsert(tx: Knex.Transaction, type: string): Promise<void>;
    query(tx: Knex.Transaction, pgQuery: PgSearchQuery): Promise<DocumentResultRow[]>;
}
interface RawDocumentRow {
    document: IndexableDocument;
    type: string;
    hash: unknown;
}
interface DocumentResultRow {
    document: IndexableDocument;
    type: string;
}

declare class DatabaseDocumentStore implements DatabaseStore {
    private readonly db;
    static create(knex: Knex): Promise<DatabaseDocumentStore>;
    static supported(knex: Knex): Promise<boolean>;
    constructor(db: Knex);
    transaction<T>(fn: (tx: Knex.Transaction) => Promise<T>): Promise<T>;
    getTransaction(): Promise<Knex.Transaction>;
    prepareInsert(tx: Knex.Transaction): Promise<void>;
    completeInsert(tx: Knex.Transaction, type: string): Promise<void>;
    insertDocuments(tx: Knex.Transaction, type: string, documents: IndexableDocument[]): Promise<void>;
    query(tx: Knex.Transaction, { types, pgTerm, fields, offset, limit }: PgSearchQuery): Promise<DocumentResultRow[]>;
}

declare type PgSearchEngineIndexerOptions = {
    batchSize: number;
    type: string;
    databaseStore: DatabaseStore;
};
declare class PgSearchEngineIndexer extends BatchSearchEngineIndexer {
    private store;
    private type;
    private tx;
    constructor(options: PgSearchEngineIndexerOptions);
    initialize(): Promise<void>;
    index(documents: IndexableDocument[]): Promise<void>;
    finalize(): Promise<void>;
}

declare type ConcretePgSearchQuery = {
    pgQuery: PgSearchQuery;
    pageSize: number;
};
declare class PgSearchEngine implements SearchEngine {
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

export { ConcretePgSearchQuery, DatabaseDocumentStore, DatabaseStore, PgSearchEngine, PgSearchEngineIndexer, PgSearchEngineIndexerOptions, PgSearchQuery, RawDocumentRow };
