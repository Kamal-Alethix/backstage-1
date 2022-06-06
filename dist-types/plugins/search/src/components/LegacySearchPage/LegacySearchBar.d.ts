/// <reference types="react" />
declare type SearchBarProps = {
    searchQuery: string;
    handleSearch: any;
    handleClearSearchBar: any;
};
export declare const SearchBar: ({ searchQuery, handleSearch, handleClearSearchBar, }: SearchBarProps) => JSX.Element;
export {};
