import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single Bitbucket Cloud API provider.
 *
 * @public
 */
export declare type BitbucketCloudIntegrationConfig = {
    /**
     * Constant. bitbucket.org
     */
    host: string;
    /**
     * Constant. https://api.bitbucket.org/2.0
     */
    apiBaseUrl: string;
    /**
     * The username to use for requests to Bitbucket Cloud (bitbucket.org).
     */
    username?: string;
    /**
     * Authentication with Bitbucket Cloud (bitbucket.org) is done using app passwords.
     *
     * See https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/
     */
    appPassword?: string;
};
/**
 * Reads a single Bitbucket Cloud integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export declare function readBitbucketCloudIntegrationConfig(config: Config): BitbucketCloudIntegrationConfig;
/**
 * Reads a set of Bitbucket Cloud integration configs,
 * and inserts one for public Bitbucket Cloud if none specified.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export declare function readBitbucketCloudIntegrationConfigs(configs: Config[]): BitbucketCloudIntegrationConfig[];
