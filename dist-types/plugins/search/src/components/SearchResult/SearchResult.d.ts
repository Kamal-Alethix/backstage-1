/// <reference types="react" />
import { SearchResult } from '@backstage/plugin-search-common';
declare type Props = {
    children: (results: {
        results: SearchResult[];
    }) => JSX.Element;
};
export declare const SearchResultComponent: ({ children }: Props) => JSX.Element;
export { SearchResultComponent as SearchResult };
