import { atlassianAuthApiRef } from '@backstage/core-plugin-api';
import { OAuthApiCreateOptions } from '../types';
/**
 * Implements the OAuth flow to Atlassian products.
 *
 * @public
 */
export default class AtlassianAuth {
    static create(options: OAuthApiCreateOptions): typeof atlassianAuthApiRef.T;
}
