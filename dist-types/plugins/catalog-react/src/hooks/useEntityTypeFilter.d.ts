/**
 * A hook built on top of `useEntityList` for enabling selection of valid `spec.type` values
 * based on the selected EntityKindFilter.
 * @public
 */
export declare function useEntityTypeFilter(): {
    loading: boolean;
    error?: Error;
    availableTypes: string[];
    selectedTypes: string[];
    setSelectedTypes: (types: string[]) => void;
};
