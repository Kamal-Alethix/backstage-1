import { IndexableDocument } from '@backstage/plugin-search-common';
import { Knex } from 'knex';
export interface PgSearchQuery {
    fields?: Record<string, string | string[]>;
    types?: string[];
    pgTerm?: string;
    offset: number;
    limit: number;
}
export interface DatabaseStore {
    transaction<T>(fn: (tx: Knex.Transaction) => Promise<T>): Promise<T>;
    getTransaction(): Promise<Knex.Transaction>;
    prepareInsert(tx: Knex.Transaction): Promise<void>;
    insertDocuments(tx: Knex.Transaction, type: string, documents: IndexableDocument[]): Promise<void>;
    completeInsert(tx: Knex.Transaction, type: string): Promise<void>;
    query(tx: Knex.Transaction, pgQuery: PgSearchQuery): Promise<DocumentResultRow[]>;
}
export interface RawDocumentRow {
    document: IndexableDocument;
    type: string;
    hash: unknown;
}
export interface DocumentResultRow {
    document: IndexableDocument;
    type: string;
}
