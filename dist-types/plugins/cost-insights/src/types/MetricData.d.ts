import { DateAggregation } from './DateAggregation';
import { ChangeStatistic } from './ChangeStatistic';
export interface MetricData {
    id: string;
    format: 'number' | 'currency';
    aggregation: DateAggregation[];
    change: ChangeStatistic;
}
