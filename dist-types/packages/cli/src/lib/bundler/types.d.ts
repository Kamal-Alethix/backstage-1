import { AppConfig, Config } from '@backstage/config';
import { BundlingPathsOptions } from './paths';
import { ConfigSchema } from '@backstage/config-loader';
export declare type BundlingOptions = {
    checksEnabled: boolean;
    isDev: boolean;
    frontendConfig: Config;
    frontendAppConfigs: AppConfig[];
    baseUrl: URL;
    parallelism?: number;
};
export declare type ServeOptions = BundlingPathsOptions & {
    checksEnabled: boolean;
    frontendConfig: Config;
    frontendAppConfigs: AppConfig[];
};
export declare type BuildOptions = BundlingPathsOptions & {
    targetDir?: string;
    statsJsonEnabled: boolean;
    parallelism?: number;
    schema?: ConfigSchema;
    frontendConfig: Config;
    frontendAppConfigs: AppConfig[];
};
export declare type BackendBundlingOptions = {
    checksEnabled: boolean;
    isDev: boolean;
    parallelism?: number;
    inspectEnabled: boolean;
    inspectBrkEnabled: boolean;
};
export declare type BackendServeOptions = BundlingPathsOptions & {
    checksEnabled: boolean;
    inspectEnabled: boolean;
    inspectBrkEnabled: boolean;
};
