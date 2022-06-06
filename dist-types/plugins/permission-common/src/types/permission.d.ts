import { EvaluatePermissionRequest, EvaluatePermissionResponse } from './api';
/**
 * The attributes related to a given permission; these should be generic and widely applicable to
 * all permissions in the system.
 * @public
 */
export declare type PermissionAttributes = {
    action?: 'create' | 'read' | 'update' | 'delete';
};
/**
 * Generic type for building {@link Permission} types.
 * @public
 */
export declare type PermissionBase<TType extends string, TFields extends object> = {
    /**
     * The name of the permission.
     */
    name: string;
    /**
     * {@link PermissionAttributes} which describe characteristics of the permission, to help
     * policy authors make consistent decisions for similar permissions without referring to them
     * all by name.
     */
    attributes: PermissionAttributes;
} & {
    /**
     * String value indicating the type of the permission (e.g. 'basic',
     * 'resource'). The allowed authorization flows in the permission system
     * depend on the type. For example, a `resourceRef` should only be provided
     * when authorizing permissions of type 'resource'.
     */
    type: TType;
} & TFields;
/**
 * A permission that can be checked through authorization.
 *
 * @remarks
 *
 * Permissions are the "what" part of authorization, the action to be performed. This may be reading
 * an entity from the catalog, executing a software template, or any other action a plugin author
 * may wish to protect.
 *
 * To evaluate authorization, a permission is paired with a Backstage identity (the "who") and
 * evaluated using an authorization policy.
 * @public
 */
export declare type Permission = BasicPermission | ResourcePermission;
/**
 * A standard {@link Permission} with no additional capabilities or restrictions.
 * @public
 */
export declare type BasicPermission = PermissionBase<'basic', {}>;
/**
 * ResourcePermissions are {@link Permission}s that can be authorized based on
 * characteristics of a resource such a catalog entity.
 * @public
 */
export declare type ResourcePermission<TResourceType extends string = string> = PermissionBase<'resource', {
    /**
     * Denotes the type of the resource whose resourceRef should be passed when
     * authorizing.
     */
    resourceType: TResourceType;
}>;
/**
 * A client interacting with the permission backend can implement this authorizer interface.
 * @public
 * @deprecated Use {@link @backstage/plugin-permission-common#PermissionEvaluator} instead
 */
export interface PermissionAuthorizer {
    authorize(requests: EvaluatePermissionRequest[], options?: AuthorizeRequestOptions): Promise<EvaluatePermissionResponse[]>;
}
/**
 * Options for authorization requests.
 * @public
 */
export declare type AuthorizeRequestOptions = {
    token?: string;
};
