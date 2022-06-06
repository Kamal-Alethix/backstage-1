import { SearchQuery, SearchResultSet } from '@backstage/plugin-search-common';
/**
 * @public
 */
export declare const searchApiRef: import("@backstage/core-plugin-api").ApiRef<SearchApi>;
/**
 * @public
 */
export interface SearchApi {
    query(query: SearchQuery): Promise<SearchResultSet>;
}
/**
 * @public
 *
 * Search Api Mock that can be used in tests and storybooks
 */
export declare class MockSearchApi implements SearchApi {
    mockedResults?: SearchResultSet | undefined;
    constructor(mockedResults?: SearchResultSet | undefined);
    query(): Promise<SearchResultSet>;
}
