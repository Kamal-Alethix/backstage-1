import { CatalogApi } from '@backstage/catalog-client';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { Logger } from 'winston';
export declare function getWorkingDirectory(config: Config, logger: Logger): Promise<string>;
/**
 * Gets the base URL of the entity location that points to the source location
 * of the entity description within a repo. If there is not source location
 * or if it has an invalid type, undefined will be returned instead.
 *
 * For file locations this will return a `file://` URL.
 */
export declare function getEntityBaseUrl(entity: Entity): string | undefined;
/**
 * Will use the provided CatalogApi to go find the given template entity with an additional token.
 * Returns the matching template, or throws a NotFoundError if no such template existed.
 */
export declare function findTemplate(options: {
    entityRef: CompoundEntityRef;
    token?: string;
    catalogApi: CatalogApi;
}): Promise<TemplateEntityV1beta3>;
