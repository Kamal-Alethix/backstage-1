import { Entity } from '@backstage/catalog-model';
/**
 * Returns true if the `owner` argument is a direct owner on the `entity` argument.
 *
 * @alpha
 * @remarks
 *
 * Note that this ownership is not the same as using the claims in the auth-resolver, it only will take into account ownership as expressed by direct entity relations.
 * It doesn't know anything about the additional groups that a user might belong to which the claims contain.
 */
export declare function isOwnerOf(owner: Entity, entity: Entity): boolean;
