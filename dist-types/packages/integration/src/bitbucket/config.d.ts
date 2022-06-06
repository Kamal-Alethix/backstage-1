import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single Bitbucket API provider.
 *
 * @public
 * @deprecated bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export declare type BitbucketIntegrationConfig = {
    /**
     * The host of the target that this matches on, e.g. "bitbucket.org"
     */
    host: string;
    /**
     * The base URL of the API of this provider, e.g. "https://api.bitbucket.org/2.0",
     * with no trailing slash.
     *
     * Values omitted at the optional property at the app-config will be deduced
     * from the "host" value.
     */
    apiBaseUrl: string;
    /**
     * The authorization token to use for requests to a Bitbucket Server provider.
     *
     * See https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html
     *
     * If no token is specified, anonymous access is used.
     */
    token?: string;
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
 * Reads a single Bitbucket integration config.
 *
 * @param config - The config object of a single integration
 * @public
 * @deprecated bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export declare function readBitbucketIntegrationConfig(config: Config): BitbucketIntegrationConfig;
/**
 * Reads a set of Bitbucket integration configs, and inserts some defaults for
 * public Bitbucket if not specified.
 *
 * @param configs - All of the integration config objects
 * @public
 * @deprecated bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export declare function readBitbucketIntegrationConfigs(configs: Config[]): BitbucketIntegrationConfig[];
