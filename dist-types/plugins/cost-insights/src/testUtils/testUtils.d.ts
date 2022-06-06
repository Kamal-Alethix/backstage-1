import { ChangeStatistic, Entity, Trendline, DateAggregation } from '../types';
export declare function aggregationFor(intervals: string, baseline: number): DateAggregation[];
export declare function changeOf(aggregation: DateAggregation[]): ChangeStatistic;
export declare function trendlineOf(aggregation: DateAggregation[]): Trendline;
export declare function entityOf(product: string): Entity;
export declare const getGroupedProducts: (intervals: string) => {
    id: string;
    aggregation: DateAggregation[];
}[];
export declare const getGroupedProjects: (intervals: string) => {
    id: string;
    aggregation: DateAggregation[];
}[];
