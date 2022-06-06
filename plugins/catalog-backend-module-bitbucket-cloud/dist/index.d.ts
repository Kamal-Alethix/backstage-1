import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { EntityProvider, EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';

/**
 * Discovers catalog files located in [Bitbucket Cloud](https://bitbucket.org).
 * The provider will search your Bitbucket Cloud account and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
declare class BitbucketCloudEntityProvider implements EntityProvider {
    private readonly client;
    private readonly config;
    private readonly logger;
    private readonly scheduleFn;
    private connection?;
    static fromConfig(config: Config, options: {
        logger: Logger;
        schedule: TaskRunner;
    }): BitbucketCloudEntityProvider[];
    private constructor();
    private createScheduleFn;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
    getProviderName(): string;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getTaskId} */
    getTaskId(): string;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
    connect(connection: EntityProviderConnection): Promise<void>;
    refresh(logger: Logger): Promise<void>;
    private findCatalogFiles;
    private matchesFilters;
    private static toUrl;
    private static toLocationSpec;
}

export { BitbucketCloudEntityProvider };
