import { Entity } from '../Entity';
import { EntityPolicy } from './types';
/**
 * Ensures that the entity spec is valid according to a schema.
 *
 * @remarks
 *
 * This should be the first policy in the list, to ensure that other downstream
 * policies can work with a structure that is at least valid in therms of the
 * typescript type.
 *
 * @public
 */
export declare class SchemaValidEntityPolicy implements EntityPolicy {
    private validate;
    enforce(entity: Entity): Promise<Entity>;
}
