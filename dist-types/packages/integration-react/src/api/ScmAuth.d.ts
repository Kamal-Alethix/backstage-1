import { OAuthApi } from '@backstage/core-plugin-api';
import { ScmAuthApi, ScmAuthTokenOptions, ScmAuthTokenResponse } from './ScmAuthApi';
/**
 * An implementation of the ScmAuthApi that merges together OAuthApi instances
 * to form a single instance that can handles authentication for multiple providers.
 *
 * @public
 *
 * @example
 * ```
 * // Supports authentication towards both public GitHub and GHE:
 * createApiFactory({
 *   api: scmAuthApiRef,
 *   deps: {
 *     gheAuthApi: gheAuthApiRef,
 *     githubAuthApi: githubAuthApiRef,
 *   },
 *   factory: ({ githubAuthApi, gheAuthApi }) =>
 *     ScmAuth.merge(
 *       ScmAuth.forGithub(githubAuthApi),
 *       ScmAuth.forGithub(gheAuthApi, {
 *         host: 'ghe.example.com',
 *       }),
 *     )
 * })
 * ```
 */
export declare class ScmAuth implements ScmAuthApi {
    #private;
    /**
     * Creates an API factory that enables auth for each of the default SCM providers.
     */
    static createDefaultApiFactory(): import("@backstage/core-plugin-api").ApiFactory<ScmAuthApi, ScmAuthApi, {
        github: OAuthApi & import("@backstage/core-plugin-api").ProfileInfoApi & import("@backstage/core-plugin-api").BackstageIdentityApi & import("@backstage/core-plugin-api").SessionApi;
        gitlab: OAuthApi & import("@backstage/core-plugin-api").ProfileInfoApi & import("@backstage/core-plugin-api").BackstageIdentityApi & import("@backstage/core-plugin-api").SessionApi;
        azure: OAuthApi & import("@backstage/core-plugin-api").OpenIdConnectApi & import("@backstage/core-plugin-api").ProfileInfoApi & import("@backstage/core-plugin-api").BackstageIdentityApi & import("@backstage/core-plugin-api").SessionApi;
        bitbucket: OAuthApi & import("@backstage/core-plugin-api").ProfileInfoApi & import("@backstage/core-plugin-api").BackstageIdentityApi & import("@backstage/core-plugin-api").SessionApi;
    }>;
    /**
     * Creates a general purpose ScmAuth instance with a custom scope mapping.
     */
    static forAuthApi(authApi: OAuthApi, options: {
        host: string;
        scopeMapping: {
            default: string[];
            repoWrite: string[];
        };
    }): ScmAuth;
    /**
     * Creates a new ScmAuth instance that handles authentication towards GitHub.
     *
     * The host option determines which URLs that are handled by this instance and defaults to `github.com`.
     *
     * The default scopes are:
     *
     * `repo read:org read:user`
     *
     * If the additional `repoWrite` permission is requested, these scopes are added:
     *
     * `gist`
     */
    static forGithub(githubAuthApi: OAuthApi, options?: {
        host?: string;
    }): ScmAuth;
    /**
     * Creates a new ScmAuth instance that handles authentication towards GitLab.
     *
     * The host option determines which URLs that are handled by this instance and defaults to `gitlab.com`.
     *
     * The default scopes are:
     *
     * `read_user read_api read_repository`
     *
     * If the additional `repoWrite` permission is requested, these scopes are added:
     *
     * `write_repository api`
     */
    static forGitlab(gitlabAuthApi: OAuthApi, options?: {
        host?: string;
    }): ScmAuth;
    /**
     * Creates a new ScmAuth instance that handles authentication towards Azure.
     *
     * The host option determines which URLs that are handled by this instance and defaults to `dev.azure.com`.
     *
     * The default scopes are:
     *
     * `vso.build vso.code vso.graph vso.project vso.profile`
     *
     * If the additional `repoWrite` permission is requested, these scopes are added:
     *
     * `vso.code_manage`
     */
    static forAzure(microsoftAuthApi: OAuthApi, options?: {
        host?: string;
    }): ScmAuth;
    /**
     * Creates a new ScmAuth instance that handles authentication towards Bitbucket.
     *
     * The host option determines which URLs that are handled by this instance and defaults to `bitbucket.org`.
     *
     * The default scopes are:
     *
     * `account team pullrequest snippet issue`
     *
     * If the additional `repoWrite` permission is requested, these scopes are added:
     *
     * `pullrequest:write snippet:write issue:write`
     */
    static forBitbucket(bitbucketAuthApi: OAuthApi, options?: {
        host?: string;
    }): ScmAuth;
    /**
     * Merges together multiple ScmAuth instances into one that
     * routes requests to the correct instance based on the URL.
     */
    static merge(...providers: ScmAuth[]): ScmAuthApi;
    private constructor();
    /**
     * Checks whether the implementation is able to provide authentication for the given URL.
     */
    isUrlSupported(url: URL): boolean;
    private getAdditionalScopesForProvider;
    /**
     * Fetches credentials for the given resource.
     */
    getCredentials(options: ScmAuthTokenOptions): Promise<ScmAuthTokenResponse>;
}
