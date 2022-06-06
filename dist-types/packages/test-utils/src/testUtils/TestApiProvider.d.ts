import { ReactNode } from 'react';
import { ApiRef, ApiHolder } from '@backstage/core-plugin-api';
/** @ignore */
declare type TestApiProviderPropsApiPair<TApi> = TApi extends infer TImpl ? readonly [ApiRef<TApi>, Partial<TImpl>] : never;
/** @ignore */
declare type TestApiProviderPropsApiPairs<TApiPairs> = {
    [TIndex in keyof TApiPairs]: TestApiProviderPropsApiPair<TApiPairs[TIndex]>;
};
/**
 * Properties for the {@link TestApiProvider} component.
 *
 * @public
 */
export declare type TestApiProviderProps<TApiPairs extends any[]> = {
    apis: readonly [...TestApiProviderPropsApiPairs<TApiPairs>];
    children: ReactNode;
};
/**
 * The `TestApiRegistry` is an {@link @backstage/core-plugin-api#ApiHolder} implementation
 * that is particularly well suited for development and test environments such as
 * unit tests, storybooks, and isolated plugin development setups.
 *
 * @public
 */
export declare class TestApiRegistry implements ApiHolder {
    private readonly apis;
    /**
     * Creates a new {@link TestApiRegistry} with a list of API implementation pairs.
     *
     * Similar to the {@link TestApiProvider}, there is no need to provide a full
     * implementation of each API, it's enough to implement the methods that are tested.
     *
     * @example
     * ```ts
     * const apis = TestApiRegistry.from(
     *   [configApiRef, new ConfigReader({})],
     *   [identityApiRef, { getUserId: () => 'tester' }],
     * );
     * ```
     *
     * @public
     * @param apis - A list of pairs mapping an ApiRef to its respective implementation.
     */
    static from<TApiPairs extends any[]>(...apis: readonly [...TestApiProviderPropsApiPairs<TApiPairs>]): TestApiRegistry;
    private constructor();
    /**
     * Returns an implementation of the API.
     *
     * @public
     */
    get<T>(api: ApiRef<T>): T | undefined;
}
/**
 * The `TestApiProvider` is a Utility API context provider that is particularly
 * well suited for development and test environments such as unit tests, storybooks,
 * and isolated plugin development setups.
 *
 * It lets you provide any number of API implementations, without necessarily
 * having to fully implement each of the APIs.
 *
 * A migration from `ApiRegistry` and `ApiProvider` might look like this, from:
 *
 * ```tsx
 * renderInTestApp(
 *   <ApiProvider
 *     apis={ApiRegistry.from([
 *       [identityApiRef, mockIdentityApi as unknown as IdentityApi]
 *     ])}
 *   >
 *     {...}
 *   </ApiProvider>
 * )
 * ```
 *
 * To the following:
 *
 * ```tsx
 * renderInTestApp(
 *   <TestApiProvider apis={[[identityApiRef, mockIdentityApi]]}>
 *     {...}
 *   </TestApiProvider>
 * )
 * ```
 *
 * Note that the cast to `IdentityApi` is no longer needed as long as the mock API
 * implements a subset of the `IdentityApi`.
 *
 * @public
 **/
export declare const TestApiProvider: <T extends any[]>(props: TestApiProviderProps<T>) => JSX.Element;
export {};
