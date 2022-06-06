import { AbortSignal } from 'node-abort-controller';
import { Context } from './types';
/**
 * A context that just holds a single value, and delegates the rest to its
 * parent.
 */
export declare class ValueContext implements Context {
    private readonly _parent;
    private readonly _key;
    private readonly _value;
    static forConstantValue(ctx: Context, key: string, value: unknown): Context;
    constructor(_parent: Context, _key: string, _value: unknown);
    get abortSignal(): AbortSignal;
    get deadline(): Date | undefined;
    value<T = unknown>(key: string): T | undefined;
}
