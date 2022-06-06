/**
 * Common functionality and types for the Backstage auth plugin.
 *
 * @packageDocumentation
 */
export { getBearerTokenFromAuthorizationHeader } from './getBearerTokenFromAuthorizationHeader';
export { IdentityClient } from './IdentityClient';
export type { IdentityClientOptions } from './IdentityClient';
export type { BackstageIdentityResponse, BackstageSignInResult, BackstageUserIdentity, } from './types';
