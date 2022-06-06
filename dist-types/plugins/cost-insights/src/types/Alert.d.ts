import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { ChangeStatistic } from './ChangeStatistic';
import { Duration } from './Duration';
import { Maybe } from './Maybe';
/**
 * Generic alert type with required fields for display. The `element` field will be rendered in
 * the Cost Insights "Action Items" section. This should use data fetched in the CostInsightsApi
 * implementation to render an InfoCard or other visualization.
 *
 * The alert type exposes hooks which can be used to enable and access various events,
 * such as when a user dismisses or snoozes an alert. Default forms and buttons
 * will be rendered if a hook is defined.
 *
 * Each default form can be overridden with a custom component. It must be implemented using
 * React.forwardRef. See https://reactjs.org/docs/forwarding-refs
 *
 * Errors thrown within hooks will generate a snackbar error notification.
 */
export declare type Alert = {
    title: string | JSX.Element;
    subtitle: string | JSX.Element;
    element?: JSX.Element;
    status?: AlertStatus;
    url?: string;
    buttonText?: string;
    SnoozeForm?: Maybe<AlertForm>;
    AcceptForm?: Maybe<AlertForm>;
    DismissForm?: Maybe<AlertForm>;
    onSnoozed?(options: AlertOptions): Promise<Alert[]>;
    onAccepted?(options: AlertOptions): Promise<Alert[]>;
    onDismissed?(options: AlertOptions): Promise<Alert[]>;
};
export declare type AlertForm<A extends Alert = any, Data = any> = ForwardRefExoticComponent<AlertFormProps<A, Data> & RefAttributes<HTMLFormElement>>;
export interface AlertOptions<T = any> {
    data: T;
    group: string;
}
/**
 * Default snooze form intervals are expressed using an ISO 8601 repeating interval string.
 * For example, R1/P7D/2020-09-02 for 1 week or R1/P30D/2020-09-02 for 1 month.
 *
 * For example, if a user dismisses an alert on Monday January 01 for 1 week,
 * it can be re-served on Monday, January 08. 7 calendar days from January 02,
 * inclusive of the last day.
 *
 * https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
 */
export interface AlertSnoozeFormData {
    intervals: string;
}
export interface AlertDismissFormData {
    other: Maybe<string>;
    reason: AlertDismissReason;
    feedback: Maybe<string>;
}
export declare enum AlertStatus {
    Snoozed = "snoozed",
    Accepted = "accepted",
    Dismissed = "dismissed"
}
export declare type AlertFormProps<A extends Alert, FormData = {}> = {
    alert: A;
    onSubmit: (data: FormData) => void;
    disableSubmit: (isDisabled: boolean) => void;
};
export interface AlertDismissOption {
    label: string;
    reason: string;
}
export declare enum AlertDismissReason {
    Other = "other",
    Resolved = "resolved",
    Expected = "expected",
    Seasonal = "seasonal",
    Migration = "migration",
    NotApplicable = "not-applicable"
}
export declare const AlertDismissOptions: AlertDismissOption[];
export declare type AlertSnoozeOption = {
    label: string;
    duration: Duration;
};
export declare const AlertSnoozeOptions: AlertSnoozeOption[];
export interface AlertCost {
    id: string;
    aggregation: [number, number];
}
export interface ResourceData {
    previous: number;
    current: number;
    name: Maybe<string>;
}
export interface BarChartOptions {
    previousFill: string;
    currentFill: string;
    previousName: string;
    currentName: string;
}
/** deprecated use BarChartOptions instead */
export interface BarChartData extends BarChartOptions {
}
export declare enum DataKey {
    Previous = "previous",
    Current = "current",
    Name = "name"
}
export interface ProjectGrowthData {
    project: string;
    periodStart: string;
    periodEnd: string;
    aggregation: [number, number];
    change: ChangeStatistic;
    products: Array<AlertCost>;
}
export interface UnlabeledDataflowData {
    periodStart: string;
    periodEnd: string;
    projects: Array<UnlabeledDataflowAlertProject>;
    unlabeledCost: number;
    labeledCost: number;
}
export interface UnlabeledDataflowAlertProject {
    id: string;
    unlabeledCost: number;
    labeledCost: number;
}
