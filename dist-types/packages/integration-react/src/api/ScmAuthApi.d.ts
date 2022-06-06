import { ApiRef, AuthRequestOptions } from '@backstage/core-plugin-api';
/**
 * The options that control a {@link ScmAuthApi.getCredentials} call.
 *
 * @public
 */
export interface ScmAuthTokenOptions extends AuthRequestOptions {
    /**
     * The URL of the SCM resource to be accessed.
     *
     * @example https://github.com/backstage/backstage
     */
    url: string;
    /**
     * Whether to request additional access scope.
     *
     * Read access to user, organization, and repositories is always included.
     */
    additionalScope?: {
        /**
         * Requests access to be able to write repository content, including
         * the ability to create things like issues and pull requests.
         */
        repoWrite?: boolean;
        /**
         * Allow an arbitrary list of scopes provided from the user
         * to request from the provider.
         */
        customScopes?: {
            github?: string[];
            azure?: string[];
            bitbucket?: string[];
            gitlab?: string[];
        };
    };
}
/**
 * The response from a {@link ScmAuthApi.getCredentials} call.
 *
 * @public
 */
export interface ScmAuthTokenResponse {
    /**
     * An authorization token that can be used to authenticate requests.
     */
    token: string;
    /**
     * The set of HTTP headers that are needed to authenticate requests.
     */
    headers: {
        [name: string]: string;
    };
}
/**
 * ScmAuthApi provides methods for authenticating towards source code management services.
 *
 * As opposed to using the GitHub, GitLab and other auth APIs
 * directly, this API allows for more generic access to SCM services.
 *
 * @public
 */
export interface ScmAuthApi {
    /**
     * Requests credentials for accessing an SCM resource.
     */
    getCredentials(options: ScmAuthTokenOptions): Promise<ScmAuthTokenResponse>;
}
/**
 * The ApiRef for the ScmAuthApi.
 *
 * @public
 */
export declare const scmAuthApiRef: ApiRef<ScmAuthApi>;
