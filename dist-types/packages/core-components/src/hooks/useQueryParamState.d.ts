declare type SetQueryParams<T> = (params: T) => void;
export declare function useQueryParamState<T>(stateName: string, 
/** @deprecated Don't configure a custom debouceTime */
debounceTime?: number): [T | undefined, SetQueryParams<T>];
export {};
