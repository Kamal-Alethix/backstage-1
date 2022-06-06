import { TransformFunc, EnvFunc, ReadFileFunc } from './types';
/**
 * Transforms a include description into the actual included value.
 */
export declare function createIncludeTransform(env: EnvFunc, readFile: ReadFileFunc, substitute: TransformFunc): TransformFunc;
