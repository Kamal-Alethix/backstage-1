/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { SearchQuery, SearchResultSet } from '@backstage/plugin-search-common';
import { JsonObject } from '@backstage/types';
import React, { PropsWithChildren } from 'react';
import { AsyncState } from 'react-use/lib/useAsync';

/**
 * @public
 */
declare const searchApiRef: _backstage_core_plugin_api.ApiRef<SearchApi>;
/**
 * @public
 */
interface SearchApi {
    query(query: SearchQuery): Promise<SearchResultSet>;
}
/**
 * @public
 *
 * Search Api Mock that can be used in tests and storybooks
 */
declare class MockSearchApi implements SearchApi {
    mockedResults?: SearchResultSet | undefined;
    constructor(mockedResults?: SearchResultSet | undefined);
    query(): Promise<SearchResultSet>;
}

/**
 * @public
 */
declare type HighlightedSearchResultTextProps = {
    text: string;
    preTag: string;
    postTag: string;
};
/**
 * @public
 */
declare const HighlightedSearchResultText: ({ text, preTag, postTag, }: HighlightedSearchResultTextProps) => JSX.Element;

/**
 *
 * @public
 */
declare type SearchContextValue = {
    result: AsyncState<SearchResultSet>;
    setTerm: React.Dispatch<React.SetStateAction<string>>;
    setTypes: React.Dispatch<React.SetStateAction<string[]>>;
    setFilters: React.Dispatch<React.SetStateAction<JsonObject>>;
    setPageCursor: React.Dispatch<React.SetStateAction<string | undefined>>;
    fetchNextPage?: React.DispatchWithoutAction;
    fetchPreviousPage?: React.DispatchWithoutAction;
} & SearchContextState;
/**
 *
 * @public
 */
declare type SearchContextState = {
    term: string;
    types: string[];
    filters: JsonObject;
    pageCursor?: string;
};
/**
 * @public
 *
 * React hook which provides the search context
 */
declare const useSearch: () => SearchContextValue;
/**
 * @public
 *
 * React hook which checks for an existing search context
 */
declare const useSearchContextCheck: () => boolean;
/**
 * Props for {@link SearchContextProvider}
 *
 * @public
 */
declare type SearchContextProviderProps = PropsWithChildren<{
    initialState?: SearchContextState;
}>;
/**
 * @public
 *
 * Search context provider which gives you access to shared state between search components
 */
declare const SearchContextProvider: (props: SearchContextProviderProps) => JSX.Element;

export { HighlightedSearchResultText, HighlightedSearchResultTextProps, MockSearchApi, SearchApi, SearchContextProvider, SearchContextProviderProps, SearchContextState, SearchContextValue, searchApiRef, useSearch, useSearchContextCheck };
