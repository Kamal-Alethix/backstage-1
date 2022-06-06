/**
 * Search Plugin frontend library
 *
 * @packageDocumentation
 */
export { searchApiRef, MockSearchApi } from './api';
export type { SearchApi } from './api';
export * from './components';
export { SearchContextProvider, useSearch, useSearchContextCheck, } from './context';
export type { SearchContextProviderProps, SearchContextState, SearchContextValue, } from './context';
