import { Schema, ValidateFunction } from 'ajv';
export declare function throwAjvError(errors: ValidateFunction<unknown>['errors']): never;
export declare function compileAjvSchema(schema: Schema, options?: {
    disableCache?: boolean;
}): ValidateFunction<unknown>;
