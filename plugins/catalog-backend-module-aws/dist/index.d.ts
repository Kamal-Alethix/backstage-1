import { Config } from '@backstage/config';
import { CatalogProcessor, LocationSpec, CatalogProcessorEmit, CatalogProcessorParser, EntityProvider, EntityProviderConnection } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { UrlReader } from '@backstage/backend-common';
import { TaskRunner } from '@backstage/backend-tasks';

/**
 * A processor for ingesting AWS Accounts from AWS Organizations.
 *
 * If custom authentication is needed, it can be achieved by configuring the
 * global AWS.credentials object.
 *
 * @public
 */
declare class AwsOrganizationCloudAccountProcessor implements CatalogProcessor {
    private readonly organizations;
    private readonly provider;
    static fromConfig(config: Config, options: {
        logger: Logger;
    }): AwsOrganizationCloudAccountProcessor;
    private static buildCredentials;
    private constructor();
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
    private normalizeName;
    private extractInformationFromArn;
    private getAwsAccounts;
    private mapAccountToComponent;
}

/**
 * A processor for automatic discovery of entities from S3 buckets. Handles the
 * `s3-discovery` location type, and target bucket URLs e.g. on the form
 * `https://testbucket.s3.us-east-2.amazonaws.com`.
 *
 * @public
 */
declare class AwsS3DiscoveryProcessor implements CatalogProcessor {
    private readonly reader;
    constructor(reader: UrlReader);
    getProcessorName(): string;
    readLocation(location: LocationSpec, optional: boolean, emit: CatalogProcessorEmit, parser: CatalogProcessorParser): Promise<boolean>;
    private doRead;
}

/**
 * Provider which discovers catalog files (any name) within an S3 bucket.
 *
 * Use `AwsS3EntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
declare class AwsS3EntityProvider implements EntityProvider {
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

export { AwsOrganizationCloudAccountProcessor, AwsS3DiscoveryProcessor, AwsS3EntityProvider };
