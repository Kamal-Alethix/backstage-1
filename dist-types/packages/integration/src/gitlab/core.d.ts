import { GitLabIntegrationConfig } from './config';
/**
 * Given a URL pointing to a file on a provider, returns a URL that is suitable
 * for fetching the contents of the data.
 *
 * @remarks
 *
 * Converts
 * from: https://gitlab.example.com/a/b/blob/master/c.yaml
 * to:   https://gitlab.example.com/a/b/raw/master/c.yaml
 * -or-
 * from: https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
 * to:   https://gitlab.com/api/v4/projects/projectId/repository/files/filepath?ref=branch
 *
 * @param url - A URL pointing to a file
 * @param config - The relevant provider config
 * @public
 */
export declare function getGitLabFileFetchUrl(url: string, config: GitLabIntegrationConfig): Promise<string>;
/**
 * Gets the request options necessary to make requests to a given provider.
 *
 * @param config - The relevant provider config
 * @public
 */
export declare function getGitLabRequestOptions(config: GitLabIntegrationConfig): {
    headers: Record<string, string>;
};
export declare function buildRawUrl(target: string): URL;
export declare function buildProjectUrl(target: string, projectID: Number): URL;
export declare function getProjectId(target: string, config: GitLabIntegrationConfig): Promise<number>;
