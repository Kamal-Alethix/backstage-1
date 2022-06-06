import { ReactElement } from 'react';
import { SearchAutocompleteFilterProps } from './SearchFilter.Autocomplete';
/**
 * @public
 */
export declare type SearchFilterComponentProps = {
    className?: string;
    name: string;
    label?: string;
    /**
     * Either an array of values directly, or an async function to return a list
     * of values to be used in the filter. In the autocomplete filter, the last
     * input value is provided as an input to allow values to be filtered. This
     * function is debounced and values cached.
     */
    values?: string[] | ((partial: string) => Promise<string[]>);
    defaultValue?: string[] | string | null;
    /**
     * Debounce time in milliseconds, used when values is an async callback.
     * Defaults to 250ms.
     */
    valuesDebounceMs?: number;
};
/**
 * @public
 */
export declare type SearchFilterWrapperProps = SearchFilterComponentProps & {
    component: (props: SearchFilterComponentProps) => ReactElement;
    debug?: boolean;
};
declare const SearchFilter: {
    ({ component: Element, ...props }: SearchFilterWrapperProps): JSX.Element;
    Checkbox(props: Omit<SearchFilterWrapperProps, 'component'> & SearchFilterComponentProps): JSX.Element;
    Select(props: Omit<SearchFilterWrapperProps, 'component'> & SearchFilterComponentProps): JSX.Element;
    /**
     * A control surface for a given filter field name, rendered as an autocomplete
     * textfield. A hard-coded list of values may be provided, or an async function
     * which returns values may be provided instead.
     * @public
     */
    Autocomplete(props: SearchAutocompleteFilterProps): JSX.Element;
};
/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchFilter /> component instead. This component will be removed in an
 * upcoming release.
 */
declare const SearchFilterNext: {
    ({ component: Element, ...props }: SearchFilterWrapperProps): JSX.Element;
    Checkbox(props: Omit<SearchFilterWrapperProps, 'component'> & SearchFilterComponentProps): JSX.Element;
    Select(props: Omit<SearchFilterWrapperProps, 'component'> & SearchFilterComponentProps): JSX.Element;
    /**
     * A control surface for a given filter field name, rendered as an autocomplete
     * textfield. A hard-coded list of values may be provided, or an async function
     * which returns values may be provided instead.
     * @public
     */
    Autocomplete(props: SearchAutocompleteFilterProps): JSX.Element;
};
export { SearchFilter, SearchFilterNext };
