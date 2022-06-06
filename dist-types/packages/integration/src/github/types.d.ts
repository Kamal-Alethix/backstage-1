/**
 * The type of credentials produced by the credential provider.
 *
 * @public
 */
export declare type GithubCredentialType = 'app' | 'token';
/**
 * A set of credentials information for a GitHub integration.
 *
 * @public
 */
export declare type GithubCredentials = {
    headers?: {
        [name: string]: string;
    };
    token?: string;
    type: GithubCredentialType;
};
/**
 * This allows implementations to be provided to retrieve GitHub credentials.
 *
 * @public
 *
 */
export interface GithubCredentialsProvider {
    getCredentials(opts: {
        url: string;
    }): Promise<GithubCredentials>;
}
