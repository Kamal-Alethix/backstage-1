import { Entity } from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '../../api';
/** @public */
export declare class AnnotateLocationEntityProcessor implements CatalogProcessor {
    private readonly options;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
    });
    getProcessorName(): string;
    preProcessEntity(entity: Entity, location: LocationSpec, _: CatalogProcessorEmit, originLocation: LocationSpec): Promise<Entity>;
}
