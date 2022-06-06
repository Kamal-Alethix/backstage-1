import { IndexableDocument } from '@backstage/plugin-search-common';
import { Knex } from 'knex';
import { DatabaseStore, DocumentResultRow, PgSearchQuery } from './types';
export declare class DatabaseDocumentStore implements DatabaseStore {
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
