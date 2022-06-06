import { PermissionCondition } from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
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
export declare const createConditionFactory: <TResourceType extends string, TParams extends any[]>(rule: PermissionRule<unknown, unknown, TResourceType, TParams>) => (...params: TParams) => PermissionCondition<TResourceType, TParams>;
