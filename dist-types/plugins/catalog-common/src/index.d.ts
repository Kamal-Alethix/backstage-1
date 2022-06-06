/**
 * Provides shared objects useful for interacting with the catalog and its
 * entities, such as catalog permissions.
 *
 * @packageDocumentation
 */
export { RESOURCE_TYPE_CATALOG_ENTITY, catalogEntityReadPermission, catalogEntityCreatePermission, catalogEntityDeletePermission, catalogEntityRefreshPermission, catalogLocationReadPermission, catalogLocationCreatePermission, catalogLocationDeletePermission, } from './permissions';
export type { CatalogEntityPermission } from './permissions';
export * from './search';
