import { ApiRef } from '../system';
import { Observable } from '@backstage/types';
/**
 * Message handled by the {@link AlertApi}.
 *
 * @public
 */
export declare type AlertMessage = {
    message: string;
    severity?: 'success' | 'info' | 'warning' | 'error';
};
/**
 * The alert API is used to report alerts to the app, and display them to the user.
 *
 * @public
 */
export declare type AlertApi = {
    /**
     * Post an alert for handling by the application.
     */
    post(alert: AlertMessage): void;
    /**
     * Observe alerts posted by other parts of the application.
     */
    alert$(): Observable<AlertMessage>;
};
/**
 * The {@link ApiRef} of {@link AlertApi}.
 *
 * @public
 */
export declare const alertApiRef: ApiRef<AlertApi>;
