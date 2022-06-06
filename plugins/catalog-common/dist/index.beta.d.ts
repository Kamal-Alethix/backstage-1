/**
 * Provides shared objects useful for interacting with the catalog and its
 * entities, such as catalog permissions.
 *
 * @packageDocumentation
 */

import { BasicPermission } from '@backstage/plugin-permission-common';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { ResourcePermission } from '@backstage/plugin-permission-common';

/* Excluded from this release type: catalogEntityCreatePermission */

/* Excluded from this release type: catalogEntityDeletePermission */

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

/* Excluded from this release type: CatalogEntityPermission */

/* Excluded from this release type: catalogEntityReadPermission */

/* Excluded from this release type: catalogEntityRefreshPermission */

/* Excluded from this release type: catalogLocationCreatePermission */

/* Excluded from this release type: catalogLocationDeletePermission */

/* Excluded from this release type: catalogLocationReadPermission */

/* Excluded from this release type: RESOURCE_TYPE_CATALOG_ENTITY */

export { }
