/// <reference types="react" />
import { Maybe, Metric } from '../../types';
export declare type MetricSelectProps = {
    metric: Maybe<string>;
    metrics: Array<Metric>;
    onSelect: (metric: Maybe<string>) => void;
};
export declare const MetricSelect: ({ metric, metrics, onSelect, }: MetricSelectProps) => JSX.Element;
