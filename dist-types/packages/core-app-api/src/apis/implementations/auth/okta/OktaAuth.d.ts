import { oktaAuthApiRef } from '@backstage/core-plugin-api';
import { OAuthApiCreateOptions } from '../types';
/**
 * Implements the OAuth flow to Okta products.
 *
 * @public
 */
export default class OktaAuth {
    static create(options: OAuthApiCreateOptions): typeof oktaAuthApiRef.T;
}
