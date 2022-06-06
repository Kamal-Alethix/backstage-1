import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { GroupTransformer, LdapProviderConfig, UserTransformer } from '../ldap';
import { CatalogProcessor, CatalogProcessorEmit, LocationSpec } from '@backstage/plugin-catalog-backend';
/**
 * Extracts teams and users out of an LDAP server.
 *
 * @public
 */
export declare class LdapOrgReaderProcessor implements CatalogProcessor {
    private readonly providers;
    private readonly logger;
    private readonly groupTransformer?;
    private readonly userTransformer?;
    static fromConfig(configRoot: Config, options: {
        logger: Logger;
        groupTransformer?: GroupTransformer;
        userTransformer?: UserTransformer;
    }): LdapOrgReaderProcessor;
    constructor(options: {
        providers: LdapProviderConfig[];
        logger: Logger;
        groupTransformer?: GroupTransformer;
        userTransformer?: UserTransformer;
    });
    getProcessorName(): string;
    readLocation(location: LocationSpec, _optional: boolean, emit: CatalogProcessorEmit): Promise<boolean>;
}
