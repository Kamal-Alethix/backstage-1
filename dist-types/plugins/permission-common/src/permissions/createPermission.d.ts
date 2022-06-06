import { BasicPermission, PermissionAttributes, ResourcePermission } from '../types';
/**
 * Utility function for creating a valid {@link ResourcePermission}, inferring
 * the appropriate type and resource type parameter.
 *
 * @public
 */
export declare function createPermission<TResourceType extends string>(input: {
    name: string;
    attributes: PermissionAttributes;
    resourceType: TResourceType;
}): ResourcePermission<TResourceType>;
/**
 * Utility function for creating a valid {@link BasicPermission}.
 *
 * @public
 */
export declare function createPermission(input: {
    name: string;
    attributes: PermissionAttributes;
}): BasicPermission;
