/// <reference types="react" />
import { Cost, Maybe, Metric, MetricData } from '../../types';
declare type CostOverviewChartProps = {
    metric: Maybe<Metric>;
    metricData: Maybe<MetricData>;
    dailyCostData: Cost;
    responsive?: boolean;
};
export declare const CostOverviewChart: ({ dailyCostData, metric, metricData, responsive, }: CostOverviewChartProps) => JSX.Element;
export {};
