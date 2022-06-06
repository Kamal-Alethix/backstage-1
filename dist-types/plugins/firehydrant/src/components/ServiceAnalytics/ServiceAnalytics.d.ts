/// <reference types="react" />
import { DateTime } from 'luxon';
export declare const DenseTable: ({ service, startDate, endDate, }: {
    service: object;
    startDate: DateTime;
    endDate: DateTime;
}) => JSX.Element;
export declare const secondsToDhms: (seconds: number) => string;
export declare const truncateNum: (num: number) => string;
export declare const calcHealthiness: ({ mttm, incidents, range, }: {
    mttm: number;
    incidents: number;
    range: number;
}) => string;
declare type AnalyticsDataType = {
    id?: string;
    count?: number;
    mttd?: number;
    mtta?: number;
    mttm?: number;
    mttr?: number;
    total_time?: number;
};
export declare const ServiceAnalytics: ({ value, loading, error, }: {
    value: AnalyticsDataType;
    loading: boolean;
    error: any;
}) => JSX.Element | null;
export {};
