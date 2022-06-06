import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { EntityProvider, EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
/**
 * Provider which discovers catalog files within an Azure DevOps repositories.
 *
 * Use `AzureDevOpsEntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
export declare class AzureDevOpsEntityProvider implements EntityProvider {
    private readonly config;
    private readonly integration;
    private readonly logger;
    private readonly scheduleFn;
    private connection?;
    static fromConfig(configRoot: Config, options: {
        logger: Logger;
        schedule: TaskRunner;
    }): AzureDevOpsEntityProvider[];
    private constructor();
    private createScheduleFn;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
    getProviderName(): string;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
    connect(connection: EntityProviderConnection): Promise<void>;
    refresh(logger: Logger): Promise<void>;
    private createLocationSpec;
    private createObjectUrl;
}
