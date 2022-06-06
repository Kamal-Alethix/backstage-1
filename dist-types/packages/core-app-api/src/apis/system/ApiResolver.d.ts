import { ApiRef, ApiHolder, AnyApiRef } from '@backstage/core-plugin-api';
import { ApiFactoryHolder } from './types';
/**
 * Handles the actual on-demand instantiation and memoization of APIs out of
 * an {@link ApiFactoryHolder}.
 *
 * @public
 */
export declare class ApiResolver implements ApiHolder {
    private readonly factories;
    /**
     * Validate factories by making sure that each of the apis can be created
     * without hitting any circular dependencies.
     */
    static validateFactories(factories: ApiFactoryHolder, apis: Iterable<AnyApiRef>): void;
    private readonly apis;
    constructor(factories: ApiFactoryHolder);
    get<T>(ref: ApiRef<T>): T | undefined;
    private load;
    private loadDeps;
}
