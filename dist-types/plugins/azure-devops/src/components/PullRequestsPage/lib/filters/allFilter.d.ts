import { BaseFilter, FilterType, PullRequestFilter } from './types';
export declare type AllFilter = BaseFilter & {
    type: FilterType.All;
};
export declare function createAllFilter(): PullRequestFilter;
