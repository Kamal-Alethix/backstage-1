import { ErrorApi, ErrorApiError, ErrorApiErrorContext } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
/**
 * Constructor arguments for {@link MockErrorApi}
 * @public
 */
export declare type MockErrorApiOptions = {
    collect?: boolean;
};
/**
 * ErrorWithContext contains error and ErrorApiErrorContext
 * @public
 */
export declare type ErrorWithContext = {
    error: ErrorApiError;
    context?: ErrorApiErrorContext;
};
/**
 * Mock implementation of the {@link core-plugin-api#ErrorApi} to be used in tests.
 * Includes withForError and getErrors methods for error testing.
 * @public
 */
export declare class MockErrorApi implements ErrorApi {
    private readonly options;
    private readonly errors;
    private readonly waiters;
    constructor(options?: MockErrorApiOptions);
    post(error: ErrorApiError, context?: ErrorApiErrorContext): void;
    error$(): Observable<{
        error: ErrorApiError;
        context?: ErrorApiErrorContext;
    }>;
    getErrors(): ErrorWithContext[];
    waitForError(pattern: RegExp, timeoutMs?: number): Promise<ErrorWithContext>;
}
