import { BaseFilter, FilterType, PullRequestFilter } from './types';
export declare type CreatedByTeamsFilter = BaseFilter & (({
    type: FilterType.CreatedByTeams;
} & ({
    teamIds: string[];
} | {
    teamNames: string[];
})) | {
    type: FilterType.CreatedByCurrentUsersTeams;
    teamIds?: string[];
});
export declare function createCreatedByTeamsFilter(filter: CreatedByTeamsFilter): PullRequestFilter;
