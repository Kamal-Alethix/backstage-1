/// <reference types="node" />
import { SpawnOptions, ChildProcess } from 'child_process';
import { LogFunc } from './logging';
declare type SpawnOptionsPartialEnv = Omit<SpawnOptions, 'env'> & {
    env?: Partial<NodeJS.ProcessEnv>;
    stdoutLogFunc?: LogFunc;
    stderrLogFunc?: LogFunc;
};
export declare function run(name: string, args?: string[], options?: SpawnOptionsPartialEnv): Promise<void>;
export declare function runPlain(cmd: string, ...args: string[]): Promise<string>;
export declare function runCheck(cmd: string, ...args: string[]): Promise<boolean>;
export declare function waitForExit(child: ChildProcess & {
    exitCode: number | null;
}, name?: string): Promise<void>;
export {};
