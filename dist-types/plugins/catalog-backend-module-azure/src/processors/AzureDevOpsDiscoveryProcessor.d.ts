import { Config } from '@backstage/config';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
/**
 * Extracts repositories out of an Azure DevOps org.
 *
 * The following will create locations for all projects which have a catalog-info.yaml
 * on the default branch. The first is shorthand for the second.
 *
 *    target: "https://dev.azure.com/org/project"
 *    or
 *    target: https://dev.azure.com/org/project?path=/catalog-info.yaml
 *
 * You may also explicitly specify a single repo:
 *
 *    target: https://dev.azure.com/org/project/_git/repo
 *
 * @public
 **/
export declare class AzureDevOpsDiscoveryProcessor implements CatalogProcessor {
    private readonly integrations;
    private readonly logger;
    static fromConfig(config: Config, options: {
        logger: Logger;
    }): AzureDevOpsDiscoveryProcessor;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
        logger: Logger;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
}
/**
 * parseUrl extracts segments from the Azure DevOps URL.
 **/
export declare function parseUrl(urlString: string): {
    baseUrl: string;
    org: string;
    project: string;
    repo: string;
    catalogPath: string;
};
