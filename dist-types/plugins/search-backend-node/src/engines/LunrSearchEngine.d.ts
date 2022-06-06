import { IndexableDocument, IndexableResultSet, SearchQuery, QueryTranslator, SearchEngine } from '@backstage/plugin-search-common';
import lunr from 'lunr';
import { Logger } from 'winston';
import { LunrSearchEngineIndexer } from './LunrSearchEngineIndexer';
/**
 * Type of translated query for the Lunr Search Engine.
 * @public
 */
export declare type ConcreteLunrQuery = {
    lunrQueryBuilder: lunr.Index.QueryBuilder;
    documentTypes?: string[];
    pageSize: number;
};
/**
 * Translator repsonsible for translating search term and filters to a query that the Lunr Search Engine understands.
 * @public
 */
export declare type LunrQueryTranslator = (query: SearchQuery) => ConcreteLunrQuery;
/**
 * Lunr specific search engine implementation.
 * @public
 */
export declare class LunrSearchEngine implements SearchEngine {
    protected lunrIndices: Record<string, lunr.Index>;
    protected docStore: Record<string, IndexableDocument>;
    protected logger: Logger;
    protected highlightPreTag: string;
    protected highlightPostTag: string;
    constructor({ logger }: {
        logger: Logger;
    });
    protected translator: QueryTranslator;
    setTranslator(translator: LunrQueryTranslator): void;
    getIndexer(type: string): Promise<LunrSearchEngineIndexer>;
    query(query: SearchQuery): Promise<IndexableResultSet>;
}
export declare function decodePageCursor(pageCursor?: string): {
    page: number;
};
export declare function encodePageCursor({ page }: {
    page: number;
}): string;
declare type ParseHighlightFieldsProps = {
    preTag: string;
    postTag: string;
    doc: any;
    positionMetadata: {
        [term: string]: {
            [field: string]: {
                position: number[][];
            };
        };
    };
};
export declare function parseHighlightFields({ preTag, postTag, doc, positionMetadata, }: ParseHighlightFieldsProps): {
    [field: string]: string;
};
export {};
