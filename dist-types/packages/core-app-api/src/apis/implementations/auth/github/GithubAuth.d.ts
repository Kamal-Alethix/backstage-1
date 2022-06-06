import { githubAuthApiRef } from '@backstage/core-plugin-api';
import { OAuthApiCreateOptions } from '../types';
/**
 * Implements the OAuth flow to GitHub products.
 *
 * @public
 */
export default class GithubAuth {
    static create(options: OAuthApiCreateOptions): typeof githubAuthApiRef.T;
}
