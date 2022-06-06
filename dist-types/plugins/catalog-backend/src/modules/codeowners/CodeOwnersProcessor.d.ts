import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Logger } from 'winston';
import { CatalogProcessor, LocationSpec } from '../../api';
/** @public */
export declare class CodeOwnersProcessor implements CatalogProcessor {
    private readonly integrations;
    private readonly logger;
    private readonly reader;
    static fromConfig(config: Config, options: {
        logger: Logger;
        reader: UrlReader;
    }): CodeOwnersProcessor;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
        logger: Logger;
        reader: UrlReader;
    });
    getProcessorName(): string;
    preProcessEntity(entity: Entity, location: LocationSpec): Promise<Entity>;
}
