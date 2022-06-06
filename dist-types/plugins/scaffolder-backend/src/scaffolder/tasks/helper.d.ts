import { Schema } from 'jsonschema';
/**
 * Returns true if the input is not `false`, `undefined`, `null`, `""`, `0`, or
 * `[]`. This behavior is based on the behavior of handlebars, see
 * https://handlebarsjs.com/guide/builtin-helpers.html#if
 */
export declare function isTruthy(value: any): boolean;
export declare function generateExampleOutput(schema: Schema): unknown;
