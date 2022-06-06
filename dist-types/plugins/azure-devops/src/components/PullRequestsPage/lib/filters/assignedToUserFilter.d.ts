import { BaseFilter, FilterType, PullRequestFilter } from './types';
export declare type AssignedToUserFilter = BaseFilter & ({
    type: FilterType.AssignedToUser;
    email: string;
} | {
    type: FilterType.AssignedToCurrentUser;
    email?: string;
});
export declare function createAssignedToUserFilter(filter: AssignedToUserFilter): PullRequestFilter;
