import { Permission, ResourcePermission } from '@backstage/plugin-permission-common';
/** @public */
export declare type AsyncPermissionResult = {
    loading: boolean;
    allowed: boolean;
    error?: Error;
};
/**
 * React hook utility for authorization. Given either a non-resource
 * {@link @backstage/plugin-permission-common#Permission} or a
 * {@link @backstage/plugin-permission-common#ResourcePermission} and an
 * optional resourceRef, it will return whether or not access is allowed (for
 * the given resource, if resourceRef is provided). See
 * {@link @backstage/plugin-permission-common/PermissionClient#authorize} for
 * more details.
 *
 * The resourceRef field is optional to allow calling this hook with an
 * entity that might be loading asynchronously, but when resourceRef is not
 * supplied, the value of `allowed` will always be false.
 *
 * Note: This hook uses stale-while-revalidate to help avoid flicker in UI
 * elements that would be conditionally rendered based on the `allowed` result
 * of this hook.
 * @public
 */
export declare function usePermission(input: {
    permission: Exclude<Permission, ResourcePermission>;
    resourceRef?: never;
} | {
    permission: ResourcePermission;
    resourceRef: string | undefined;
}): AsyncPermissionResult;
