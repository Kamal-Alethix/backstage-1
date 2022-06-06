import { AbortController, AbortSignal } from 'node-abort-controller';
import { Context } from './types';
/**
 * A context that implements various abort related functionality.
 */
export declare class AbortContext implements Context {
    private readonly parent;
    readonly abortSignal: AbortSignal;
    readonly deadline: Date | undefined;
    /**
     * Abort either when the parent aborts, or after the given timeout has
     * expired.
     *
     * @param ctx - The parent context
     * @param timeout - A timeout value, in milliseconds
     * @returns A new context
     */
    static forTimeoutMillis(ctx: Context, timeout: number): Context;
    /**
     * Abort either when the parent aborts, or when the given controller is
     * triggered.
     *
     * @remarks
     *
     * If you have access to the controller, this function is more efficient than
     * {@link AbortContext#forSignal}.
     *
     * @param ctx - The parent context
     * @param controller - An abort controller
     * @returns A new context
     */
    static forController(ctx: Context, controller: AbortController): Context;
    /**
     * Abort either when the parent aborts, or when the given signal is triggered.
     *
     * @remarks
     *
     * If you have access to the controller and not just the signal,
     * {@link AbortContext#forController} is slightly more efficient to use.
     *
     * @param ctx - The parent context
     * @param signal - An abort signal
     * @returns A new context
     */
    static forSignal(ctx: Context, signal: AbortSignal): Context;
    private constructor();
    value<T = unknown>(key: string): T | undefined;
}
