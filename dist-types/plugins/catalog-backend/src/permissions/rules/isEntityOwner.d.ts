import { Entity } from '@backstage/catalog-model';
/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for entities with a specified owner.
 *
 * @alpha
 */
export declare const isEntityOwner: import("@backstage/plugin-permission-node").PermissionRule<Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [claims: string[]]>;
