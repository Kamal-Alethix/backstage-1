import { ResourcePermission } from '@backstage/plugin-permission-common';
/**
 * A thin wrapper around the
 * {@link @backstage/plugin-permission-react#usePermission} hook which uses the
 * current entity in context to make an authorization request for the given
 * {@link @backstage/plugin-catalog-common#CatalogEntityPermission}.
 *
 * Note: this hook blocks the permission request until the entity has loaded in
 * context. If you have the entityRef and need concurrent requests, use the
 * `usePermission` hook directly.
 * @alpha
 */
export declare function useEntityPermission(permission: ResourcePermission<'catalog-entity'>): {
    loading: boolean;
    allowed: boolean;
    error?: Error;
};
