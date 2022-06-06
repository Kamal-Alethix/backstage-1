import { AppConfigLoader } from './types';
/**
 * The default config loader, which expects that config is available at compile-time
 * in `process.env.APP_CONFIG`. APP_CONFIG should be an array of config objects as
 * returned by the config loader.
 *
 * It will also load runtime config from the __APP_INJECTED_RUNTIME_CONFIG__ string,
 * which can be rewritten at runtime to contain an additional JSON config object.
 * If runtime config is present, it will be placed first in the config array, overriding
 * other config values.
 *
 * @public
 */
export declare const defaultConfigLoader: AppConfigLoader;
