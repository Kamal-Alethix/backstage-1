import { ErrorApi, ErrorApiError, ErrorApiErrorContext, AlertApi } from '@backstage/core-plugin-api';
/**
 * Decorates an ErrorApi by also forwarding error messages
 * to the alertApi with an 'error' severity.
 *
 * @public
 */
export declare class ErrorAlerter implements ErrorApi {
    private readonly alertApi;
    private readonly errorApi;
    constructor(alertApi: AlertApi, errorApi: ErrorApi);
    post(error: ErrorApiError, context?: ErrorApiErrorContext): void;
    error$(): import("@backstage/types").Observable<{
        error: ErrorApiError;
        context?: ErrorApiErrorContext | undefined;
    }>;
}
