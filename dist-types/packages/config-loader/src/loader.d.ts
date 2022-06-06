import { AppConfig } from '@backstage/config';
/** @public */
export declare type ConfigTarget = {
    path: string;
} | {
    url: string;
};
/** @public */
export declare type LoadConfigOptionsWatch = {
    /**
     * A listener that is called when a config file is changed.
     */
    onChange: (configs: AppConfig[]) => void;
    /**
     * An optional signal that stops the watcher once the promise resolves.
     */
    stopSignal?: Promise<void>;
};
/** @public */
export declare type LoadConfigOptionsRemote = {
    /**
     * A remote config reloading period, in seconds
     */
    reloadIntervalSeconds: number;
};
/**
 * Options that control the loading of configuration files in the backend.
 *
 * @public
 */
export declare type LoadConfigOptions = {
    configRoot: string;
    configTargets: ConfigTarget[];
    /**
     * Custom environment variable loading function
     *
     * @experimental This API is not stable and may change at any point
     */
    experimentalEnvFunc?: (name: string) => Promise<string | undefined>;
    /**
     * An optional remote config
     */
    remote?: LoadConfigOptionsRemote;
    /**
     * An optional configuration that enables watching of config files.
     */
    watch?: LoadConfigOptionsWatch;
};
/**
 * Results of loading configuration files.
 * @public
 */
export declare type LoadConfigResult = {
    /**
     * Array of all loaded configs.
     */
    appConfigs: AppConfig[];
};
/**
 * Load configuration data.
 *
 * @public
 */
export declare function loadConfig(options: LoadConfigOptions): Promise<LoadConfigResult>;
