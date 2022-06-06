import { Entity } from '@backstage/catalog-model';
/**
 * Writes a catalog descriptor file containing the provided entity to a path in the workspace.
 * @public
 */
export declare function createCatalogWriteAction(): import("../..").TemplateAction<{
    filePath?: string | undefined;
    entity: Entity;
}>;
