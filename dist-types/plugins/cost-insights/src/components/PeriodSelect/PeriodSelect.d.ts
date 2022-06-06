/// <reference types="react" />
import { Duration } from '../../types';
export declare type PeriodOption = {
    value: Duration;
    label: string;
};
export declare function getDefaultOptions(lastCompleteBillingDate: string): PeriodOption[];
declare type PeriodSelectProps = {
    duration: Duration;
    onSelect: (duration: Duration) => void;
    options?: PeriodOption[];
};
export declare const PeriodSelect: ({ duration, onSelect, options, }: PeriodSelectProps) => JSX.Element;
export {};
