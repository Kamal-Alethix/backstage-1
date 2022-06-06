import { CustomErrorBase } from './CustomErrorBase';
/**
 * The given inputs are malformed and cannot be processed.
 *
 * @public
 */
export declare class InputError extends CustomErrorBase {
}
/**
 * The request requires authentication, which was not properly supplied.
 *
 * @public
 */
export declare class AuthenticationError extends CustomErrorBase {
}
/**
 * The authenticated caller is not allowed to perform this request.
 *
 * @public
 */
export declare class NotAllowedError extends CustomErrorBase {
}
/**
 * The requested resource could not be found.
 *
 * Note that this error usually is used to indicate that an entity with a given
 * ID does not exist, rather than signalling that an entire route is missing.
 *
 * @public
 */
export declare class NotFoundError extends CustomErrorBase {
}
/**
 * The request could not complete due to a conflict in the current state of the
 * resource.
 *
 * @public
 */
export declare class ConflictError extends CustomErrorBase {
}
/**
 * The requested resource has not changed since last request.
 *
 * @public
 */
export declare class NotModifiedError extends CustomErrorBase {
}
/**
 * An error that forwards an underlying cause with additional context in the message.
 *
 * The `name` property of the error will be inherited from the `cause` if
 * possible, and will otherwise be set to `'Error'`.
 *
 * @public
 */
export declare class ForwardedError extends CustomErrorBase {
    constructor(message: string, cause: Error | unknown);
}
