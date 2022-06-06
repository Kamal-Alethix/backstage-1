import { Entity } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '../../api';
export declare function toAbsoluteUrl(integrations: ScmIntegrationRegistry, base: LocationSpec, target: string): string;
/** @public */
export declare type LocationEntityProcessorOptions = {
    integrations: ScmIntegrationRegistry;
};
/** @public */
export declare class LocationEntityProcessor implements CatalogProcessor {
    private readonly options;
    constructor(options: LocationEntityProcessorOptions);
    getProcessorName(): string;
    postProcessEntity(entity: Entity, location: LocationSpec, emit: CatalogProcessorEmit): Promise<Entity>;
}
