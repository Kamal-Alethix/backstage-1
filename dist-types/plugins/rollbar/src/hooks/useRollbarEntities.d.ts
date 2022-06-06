export declare function useRollbarEntities(): {
    entities: import("@backstage/catalog-model").Entity[] | undefined;
    organization: string;
    loading: boolean;
    error: Error | undefined;
};
