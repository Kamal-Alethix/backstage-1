import { Maybe } from './Maybe';
import { Duration } from './Duration';
export interface PageFilters {
    group: Maybe<string>;
    project: Maybe<string>;
    duration: Duration;
    metric: string | null;
}
export declare type ProductFilters = Array<ProductPeriod>;
export interface ProductPeriod {
    duration: Duration;
    productType: string;
}
