/// <reference types="react" />
import { InputBaseProps } from '@material-ui/core';
import * as react from 'react';
import { ReactElement, ReactNode } from 'react';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { IconComponent } from '@backstage/core-plugin-api';
import * as _backstage_plugin_search_common from '@backstage/plugin-search-common';

declare type FiltersButtonProps = {
    numberOfSelectedFilters: number;
    handleToggleFilters: () => void;
};
declare const FiltersButton: ({ numberOfSelectedFilters, handleToggleFilters, }: FiltersButtonProps) => JSX.Element;

declare type FiltersState = {
    selected: string;
    checked: Array<string>;
};
declare type FilterOptions = {
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
declare const Filters: ({ filters, filterOptions, resetFilters, updateSelected, updateChecked, }: FiltersProps) => JSX.Element;

/**
 * Props for {@link SearchBarBase}.
 *
 * @public
 */
declare type SearchBarBaseProps = Omit<InputBaseProps, 'onChange'> & {
    debounceTime?: number;
    clearButton?: boolean;
    onClear?: () => void;
    onSubmit?: () => void;
    onChange: (value: string) => void;
};
/**
 * All search boxes exported by the search plugin are based on the <SearchBarBase />,
 * and this one is based on the <InputBase /> component from Material UI.
 * Recommended if you don't use Search Provider or Search Context.
 *
 * @public
 */
declare const SearchBarBase: ({ onChange, onKeyDown, onSubmit, debounceTime, clearButton, fullWidth, value: defaultValue, inputProps: defaultInputProps, endAdornment: defaultEndAdornment, ...props }: SearchBarBaseProps) => JSX.Element;
/**
 * Props for {@link SearchBar}.
 *
 * @public
 */
declare type SearchBarProps = Partial<SearchBarBaseProps>;
/**
 * Recommended search bar when you use the Search Provider or Search Context.
 *
 * @public
 */
declare const SearchBar: ({ onChange, ...props }: SearchBarProps) => JSX.Element;

/**
 * Props for {@link HomePageSearchBar}.
 *
 * @public
 */
declare type HomePageSearchBarProps = Partial<Omit<SearchBarBaseProps, 'onChange' | 'onSubmit'>>;

/**
 * @public
 */
declare type SearchAutocompleteFilterProps = SearchFilterComponentProps & {
    filterSelectedOptions?: boolean;
    limitTags?: number;
    multiple?: boolean;
};

/**
 * @public
 */
declare type SearchFilterComponentProps = {
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
declare type SearchFilterWrapperProps = SearchFilterComponentProps & {
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

/**
 * @public
 **/
interface SearchModalChildrenProps {
    /**
     * A function that should be invoked when navigating away from the modal.
     */
    toggleModal: () => void;
}
interface SearchModalProps {
    /**
     * If true, it renders the modal.
     */
    open?: boolean;
    /**
     * This is supposed to be used together with the open prop.
     * If `hidden` is true, it hides the modal.
     * If `open` is false, the value of `hidden` has no effect on the modal.
     * Use `open` for controlling whether the modal should be rendered or not.
     */
    hidden?: boolean;
    /**
     * a function invoked when a search item is pressed or when the dialog
     * should be closed.
     */
    toggleModal: () => void;
    /**
     * A function that returns custom content to render in the search modal in
     * place of the default.
     */
    children?: (props: SearchModalChildrenProps) => JSX.Element;
}
declare const SearchModal: ({ open, hidden, toggleModal, children, }: SearchModalProps) => JSX.Element;

/**
 * The state of the search modal, as well as functions for changing the modal's
 * visibility.
 *
 * @public
 */
declare type SearchModalValue = {
    state: {
        hidden: boolean;
        open: boolean;
    };
    toggleModal: () => void;
    setOpen: (open: boolean) => void;
};
/**
 * Props for the SearchModalProvider.
 * @public
 */
declare type SearchModalProviderProps = {
    /**
     * Children which should have access to the SearchModal context and the
     * associated useSearchModal() hook.
     */
    children: ReactNode;
    /**
     * Pass true if the modal should be rendered initially.
     */
    showInitially?: boolean;
};
/**
 * A context provider responsible for storing and managing state related to the
 * search modal.
 *
 * @remarks
 * If you need to control visibility of the search toggle outside of the modal
 * itself, you can optionally place this higher up in the react tree where your
 * custom code and the search modal share the same context.
 *
 * @example
 * ```tsx
 * import {
 *   SearchModalProvider,
 *   SidebarSearchModal,
 * } from '@backstage/plugin-search';
 *
 * // ...
 *
 * <SearchModalProvider>
 *   <KeyboardShortcutSearchToggler />
 *   <SidebarSearchModal>
 *     {({ toggleModal }) => <SearchModal toggleModal={toggleModal} />}
 *   </SidebarSearchModal>
 * </SearchModalProvider>
 * ```
 *
 * @public
 */
declare const SearchModalProvider: ({ children, showInitially, }: SearchModalProviderProps) => JSX.Element;
/**
 * Use this hook to manage the state of {@link SearchModal}
 * and change its visibility.
 *
 * @public
 *
 * @param initialState - pass `true` to make the modal initially visible
 * @returns an object containing the state of the modal together with
 * functions for changing the visibility of the modal.
 */
declare function useSearchModal(initialState?: boolean): SearchModalValue;

declare const SearchPage$1: () => JSX.Element;

declare const SearchResultPager: () => JSX.Element;

/**
 * @public
 */
declare type SearchTypeAccordionProps = {
    name: string;
    types: Array<{
        value: string;
        name: string;
        icon: JSX.Element;
    }>;
    defaultValue?: string;
};

/**
 * @public
 */
declare type SearchTypeTabsProps = {
    types: Array<{
        value: string;
        name: string;
    }>;
    defaultValue?: string;
};

/**
 * @public
 */
declare type SearchTypeProps = {
    className?: string;
    name: string;
    values?: string[];
    defaultValue?: string[] | string | null;
};
declare const SearchType: {
    (props: SearchTypeProps): JSX.Element;
    /**
     * A control surface for the search query's "types" property, displayed as a
     * single-select collapsible accordion suitable for use in faceted search UIs.
     * @public
     */
    Accordion(props: SearchTypeAccordionProps): JSX.Element;
    /**
     * A control surface for the search query's "types" property, displayed as a
     * tabs suitable for use in faceted search UIs.
     * @public
     */
    Tabs(props: SearchTypeTabsProps): JSX.Element;
};

declare type SidebarSearchProps = {
    icon?: IconComponent;
};
declare const SidebarSearch: (props: SidebarSearchProps) => JSX.Element;

declare type SidebarSearchModalProps = {
    icon?: IconComponent;
    children?: (props: SearchModalChildrenProps) => JSX.Element;
};

declare const searchPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
    nextRoot: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const SearchPage: () => JSX.Element;
/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchPage /> component instead. This component will be removed in an
 * upcoming release.
 */
declare const SearchPageNext: () => JSX.Element;
/**
 * @deprecated This component was used for rapid prototyping of the Backstage
 * Search platform. Now that the API has stabilized, you should use the
 * <SearchBar /> component instead. This component will be removed in an
 * upcoming release.
 */
declare const SearchBarNext: ({ onChange, ...props }: Partial<SearchBarBaseProps>) => JSX.Element;
declare const SearchResult: ({ children }: {
    children: (results: {
        results: _backstage_plugin_search_common.SearchResult[];
    }) => JSX.Element;
}) => JSX.Element;
declare const SidebarSearchModal: (props: SidebarSearchModalProps) => JSX.Element;
declare const DefaultResultListItem: ({ result, highlight, icon, secondaryAction, lineClamp, }: {
    icon?: react.ReactNode;
    secondaryAction?: react.ReactNode;
    result: _backstage_plugin_search_common.SearchDocument;
    highlight?: _backstage_plugin_search_common.ResultHighlight | undefined;
    lineClamp?: number | undefined;
}) => JSX.Element;
declare const HomePageSearchBar: ({ ...props }: Partial<Omit<SearchBarBaseProps, "onChange" | "onSubmit">>) => JSX.Element;

export { DefaultResultListItem, Filters, FiltersButton, FiltersState, HomePageSearchBar, HomePageSearchBarProps, SearchPage$1 as Router, SearchAutocompleteFilterProps, SearchBar, SearchBarBase, SearchBarBaseProps, SearchBarNext, SearchBarProps, SearchFilter, SearchFilterComponentProps, SearchFilterNext, SearchFilterWrapperProps, SearchModal, SearchModalChildrenProps, SearchModalProps, SearchModalProvider, SearchModalProviderProps, SearchModalValue, SearchPage, SearchPageNext, SearchResult, SearchResultPager, SearchType, SearchTypeAccordionProps, SearchTypeProps, SearchTypeTabsProps, SidebarSearch, SidebarSearchModal, SidebarSearchModalProps, SidebarSearchProps, searchPlugin as plugin, searchPlugin, useSearchModal };
