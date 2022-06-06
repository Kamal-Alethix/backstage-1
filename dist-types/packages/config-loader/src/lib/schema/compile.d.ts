import { JSONSchema7 as JSONSchema } from 'json-schema';
import { ConfigSchemaPackageEntry, ValidationFunc } from './types';
/**
 * This takes a collection of Backstage configuration schemas from various
 * sources and compiles them down into a single schema validation function.
 *
 * It also handles the implementation of the custom "visibility" keyword used
 * to specify the scope of different config paths.
 */
export declare function compileConfigSchemas(schemas: ConfigSchemaPackageEntry[]): ValidationFunc;
/**
 * Given a list of configuration schemas from packages, merge them
 * into a single json schema.
 *
 * @public
 */
export declare function mergeConfigSchemas(schemas: JSONSchema[]): JSONSchema;
