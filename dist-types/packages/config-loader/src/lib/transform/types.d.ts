import { JsonValue } from '@backstage/types';
export declare type EnvFunc = (name: string) => Promise<string | undefined>;
export declare type ReadFileFunc = (path: string) => Promise<string>;
export declare type TransformFunc = (value: JsonValue, baseDir: string) => Promise<{
    applied: false;
} | {
    applied: true;
    value: JsonValue | undefined;
    newBaseDir?: string | undefined;
}>;
