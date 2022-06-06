/// <reference types="node" />
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { DocumentTypeInfo, IndexableResultSet, QueryRequestOptions, QueryTranslator, SearchEngine, SearchQuery } from '@backstage/plugin-search-common';
import { Config } from '@backstage/config';
import { Writable } from 'stream';
export declare function decodePageCursor(pageCursor?: string): {
    page: number;
};
export declare function encodePageCursor({ page }: {
    page: number;
}): string;
export declare class AuthorizedSearchEngine implements SearchEngine {
    private readonly searchEngine;
    private readonly types;
    private readonly permissions;
    private readonly pageSize;
    private readonly queryLatencyBudgetMs;
    constructor(searchEngine: SearchEngine, types: Record<string, DocumentTypeInfo>, permissions: PermissionEvaluator, config: Config);
    setTranslator(translator: QueryTranslator): void;
    getIndexer(type: string): Promise<Writable>;
    query(query: SearchQuery, options: QueryRequestOptions): Promise<IndexableResultSet>;
    private filterResults;
}
