import { GitHubIntegrationConfig } from './config';
import { GithubCredentials } from './types';
/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://github.com/a/b/blob/branchname/path/to/c.yaml
 * to:   https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname
 * or:   https://raw.githubusercontent.com/a/b/branchname/c.yaml
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export declare function getGitHubFileFetchUrl(url: string, config: GitHubIntegrationConfig, credentials: GithubCredentials): string;
/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @deprecated This function is no longer used internally
 * @param config - The relevant provider config
 * @public
 */
export declare function getGitHubRequestOptions(config: GitHubIntegrationConfig, credentials: GithubCredentials): {
    headers: Record<string, string>;
};
export declare function chooseEndpoint(config: GitHubIntegrationConfig, credentials: GithubCredentials): 'api' | 'raw';
