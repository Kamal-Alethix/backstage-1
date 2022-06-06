import { ResourcePermission } from '.';
import { Permission } from './permission';
/**
 * A request with a UUID identifier, so that batched responses can be matched up with the original
 * requests.
 * @public
 */
export declare type IdentifiedPermissionMessage<T> = T & {
    id: string;
};
/**
 * A batch of request or response items.
 * @public
 */
export declare type PermissionMessageBatch<T> = {
    items: IdentifiedPermissionMessage<T>[];
};
/**
 * The result of an authorization request.
 * @public
 */
export declare enum AuthorizeResult {
    /**
     * The authorization request is denied.
     */
    DENY = "DENY",
    /**
     * The authorization request is allowed.
     */
    ALLOW = "ALLOW",
    /**
     * The authorization request is allowed if the provided conditions are met.
     */
    CONDITIONAL = "CONDITIONAL"
}
/**
 * A definitive decision returned by the {@link @backstage/plugin-permission-node#PermissionPolicy}.
 *
 * @remarks
 *
 * This indicates that the policy unconditionally allows (or denies) the request.
 *
 * @public
 */
export declare type DefinitivePolicyDecision = {
    result: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
};
/**
 * A conditional decision returned by the {@link @backstage/plugin-permission-node#PermissionPolicy}.
 *
 * @remarks
 *
 * This indicates that the policy allows authorization for the request, given that the returned
 * conditions hold when evaluated. The conditions will be evaluated by the corresponding plugin
 * which knows about the referenced permission rules.
 *
 * @public
 */
export declare type ConditionalPolicyDecision = {
    result: AuthorizeResult.CONDITIONAL;
    pluginId: string;
    resourceType: string;
    conditions: PermissionCriteria<PermissionCondition>;
};
/**
 * A decision returned by the {@link @backstage/plugin-permission-node#PermissionPolicy}.
 *
 * @public
 */
export declare type PolicyDecision = DefinitivePolicyDecision | ConditionalPolicyDecision;
/**
 * A condition returned with a CONDITIONAL authorization response.
 *
 * Conditions are a reference to a rule defined by a plugin, and parameters to apply the rule. For
 * example, a rule might be `isOwner` from the catalog-backend, and params may be a list of entity
 * claims from a identity token.
 * @public
 */
export declare type PermissionCondition<TResourceType extends string = string, TParams extends unknown[] = unknown[]> = {
    resourceType: TResourceType;
    rule: string;
    params: TParams;
};
/**
 * Utility type to represent an array with 1 or more elements.
 * @ignore
 */
declare type NonEmptyArray<T> = [T, ...T[]];
/**
 * Represents a logical AND for the provided criteria.
 * @public
 */
export declare type AllOfCriteria<TQuery> = {
    allOf: NonEmptyArray<PermissionCriteria<TQuery>>;
};
/**
 * Represents a logical OR for the provided criteria.
 * @public
 */
export declare type AnyOfCriteria<TQuery> = {
    anyOf: NonEmptyArray<PermissionCriteria<TQuery>>;
};
/**
 * Represents a negation of the provided criteria.
 * @public
 */
export declare type NotCriteria<TQuery> = {
    not: PermissionCriteria<TQuery>;
};
/**
 * Composes several {@link PermissionCondition}s as criteria with a nested AND/OR structure.
 * @public
 */
export declare type PermissionCriteria<TQuery> = AllOfCriteria<TQuery> | AnyOfCriteria<TQuery> | NotCriteria<TQuery> | TQuery;
/**
 * An individual request sent to the permission backend.
 * @public
 */
export declare type EvaluatePermissionRequest = {
    permission: Permission;
    resourceRef?: string;
};
/**
 * A batch of requests sent to the permission backend.
 * @public
 */
export declare type EvaluatePermissionRequestBatch = PermissionMessageBatch<EvaluatePermissionRequest>;
/**
 * An individual response from the permission backend.
 *
 * @remarks
 *
 * This response type is an alias of {@link PolicyDecision} to maintain separation between the
 * {@link @backstage/plugin-permission-node#PermissionPolicy} interface and the permission backend
 * api. They may diverge at some point in the future. The response
 *
 * @public
 */
export declare type EvaluatePermissionResponse = PolicyDecision;
/**
 * A batch of responses from the permission backend.
 * @public
 */
export declare type EvaluatePermissionResponseBatch = PermissionMessageBatch<EvaluatePermissionResponse>;
/**
 * Request object for {@link PermissionEvaluator.authorize}. If a {@link ResourcePermission}
 * is provided, it must include a corresponding `resourceRef`.
 * @public
 */
export declare type AuthorizePermissionRequest = {
    permission: Exclude<Permission, ResourcePermission>;
    resourceRef?: never;
} | {
    permission: ResourcePermission;
    resourceRef: string;
};
/**
 * Response object for {@link PermissionEvaluator.authorize}.
 * @public
 */
export declare type AuthorizePermissionResponse = DefinitivePolicyDecision;
/**
 * Request object for {@link PermissionEvaluator.authorizeConditional}.
 * @public
 */
export declare type QueryPermissionRequest = {
    permission: ResourcePermission;
    resourceRef?: never;
};
/**
 * Response object for {@link PermissionEvaluator.authorizeConditional}.
 * @public
 */
export declare type QueryPermissionResponse = PolicyDecision;
/**
 * A client interacting with the permission backend can implement this evaluator interface.
 *
 * @public
 */
export interface PermissionEvaluator {
    /**
     * Evaluates {@link Permission | Permissions} and returns a definitive decision.
     */
    authorize(requests: AuthorizePermissionRequest[], options?: EvaluatorRequestOptions): Promise<AuthorizePermissionResponse[]>;
    /**
     * Evaluates {@link ResourcePermission | ResourcePermissions} and returns both definitive and
     * conditional decisions, depending on the configured
     * {@link @backstage/plugin-permission-node#PermissionPolicy}. This method is useful when the
     * caller needs more control over the processing of conditional decisions. For example, a plugin
     * backend may want to use {@link PermissionCriteria | conditions} in a database query instead of
     * evaluating each resource in memory.
     */
    authorizeConditional(requests: QueryPermissionRequest[], options?: EvaluatorRequestOptions): Promise<QueryPermissionResponse[]>;
}
/**
 * Options for {@link PermissionEvaluator} requests.
 * The Backstage identity token should be defined if available.
 * @public
 */
export declare type EvaluatorRequestOptions = {
    token?: string;
};
export {};
