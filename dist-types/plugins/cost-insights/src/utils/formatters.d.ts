import { ChangeStatistic, Duration } from '../types';
export declare type Period = {
    periodStart: string;
    periodEnd: string;
};
export declare const costFormatter: Intl.NumberFormat;
export declare const currencyFormatter: Intl.NumberFormat;
export declare const lengthyCurrencyFormatter: Intl.NumberFormat;
export declare const numberFormatter: Intl.NumberFormat;
export declare const monthFormatter: Intl.DateTimeFormat;
export declare const dateFormatter: Intl.DateTimeFormat;
export declare const monthOf: (date: string) => string;
export declare const quarterOf: (date: string) => string;
export declare function formatCurrency(amount: number, currency?: string): string;
export declare function formatChange(change: ChangeStatistic): string;
export declare function formatPercent(n: number): string;
export declare function formatLastTwoLookaheadQuarters(inclusiveEndDate: string): string;
export declare function formatPeriod(duration: Duration, date: string, isEndDate: boolean): string;
