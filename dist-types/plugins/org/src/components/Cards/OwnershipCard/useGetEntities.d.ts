import { Entity } from '@backstage/catalog-model';
export declare function useGetEntities(entity: Entity, relationsType: string, isGroup: boolean, entityFilterKind?: string[]): {
    componentsWithCounters: {
        counter: number;
        type: string;
        name: string;
        queryParams: string;
    }[] | undefined;
    loading: boolean;
    error?: Error;
};
