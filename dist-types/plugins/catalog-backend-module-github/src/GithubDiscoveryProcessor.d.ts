import { Config } from '@backstage/config';
import { GithubCredentialsProvider, ScmIntegrationRegistry } from '@backstage/integration';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
/**
 * Extracts repositories out of a GitHub org.
 *
 * The following will create locations for all projects which have a catalog-info.yaml
 * on the default branch. The first is shorthand for the second.
 *
 *    target: "https://github.com/backstage"
 *    or
 *    target: https://github.com/backstage/*\/blob/-/catalog-info.yaml
 *
 * You may also explicitly specify the source branch:
 *
 *    target: https://github.com/backstage/*\/blob/main/catalog-info.yaml
 *
 * @public
 **/
export declare class GithubDiscoveryProcessor implements CatalogProcessor {
    private readonly integrations;
    private readonly logger;
    private readonly githubCredentialsProvider;
    static fromConfig(config: Config, options: {
        logger: Logger;
        githubCredentialsProvider?: GithubCredentialsProvider;
    }): GithubDiscoveryProcessor;
    constructor(options: {
        integrations: ScmIntegrationRegistry;
        logger: Logger;
        githubCredentialsProvider?: GithubCredentialsProvider;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
}
export declare function parseUrl(urlString: string): {
    org: string;
    repoSearchPath: RegExp;
    catalogPath: string;
    branch: string;
    host: string;
};
export declare function escapeRegExp(str: string): RegExp;
