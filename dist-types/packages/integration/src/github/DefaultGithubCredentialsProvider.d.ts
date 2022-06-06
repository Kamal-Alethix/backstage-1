import { GithubCredentials, GithubCredentialsProvider } from './types';
import { ScmIntegrationRegistry } from '../registry';
/**
 * Handles the creation and caching of credentials for GitHub integrations.
 *
 * @public
 * @remarks
 *
 * TODO: Possibly move this to a backend only package so that it's not used in the frontend by mistake
 */
export declare class DefaultGithubCredentialsProvider implements GithubCredentialsProvider {
    private readonly providers;
    static fromIntegrations(integrations: ScmIntegrationRegistry): DefaultGithubCredentialsProvider;
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
     *   url: 'https://github.com/backstage/foobar'
     * })
     *
     * const { token, headers } = await getCredentials({
     *   url: 'https://github.com/backstage'
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
