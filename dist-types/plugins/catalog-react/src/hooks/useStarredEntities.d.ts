import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
/** @public */
export declare function useStarredEntities(): {
    starredEntities: Set<string>;
    toggleStarredEntity: (entityOrRef: Entity | CompoundEntityRef | string) => void;
    isStarredEntity: (entityOrRef: Entity | CompoundEntityRef | string) => boolean;
};
