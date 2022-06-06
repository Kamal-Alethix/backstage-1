import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { EntityProvider, EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
/**
 * Provider which discovers catalog files (any name) within an S3 bucket.
 *
 * Use `AwsS3EntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
export declare class AwsS3EntityProvider implements EntityProvider {
    private readonly config;
    private readonly logger;
    private readonly s3;
    private readonly scheduleFn;
    private connection?;
    static fromConfig(configRoot: Config, options: {
        logger: Logger;
        schedule: TaskRunner;
    }): AwsS3EntityProvider[];
    private constructor();
    private createScheduleFn;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
    getProviderName(): string;
    /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
    connect(connection: EntityProviderConnection): Promise<void>;
    refresh(logger: Logger): Promise<void>;
    private listAllObjectKeys;
    private createLocationSpec;
    private createObjectUrl;
}
