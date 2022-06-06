/**
 * Runs a function repeatedly, with a fixed wait between invocations.
 *
 * Supports async functions, and silently ignores exceptions and rejections.
 *
 * @param fn - The function to run. May return a Promise.
 * @param delayMs - The delay between a completed function invocation and the
 *                next.
 * @returns A function that, when called, stops the invocation loop.
 */
export declare function runPeriodically(fn: () => any, delayMs: number): () => void;
