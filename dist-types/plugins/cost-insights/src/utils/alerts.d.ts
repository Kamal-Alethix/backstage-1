import { Alert, AlertForm, AlertStatus, Maybe } from '../types';
export declare const isAlertActive: (alert: Alert) => boolean;
export declare const isAlertSnoozed: (alert: Alert) => boolean;
export declare const isAlertAccepted: (alert: Alert) => boolean;
export declare const isAlertDismissed: (alert: Alert) => boolean;
export declare const isStatusSnoozed: (s: Maybe<AlertStatus>) => boolean;
export declare const isStatusAccepted: (s: Maybe<AlertStatus>) => boolean;
export declare const isStatusDismissed: (s: Maybe<AlertStatus>) => boolean;
export declare const isSnoozeEnabled: (alert: Maybe<Alert>) => boolean;
export declare const isAcceptEnabled: (alert: Maybe<Alert>) => boolean;
export declare const isDismissEnabled: (alert: Maybe<Alert>) => boolean;
export declare const isSnoozeFormEnabled: (alert: Maybe<Alert>) => boolean;
export declare const isAcceptFormEnabled: (alert: Maybe<Alert>) => boolean;
export declare const isDismissFormEnabled: (alert: Maybe<Alert>) => boolean;
/**
 * Utility for determining if a form is disabled.
 * When a form is disabled, the dialog button's type should convert from submit to button.
 * @param alert
 * @param status
 */
export declare const isFormDisabled: (alert: Maybe<Alert>, status: Maybe<AlertStatus>) => boolean;
export declare function formOf(alert: Maybe<Alert>, status: Maybe<AlertStatus>): Maybe<AlertForm>;
/**
 * Utility for choosing from a fixed set of values for a given alert status.
 * @param status
 * @param values
 */
export declare function choose<T>(status: Maybe<AlertStatus>, values: [T, T, T], none: T): T;
export declare function hasProperty(alert: Maybe<Alert>, prop: keyof Alert): boolean;
export declare const sumOfAllAlerts: (sum: number, alerts: Alert[]) => number;
