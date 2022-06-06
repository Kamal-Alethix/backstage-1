/**
 * Utility hook for either asynchronously loading filter values from a given
 * function or synchronously providing a given list of default values.
 */
export declare const useAsyncFilterValues: (fn: ((partial: string) => Promise<string[]>) | undefined, inputValue: string, defaultValues?: string[], debounce?: number) => {
    loading: boolean;
    error?: undefined;
    value?: undefined;
} | {
    loading: false;
    error: Error;
    value?: undefined;
} | {
    loading: true;
    error?: Error | undefined;
    value?: string[] | undefined;
} | {
    loading: boolean;
    value: string[];
};
/**
 * Utility hook for applying a given default value to the search context.
 */
export declare const useDefaultFilterValue: (name: string, defaultValue?: string | string[] | null | undefined) => void;
