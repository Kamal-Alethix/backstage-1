import { JsonValue, JsonObject } from '@backstage/types';
import { AppConfig, Config } from './types';
/**
 * An implementation of the `Config` interface that uses a plain JavaScript object
 * for the backing data, with the ability of linking multiple readers together.
 *
 * @public
 */
export declare class ConfigReader implements Config {
    private readonly data;
    private readonly context;
    private readonly fallback?;
    private readonly prefix;
    /**
     * A set of key paths that where removed from the config due to not being visible.
     *
     * This was added as a mutable private member to avoid changes to the public API.
     * Its only purpose of this is to warn users of missing visibility when running
     * the frontend in development mode.
     */
    private filteredKeys?;
    private notifiedFilteredKeys;
    /**
     * Instantiates the config reader from a list of application config objects.
     */
    static fromConfigs(configs: AppConfig[]): ConfigReader;
    constructor(data: JsonObject | undefined, context?: string, fallback?: ConfigReader | undefined, prefix?: string);
    /** {@inheritdoc Config.has} */
    has(key: string): boolean;
    /** {@inheritdoc Config.keys} */
    keys(): string[];
    /** {@inheritdoc Config.get} */
    get<T = JsonValue>(key?: string): T;
    /** {@inheritdoc Config.getOptional} */
    getOptional<T = JsonValue>(key?: string): T | undefined;
    /** {@inheritdoc Config.getConfig} */
    getConfig(key: string): ConfigReader;
    /** {@inheritdoc Config.getOptionalConfig} */
    getOptionalConfig(key: string): ConfigReader | undefined;
    /** {@inheritdoc Config.getConfigArray} */
    getConfigArray(key: string): ConfigReader[];
    /** {@inheritdoc Config.getOptionalConfigArray} */
    getOptionalConfigArray(key: string): ConfigReader[] | undefined;
    /** {@inheritdoc Config.getNumber} */
    getNumber(key: string): number;
    /** {@inheritdoc Config.getOptionalNumber} */
    getOptionalNumber(key: string): number | undefined;
    /** {@inheritdoc Config.getBoolean} */
    getBoolean(key: string): boolean;
    /** {@inheritdoc Config.getOptionalBoolean} */
    getOptionalBoolean(key: string): boolean | undefined;
    /** {@inheritdoc Config.getString} */
    getString(key: string): string;
    /** {@inheritdoc Config.getOptionalString} */
    getOptionalString(key: string): string | undefined;
    /** {@inheritdoc Config.getStringArray} */
    getStringArray(key: string): string[];
    /** {@inheritdoc Config.getOptionalStringArray} */
    getOptionalStringArray(key: string): string[] | undefined;
    private fullKey;
    private copy;
    private readConfigValue;
    private readValue;
}
