import { AzureIntegrationConfig } from './config';
/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * - from: `https://dev.azure.com/{organization}/{project}/_git/reponame?path={path}&version=GB{commitOrBranch}&_a=contents`
 * - to:   `https://dev.azure.com/{organization}/{project}/_apis/git/repositories/reponame/items?path={path}&version={commitOrBranch}`
 *
 * @param url - A URL pointing to a file
 * @public
 */
export declare function getAzureFileFetchUrl(url: string): string;
/**
 * Given a URL pointing to a path on a provider, returns a URL that is suitable
 * for downloading the subtree.
 *
 * @param url - A URL pointing to a path
 * @public
 */
export declare function getAzureDownloadUrl(url: string): string;
/**
 * Given a URL, return the API URL to fetch commits on the branch.
 *
 * @param url - A URL pointing to a repository or a sub-path
 * @public
 */
export declare function getAzureCommitsUrl(url: string): string;
/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config - The relevant provider config
 * @public
 */
export declare function getAzureRequestOptions(config: AzureIntegrationConfig, additionalHeaders?: Record<string, string>): {
    headers: Record<string, string>;
};
