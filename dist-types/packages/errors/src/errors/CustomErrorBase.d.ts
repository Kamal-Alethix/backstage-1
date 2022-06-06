/**
 * A base class that custom Error classes can inherit from.
 *
 * @public
 * @example
 *```ts
 * class MyCustomError extends CustomErrorBase {}
 *
 * const e = new MyCustomError('Some message', cause);
 * // e.name === 'MyCustomError'
 * // e.message === 'Some message'
 * // e.cause === cause
 * // e.stack is set if the runtime supports it
 * ```
 */
export declare class CustomErrorBase extends Error {
    /**
     * An inner error that caused this error to be thrown, if any.
     */
    readonly cause?: Error | undefined;
    constructor(message?: string, cause?: Error | unknown);
}
