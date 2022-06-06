/**
 * These conditions are used when creating conditional decisions for catalog
 * entities that are returned by authorization policies.
 *
 * @alpha
 */
export declare const catalogConditions: import("@backstage/plugin-permission-node").Conditions<{
    hasAnnotation: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("..").EntitiesSearchFilter, "catalog-entity", [annotation: string]>;
    hasLabel: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("..").EntitiesSearchFilter, "catalog-entity", [label: string]>;
    hasMetadata: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("..").EntitiesSearchFilter, "catalog-entity", [key: string, value?: string | undefined]>;
    hasSpec: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("..").EntitiesSearchFilter, "catalog-entity", [key: string, value?: string | undefined]>;
    isEntityKind: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("..").EntitiesSearchFilter, "catalog-entity", [kinds: string[]]>;
    isEntityOwner: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("..").EntitiesSearchFilter, "catalog-entity", [claims: string[]]>;
}>;
/**
 * `createCatalogConditionalDecision` can be used when authoring policies to
 * create conditional decisions. It requires a permission of type
 * `ResourcePermission<'catalog-entity'>` to be passed as the first parameter.
 * It's recommended that you use the provided `isResourcePermission` and
 * `isPermission` helper methods to narrow the type of the permission passed to
 * the handle method as shown below.
 *
 * ```
 * // MyAuthorizationPolicy.ts
 * ...
 * import { createCatalogPolicyDecision } from '@backstage/plugin-catalog-backend';
 * import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common';
 *
 * class MyAuthorizationPolicy implements PermissionPolicy {
 *   async handle(request, user) {
 *     ...
 *
 *     if (isResourcePermission(request.permission, RESOURCE_TYPE_CATALOG_ENTITY)) {
 *       return createCatalogConditionalDecision(
 *         request.permission,
 *         { anyOf: [...insert conditions here...] }
 *       );
 *     }
 *
 *     ...
 * }
 * ```
 *
 * @alpha
 */
export declare const createCatalogConditionalDecision: (permission: import("@backstage/plugin-permission-common").ResourcePermission<"catalog-entity">, conditions: import("@backstage/plugin-permission-common").PermissionCriteria<import("@backstage/plugin-permission-common").PermissionCondition<"catalog-entity", unknown[]>>) => import("@backstage/plugin-permission-common").ConditionalPolicyDecision;
