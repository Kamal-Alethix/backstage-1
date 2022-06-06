/// <reference types="react" />
import { Alert } from '../../types';
declare type AlertInsightsSectionProps = {
    alert: Alert;
    number: number;
    onSnooze: (alert: Alert) => void;
    onAccept: (alert: Alert) => void;
    onDismiss: (alert: Alert) => void;
};
export declare const AlertInsightsSection: ({ alert, number, onSnooze, onAccept, onDismiss, }: AlertInsightsSectionProps) => JSX.Element;
export {};
