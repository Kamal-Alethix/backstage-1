/// <reference types="react" />
export declare type FiltersState = {
    selected: string;
    checked: Array<string>;
};
export declare type FilterOptions = {
    kind: Array<string>;
    lifecycle: Array<string>;
};
declare type FiltersProps = {
    filters: FiltersState;
    filterOptions: FilterOptions;
    resetFilters: () => void;
    updateSelected: (filter: string) => void;
    updateChecked: (filter: string) => void;
};
export declare const Filters: ({ filters, filterOptions, resetFilters, updateSelected, updateChecked, }: FiltersProps) => JSX.Element;
export {};
