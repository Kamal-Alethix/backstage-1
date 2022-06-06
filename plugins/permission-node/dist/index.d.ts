import { PermissionCriteria, PermissionCondition, ResourcePermission, ConditionalPolicyDecision, IdentifiedPermissionMessage, DefinitivePolicyDecision, AllOfCriteria, AnyOfCriteria, NotCriteria, Permission, PolicyDecision, PermissionEvaluator, QueryPermissionRequest, EvaluatorRequestOptions, AuthorizePermissionRequest, AuthorizePermissionResponse } from '@backstage/plugin-permission-common';
import express from 'express';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { PluginEndpointDiscovery, TokenManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';

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
declare type PermissionRule<TResource, TQuery, TResourceType extends string, TParams extends unknown[] = unknown[]> = {
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

/**
 * Creates a condition factory function for a given authorization rule and parameter types.
 *
 * @remarks
 *
 * For example, an isEntityOwner rule for catalog entities might take an array of entityRef strings.
 * The rule itself defines _how_ to check a given resource, whereas a condition also includes _what_
 * to verify.
 *
 * Plugin authors should generally use the {@link createConditionExports} in order to efficiently
 * create multiple condition factories. This helper should generally only be used to construct
 * condition factories for third-party rules that aren't part of the backend plugin with which
 * they're intended to integrate.
 *
 * @public
 */
declare const createConditionFactory: <TResourceType extends string, TParams extends any[]>(rule: PermissionRule<unknown, unknown, TResourceType, TParams>) => (...params: TParams) => PermissionCondition<TResourceType, TParams>;

/**
 * A utility type for mapping a single {@link PermissionRule} to its
 * corresponding {@link @backstage/plugin-permission-common#PermissionCondition}.
 *
 * @public
 */
declare type Condition<TRule> = TRule extends PermissionRule<any, any, infer TResourceType, infer TParams> ? (...params: TParams) => PermissionCondition<TResourceType, TParams> : never;
/**
 * A utility type for mapping {@link PermissionRule}s to their corresponding
 * {@link @backstage/plugin-permission-common#PermissionCondition}s.
 *
 * @public
 */
declare type Conditions<TRules extends Record<string, PermissionRule<any, any, any>>> = {
    [Name in keyof TRules]: Condition<TRules[Name]>;
};
/**
 * Creates the recommended condition-related exports for a given plugin based on
 * the built-in {@link PermissionRule}s it supports.
 *
 * @remarks
 *
 * The function returns a `conditions` object containing a
 * {@link @backstage/plugin-permission-common#PermissionCondition} factory for
 * each of the supplied {@link PermissionRule}s, along with a
 * `createConditionalDecision` function which builds the wrapper object needed
 * to enclose conditions when authoring {@link PermissionPolicy}
 * implementations.
 *
 * Plugin authors should generally call this method with all the built-in
 * {@link PermissionRule}s the plugin supports, and export the resulting
 * `conditions` object and `createConditionalDecision` function so that they can
 * be used by {@link PermissionPolicy} authors.
 *
 * @public
 */
declare const createConditionExports: <TResourceType extends string, TResource, TRules extends Record<string, PermissionRule<TResource, any, TResourceType, unknown[]>>>(options: {
    pluginId: string;
    resourceType: TResourceType;
    rules: TRules;
}) => {
    conditions: Conditions<TRules>;
    createConditionalDecision: (permission: ResourcePermission<TResourceType>, conditions: PermissionCriteria<PermissionCondition<TResourceType, unknown[]>>) => ConditionalPolicyDecision;
};

/**
 * A function which accepts {@link @backstage/plugin-permission-common#PermissionCondition}s
 * logically grouped in a {@link @backstage/plugin-permission-common#PermissionCriteria}
 * object, and transforms the {@link @backstage/plugin-permission-common#PermissionCondition}s
 * into plugin specific query fragments while retaining the enclosing criteria shape.
 *
 * @public
 */
declare type ConditionTransformer<TQuery> = (conditions: PermissionCriteria<PermissionCondition>) => PermissionCriteria<TQuery>;
/**
 * A higher-order helper function which accepts an array of
 * {@link PermissionRule}s, and returns a {@link ConditionTransformer}
 * which transforms input conditions into equivalent plugin-specific
 * query fragments using the supplied rules.
 *
 * @public
 */
declare const createConditionTransformer: <TQuery, TRules extends PermissionRule<any, TQuery, string, unknown[]>[]>(permissionRules: [...TRules]) => ConditionTransformer<TQuery>;

/**
 * A request to load the referenced resource and apply conditions in order to
 * finalize a conditional authorization response.
 *
 * @public
 */
declare type ApplyConditionsRequestEntry = IdentifiedPermissionMessage<{
    resourceRef: string;
    resourceType: string;
    conditions: PermissionCriteria<PermissionCondition>;
}>;
/**
 * A batch of {@link ApplyConditionsRequestEntry} objects.
 *
 * @public
 */
declare type ApplyConditionsRequest = {
    items: ApplyConditionsRequestEntry[];
};
/**
 * The result of applying the conditions, expressed as a definitive authorize
 * result of ALLOW or DENY.
 *
 * @public
 */
declare type ApplyConditionsResponseEntry = IdentifiedPermissionMessage<DefinitivePolicyDecision>;
/**
 * A batch of {@link ApplyConditionsResponseEntry} objects.
 *
 * @public
 */
declare type ApplyConditionsResponse = {
    items: ApplyConditionsResponseEntry[];
};
/**
 * Prevent use of type parameter from contributing to type inference.
 *
 * https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-980401795
 * @ignore
 */
declare type NoInfer<T> = T extends infer S ? S : never;
/**
 * Create an express Router which provides an authorization route to allow
 * integration between the permission backend and other Backstage backend
 * plugins. Plugin owners that wish to support conditional authorization for
 * their resources should add the router created by this function to their
 * express app inside their `createRouter` implementation.
 *
 * @remarks
 *
 * To make this concrete, we can use the Backstage software catalog as an
 * example. The catalog has conditional rules around access to specific
 * _entities_ in the catalog. The _type_ of resource is captured here as
 * `resourceType`, a string identifier (`catalog-entity` in this example) that
 * can be provided with permission definitions. This is merely a _type_ to
 * verify that conditions in an authorization policy are constructed correctly,
 * not a reference to a specific resource.
 *
 * The `rules` parameter is an array of {@link PermissionRule}s that introduce
 * conditional filtering logic for resources; for the catalog, these are things
 * like `isEntityOwner` or `hasAnnotation`. Rules describe how to filter a list
 * of resources, and the `conditions` returned allow these rules to be applied
 * with specific parameters (such as 'group:default/team-a', or
 * 'backstage.io/edit-url').
 *
 * The `getResources` argument should load resources based on a reference
 * identifier. For the catalog, this is an
 * {@link @backstage/catalog-model#EntityRef}. For other plugins, this can be
 * any serialized format. This is used to construct the
 * `createPermissionIntegrationRouter`, a function to add an authorization route
 * to your backend plugin. This function will be called by the
 * `permission-backend` when authorization conditions relating to this plugin
 * need to be evaluated.
 *
 * @public
 */
declare const createPermissionIntegrationRouter: <TResourceType extends string, TResource>(options: {
    resourceType: TResourceType;
    rules: PermissionRule<TResource, any, NoInfer<TResourceType>, unknown[]>[];
    getResources: (resourceRefs: string[]) => Promise<(TResource | undefined)[]>;
}) => express.Router;

/**
 * Helper function to ensure that {@link PermissionRule} definitions are typed correctly.
 *
 * @public
 */
declare const createPermissionRule: <TResource, TQuery, TResourceType extends string, TParams extends unknown[]>(rule: PermissionRule<TResource, TQuery, TResourceType, TParams>) => PermissionRule<TResource, TQuery, TResourceType, TParams>;
/**
 * Helper for making plugin-specific createPermissionRule functions, that have
 * the TResource and TQuery type parameters populated but infer the params from
 * the supplied rule. This helps ensure that rules created for this plugin use
 * consistent types for the resource and query.
 *
 * @public
 */
declare const makeCreatePermissionRule: <TResource, TQuery, TResourceType extends string>() => <TParams extends unknown[]>(rule: PermissionRule<TResource, TQuery, TResourceType, TParams>) => PermissionRule<TResource, TQuery, TResourceType, TParams>;

/**
 * Utility function used to parse a PermissionCriteria
 * @param criteria - a PermissionCriteria
 * @alpha
 *
 * @returns `true` if the permission criteria is of type allOf,
 * narrowing down `criteria` to the specific type.
 */
declare const isAndCriteria: <T>(criteria: PermissionCriteria<T>) => criteria is AllOfCriteria<T>;
/**
 * Utility function used to parse a PermissionCriteria of type
 * @param criteria - a PermissionCriteria
 * @alpha
 *
 * @returns `true` if the permission criteria is of type anyOf,
 * narrowing down `criteria` to the specific type.
 */
declare const isOrCriteria: <T>(criteria: PermissionCriteria<T>) => criteria is AnyOfCriteria<T>;
/**
 * Utility function used to parse a PermissionCriteria
 * @param criteria - a PermissionCriteria
 * @alpha
 *
 * @returns `true` if the permission criteria is of type not,
 * narrowing down `criteria` to the specific type.
 */
declare const isNotCriteria: <T>(criteria: PermissionCriteria<T>) => criteria is NotCriteria<T>;

/**
 * A query to be evaluated by the {@link PermissionPolicy}.
 *
 * @remarks
 *
 * Unlike other parts of the permission API, the policy does not accept a resource ref. This keeps
 * the policy decoupled from the resource loading and condition applying logic.
 *
 * @public
 */
declare type PolicyQuery = {
    permission: Permission;
};
/**
 * A policy to evaluate authorization requests for any permissioned action performed in Backstage.
 *
 * @remarks
 *
 * This takes as input a permission and an optional Backstage identity, and should return ALLOW if
 * the user is permitted to execute that action; otherwise DENY. For permissions relating to
 * resources, such a catalog entities, a conditional response can also be returned. This states
 * that the action is allowed if the conditions provided hold true.
 *
 * Conditions are a rule, and parameters to evaluate against that rule. For example, the rule might
 * be `isOwner` and the parameters a collection of entityRefs; if one of the entityRefs matches
 * the `owner` field on a catalog entity, this would resolve to ALLOW.
 *
 * @public
 */
interface PermissionPolicy {
    handle(request: PolicyQuery, user?: BackstageIdentityResponse): Promise<PolicyDecision>;
}

/**
 * A thin wrapper around
 * {@link @backstage/plugin-permission-common#PermissionClient} that allows all
 * backend-to-backend requests.
 * @public
 */
declare class ServerPermissionClient implements PermissionEvaluator {
    private readonly permissionClient;
    private readonly tokenManager;
    private readonly permissionEnabled;
    static fromConfig(config: Config, options: {
        discovery: PluginEndpointDiscovery;
        tokenManager: TokenManager;
    }): ServerPermissionClient;
    private constructor();
    authorizeConditional(queries: QueryPermissionRequest[], options?: EvaluatorRequestOptions): Promise<PolicyDecision[]>;
    authorize(requests: AuthorizePermissionRequest[], options?: EvaluatorRequestOptions): Promise<AuthorizePermissionResponse[]>;
    private isValidServerToken;
    private isEnabled;
}

export { ApplyConditionsRequest, ApplyConditionsRequestEntry, ApplyConditionsResponse, ApplyConditionsResponseEntry, Condition, ConditionTransformer, Conditions, PermissionPolicy, PermissionRule, PolicyQuery, ServerPermissionClient, createConditionExports, createConditionFactory, createConditionTransformer, createPermissionIntegrationRouter, createPermissionRule, isAndCriteria, isNotCriteria, isOrCriteria, makeCreatePermissionRule };
