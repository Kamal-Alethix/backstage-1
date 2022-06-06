import { Config } from '@backstage/config';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
/**
 * A processor for ingesting AWS Accounts from AWS Organizations.
 *
 * If custom authentication is needed, it can be achieved by configuring the
 * global AWS.credentials object.
 *
 * @public
 */
export declare class AwsOrganizationCloudAccountProcessor implements CatalogProcessor {
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
