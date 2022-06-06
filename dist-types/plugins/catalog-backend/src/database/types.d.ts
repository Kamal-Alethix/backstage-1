import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';
import { DateTime } from 'luxon';
import { EntityRelationSpec } from '../api';
import { DeferredEntity } from '../processing/types';
import { DbRelationsRow } from './tables';
/**
 * An abstraction for transactions of the underlying database technology.
 */
export declare type Transaction = {
    rollback(): Promise<unknown>;
};
export declare type AddUnprocessedEntitiesResult = {};
export declare type UpdateProcessedEntityOptions = {
    id: string;
    processedEntity: Entity;
    resultHash: string;
    errors?: string;
    relations: EntityRelationSpec[];
    deferredEntities: DeferredEntity[];
    locationKey?: string;
};
export declare type UpdateEntityCacheOptions = {
    id: string;
    state?: JsonObject;
};
export declare type UpdateProcessedEntityErrorsOptions = {
    id: string;
    errors?: string;
    resultHash: string;
};
export declare type RefreshStateItem = {
    id: string;
    entityRef: string;
    unprocessedEntity: Entity;
    processedEntity?: Entity;
    resultHash: string;
    nextUpdateAt: DateTime;
    lastDiscoveryAt: DateTime;
    state?: JsonObject;
    errors?: string;
    locationKey?: string;
};
export declare type GetProcessableEntitiesResult = {
    items: RefreshStateItem[];
};
export declare type ReplaceUnprocessedEntitiesOptions = {
    sourceKey: string;
    items: DeferredEntity[];
    type: 'full';
} | {
    sourceKey: string;
    added: DeferredEntity[];
    removed: DeferredEntity[];
    type: 'delta';
};
export declare type RefreshOptions = {
    entityRef: string;
};
export declare type ListAncestorsOptions = {
    entityRef: string;
};
export declare type ListAncestorsResult = {
    entityRefs: string[];
};
export declare type ListParentsOptions = {
    entityRef: string;
};
export declare type ListParentsResult = {
    entityRefs: string[];
};
export interface ProcessingDatabase {
    transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;
    /**
     * Add unprocessed entities to the front of the processing queue using a mutation.
     */
    replaceUnprocessedEntities(txOpaque: Transaction, options: ReplaceUnprocessedEntitiesOptions): Promise<void>;
    getProcessableEntities(txOpaque: Transaction, request: {
        processBatchSize: number;
    }): Promise<GetProcessableEntitiesResult>;
    /**
     * Updates a processed entity.
     *
     * Any deferred entities are added at the front of the processing queue for
     * immediate processing, meaning this should only be called when the entity has changes.
     */
    updateProcessedEntity(txOpaque: Transaction, options: UpdateProcessedEntityOptions): Promise<{
        previous: {
            relations: DbRelationsRow[];
        };
    }>;
    /**
     * Updates the cache associated with an entity.
     */
    updateEntityCache(txOpaque: Transaction, options: UpdateEntityCacheOptions): Promise<void>;
    /**
     * Updates only the errors of a processed entity
     */
    updateProcessedEntityErrors(txOpaque: Transaction, options: UpdateProcessedEntityErrorsOptions): Promise<void>;
    /**
     * Schedules a refresh of a given entityRef.
     */
    refresh(txOpaque: Transaction, options: RefreshOptions): Promise<void>;
    /**
     * Lists all ancestors of a given entityRef.
     *
     * The returned list is ordered from the most immediate ancestor to the most distant one.
     */
    listAncestors(txOpaque: Transaction, options: ListAncestorsOptions): Promise<ListAncestorsResult>;
    listParents(txOpaque: Transaction, options: ListParentsOptions): Promise<ListParentsResult>;
}
