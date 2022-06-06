/**
 * An object that is shaped like an `Error`.
 *
 * @public
 */
export declare type ErrorLike = {
    name: string;
    message: string;
    stack?: string;
    [unknownKeys: string]: unknown;
};
/**
 * Checks whether an unknown value is an {@link ErrorLike} object, which guarantees that it's
 * an object that has at least two string properties: a non-empty `name` and `message`.
 *
 * @public
 * @param value - an unknown value
 * @returns true if the value is an {@link ErrorLike} object, false otherwise
 */
export declare function isError(value: unknown): value is ErrorLike;
/**
 * Asserts that an unknown value is an {@link ErrorLike} object, which guarantees that it's
 * an object that has at least two string properties: a non-empty `name` and `message`.
 *
 * If the value is not an {@link ErrorLike} object, an error is thrown.
 *
 * @public
 * @param value - an unknown value
 */
export declare function assertError(value: unknown): asserts value is ErrorLike;
