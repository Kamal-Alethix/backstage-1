import { DateAggregation, Trendline, ChartData } from '../types';
export declare function trendFrom(trendline: Trendline, date: number): number;
export declare function groupByDate(acc: Record<string, number>, entry: DateAggregation): Record<string, number>;
export declare function toMaxCost(acc: ChartData, entry: ChartData): ChartData;
export declare function toDataMax(metric: string, data: ChartData[]): number;
