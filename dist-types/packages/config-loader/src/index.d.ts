/**
 * Config loading functionality used by Backstage backend, and CLI
 *
 * @packageDocumentation
 */
export { readEnvConfig, loadConfigSchema, mergeConfigSchemas } from './lib';
export type { ConfigSchema, ConfigSchemaProcessingOptions, ConfigVisibility, LoadConfigSchemaOptions, TransformFunc, } from './lib';
export { loadConfig } from './loader';
export type { ConfigTarget, LoadConfigOptions, LoadConfigOptionsWatch, LoadConfigOptionsRemote, LoadConfigResult, } from './loader';
