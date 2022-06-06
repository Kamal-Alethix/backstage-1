import { Entity } from '@backstage/catalog-model';
/**
 * Uses the default ownership resolution logic to return an array
 * of entity refs that the provided entity claims ownership through.
 *
 * A reference to the entity itself will also be included in the returned array.
 *
 * @public
 */
export declare function getDefaultOwnershipEntityRefs(entity: Entity): string[];
