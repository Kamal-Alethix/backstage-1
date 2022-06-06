import { Entity } from '../entity';
/**
 * Validates entities of a certain kind.
 *
 * @public
 */
export declare type KindValidator = {
    /**
     * Validates the entity as a known entity kind.
     *
     * @param entity - The entity to validate
     * @returns Resolves to true, if the entity was of a kind that was known and
     *   handled by this validator, and was found to be valid. Resolves to false,
     *   if the entity was not of a kind that was known by this validator.
     *   Rejects to an Error describing the problem, if the entity was of a kind
     *   that was known by this validator and was not valid.
     */
    check(entity: Entity): Promise<boolean>;
};
