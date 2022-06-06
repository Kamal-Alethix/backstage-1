/// <reference types="react" />
declare type FiltersButtonProps = {
    numberOfSelectedFilters: number;
    handleToggleFilters: () => void;
};
export declare const FiltersButton: ({ numberOfSelectedFilters, handleToggleFilters, }: FiltersButtonProps) => JSX.Element;
export {};
