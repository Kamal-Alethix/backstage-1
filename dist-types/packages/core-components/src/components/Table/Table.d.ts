import { Column, MaterialTableProps } from '@material-table/core';
import { MutableRefObject, ReactNode } from 'react';
import { SelectedFilters } from './Filters';
export declare type TableHeaderClassKey = 'header';
export declare type TableToolbarClassKey = 'root' | 'title' | 'searchField';
/** @public */
export declare type FiltersContainerClassKey = 'root' | 'title';
export declare type TableClassKey = 'root';
export interface TableColumn<T extends object = {}> extends Column<T> {
    highlight?: boolean;
    width?: string;
}
export declare type TableFilter = {
    column: string;
    type: 'select' | 'multiple-select';
};
export declare type TableState = {
    search?: string;
    filtersOpen?: boolean;
    filters?: SelectedFilters;
};
export interface TableProps<T extends object = {}> extends MaterialTableProps<T> {
    columns: TableColumn<T>[];
    subtitle?: string;
    filters?: TableFilter[];
    initialState?: TableState;
    emptyContent?: ReactNode;
    onStateChange?: (state: TableState) => any;
}
export declare function TableToolbar(toolbarProps: {
    toolbarRef: MutableRefObject<any>;
    setSearch: (value: string) => void;
    onSearchChanged: (value: string) => void;
    toggleFilters: () => void;
    hasFilters: boolean;
    selectedFiltersLength: number;
}): JSX.Element;
export declare function Table<T extends object = {}>(props: TableProps<T>): JSX.Element;
