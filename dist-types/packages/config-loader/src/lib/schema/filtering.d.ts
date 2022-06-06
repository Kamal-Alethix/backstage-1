import { JsonObject } from '@backstage/types';
import { ConfigVisibility, TransformFunc, ValidationError } from './types';
/**
 * This filters data by visibility by discovering the visibility of each
 * value, and then only keeping the ones that are specified in `includeVisibilities`.
 */
export declare function filterByVisibility(data: JsonObject, includeVisibilities: ConfigVisibility[], visibilityByDataPath: Map<string, ConfigVisibility>, deprecationByDataPath: Map<string, string>, transformFunc?: TransformFunc<number | string | boolean>, withFilteredKeys?: boolean, withDeprecatedKeys?: boolean): {
    data: JsonObject;
    filteredKeys?: string[];
    deprecatedKeys?: {
        key: string;
        description: string;
    }[];
};
export declare function filterErrorsByVisibility(errors: ValidationError[] | undefined, includeVisibilities: ConfigVisibility[] | undefined, visibilityByDataPath: Map<string, ConfigVisibility>, visibilityBySchemaPath: Map<string, ConfigVisibility>): ValidationError[];
