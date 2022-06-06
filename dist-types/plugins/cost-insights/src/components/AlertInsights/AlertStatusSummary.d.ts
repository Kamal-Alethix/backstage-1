/// <reference types="react" />
import { Alert } from '../../types';
declare type AlertStatusSummaryProps = {
    open: boolean;
    snoozed: Alert[];
    accepted: Alert[];
    dismissed: Alert[];
};
export declare const AlertStatusSummary: ({ open, snoozed, accepted, dismissed, }: AlertStatusSummaryProps) => JSX.Element;
export {};
