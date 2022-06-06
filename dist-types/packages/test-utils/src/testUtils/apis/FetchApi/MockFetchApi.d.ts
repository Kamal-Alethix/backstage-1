import { DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import crossFetch from 'cross-fetch';
/**
 * The options given when constructing a {@link MockFetchApi}.
 *
 * @public
 */
export interface MockFetchApiOptions {
    /**
     * Define the underlying base `fetch` implementation.
     *
     * @defaultValue undefined
     * @remarks
     *
     * Leaving out this parameter or passing `undefined`, makes the API use the
     * global `fetch` implementation to make real network requests.
     *
     * `'none'` swallows all calls and makes no requests at all.
     *
     * You can also pass in any `fetch` compatible callback, such as a
     * `jest.fn()`, if you want to use a custom implementation or to just track
     * and assert on calls.
     */
    baseImplementation?: undefined | 'none' | typeof crossFetch;
    /**
     * Add translation from `plugin://` URLs to concrete http(s) URLs, basically
     * simulating what
     * {@link @backstage/core-app-api#FetchMiddlewares.resolvePluginProtocol}
     * does.
     *
     * @defaultValue undefined
     * @remarks
     *
     * Leaving out this parameter or passing `undefined`, disables plugin protocol
     * translation.
     *
     * To enable the feature, pass in a discovery API which is then used to
     * resolve the URLs.
     */
    resolvePluginProtocol?: undefined | {
        discoveryApi: Pick<DiscoveryApi, 'getBaseUrl'>;
    };
    /**
     * Add token based Authorization headers to requests, basically simulating
     * what {@link @backstage/core-app-api#FetchMiddlewares.injectIdentityAuth}
     * does.
     *
     * @defaultValue undefined
     * @remarks
     *
     * Leaving out this parameter or passing `undefined`, disables auth injection.
     *
     * To enable the feature, pass in either a static token or an identity API
     * which is queried on each request for a token.
     */
    injectIdentityAuth?: undefined | {
        token: string;
    } | {
        identityApi: Pick<IdentityApi, 'getCredentials'>;
    };
}
/**
 * A test helper implementation of {@link @backstage/core-plugin-api#FetchApi}.
 *
 * @public
 */
export declare class MockFetchApi implements FetchApi {
    private readonly implementation;
    /**
     * Creates a mock {@link @backstage/core-plugin-api#FetchApi}.
     */
    constructor(options?: MockFetchApiOptions);
    /** {@inheritdoc @backstage/core-plugin-api#FetchApi.fetch} */
    get fetch(): typeof crossFetch;
}
