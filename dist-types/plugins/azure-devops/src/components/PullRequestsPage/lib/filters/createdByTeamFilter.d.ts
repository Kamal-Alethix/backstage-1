import { BaseFilter, FilterType, PullRequestFilter } from './types';
export declare type CreatedByTeamFilter = BaseFilter & ({
    type: FilterType.CreatedByTeam;
} & ({
    teamId: string;
} | {
    teamName: string;
}));
export declare function createCreatedByTeamFilter(filter: CreatedByTeamFilter): PullRequestFilter;
