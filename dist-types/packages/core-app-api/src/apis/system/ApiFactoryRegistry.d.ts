import { ApiFactoryHolder } from './types';
import { ApiRef, ApiFactory, AnyApiRef } from '@backstage/core-plugin-api';
/**
 * Scope type when registering API factories.
 * @public
 */
export declare type ApiFactoryScope = 'default' | 'app' | 'static';
/**
 * ApiFactoryRegistry is an ApiFactoryHolder implementation that enables
 * registration of API Factories with different scope.
 *
 * Each scope has an assigned priority, where factories registered with
 * higher priority scopes override ones with lower priority.
 *
 * @public
 */
export declare class ApiFactoryRegistry implements ApiFactoryHolder {
    private readonly factories;
    /**
     * Register a new API factory. Returns true if the factory was added
     * to the registry.
     *
     * A factory will not be added to the registry if there is already
     * an existing factory with the same or higher priority.
     */
    register<Api, Impl extends Api, Deps extends {
        [name in string]: unknown;
    }>(scope: ApiFactoryScope, factory: ApiFactory<Api, Impl, Deps>): boolean;
    get<T>(api: ApiRef<T>): ApiFactory<T, T, {
        [x: string]: unknown;
    }> | undefined;
    getAllApis(): Set<AnyApiRef>;
}
