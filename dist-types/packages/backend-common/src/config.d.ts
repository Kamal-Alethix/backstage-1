import { Logger } from 'winston';
import { LoadConfigOptionsRemote } from '@backstage/config-loader';
import { Config } from '@backstage/config';
import { JsonValue } from '@backstage/types';
export declare class ObservableConfigProxy implements Config {
    private readonly logger;
    private readonly parent?;
    private parentKey?;
    private config;
    private readonly subscribers;
    constructor(logger: Logger, parent?: ObservableConfigProxy | undefined, parentKey?: string | undefined);
    setConfig(config: Config): void;
    subscribe(onChange: () => void): {
        unsubscribe: () => void;
    };
    private select;
    has(key: string): boolean;
    keys(): string[];
    get<T = JsonValue>(key?: string): T;
    getOptional<T = JsonValue>(key?: string): T | undefined;
    getConfig(key: string): Config;
    getOptionalConfig(key: string): Config | undefined;
    getConfigArray(key: string): Config[];
    getOptionalConfigArray(key: string): Config[] | undefined;
    getNumber(key: string): number;
    getOptionalNumber(key: string): number | undefined;
    getBoolean(key: string): boolean;
    getOptionalBoolean(key: string): boolean | undefined;
    getString(key: string): string;
    getOptionalString(key: string): string | undefined;
    getStringArray(key: string): string[];
    getOptionalStringArray(key: string): string[] | undefined;
}
/**
 * Load configuration for a Backend.
 *
 * This function should only be called once, during the initialization of the backend.
 *
 * @public
 */
export declare function loadBackendConfig(options: {
    logger: Logger;
    remote?: LoadConfigOptionsRemote;
    argv: string[];
}): Promise<Config>;
