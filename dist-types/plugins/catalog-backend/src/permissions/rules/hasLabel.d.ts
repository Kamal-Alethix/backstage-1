import { Entity } from '@backstage/catalog-model';
/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for entities with a specified label in its metadata.
 * @alpha
 */
export declare const hasLabel: import("@backstage/plugin-permission-node").PermissionRule<Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [label: string]>;
