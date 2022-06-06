import { Config } from '@backstage/config';
import { CatalogProcessor, LocationSpec, CatalogProcessorEmit } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';

/**
 * Extracts repositories out of an GitLab instance.
 * @public
 */
declare class GitLabDiscoveryProcessor implements CatalogProcessor {
    private readonly integrations;
    private readonly logger;
    private readonly cache;
    private readonly skipReposWithoutExactFileMatch;
    static fromConfig(config: Config, options: {
        logger: Logger;
        skipReposWithoutExactFileMatch?: boolean;
    }): GitLabDiscoveryProcessor;
    private constructor();
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
    private updateLastActivity;
}

export { GitLabDiscoveryProcessor };
