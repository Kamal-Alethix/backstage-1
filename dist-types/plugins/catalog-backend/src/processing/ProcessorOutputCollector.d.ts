import { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';
import { CatalogProcessorResult, EntityRelationSpec } from '../api';
import { DeferredEntity } from './types';
/**
 * Helper class for aggregating all of the emitted data from processors.
 */
export declare class ProcessorOutputCollector {
    private readonly logger;
    private readonly parentEntity;
    private readonly errors;
    private readonly relations;
    private readonly deferredEntities;
    private done;
    constructor(logger: Logger, parentEntity: Entity);
    get onEmit(): (i: CatalogProcessorResult) => void;
    results(): {
        errors: Error[];
        relations: EntityRelationSpec[];
        deferredEntities: DeferredEntity[];
    };
    private receive;
}
