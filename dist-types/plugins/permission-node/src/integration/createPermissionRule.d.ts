import { PermissionRule } from '../types';
/**
 * Helper function to ensure that {@link PermissionRule} definitions are typed correctly.
 *
 * @public
 */
export declare const createPermissionRule: <TResource, TQuery, TResourceType extends string, TParams extends unknown[]>(rule: PermissionRule<TResource, TQuery, TResourceType, TParams>) => PermissionRule<TResource, TQuery, TResourceType, TParams>;
/**
 * Helper for making plugin-specific createPermissionRule functions, that have
 * the TResource and TQuery type parameters populated but infer the params from
 * the supplied rule. This helps ensure that rules created for this plugin use
 * consistent types for the resource and query.
 *
 * @public
 */
export declare const makeCreatePermissionRule: <TResource, TQuery, TResourceType extends string>() => <TParams extends unknown[]>(rule: PermissionRule<TResource, TQuery, TResourceType, TParams>) => PermissionRule<TResource, TQuery, TResourceType, TParams>;
