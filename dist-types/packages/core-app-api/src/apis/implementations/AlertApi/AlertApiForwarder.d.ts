import { AlertApi, AlertMessage } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
/**
 * Base implementation for the AlertApi that simply forwards alerts to consumers.
 *
 * @public
 */
export declare class AlertApiForwarder implements AlertApi {
    private readonly subject;
    post(alert: AlertMessage): void;
    alert$(): Observable<AlertMessage>;
}
