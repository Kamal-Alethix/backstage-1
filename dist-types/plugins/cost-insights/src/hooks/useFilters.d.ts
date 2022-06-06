import React, { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { Maybe, PageFilters, ProductFilters } from '../types';
export declare type FilterContextProps = {
    pageFilters: PageFilters;
    productFilters: ProductFilters;
    setPageFilters: Dispatch<SetStateAction<Maybe<PageFilters>>>;
    setProductFilters: Dispatch<SetStateAction<Maybe<ProductFilters>>>;
};
export declare type MapFiltersToProps<T> = (props: FilterContextProps) => T;
export declare const FilterContext: React.Context<FilterContextProps | undefined>;
export declare const FilterProvider: ({ children }: PropsWithChildren<{}>) => JSX.Element | null;
export declare function useFilters<T>(mapFiltersToProps: MapFiltersToProps<T>): T;
