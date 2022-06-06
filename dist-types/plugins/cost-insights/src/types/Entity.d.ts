import { ChangeStatistic } from './ChangeStatistic';
import { Maybe } from './Maybe';
export interface Entity {
    id: Maybe<string>;
    aggregation: [number, number];
    entities: Record<string, Entity[]>;
    change: ChangeStatistic;
}
