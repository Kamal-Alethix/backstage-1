import { Entity } from '@backstage/catalog-model';
/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for the presence of an annotation on a given entity.
 *
 * @alpha
 */
export declare const hasAnnotation: import("@backstage/plugin-permission-node").PermissionRule<Entity, import("../..").EntitiesSearchFilter, "catalog-entity", [annotation: string]>;
