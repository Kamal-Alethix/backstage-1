import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single Azure provider.
 *
 * @public
 */
export declare type AzureIntegrationConfig = {
    /**
     * The host of the target that this matches on, e.g. "dev.azure.com".
     *
     * Currently only "dev.azure.com" is supported.
     */
    host: string;
    /**
     * The authorization token to use for requests.
     *
     * If no token is specified, anonymous access is used.
     */
    token?: string;
};
/**
 * Reads a single Azure integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export declare function readAzureIntegrationConfig(config: Config): AzureIntegrationConfig;
/**
 * Reads a set of Azure integration configs, and inserts some defaults for
 * public Azure if not specified.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export declare function readAzureIntegrationConfigs(configs: Config[]): AzureIntegrationConfig[];
