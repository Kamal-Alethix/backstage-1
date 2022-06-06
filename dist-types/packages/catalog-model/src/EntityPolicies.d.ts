import { EntityPolicy } from './entity';
/**
 * Provides helpers for enforcing a set of {@link EntityPolicy} in an `and`/`or` expression.
 *
 * @public
 */
export declare const EntityPolicies: {
    allOf(policies: EntityPolicy[]): EntityPolicy;
    oneOf(policies: EntityPolicy[]): EntityPolicy;
};
