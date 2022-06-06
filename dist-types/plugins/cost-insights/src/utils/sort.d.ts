import { DateAggregation, ResourceData } from '../types';
import { ProductState } from './loading';
export declare const aggregationSort: (a: DateAggregation, b: DateAggregation) => number;
export declare const resourceSort: (a: ResourceData, b: ResourceData) => number;
export declare function totalAggregationSort(a: ProductState, b: ProductState): number;
