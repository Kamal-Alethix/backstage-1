import { ErrorResponseBody } from '../serialization/response';
/**
 * An error thrown as the result of a failed server request.
 *
 * The server is expected to respond on the ErrorResponseBody format.
 *
 * @public
 */
export declare class ResponseError extends Error {
    /**
     * The actual response, as seen by the client.
     *
     * Note that the body of this response is always consumed. Its parsed form is
     * in the `body` field.
     */
    readonly response: Response;
    /**
     * The parsed JSON error body, as sent by the server.
     */
    readonly body: ErrorResponseBody;
    /**
     * The Error cause, as seen by the remote server. This is parsed out of the
     * JSON error body.
     *
     * This error always has the plain Error constructor, however all
     * serializable enumerable fields on the remote error including its name are
     * preserved. Therefore, if you want to check the error type, use its name
     * property rather than checking typeof or its constructor or prototype.
     */
    readonly cause: Error;
    /**
     * Constructs a ResponseError based on a failed response.
     *
     * Assumes that the response has already been checked to be not ok. This
     * function consumes the body of the response, and assumes that it hasn't
     * been consumed before.
     */
    static fromResponse(response: Response): Promise<ResponseError>;
    private constructor();
}
