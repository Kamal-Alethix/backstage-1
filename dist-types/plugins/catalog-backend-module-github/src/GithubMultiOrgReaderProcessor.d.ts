import { Config } from '@backstage/config';
import { GithubCredentialsProvider, ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { GithubMultiOrgConfig } from './lib';
/**
 * Extracts teams and users out of a multiple GitHub orgs namespaced per org.
 *
 * Be aware that this processor may not be compatible with future org structures in the catalog.
 *
 * @public
 */
export declare class GithubMultiOrgReaderProcessor implements CatalogProcessor {
    private readonly integrations;
    private readonly orgs;
    private readonly logger;
    private readonly githubCredentialsProvider;
    static fromConfig(config: Config, options: {
        logger: Logger;
        githubCredentialsProvider?: GithubCredentialsProvider;
    }): GithubMultiOrgReaderProcessor;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
        logger: Logger;
        orgs: GithubMultiOrgConfig;
        githubCredentialsProvider?: GithubCredentialsProvider;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
    private getAllOrgs;
}
