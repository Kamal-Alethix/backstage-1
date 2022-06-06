/**
 * Provides shared objects useful for interacting with the catalog and its
 * entities, such as catalog permissions.
 *
 * @packageDocumentation
 */

import { BasicPermission } from '@backstage/plugin-permission-common';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { ResourcePermission } from '@backstage/plugin-permission-common';

/**
 * This permission is used to authorize actions that involve creating a new
 * catalog entity. This includes registering an existing component into the
 * catalog.
 * @alpha
 */
export declare const catalogEntityCreatePermission: BasicPermission;

/**
 * This permission is used to designate actions that involve removing one or
 * more entities from the catalog.
 * @alpha
 */
export declare const catalogEntityDeletePermission: ResourcePermission<"catalog-entity">;

/**
 * The Document format for an Entity in the Catalog for search
 *
 * @public
 */
export declare interface CatalogEntityDocument extends IndexableDocument {
    /** @deprecated `componentType` is being renamed to `type`. During the transition both of these fields should be set to the same value, in order to avoid issues with indexing. */
    componentType: string;
    type: string;
    namespace: string;
    kind: string;
    lifecycle: string;
    owner: string;
}

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
 * This permission is used to designate refreshing one or more entities from the
 * catalog.
 * @alpha
 */
export declare const catalogEntityRefreshPermission: ResourcePermission<"catalog-entity">;

/**
 * This permission is used to designate actions that involve creating catalog
 * locations.
 * @alpha
 */
export declare const catalogLocationCreatePermission: BasicPermission;

/**
 * This permission is used to designate actions that involve deleting locations
 * from the catalog.
 * @alpha
 */
export declare const catalogLocationDeletePermission: BasicPermission;

/**
 * This permission is used to designate actions that involve reading one or more
 * locations from the catalog.
 *
 * If this permission is not authorized, it will appear that the location does
 * not exist in the catalog — both in the frontend and in API responses.
 * @alpha
 */
export declare const catalogLocationReadPermission: BasicPermission;

/**
 * Permission resource type which corresponds to catalog entities.
 *
 * {@link https://backstage.io/docs/features/software-catalog/software-catalog-overview}
 * @alpha
 */
export declare const RESOURCE_TYPE_CATALOG_ENTITY = "catalog-entity";

export { }
