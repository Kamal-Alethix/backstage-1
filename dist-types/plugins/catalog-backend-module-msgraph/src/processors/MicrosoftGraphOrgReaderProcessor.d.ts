import { Config } from '@backstage/config';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { GroupTransformer, MicrosoftGraphProviderConfig, OrganizationTransformer, UserTransformer } from '../microsoftGraph';
/**
 * Extracts teams and users out of a the Microsoft Graph API.
 *
 * @public
 */
export declare class MicrosoftGraphOrgReaderProcessor implements CatalogProcessor {
    private readonly providers;
    private readonly logger;
    private readonly userTransformer?;
    private readonly groupTransformer?;
    private readonly organizationTransformer?;
    static fromConfig(config: Config, options: {
        logger: Logger;
        userTransformer?: UserTransformer;
        groupTransformer?: GroupTransformer;
        organizationTransformer?: OrganizationTransformer;
    }): MicrosoftGraphOrgReaderProcessor;
    constructor(options: {
        providers: MicrosoftGraphProviderConfig[];
        logger: Logger;
        userTransformer?: UserTransformer;
        groupTransformer?: GroupTransformer;
        organizationTransformer?: OrganizationTransformer;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
}
