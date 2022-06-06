import { Entity } from '@backstage/catalog-model';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
/** @public */
export declare class ScaffolderEntitiesProcessor implements CatalogProcessor {
    getProcessorName(): string;
    private readonly validators;
    validateEntityKind(entity: Entity): Promise<boolean>;
    postProcessEntity(entity: Entity, _location: LocationSpec, emit: CatalogProcessorEmit): Promise<Entity>;
}
