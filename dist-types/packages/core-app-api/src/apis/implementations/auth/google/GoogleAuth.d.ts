import { googleAuthApiRef } from '@backstage/core-plugin-api';
import { OAuthApiCreateOptions } from '../types';
/**
 * Implements the OAuth flow to Google products.
 *
 * @public
 */
export default class GoogleAuth {
    static create(options: OAuthApiCreateOptions): typeof googleAuthApiRef.T;
}
