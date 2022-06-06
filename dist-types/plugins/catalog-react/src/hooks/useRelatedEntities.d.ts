import { Entity } from '@backstage/catalog-model';
/** @public */
export declare function useRelatedEntities(entity: Entity, relationFilter: {
    type?: string;
    kind?: string;
}): {
    entities: Entity[] | undefined;
    loading: boolean;
    error: Error | undefined;
};
