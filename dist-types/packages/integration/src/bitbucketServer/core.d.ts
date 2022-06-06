import { BitbucketServerIntegrationConfig } from './config';
/**
 * Given a URL pointing to a path on a provider, returns the default branch.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 */
export declare function getBitbucketServerDefaultBranch(url: string, config: BitbucketServerIntegrationConfig): Promise<string>;
/**
 * Given a URL pointing to a path on a provider, returns a URL that is suitable
 * for downloading the subtree.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 */
export declare function getBitbucketServerDownloadUrl(url: string, config: BitbucketServerIntegrationConfig): Promise<string>;
/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://bitbucket.company.com/projectname/reponame/src/main/file.yaml
 * to:   https://bitbucket.company.com/rest/api/1.0/project/projectname/reponame/raw/file.yaml?at=main
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export declare function getBitbucketServerFileFetchUrl(url: string, config: BitbucketServerIntegrationConfig): string;
/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config - The relevant provider config
 * @public
 */
export declare function getBitbucketServerRequestOptions(config: BitbucketServerIntegrationConfig): {
    headers: Record<string, string>;
};
