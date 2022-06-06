import { ErrorApi, ErrorApiError, ErrorApiErrorContext } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
/**
 * Base implementation for the ErrorApi that simply forwards errors to consumers.
 *
 * @public
 */
export declare class ErrorApiForwarder implements ErrorApi {
    private readonly subject;
    post(error: ErrorApiError, context?: ErrorApiErrorContext): void;
    error$(): Observable<{
        error: Error;
        context?: ErrorApiErrorContext;
    }>;
}
