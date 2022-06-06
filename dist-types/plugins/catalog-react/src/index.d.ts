/**
 * A frontend library that helps other Backstage plugins interact with the catalog
 *
 * @packageDocumentation
 */
export type { CatalogApi } from '@backstage/catalog-client';
export { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
export { catalogApiRef } from './api';
export * from './apis';
export * from './components';
export * from './hooks';
export * from './filters';
export { entityRouteParams, entityRouteRef } from './routes';
export * from './testUtils';
export * from './types';
export * from './overridableComponents';
export { getEntityRelations, getEntitySourceLocation, isOwnerOf, } from './utils';
export type { EntitySourceLocation } from './utils';
