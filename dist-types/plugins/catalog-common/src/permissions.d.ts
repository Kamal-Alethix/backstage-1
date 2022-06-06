import { ResourcePermission } from '@backstage/plugin-permission-common';
/**
 * Permission resource type which corresponds to catalog entities.
 *
 * {@link https://backstage.io/docs/features/software-catalog/software-catalog-overview}
 * @alpha
 */
export declare const RESOURCE_TYPE_CATALOG_ENTITY = "catalog-entity";
/**
 * Convenience type for catalog entity
 * {@link @backstage/plugin-permission-common#ResourcePermission}s.
 * @alpha
 */
export declare type CatalogEntityPermission = ResourcePermission<typeof RESOURCE_TYPE_CATALOG_ENTITY>;
/**
 * This permission is used to authorize actions that involve reading one or more
 * entities from the catalog.
 *
 * If this permission is not authorized, it will appear that the entity does not
 * exist in the catalog — both in the frontend and in API responses.
 * @alpha
 */
export declare const catalogEntityReadPermission: ResourcePermission<"catalog-entity">;
/**
 * This permission is used to authorize actions that involve creating a new
 * catalog entity. This includes registering an existing component into the
 * catalog.
 * @alpha
 */
export declare const catalogEntityCreatePermission: import("@backstage/plugin-permission-common").BasicPermission;
/**
 * This permission is used to designate actions that involve removing one or
 * more entities from the catalog.
 * @alpha
 */
export declare const catalogEntityDeletePermission: ResourcePermission<"catalog-entity">;
/**
 * This permission is used to designate refreshing one or more entities from the
 * catalog.
 * @alpha
 */
export declare const catalogEntityRefreshPermission: ResourcePermission<"catalog-entity">;
/**
 * This permission is used to designate actions that involve reading one or more
 * locations from the catalog.
 *
 * If this permission is not authorized, it will appear that the location does
 * not exist in the catalog — both in the frontend and in API responses.
 * @alpha
 */
export declare const catalogLocationReadPermission: import("@backstage/plugin-permission-common").BasicPermission;
/**
 * This permission is used to designate actions that involve creating catalog
 * locations.
 * @alpha
 */
export declare const catalogLocationCreatePermission: import("@backstage/plugin-permission-common").BasicPermission;
/**
 * This permission is used to designate actions that involve deleting locations
 * from the catalog.
 * @alpha
 */
export declare const catalogLocationDeletePermission: import("@backstage/plugin-permission-common").BasicPermission;
