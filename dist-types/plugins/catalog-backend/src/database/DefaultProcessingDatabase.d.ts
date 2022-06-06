import { Knex } from 'knex';
import type { Logger } from 'winston';
import { Transaction, GetProcessableEntitiesResult, ProcessingDatabase, RefreshOptions, ReplaceUnprocessedEntitiesOptions, UpdateProcessedEntityOptions, ListAncestorsOptions, ListAncestorsResult, UpdateEntityCacheOptions, ListParentsOptions, ListParentsResult } from './types';
import { ProcessingIntervalFunction } from '../processing/refresh';
import { DbRelationsRow } from './tables';
export declare class DefaultProcessingDatabase implements ProcessingDatabase {
    private readonly options;
    constructor(options: {
        database: Knex;
        logger: Logger;
        refreshInterval: ProcessingIntervalFunction;
    });
    updateProcessedEntity(txOpaque: Transaction, options: UpdateProcessedEntityOptions): Promise<{
        previous: {
            relations: DbRelationsRow[];
        };
    }>;
    updateProcessedEntityErrors(txOpaque: Transaction, options: UpdateProcessedEntityOptions): Promise<void>;
    updateEntityCache(txOpaque: Transaction, options: UpdateEntityCacheOptions): Promise<void>;
    replaceUnprocessedEntities(txOpaque: Transaction, options: ReplaceUnprocessedEntitiesOptions): Promise<void>;
    getProcessableEntities(txOpaque: Transaction, request: {
        processBatchSize: number;
    }): Promise<GetProcessableEntitiesResult>;
    listAncestors(txOpaque: Transaction, options: ListAncestorsOptions): Promise<ListAncestorsResult>;
    listParents(txOpaque: Transaction, options: ListParentsOptions): Promise<ListParentsResult>;
    refresh(txOpaque: Transaction, options: RefreshOptions): Promise<void>;
    transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;
    /**
     * Attempts to update an existing refresh state row, returning true if it was
     * updated and false if there was no entity with a matching ref and location key.
     *
     * Updating the entity will also cause it to be scheduled for immediate processing.
     */
    private updateUnprocessedEntity;
    /**
     * Attempts to insert a new refresh state row for the given entity, returning
     * true if successful and false if there was a conflict.
     */
    private insertUnprocessedEntity;
    /**
     * Checks whether a refresh state exists for the given entity that has a
     * location key that does not match the provided location key.
     *
     * @returns The conflicting key if there is one.
     */
    private checkLocationKeyConflict;
    private deduplicateRelations;
    private createDelta;
    /**
     * Add a set of deferred entities for processing.
     * The entities will be added at the front of the processing queue.
     */
    private addUnprocessedEntities;
}
