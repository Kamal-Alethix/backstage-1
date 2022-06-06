import type { Entity } from '../Entity';
/**
 * A policy for validation or mutation to be applied to entities as they are
 * entering the system.
 *
 * @public
 */
export declare type EntityPolicy = {
    /**
     * Applies validation or mutation on an entity.
     *
     * @param entity - The entity, as validated/mutated so far in the policy tree
     * @returns The incoming entity, or a mutated version of the same, or
     *          undefined if this processor could not handle the entity
     * @throws An error if the entity should be rejected
     */
    enforce(entity: Entity): Promise<Entity | undefined>;
};
