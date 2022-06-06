import { AllFilter } from './allFilter';
import { AssignedToTeamFilter } from './assignedToTeamFilter';
import { AssignedToTeamsFilter } from './assignedToTeamsFilter';
import { AssignedToUserFilter } from './assignedToUserFilter';
import { CreatedByTeamFilter } from './createdByTeamFilter';
import { CreatedByTeamsFilter } from './createdByTeamsFilter';
import { CreatedByUserFilter } from './createdByUserFilter';
import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
export declare enum FilterType {
    All = "All",
    AssignedToUser = "AssignedToUser",
    AssignedToCurrentUser = "AssignedToCurrentUser",
    AssignedToTeam = "AssignedToTeam",
    AssignedToTeams = "AssignedToTeams",
    AssignedToCurrentUsersTeams = "AssignedToCurrentUsersTeams",
    CreatedByUser = "CreatedByUser",
    CreatedByCurrentUser = "CreatedByCurrentUser",
    CreatedByTeam = "CreatedByTeam",
    CreatedByTeams = "CreatedByTeams",
    CreatedByCurrentUsersTeams = "CreatedByCurrentUsersTeams"
}
export declare const FilterTypes: readonly [FilterType.All, FilterType.AssignedToUser, FilterType.AssignedToCurrentUser, FilterType.AssignedToTeam, FilterType.AssignedToTeams, FilterType.AssignedToCurrentUsersTeams, FilterType.CreatedByUser, FilterType.CreatedByCurrentUser, FilterType.CreatedByTeam, FilterType.CreatedByTeams, FilterType.CreatedByCurrentUsersTeams];
export declare type BaseFilter = {
    type: FilterType;
};
export declare type Filter = AssignedToUserFilter | CreatedByUserFilter | AssignedToTeamFilter | CreatedByTeamFilter | AssignedToTeamsFilter | CreatedByTeamsFilter | AllFilter;
export type { AssignedToUserFilter, CreatedByUserFilter, AssignedToTeamFilter, CreatedByTeamFilter, AssignedToTeamsFilter, CreatedByTeamsFilter, AllFilter, };
export declare type PullRequestFilter = (pullRequest: DashboardPullRequest) => boolean;
