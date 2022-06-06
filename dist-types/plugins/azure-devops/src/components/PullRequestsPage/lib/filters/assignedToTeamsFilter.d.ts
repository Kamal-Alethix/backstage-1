import { BaseFilter, FilterType, PullRequestFilter } from './types';
export declare type AssignedToTeamsFilter = BaseFilter & ({
    type: FilterType.AssignedToTeams;
    teamIds: string[];
} | {
    type: FilterType.AssignedToCurrentUsersTeams;
    teamIds?: string[];
});
export declare function createAssignedToTeamsFilter(filter: AssignedToTeamsFilter): PullRequestFilter;
