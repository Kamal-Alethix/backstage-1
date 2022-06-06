/// <reference types="react" />
import { Duration, Entity } from '../../types';
export declare type ProductInsightsChartProps = {
    billingDate: string;
    entity: Entity;
    duration: Duration;
};
export declare const ProductInsightsChart: ({ billingDate, entity, duration, }: ProductInsightsChartProps) => JSX.Element;
