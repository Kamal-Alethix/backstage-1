import { Entity } from '@backstage/catalog-model';
import { DbSearchRow } from '../database/tables';
declare type Kv = {
    key: string;
    value: unknown;
};
export declare function traverse(root: unknown): Kv[];
export declare function mapToRows(input: Kv[], entityId: string): DbSearchRow[];
/**
 * Generates all of the search rows that are relevant for this entity.
 *
 * @param entityId - The uid of the entity
 * @param entity - The entity
 * @returns A list of entity search rows
 */
export declare function buildEntitySearch(entityId: string, entity: Entity): DbSearchRow[];
export {};
