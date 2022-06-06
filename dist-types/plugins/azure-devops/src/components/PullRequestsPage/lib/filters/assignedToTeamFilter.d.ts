import { BaseFilter, FilterType, PullRequestFilter } from './types';
export declare type AssignedToTeamFilter = BaseFilter & {
    type: FilterType.AssignedToTeam;
    teamId: string;
};
export declare function createAssignedToTeamFilter(filter: AssignedToTeamFilter): PullRequestFilter;
