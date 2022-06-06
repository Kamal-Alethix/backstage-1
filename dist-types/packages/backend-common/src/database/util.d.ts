/**
 * Tries to deduce whether a thrown error is a database conflict.
 *
 * @public
 * @param e - A thrown error
 * @returns True if the error looks like it was a conflict error thrown by a
 *          known database engine
 */
export declare function isDatabaseConflictError(e: unknown): boolean;
