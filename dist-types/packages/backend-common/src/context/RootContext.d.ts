import { AbortSignal } from 'node-abort-controller';
import { Context } from './types';
/**
 * An empty root context.
 */
export declare class RootContext implements Context {
    readonly abortSignal: AbortSignal;
    readonly deadline: undefined;
    value<T = unknown>(_key: string): T | undefined;
}
