import { PropsWithChildren } from 'react';
import { MetricData, Maybe, Cost, Metric } from '../../types';
declare type CostOverviewLegendProps = {
    metric: Maybe<Metric>;
    metricData: Maybe<MetricData>;
    dailyCostData: Cost;
};
export declare const CostOverviewLegend: ({ dailyCostData, metric, metricData, }: PropsWithChildren<CostOverviewLegendProps>) => JSX.Element;
export {};
