import { ApiRef, ApiFactory } from './types';
/**
 * Used to infer types for a standalone {@link ApiFactory} that isn't immediately passed
 * to another function.
 *
 * @remarks
 *
 * This function doesn't actually do anything, it's only used to infer types.
 *
 * @public
 */
export declare function createApiFactory<Api, Impl extends Api, Deps extends {
    [name in string]: unknown;
}>(factory: ApiFactory<Api, Impl, Deps>): ApiFactory<Api, Impl, Deps>;
/**
 * Used to infer types for a standalone {@link ApiFactory} that isn't immediately passed
 * to another function.
 *
 * @param api - Ref of the API that will be produced by the factory.
 * @param instance - Implementation of the API to use.
 * @public
 */
export declare function createApiFactory<Api, Impl extends Api>(api: ApiRef<Api>, instance: Impl): ApiFactory<Api, Impl, {}>;
