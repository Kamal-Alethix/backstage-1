import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { OAuthApiCreateOptions } from '../types';
/**
 * Implements the OAuth flow to Microsoft products.
 *
 * @public
 */
export default class MicrosoftAuth {
    static create(options: OAuthApiCreateOptions): typeof microsoftAuthApiRef.T;
}
