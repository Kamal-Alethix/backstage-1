/**
 * The Backstage plugin that provides your backstage app with search
 *
 * @packageDocumentation
 */
export { Filters, FiltersButton } from './components/Filters';
export type { FiltersState } from './components/Filters';
export type { HomePageSearchBarProps } from './components/HomePageComponent';
export { SearchBar, SearchBarBase } from './components/SearchBar';
export type { SearchBarBaseProps, SearchBarProps, } from './components/SearchBar';
export { SearchFilter, SearchFilterNext } from './components/SearchFilter';
export type { SearchAutocompleteFilterProps, SearchFilterComponentProps, SearchFilterWrapperProps, } from './components/SearchFilter';
export { SearchModal, SearchModalProvider, useSearchModal, } from './components/SearchModal';
export type { SearchModalChildrenProps, SearchModalProps, SearchModalProviderProps, SearchModalValue, } from './components/SearchModal';
export { SearchPage as Router } from './components/SearchPage';
export { SearchResultPager } from './components/SearchResultPager';
export { SearchType } from './components/SearchType';
export type { SearchTypeAccordionProps, SearchTypeTabsProps, SearchTypeProps, } from './components/SearchType';
export { SidebarSearch } from './components/SidebarSearch';
export type { SidebarSearchProps } from './components/SidebarSearch';
export type { SidebarSearchModalProps } from './components/SidebarSearchModal';
export { DefaultResultListItem, HomePageSearchBar, SearchBarNext, SearchPage, SearchPageNext, searchPlugin as plugin, searchPlugin, SearchResult, SidebarSearchModal, } from './plugin';
