import { ScmIntegrations } from '@backstage/integration';
import { CatalogApi } from '@backstage/catalog-client';
/**
 * Registers entities from a catalog descriptor file in the workspace into the software catalog.
 * @public
 */
export declare function createCatalogRegisterAction(options: {
    catalogClient: CatalogApi;
    integrations: ScmIntegrations;
}): import("../..").TemplateAction<{
    catalogInfoUrl: string;
    optional?: boolean | undefined;
} | {
    repoContentsUrl: string;
    catalogInfoPath?: string | undefined;
    optional?: boolean | undefined;
}>;
