import { DateAggregation } from './DateAggregation';
import { ChangeStatistic } from './ChangeStatistic';
import { Trendline } from './Trendline';
export interface Cost {
    id: string;
    aggregation: DateAggregation[];
    change?: ChangeStatistic;
    trendline?: Trendline;
    groupedCosts?: Record<string, Cost[]>;
}
