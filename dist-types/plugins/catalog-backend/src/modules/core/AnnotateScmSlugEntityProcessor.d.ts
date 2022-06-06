import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessor, LocationSpec } from '../../api';
/** @public */
export declare class AnnotateScmSlugEntityProcessor implements CatalogProcessor {
    private readonly opts;
    constructor(opts: {
        scmIntegrationRegistry: ScmIntegrationRegistry;
    });
    getProcessorName(): string;
    static fromConfig(config: Config): AnnotateScmSlugEntityProcessor;
    preProcessEntity(entity: Entity, location: LocationSpec): Promise<Entity>;
}
