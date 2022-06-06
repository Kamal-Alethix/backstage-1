import { ConfigReader } from '@backstage/config';
declare type Options = {
    args: string[];
    fromPackage?: string;
    mockEnv?: boolean;
    withFilteredKeys?: boolean;
    withDeprecatedKeys?: boolean;
    fullVisibility?: boolean;
};
export declare function loadCliConfig(options: Options): Promise<{
    schema: import("@backstage/config-loader").ConfigSchema;
    appConfigs: import("@backstage/config").AppConfig[];
    frontendConfig: ConfigReader;
    frontendAppConfigs: import("@backstage/config").AppConfig[];
}>;
export {};
