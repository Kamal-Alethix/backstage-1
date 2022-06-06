/// <reference types="react" />
import { SelectProps } from '../Select/Select';
export declare type TableFiltersClassKey = 'root' | 'value' | 'heder' | 'filters';
export declare type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
export declare type Filter = {
    type: 'select' | 'multiple-select';
    element: Without<SelectProps, 'onChange'>;
};
export declare type SelectedFilters = {
    [key: string]: string | string[];
};
declare type Props = {
    filters: Filter[];
    selectedFilters?: SelectedFilters;
    onChangeFilters: (arg: any) => any;
};
export declare const Filters: (props: Props) => JSX.Element;
export {};
