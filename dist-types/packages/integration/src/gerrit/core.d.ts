import { GerritIntegrationConfig } from '.';
/**
 * Parse a Gitiles URL and return branch, file path and project.
 *
 * @remarks
 *
 * Gerrit only handles code reviews so it does not have a native way to browse
 * or showing the content of gits. Image if Github only had the "pull requests"
 * tab.
 *
 * Any source code browsing is instead handled by optional services outside
 * Gerrit. The url format chosen for the Gerrit url reader is the one used by
 * the Gitiles project. Gerrit will work perfectly with Backstage without
 * having Gitiles installed but there are some places in the Backstage GUI
 * with links to the url used by the url reader. These will not work unless
 * the urls point to an actual Gitiles installation.
 *
 * Gitiles url:
 * https://g.com/optional_path/\{project\}/+/refs/heads/\{branch\}/\{filePath\}
 *
 *
 * @param url - An URL pointing to a file stored in git.
 * @public
 */
export declare function parseGerritGitilesUrl(config: GerritIntegrationConfig, url: string): {
    branch: string;
    filePath: string;
    project: string;
};
/**
 * Build a Gerrit Gitiles url that targets a specific path.
 *
 * @param config - A Gerrit provider config.
 * @param project - The name of the git project
 * @param branch - The branch we will target.
 * @param filePath - The absolute file path.
 * @public
 */
export declare function builldGerritGitilesUrl(config: GerritIntegrationConfig, project: string, branch: string, filePath: string): string;
/**
 * Return the authentication prefix.
 *
 * @remarks
 *
 * To authenticate with a password the API url must be prefixed with "/a/".
 * If no password is set anonymous access (without the prefix) will
 * be used.
 *
 * @param config - A Gerrit provider config.
 * @public
 */
export declare function getAuthenticationPrefix(config: GerritIntegrationConfig): string;
/**
 * Return the url to get branch info from the Gerrit API.
 *
 * @param config - A Gerrit provider config.
 * @param url - An url pointing to a file in git.
 * @public
 */
export declare function getGerritBranchApiUrl(config: GerritIntegrationConfig, url: string): string;
/**
 * Return the url to clone the repo that is referenced by the url.
 *
 * @param url - An url pointing to a file in git.
 * @public
 */
export declare function getGerritCloneRepoUrl(config: GerritIntegrationConfig, url: string): string;
/**
 * Return the url to fetch the contents of a file using the Gerrit API.
 *
 * @param config - A Gerrit provider config.
 * @param url - An url pointing to a file in git.
 * @public
 */
export declare function getGerritFileContentsApiUrl(config: GerritIntegrationConfig, url: string): string;
/**
 * Return the url to query available projects using the Gerrit API.
 *
 * @param config - A Gerrit provider config.
 * @public
 */
export declare function getGerritProjectsApiUrl(config: GerritIntegrationConfig): string;
/**
 * Return request headers for a Gerrit provider.
 *
 * @param config - A Gerrit provider config
 * @public
 */
export declare function getGerritRequestOptions(config: GerritIntegrationConfig): {
    headers?: Record<string, string>;
};
/**
 * Parse the json response from Gerrit and strip the magic prefix.
 *
 * @remarks
 *
 * To prevent against XSSI attacks the JSON response body from Gerrit starts
 * with a magic prefix that must be stripped before it can be fed to a JSON
 * parser.
 *
 * @param response - An API response.
 * @public
 */
export declare function parseGerritJsonResponse(response: Response): Promise<unknown>;
