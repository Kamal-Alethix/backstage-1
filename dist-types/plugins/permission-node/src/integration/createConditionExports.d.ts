import { ConditionalPolicyDecision, PermissionCondition, PermissionCriteria, ResourcePermission } from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
/**
 * A utility type for mapping a single {@link PermissionRule} to its
 * corresponding {@link @backstage/plugin-permission-common#PermissionCondition}.
 *
 * @public
 */
export declare type Condition<TRule> = TRule extends PermissionRule<any, any, infer TResourceType, infer TParams> ? (...params: TParams) => PermissionCondition<TResourceType, TParams> : never;
/**
 * A utility type for mapping {@link PermissionRule}s to their corresponding
 * {@link @backstage/plugin-permission-common#PermissionCondition}s.
 *
 * @public
 */
export declare type Conditions<TRules extends Record<string, PermissionRule<any, any, any>>> = {
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
export declare const createConditionExports: <TResourceType extends string, TResource, TRules extends Record<string, PermissionRule<TResource, any, TResourceType, unknown[]>>>(options: {
    pluginId: string;
    resourceType: TResourceType;
    rules: TRules;
}) => {
    conditions: Conditions<TRules>;
    createConditionalDecision: (permission: ResourcePermission<TResourceType>, conditions: PermissionCriteria<PermissionCondition<TResourceType, unknown[]>>) => ConditionalPolicyDecision;
};
