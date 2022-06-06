import { JsonObject, JsonValue } from '@backstage/types';
import { TransformFunc } from './types';
/**
 * Applies a set of transforms to raw configuration data.
 */
export declare function applyConfigTransforms(initialDir: string, input: JsonValue, transforms: TransformFunc[]): Promise<JsonObject>;
