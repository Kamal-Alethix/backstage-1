/// <reference types="react" />
import { CostInsightsApi } from '../../api';
import { Alert, AlertForm, AlertOptions, AlertSnoozeFormData, ChangeStatistic, Entity } from '../../types';
import { KubernetesMigrationDismissFormData } from '../forms';
export interface KubernetesMigrationData {
    startDate: string;
    endDate: string;
    change: ChangeStatistic;
    services: Array<Entity>;
}
export interface KubernetesMigrationApi extends Alert {
    api: CostInsightsApi;
    data: KubernetesMigrationData;
}
/**
 * This is an example of an Alert implementation using optional event hooks.
 *
 * Event hooks can be used to enable users to dismiss, snooze, or accept an action item
 * - or any combination thereof. Defining a hook will generate default UI - button, dialog and
 * form. Cost Insights does not preserve client side alert state - each hook is expected to return a new set of alerts.
 *
 * Snoozed, accepted, etc. alerts should define a corresponding status property. Alerts will be aggregated
 * by status in a collapsed view below Alert Insights section and a badge will appear in Action Items
 * showing the total alerts of that status.
 *
 * Customizing Alerts
 * Default forms can be overridden in two ways - by setting a form property to null or defining a custom component.
 *
 * If a form property is set to null, the Dialog will not render a form. This can be useful in scenarios
 * where data isn't needed from the user such as when a user accepts an action item's recommendation.
 *
 * If a form property is set to a React component, the Dialog will render the form component in place of the default form.
 * Form components must return valid form elements, and accept a ref and onSubmit event handler.
 * Custom forms must implement the corresponding event hook. See /forms for example implementations.
 */
export declare class KubernetesMigrationAlert implements KubernetesMigrationApi {
    api: CostInsightsApi;
    data: KubernetesMigrationData;
    subtitle: string;
    AcceptForm: null;
    DismissForm: AlertForm<KubernetesMigrationAlert, KubernetesMigrationDismissFormData>;
    constructor(api: CostInsightsApi, data: KubernetesMigrationData);
    get title(): JSX.Element;
    get element(): JSX.Element;
    onDismissed(options: AlertOptions<KubernetesMigrationDismissFormData>): Promise<Alert[]>;
    onSnoozed(options: AlertOptions<AlertSnoozeFormData>): Promise<Alert[]>;
    onAccepted(options: AlertOptions<null>): Promise<Alert[]>;
}
