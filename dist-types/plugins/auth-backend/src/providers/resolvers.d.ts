import { SignInResolver } from './types';
/**
 * A common sign-in resolver that looks up the user using the local part of
 * their email address as the entity name.
 */
export declare const commonByEmailLocalPartResolver: SignInResolver<unknown>;
/**
 * A common sign-in resolver that looks up the user using their email address
 * as email of the entity.
 */
export declare const commonByEmailResolver: SignInResolver<unknown>;
