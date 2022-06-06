import { Logger } from 'winston';
import { AppConfig, Config } from '@backstage/config';
declare type InjectOptions = {
    appConfigs: AppConfig[];
    staticDir: string;
    logger: Logger;
};
/**
 * Injects configs into the app bundle, replacing any existing injected config.
 */
export declare function injectConfig(options: InjectOptions): Promise<void>;
declare type ReadOptions = {
    env: {
        [name: string]: string | undefined;
    };
    appDistDir: string;
    config: Config;
};
/**
 * Read config from environment and process the backend config using the
 * schema that is embedded in the frontend build.
 */
export declare function readConfigs(options: ReadOptions): Promise<AppConfig[]>;
export {};
