import { JsonObject } from '@backstage/types';
import { SearchResultSet } from '@backstage/plugin-search-common';
import React, { PropsWithChildren } from 'react';
import { AsyncState } from 'react-use/lib/useAsync';
/**
 *
 * @public
 */
export declare type SearchContextValue = {
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
export declare type SearchContextState = {
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
export declare const useSearch: () => SearchContextValue;
/**
 * @public
 *
 * React hook which checks for an existing search context
 */
export declare const useSearchContextCheck: () => boolean;
/**
 * Props for {@link SearchContextProvider}
 *
 * @public
 */
export declare type SearchContextProviderProps = PropsWithChildren<{
    initialState?: SearchContextState;
}>;
/**
 * @public
 *
 * Search context provider which gives you access to shared state between search components
 */
export declare const SearchContextProvider: (props: SearchContextProviderProps) => JSX.Element;
