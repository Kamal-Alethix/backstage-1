import { ErrorApi, ErrorApiErrorContext } from '@backstage/core-plugin-api';
/**
 * Utility class that helps with error forwarding.
 *
 * @public
 */
export declare class UnhandledErrorForwarder {
    /**
     * Add event listener, such that unhandled errors can be forwarded using an given `ErrorApi` instance
     */
    static forward(errorApi: ErrorApi, errorContext: ErrorApiErrorContext): void;
}
