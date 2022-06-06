import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
/**
 * Get the related entity references.
 *
 * @public
 */
export declare function getEntityRelations(entity: Entity | undefined, relationType: string, filter?: {
    kind: string;
}): CompoundEntityRef[];
