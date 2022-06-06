/// <reference types="react" />
import { Alert } from '../../types';
declare type AlertInsightsProps = {
    group: string;
    active: Alert[];
    snoozed: Alert[];
    accepted: Alert[];
    dismissed: Alert[];
    onChange: (alerts: Alert[]) => void;
};
export declare const AlertInsights: ({ group, active, snoozed, accepted, dismissed, onChange, }: AlertInsightsProps) => JSX.Element;
export {};
