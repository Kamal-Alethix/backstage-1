import { AllOfCriteria, AnyOfCriteria, NotCriteria, PermissionCriteria } from '@backstage/plugin-permission-common';
import { PermissionRule } from '../types';
/**
 * Utility function used to parse a PermissionCriteria
 * @param criteria - a PermissionCriteria
 * @alpha
 *
 * @returns `true` if the permission criteria is of type allOf,
 * narrowing down `criteria` to the specific type.
 */
export declare const isAndCriteria: <T>(criteria: PermissionCriteria<T>) => criteria is AllOfCriteria<T>;
/**
 * Utility function used to parse a PermissionCriteria of type
 * @param criteria - a PermissionCriteria
 * @alpha
 *
 * @returns `true` if the permission criteria is of type anyOf,
 * narrowing down `criteria` to the specific type.
 */
export declare const isOrCriteria: <T>(criteria: PermissionCriteria<T>) => criteria is AnyOfCriteria<T>;
/**
 * Utility function used to parse a PermissionCriteria
 * @param criteria - a PermissionCriteria
 * @alpha
 *
 * @returns `true` if the permission criteria is of type not,
 * narrowing down `criteria` to the specific type.
 */
export declare const isNotCriteria: <T>(criteria: PermissionCriteria<T>) => criteria is NotCriteria<T>;
export declare const createGetRule: <TResource, TQuery>(rules: PermissionRule<TResource, TQuery, string, unknown[]>[]) => (name: string) => PermissionRule<TResource, TQuery, string, unknown[]>;
