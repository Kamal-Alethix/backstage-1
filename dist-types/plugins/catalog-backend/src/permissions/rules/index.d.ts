/**
 * These permission rules can be used to conditionally filter catalog entities
 * or describe a user's access to the entities.
 *
 * @alpha
 */
export declare const permissionRules: {
    hasAnnotation: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [annotation: string]>;
    hasLabel: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [label: string]>;
    hasMetadata: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [key: string, value?: string | undefined]>;
    hasSpec: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [key: string, value?: string | undefined]>;
    isEntityKind: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [kinds: string[]]>;
    isEntityOwner: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [claims: string[]]>;
};
export type { CatalogPermissionRule } from './util';
export { createCatalogPermissionRule } from './util';
