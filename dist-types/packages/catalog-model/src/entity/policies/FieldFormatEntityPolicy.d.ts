import { EntityPolicy } from './types';
import { Validators } from '../../validation';
import { Entity } from '../Entity';
/**
 * Ensures that the format of individual fields of the entity envelope
 * is valid.
 *
 * @remarks
 *
 * This does not take into account machine generated fields such as uid and etag.
 *
 * @public
 */
export declare class FieldFormatEntityPolicy implements EntityPolicy {
    private readonly validators;
    constructor(validators?: Validators);
    enforce(entity: Entity): Promise<Entity>;
}
