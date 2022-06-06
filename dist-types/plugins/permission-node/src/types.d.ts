import type { PermissionCriteria } from '@backstage/plugin-permission-common';
/**
 * A conditional rule that can be provided in an
 * {@link @backstage/permission-common#AuthorizeDecision} response to an authorization request.
 *
 * @remarks
 *
 * Rules can either be evaluated against a resource loaded in memory, or used as filters when
 * loading a collection of resources from a data source. The `apply` and `toQuery` methods implement
 * these two concepts.
 *
 * The two operations should always have the same logical result. If they don’t, the effective
 * outcome of an authorization operation will sometimes differ depending on how the authorization
 * check was performed.
 *
 * @public
 */
export declare type PermissionRule<TResource, TQuery, TResourceType extends string, TParams extends unknown[] = unknown[]> = {
    name: string;
    description: string;
    resourceType: TResourceType;
    /**
     * Apply this rule to a resource already loaded from a backing data source. The params are
     * arguments supplied for the rule; for example, a rule could be `isOwner` with entityRefs as the
     * params.
     */
    apply(resource: TResource, ...params: TParams): boolean;
    /**
     * Translate this rule to criteria suitable for use in querying a backing data store. The criteria
     * can be used for loading a collection of resources efficiently with conditional criteria already
     * applied.
     */
    toQuery(...params: TParams): PermissionCriteria<TQuery>;
};
