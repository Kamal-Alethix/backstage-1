import { JsonObject } from '@backstage/types';
/**
 * The serialized form of an Error.
 *
 * @public
 */
export declare type SerializedError = JsonObject & {
    /** The name of the exception that was thrown */
    name: string;
    /** The message of the exception that was thrown */
    message: string;
    /** A stringified stack trace; may not be present */
    stack?: string;
    /** A custom code (not necessarily the same as an HTTP response code); may not be present */
    code?: string;
};
/**
 * Serializes an error object to a JSON friendly form.
 *
 * @public
 * @param error - The error.
 * @param options - Optional serialization options.
 */
export declare function serializeError(error: Error, options?: {
    /** Include stack trace in the output (default false) */
    includeStack?: boolean;
}): SerializedError;
/**
 * Deserializes a serialized error object back to an Error.
 *
 * @public
 */
export declare function deserializeError<T extends Error = Error>(data: SerializedError): T;
/**
 * Stringifies an error, including its name and message where available.
 *
 * @param error - The error.
 * @public
 */
export declare function stringifyError(error: unknown): string;
