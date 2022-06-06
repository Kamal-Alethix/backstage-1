import { AuthProviderFactory, SignInResolver } from './types';
/**
 * Creates a standardized representation of an integration with a third-party
 * auth provider.
 *
 * The returned object facilitates the creation of provider instances, and
 * supplies built-in sign-in resolvers for the specific provider.
 */
export declare function createAuthProviderIntegration<TCreateOptions extends unknown[], TResolvers extends {
    [name in string]: (...args: any[]) => SignInResolver<any>;
}>(config: {
    create: (...args: TCreateOptions) => AuthProviderFactory;
    resolvers?: TResolvers;
}): Readonly<{
    create: (...args: TCreateOptions) => AuthProviderFactory;
    resolvers: Readonly<string extends keyof TResolvers ? never : TResolvers>;
}>;
