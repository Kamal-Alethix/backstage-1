import { Entity } from '@backstage/catalog-model';
/**
 * Returns a function that checks whether the currently signed-in user is an
 * owner of a given entity. When the hook is initially mounted, the loading
 * flag will be true and the results returned from the function will always be
 * false.
 *
 * @public
 *
 * @returns a function that checks if the signed in user owns an entity
 */
export declare function useEntityOwnership(): {
    loading: boolean;
    isOwnedEntity: (entity: Entity) => boolean;
};
