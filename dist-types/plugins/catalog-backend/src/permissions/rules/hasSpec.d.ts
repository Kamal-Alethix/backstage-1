/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for entities with the specified spec subfield. Also matches on values
 * if value is provided.
 *
 * The key argument to the `apply` and `toQuery` methods can be nested, such as
 * 'field.nestedfield'.
 * @alpha
 */
export declare const hasSpec: import("@backstage/plugin-permission-node").PermissionRule<import("@backstage/catalog-model").Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [key: string, value?: string | undefined]>;
