import { Entity } from '@backstage/catalog-model';
import { PermissionRule } from '@backstage/plugin-permission-node';
import { EntitiesSearchFilter } from '../../catalog/types';
/**
 * Convenience type for {@link @backstage/plugin-permission-node#PermissionRule}
 * instances with the correct resource type, resource, and filter to work with
 * the catalog.
 *
 * @alpha
 */
export declare type CatalogPermissionRule<TParams extends unknown[] = unknown[]> = PermissionRule<Entity, EntitiesSearchFilter, 'catalog-entity', TParams>;
/**
 * Helper function for creating correctly-typed
 * {@link @backstage/plugin-permission-node#PermissionRule}s for the
 * catalog-backend.
 *
 * @alpha
 */
export declare const createCatalogPermissionRule: <TParams extends unknown[]>(rule: PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", TParams>) => PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", TParams>;
