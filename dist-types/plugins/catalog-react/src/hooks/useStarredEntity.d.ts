import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
/** @public */
export declare function useStarredEntity(entityOrRef: Entity | CompoundEntityRef | string): {
    toggleStarredEntity: () => void;
    isStarredEntity: boolean;
};
