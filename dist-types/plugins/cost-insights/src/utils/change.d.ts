import { Cost, ChangeStatistic, GrowthType, MetricData, Duration, DateAggregation } from '../types';
export declare function growthOf(change: ChangeStatistic): GrowthType;
export declare function getComparedChange(dailyCost: Cost, metricData: MetricData, duration: Duration, lastCompleteBillingDate: string): ChangeStatistic;
export declare function getPreviousPeriodTotalCost(aggregation: DateAggregation[], duration: Duration, inclusiveEndDate: string): number;
export declare function choose<T>([savings, excess]: [T, T], change: ChangeStatistic): T;
