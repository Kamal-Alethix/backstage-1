import { FetchApi } from '@backstage/core-plugin-api';
import { FetchMiddleware } from './types';
/**
 * Builds a fetch API, based on the builtin fetch wrapped by a set of optional
 * middleware implementations that add behaviors.
 *
 * @remarks
 *
 * The middleware are applied in reverse order, i.e. the last one will be
 * "closest" to the base implementation. Passing in `[M1, M2, M3]` effectively
 * leads to `M1(M2(M3(baseImplementation)))`.
 *
 * @public
 */
export declare function createFetchApi(options: {
    baseImplementation?: typeof fetch | undefined;
    middleware?: FetchMiddleware | FetchMiddleware[] | undefined;
}): FetchApi;
