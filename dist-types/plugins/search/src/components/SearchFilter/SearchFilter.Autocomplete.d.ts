/// <reference types="react" />
import { SearchFilterComponentProps } from './SearchFilter';
/**
 * @public
 */
export declare type SearchAutocompleteFilterProps = SearchFilterComponentProps & {
    filterSelectedOptions?: boolean;
    limitTags?: number;
    multiple?: boolean;
};
export declare const AutocompleteFilter: (props: SearchAutocompleteFilterProps) => JSX.Element;
