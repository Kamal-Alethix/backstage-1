import { gitlabAuthApiRef } from '@backstage/core-plugin-api';
import { OAuthApiCreateOptions } from '../types';
/**
 * Implements the OAuth flow to GitLab products.
 *
 * @public
 */
export default class GitlabAuth {
    static create(options: OAuthApiCreateOptions): typeof gitlabAuthApiRef.T;
}
