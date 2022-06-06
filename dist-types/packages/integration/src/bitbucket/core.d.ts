import { BitbucketIntegrationConfig } from './config';
/**
 * Given a URL pointing to a path on a provider, returns the default branch.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 * @deprecated no longer in use, bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export declare function getBitbucketDefaultBranch(url: string, config: BitbucketIntegrationConfig): Promise<string>;
/**
 * Given a URL pointing to a path on a provider, returns a URL that is suitable
 * for downloading the subtree.
 *
 * @param url - A URL pointing to a path
 * @param config - The relevant provider config
 * @public
 * @deprecated no longer in use, bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export declare function getBitbucketDownloadUrl(url: string, config: BitbucketIntegrationConfig): Promise<string>;
/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://bitbucket.org/orgname/reponame/src/master/file.yaml
 * to:   https://api.bitbucket.org/2.0/repositories/orgname/reponame/src/master/file.yaml
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 * @deprecated no longer in use, bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export declare function getBitbucketFileFetchUrl(url: string, config: BitbucketIntegrationConfig): string;
/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config - The relevant provider config
 * @public
 * @deprecated no longer in use, bitbucket integration replaced by integrations bitbucketCloud and bitbucketServer.
 */
export declare function getBitbucketRequestOptions(config: BitbucketIntegrationConfig): {
    headers: Record<string, string>;
};
