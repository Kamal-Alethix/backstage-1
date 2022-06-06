/**
 * A Backstage backend plugin that handles authentication
 *
 * @packageDocumentation
 */
export * from './service/router';
export type { TokenIssuer, TokenParams } from './identity';
export * from './providers';
export * from './lib/flow';
export * from './lib/oauth';
export * from './lib/catalog';
export { getDefaultOwnershipEntityRefs } from './lib/resolvers';
