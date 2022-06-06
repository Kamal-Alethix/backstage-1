import { AppConfig } from '@backstage/config';
import { JsonObject } from '@backstage/types';
/**
 * An sub-set of configuration schema.
 */
export declare type ConfigSchemaPackageEntry = {
    /**
     * The configuration schema itself.
     */
    value: JsonObject;
    /**
     * The relative path that the configuration schema was discovered at.
     */
    path: string;
};
/**
 * A list of all possible configuration value visibilities.
 */
export declare const CONFIG_VISIBILITIES: readonly ["frontend", "backend", "secret"];
/**
 * A type representing the possible configuration value visibilities
 *
 * @public
 */
export declare type ConfigVisibility = 'frontend' | 'backend' | 'secret';
/**
 * The default configuration visibility if no other values is given.
 */
export declare const DEFAULT_CONFIG_VISIBILITY: ConfigVisibility;
/**
 * An explanation of a configuration validation error.
 */
export declare type ValidationError = {
    keyword: string;
    instancePath: string;
    schemaPath: string;
    params: Record<string, any>;
    propertyName?: string;
    message?: string;
};
/**
 * The result of validating configuration data using a schema.
 */
declare type ValidationResult = {
    /**
     * Errors that where emitted during validation, if any.
     */
    errors?: ValidationError[];
    /**
     * The configuration visibilities that were discovered during validation.
     *
     * The path in the key uses the form `/<key>/<sub-key>/<array-index>/<leaf-key>`
     */
    visibilityByDataPath: Map<string, ConfigVisibility>;
    /**
     * The configuration visibilities that were discovered during validation.
     *
     * The path in the key uses the form `/properties/<key>/items/additionalProperties/<leaf-key>`
     */
    visibilityBySchemaPath: Map<string, ConfigVisibility>;
    /**
     * The deprecated options that were discovered during validation.
     *
     * The path in the key uses the form `/<key>/<sub-key>/<array-index>/<leaf-key>`
     */
    deprecationByDataPath: Map<string, string>;
};
/**
 * A function used validate configuration data.
 */
export declare type ValidationFunc = (configs: AppConfig[]) => ValidationResult;
/**
 * A function used to transform primitive configuration values.
 *
 * @public
 */
export declare type TransformFunc<T extends number | string | boolean> = (value: T, context: {
    visibility: ConfigVisibility;
}) => T | undefined;
/**
 * Options used to process configuration data with a schema.
 *
 * @public
 */
export declare type ConfigSchemaProcessingOptions = {
    /**
     * The visibilities that should be included in the output data.
     * If omitted, the data will not be filtered by visibility.
     */
    visibility?: ConfigVisibility[];
    /**
     * When set to `true`, any schema errors in the provided configuration will be ignored.
     */
    ignoreSchemaErrors?: boolean;
    /**
     * A transform function that can be used to transform primitive configuration values
     * during validation. The value returned from the transform function will be used
     * instead of the original value. If the transform returns `undefined`, the value
     * will be omitted.
     */
    valueTransform?: TransformFunc<any>;
    /**
     * Whether or not to include the `filteredKeys` property in the output `AppConfig`s.
     *
     * Default: `false`.
     */
    withFilteredKeys?: boolean;
    /**
     * Whether or not to include the `deprecatedKeys` property in the output `AppConfig`s.
     *
     * Default: `true`.
     */
    withDeprecatedKeys?: boolean;
};
/**
 * A loaded configuration schema that is ready to process configuration data.
 *
 * @public
 */
export declare type ConfigSchema = {
    process(appConfigs: AppConfig[], options?: ConfigSchemaProcessingOptions): AppConfig[];
    serialize(): JsonObject;
};
export {};
