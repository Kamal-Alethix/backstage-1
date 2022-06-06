/// <reference types="react" />
import { Alert } from '../../types';
declare type ActionItemsProps = {
    active: Alert[];
    snoozed: Alert[];
    accepted: Alert[];
    dismissed: Alert[];
};
export declare const ActionItems: ({ active, snoozed, accepted, dismissed, }: ActionItemsProps) => JSX.Element;
export {};
