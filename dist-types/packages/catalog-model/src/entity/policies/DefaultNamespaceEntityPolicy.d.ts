import { EntityPolicy } from './types';
import { Entity } from '../Entity';
/**
 * Sets a default namespace if none was set.
 *
 * @public
 */
export declare class DefaultNamespaceEntityPolicy implements EntityPolicy {
    private readonly namespace;
    constructor(namespace?: string);
    enforce(entity: Entity): Promise<Entity>;
}
