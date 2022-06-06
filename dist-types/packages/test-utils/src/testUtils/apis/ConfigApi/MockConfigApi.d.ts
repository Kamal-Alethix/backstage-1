import { Config } from '@backstage/config';
import { JsonObject, JsonValue } from '@backstage/types';
import { ConfigApi } from '@backstage/core-plugin-api';
/**
 * MockConfigApi is a thin wrapper around {@link @backstage/config#ConfigReader}
 * that can be used to mock configuration using a plain object.
 *
 * @public
 * @example
 * ```tsx
 * const mockConfig = new MockConfigApi({
 *   app: { baseUrl: 'https://example.com' },
 * });
 *
 * const rendered = await renderInTestApp(
 *   <TestApiProvider apis={[[configApiRef, mockConfig]]}>
 *     <MyTestedComponent />
 *   </TestApiProvider>,
 * );
 * ```
 */
export declare class MockConfigApi implements ConfigApi {
    private readonly config;
    constructor(data: JsonObject);
    /** {@inheritdoc @backstage/config#Config.has} */
    has(key: string): boolean;
    /** {@inheritdoc @backstage/config#Config.keys} */
    keys(): string[];
    /** {@inheritdoc @backstage/config#Config.get} */
    get<T = JsonValue>(key?: string): T;
    /** {@inheritdoc @backstage/config#Config.getOptional} */
    getOptional<T = JsonValue>(key?: string): T | undefined;
    /** {@inheritdoc @backstage/config#Config.getConfig} */
    getConfig(key: string): Config;
    /** {@inheritdoc @backstage/config#Config.getOptionalConfig} */
    getOptionalConfig(key: string): Config | undefined;
    /** {@inheritdoc @backstage/config#Config.getConfigArray} */
    getConfigArray(key: string): Config[];
    /** {@inheritdoc @backstage/config#Config.getOptionalConfigArray} */
    getOptionalConfigArray(key: string): Config[] | undefined;
    /** {@inheritdoc @backstage/config#Config.getNumber} */
    getNumber(key: string): number;
    /** {@inheritdoc @backstage/config#Config.getOptionalNumber} */
    getOptionalNumber(key: string): number | undefined;
    /** {@inheritdoc @backstage/config#Config.getBoolean} */
    getBoolean(key: string): boolean;
    /** {@inheritdoc @backstage/config#Config.getOptionalBoolean} */
    getOptionalBoolean(key: string): boolean | undefined;
    /** {@inheritdoc @backstage/config#Config.getString} */
    getString(key: string): string;
    /** {@inheritdoc @backstage/config#Config.getOptionalString} */
    getOptionalString(key: string): string | undefined;
    /** {@inheritdoc @backstage/config#Config.getStringArray} */
    getStringArray(key: string): string[];
    /** {@inheritdoc @backstage/config#Config.getOptionalStringArray} */
    getOptionalStringArray(key: string): string[] | undefined;
}
