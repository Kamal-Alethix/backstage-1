/// <reference types="react" />
import { Cost, Maybe, MetricData } from '../../types';
export declare type CostOverviewCardProps = {
    dailyCostData: Cost;
    metricData: Maybe<MetricData>;
};
export declare const CostOverviewCard: ({ dailyCostData, metricData, }: CostOverviewCardProps) => JSX.Element;
