import { GitHubIntegrationConfig } from './config';
import { RestEndpointMethodTypes } from '@octokit/rest';
import { GithubCredentials, GithubCredentialsProvider } from './types';
/**
 * Corresponds to a Github installation which internally could hold several GitHub Apps.
 *
 * @public
 */
export declare class GithubAppCredentialsMux {
    private readonly apps;
    constructor(config: GitHubIntegrationConfig);
    getAllInstallations(): Promise<RestEndpointMethodTypes['apps']['listInstallations']['response']['data']>;
    getAppToken(owner: string, repo?: string): Promise<string | undefined>;
}
/**
 * Handles the creation and caching of credentials for GitHub integrations.
 *
 * @public
 * @remarks
 *
 * TODO: Possibly move this to a backend only package so that it's not used in the frontend by mistake
 */
export declare class SingleInstanceGithubCredentialsProvider implements GithubCredentialsProvider {
    private readonly githubAppCredentialsMux;
    private readonly token?;
    static create: (config: GitHubIntegrationConfig) => GithubCredentialsProvider;
    private constructor();
    /**
     * Returns {@link GithubCredentials} for a given URL.
     *
     * @remarks
     *
     * Consecutive calls to this method with the same URL will return cached
     * credentials.
     *
     * The shortest lifetime for a token returned is 10 minutes.
     *
     * @example
     * ```ts
     * const { token, headers } = await getCredentials({
     *   url: 'github.com/backstage/foobar'
     * })
     * ```
     *
     * @param opts - The organization or repository URL
     * @returns A promise of {@link GithubCredentials}.
     */
    getCredentials(opts: {
        url: string;
    }): Promise<GithubCredentials>;
}
