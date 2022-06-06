import { Counter, CounterConfiguration, Gauge, GaugeConfiguration, Histogram, HistogramConfiguration, Summary, SummaryConfiguration } from 'prom-client';
export declare function createCounterMetric<T extends string>(config: CounterConfiguration<T>): Counter<T>;
export declare function createGaugeMetric<T extends string>(config: GaugeConfiguration<T>): Gauge<T>;
export declare function createSummaryMetric<T extends string>(config: SummaryConfiguration<T>): Summary<T>;
export declare function createHistogramMetric<T extends string>(config: HistogramConfiguration<T>): Histogram<T>;
