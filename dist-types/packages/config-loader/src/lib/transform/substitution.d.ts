import { TransformFunc, EnvFunc } from './types';
/**
 * A environment variable substitution transform that transforms e.g. 'token ${MY_TOKEN}'
 * to 'token abc' if MY_TOKEN is 'abc'. If any of the substituted variables are undefined,
 * the entire expression ends up undefined.
 */
export declare function createSubstitutionTransform(env: EnvFunc): TransformFunc;
