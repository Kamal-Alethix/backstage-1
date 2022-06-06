import { Permission, PermissionAuthorizer, PermissionEvaluator, ResourcePermission } from '../types';
/**
 * Check if the two parameters are equivalent permissions.
 * @public
 */
export declare function isPermission<T extends Permission>(permission: Permission, comparedPermission: T): permission is T;
/**
 * Check if a given permission is a {@link ResourcePermission}. When
 * `resourceType` is supplied as the second parameter, also checks if
 * the permission has the specified resource type.
 * @public
 */
export declare function isResourcePermission<T extends string = string>(permission: Permission, resourceType?: T): permission is ResourcePermission<T>;
/**
 * Check if a given permission is related to a create action.
 * @public
 */
export declare function isCreatePermission(permission: Permission): boolean;
/**
 * Check if a given permission is related to a read action.
 * @public
 */
export declare function isReadPermission(permission: Permission): boolean;
/**
 * Check if a given permission is related to an update action.
 * @public
 */
export declare function isUpdatePermission(permission: Permission): boolean;
/**
 * Check if a given permission is related to a delete action.
 * @public
 */
export declare function isDeletePermission(permission: Permission): boolean;
/**
 * Convert {@link PermissionAuthorizer} to {@link PermissionEvaluator}.
 *
 * @public
 */
export declare function toPermissionEvaluator(permissionAuthorizer: PermissionAuthorizer): PermissionEvaluator;
