import { Config } from '@backstage/config';
import { GithubCredentialsProvider, ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
/**
 * Extracts teams and users out of a GitHub org.
 *
 * @remarks
 *
 * Consider using {@link GitHubOrgEntityProvider} instead.
 *
 * @public
 */
export declare class GithubOrgReaderProcessor implements CatalogProcessor {
    private readonly integrations;
    private readonly logger;
    private readonly githubCredentialsProvider;
    static fromConfig(config: Config, options: {
        logger: Logger;
        githubCredentialsProvider?: GithubCredentialsProvider;
    }): GithubOrgReaderProcessor;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
        logger: Logger;
        githubCredentialsProvider?: GithubCredentialsProvider;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
    private createClient;
}
