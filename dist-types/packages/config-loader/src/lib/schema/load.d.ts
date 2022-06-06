import { JsonObject } from '@backstage/types';
import { ConfigSchema } from './types';
/**
 * Options that control the loading of configuration schema files in the backend.
 *
 * @public
 */
export declare type LoadConfigSchemaOptions = {
    dependencies: string[];
    packagePaths?: string[];
} | {
    serialized: JsonObject;
};
/**
 * Loads config schema for a Backstage instance.
 *
 * @public
 */
export declare function loadConfigSchema(options: LoadConfigSchemaOptions): Promise<ConfigSchema>;
