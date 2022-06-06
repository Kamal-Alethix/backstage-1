import { Entity } from '@backstage/catalog-model';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '../../api';
/** @public */
export declare class BuiltinKindsEntityProcessor implements CatalogProcessor {
    private readonly validators;
    getProcessorName(): string;
    validateEntityKind(entity: Entity): Promise<boolean>;
    postProcessEntity(entity: Entity, _location: LocationSpec, emit: CatalogProcessorEmit): Promise<Entity>;
}
