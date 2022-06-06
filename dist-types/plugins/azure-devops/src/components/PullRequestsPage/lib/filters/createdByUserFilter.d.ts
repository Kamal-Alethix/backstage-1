import { BaseFilter, FilterType, PullRequestFilter } from './types';
export declare type CreatedByUserFilter = BaseFilter & ({
    type: FilterType.CreatedByUser;
    email: string;
} | {
    type: FilterType.CreatedByCurrentUser;
    email?: string;
});
export declare function createCreatedByUserFilter(filter: CreatedByUserFilter): PullRequestFilter;
