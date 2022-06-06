import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single Gerrit API provider.
 *
 * @public
 */
export declare type GerritIntegrationConfig = {
    /**
     * The host of the target that this matches on, e.g. "gerrit-review.com"
     */
    host: string;
    /**
     * The optional base URL of the Gerrit instance. It is assumed that https
     * is used and that the base path is "/" on the host. If that is not the
     * case set the complete base url to the gerrit instance, e.g.
     * "https://gerrit-review.com/gerrit". This is the url that you would open
     * in a browser.
     */
    baseUrl?: string;
    /**
     * The optional base url to use for cloning a repository. If not set the
     * baseUrl will be used.
     */
    cloneUrl?: string;
    /**
     * Optional base url for Gitiles. This is needed for creating a valid
     * user-friendly url that can be used for browsing the content of the
     * provider. If not set a default value will be created in the same way
     * as the "baseUrl" option.
     */
    gitilesBaseUrl?: string;
    /**
     * The username to use for requests to gerrit.
     */
    username?: string;
    /**
     * The password or http token to use for authentication.
     */
    password?: string;
};
/**
 * Reads a single Gerrit integration config.
 *
 * @param config - The config object of a single integration
 *
 * @public
 */
export declare function readGerritIntegrationConfig(config: Config): GerritIntegrationConfig;
/**
 * Reads a set of Gerrit integration configs.
 *
 * @param configs - All of the integration config objects
 *
 * @public
 */
export declare function readGerritIntegrationConfigs(configs: Config[]): GerritIntegrationConfig[];
