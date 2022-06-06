import { Config } from '@backstage/config';
/**
 * The configuration parameters for a single GitLab integration.
 *
 * @public
 */
export declare type GitLabIntegrationConfig = {
    /**
     * The host of the target that this matches on, e.g. `gitlab.com`.
     */
    host: string;
    /**
     * The base URL of the API of this provider, e.g.
     * `https://gitlab.com/api/v4`, with no trailing slash.
     *
     * May be omitted specifically for public GitLab; then it will be deduced.
     */
    apiBaseUrl: string;
    /**
     * The authorization token to use for requests to this provider.
     *
     * If no token is specified, anonymous access is used.
     */
    token?: string;
    /**
     * The baseUrl of this provider, e.g. `https://gitlab.com`, which is passed
     * into the GitLab client.
     *
     * If no baseUrl is provided, it will default to `https://${host}`
     */
    baseUrl: string;
};
/**
 * Reads a single GitLab integration config.
 *
 * @param config - The config object of a single integration
 * @public
 */
export declare function readGitLabIntegrationConfig(config: Config): GitLabIntegrationConfig;
/**
 * Reads a set of GitLab integration configs, and inserts some defaults for
 * public GitLab if not specified.
 *
 * @param configs - All of the integration config objects
 * @public
 */
export declare function readGitLabIntegrationConfigs(configs: Config[]): GitLabIntegrationConfig[];
