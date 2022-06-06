import { AbortSignal } from 'node-abort-controller';
/**
 * A context that is meant to be passed as a ctx variable down the call chain,
 * to pass along scoped information and abort signals.
 *
 * @alpha
 */
export interface Context {
    /**
     * Returns an abort signal that triggers when the current context or any of
     * its parents signal for it.
     */
    readonly abortSignal: AbortSignal;
    /**
     * The point in time when the current context shall time out and abort, if
     * applicable.
     */
    readonly deadline: Date | undefined;
    /**
     * Attempts to get a stored value by key from the context.
     *
     * @param key - The key of the value to get
     * @returns The associated value, or undefined if not set
     */
    value<T = unknown>(key: string): T | undefined;
}
