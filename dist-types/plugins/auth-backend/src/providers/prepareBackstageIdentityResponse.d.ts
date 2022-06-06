import { BackstageIdentityResponse, BackstageSignInResult } from '@backstage/plugin-auth-node';
/**
 * Parses a Backstage-issued token and decorates the
 * {@link @backstage/plugin-auth-node#BackstageIdentityResponse} with identity information sourced from the
 * token.
 *
 * @public
 */
export declare function prepareBackstageIdentityResponse(result: BackstageSignInResult): BackstageIdentityResponse;
