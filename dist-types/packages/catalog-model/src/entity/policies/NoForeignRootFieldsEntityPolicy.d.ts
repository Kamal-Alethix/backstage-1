import { EntityPolicy } from './types';
import { Entity } from '../Entity';
/**
 * Ensures that there are no foreign root fields in the entity.
 *
 * @public
 */
export declare class NoForeignRootFieldsEntityPolicy implements EntityPolicy {
    private readonly knownFields;
    constructor(knownFields?: string[]);
    enforce(entity: Entity): Promise<Entity>;
}
