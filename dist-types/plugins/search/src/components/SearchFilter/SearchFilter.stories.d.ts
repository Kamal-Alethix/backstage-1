import { ComponentType } from 'react';
declare const _default: {
    title: string;
    component: {
        ({ component: Element, ...props }: import("./SearchFilter").SearchFilterWrapperProps): JSX.Element;
        Checkbox(props: Omit<import("./SearchFilter").SearchFilterWrapperProps, "component"> & import("./SearchFilter").SearchFilterComponentProps): JSX.Element;
        Select(props: Omit<import("./SearchFilter").SearchFilterWrapperProps, "component"> & import("./SearchFilter").SearchFilterComponentProps): JSX.Element;
        Autocomplete(props: import("./SearchFilter.Autocomplete").SearchAutocompleteFilterProps): JSX.Element;
    };
    decorators: ((Story: ComponentType<{}>) => JSX.Element)[];
};
export default _default;
export declare const CheckBoxFilter: () => JSX.Element;
export declare const SelectFilter: () => JSX.Element;
export declare const AsyncSelectFilter: () => JSX.Element;
export declare const Autocomplete: () => JSX.Element;
export declare const MultiSelectAutocomplete: () => JSX.Element;
export declare const AsyncMultiSelectAutocomplete: () => JSX.Element;
