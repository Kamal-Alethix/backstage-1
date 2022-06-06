/// <reference types="react" />
import { ChangeStatistic, Duration } from '../../types';
export declare type CostGrowthProps = {
    change: ChangeStatistic;
    duration: Duration;
};
export declare const CostGrowth: ({ change, duration }: CostGrowthProps) => JSX.Element;
