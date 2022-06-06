import { Entity } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/types';
import { EntityRelationSpec } from '../api';
/**
 * The request to process an entity.
 * @public
 */
export declare type EntityProcessingRequest = {
    entity: Entity;
    state?: JsonObject;
};
/**
 * The result of processing an entity.
 * @public
 */
export declare type EntityProcessingResult = {
    ok: true;
    state: JsonObject;
    completedEntity: Entity;
    deferredEntities: DeferredEntity[];
    relations: EntityRelationSpec[];
    errors: Error[];
} | {
    ok: false;
    errors: Error[];
};
/**
 * Responsible for executing the individual processing steps in order to fully process an entity.
 * @public
 */
export interface CatalogProcessingOrchestrator {
    process(request: EntityProcessingRequest): Promise<EntityProcessingResult>;
}
/**
 * Entities that are not yet processed.
 * @public
 */
export declare type DeferredEntity = {
    entity: Entity;
    locationKey?: string;
};
/** @public */
export interface CatalogProcessingEngine {
    start(): Promise<void>;
    stop(): Promise<void>;
}
