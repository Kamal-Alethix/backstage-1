import { PermissionCondition, PermissionCriteria } from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
/**
 * A function which accepts {@link @backstage/plugin-permission-common#PermissionCondition}s
 * logically grouped in a {@link @backstage/plugin-permission-common#PermissionCriteria}
 * object, and transforms the {@link @backstage/plugin-permission-common#PermissionCondition}s
 * into plugin specific query fragments while retaining the enclosing criteria shape.
 *
 * @public
 */
export declare type ConditionTransformer<TQuery> = (conditions: PermissionCriteria<PermissionCondition>) => PermissionCriteria<TQuery>;
/**
 * A higher-order helper function which accepts an array of
 * {@link PermissionRule}s, and returns a {@link ConditionTransformer}
 * which transforms input conditions into equivalent plugin-specific
 * query fragments using the supplied rules.
 *
 * @public
 */
export declare const createConditionTransformer: <TQuery, TRules extends PermissionRule<any, TQuery, string, unknown[]>[]>(permissionRules: [...TRules]) => ConditionTransformer<TQuery>;
