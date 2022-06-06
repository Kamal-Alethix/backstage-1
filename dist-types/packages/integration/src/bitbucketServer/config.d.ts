import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single Bitbucket Server API provider.
 *
 * @public
 */
export declare type BitbucketServerIntegrationConfig = {
    /**
     * The host of the target that this matches on, e.g. "bitbucket.company.com"
     */
    host: string;
    /**
     * The base URL of the API of this provider, e.g. "https://<host>/rest/api/1.0",
     * with no trailing slash.
     *
     * The API will always be preferred if both its base URL and a token are
     * present.
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
};
/**
 * Reads a single Bitbucket Server integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export declare function readBitbucketServerIntegrationConfig(config: Config): BitbucketServerIntegrationConfig;
/**
 * Reads a set of Bitbucket Server integration configs.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export declare function readBitbucketServerIntegrationConfigs(configs: Config[]): BitbucketServerIntegrationConfig[];
