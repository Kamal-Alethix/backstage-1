/// <reference types="react" />
import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { SvgIconProps } from '@material-ui/core';

declare type AllFilter = BaseFilter & {
    type: FilterType.All;
};

declare type AssignedToTeamFilter = BaseFilter & {
    type: FilterType.AssignedToTeam;
    teamId: string;
};

declare type AssignedToTeamsFilter = BaseFilter & ({
    type: FilterType.AssignedToTeams;
    teamIds: string[];
} | {
    type: FilterType.AssignedToCurrentUsersTeams;
    teamIds?: string[];
});

declare type AssignedToUserFilter = BaseFilter & ({
    type: FilterType.AssignedToUser;
    email: string;
} | {
    type: FilterType.AssignedToCurrentUser;
    email?: string;
});

declare type CreatedByTeamFilter = BaseFilter & ({
    type: FilterType.CreatedByTeam;
} & ({
    teamId: string;
} | {
    teamName: string;
}));

declare type CreatedByTeamsFilter = BaseFilter & (({
    type: FilterType.CreatedByTeams;
} & ({
    teamIds: string[];
} | {
    teamNames: string[];
})) | {
    type: FilterType.CreatedByCurrentUsersTeams;
    teamIds?: string[];
});

declare type CreatedByUserFilter = BaseFilter & ({
    type: FilterType.CreatedByUser;
    email: string;
} | {
    type: FilterType.CreatedByCurrentUser;
    email?: string;
});

declare enum FilterType {
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
declare type BaseFilter = {
    type: FilterType;
};
declare type Filter = AssignedToUserFilter | CreatedByUserFilter | AssignedToTeamFilter | CreatedByTeamFilter | AssignedToTeamsFilter | CreatedByTeamsFilter | AllFilter;

declare type PullRequestFilter = (pullRequest: DashboardPullRequest) => boolean;

interface PullRequestColumnConfig {
    title: string;
    filters: Filter[];
    simplified?: boolean;
}

declare const isAzureDevOpsAvailable: (entity: Entity) => boolean;
declare const isAzurePipelinesAvailable: (entity: Entity) => boolean;
declare const azureDevOpsPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
declare const AzurePullRequestsPage: ({ projectName, pollingInterval, defaultColumnConfigs, }: {
    projectName?: string | undefined;
    pollingInterval?: number | undefined;
    defaultColumnConfigs?: PullRequestColumnConfig[] | undefined;
}) => JSX.Element;
declare const EntityAzurePipelinesContent: ({ defaultLimit, }: {
    defaultLimit?: number | undefined;
}) => JSX.Element;
declare const EntityAzureGitTagsContent: () => JSX.Element;
declare const EntityAzurePullRequestsContent: ({ defaultLimit, }: {
    defaultLimit?: number | undefined;
}) => JSX.Element;

declare const AzurePullRequestsIcon: (props: SvgIconProps) => JSX.Element;

export { AllFilter, AssignedToTeamFilter, AssignedToTeamsFilter, AssignedToUserFilter, AzurePullRequestsIcon, AzurePullRequestsPage, BaseFilter, CreatedByTeamFilter, CreatedByTeamsFilter, CreatedByUserFilter, EntityAzureGitTagsContent, EntityAzurePipelinesContent, EntityAzurePullRequestsContent, Filter, FilterType, PullRequestColumnConfig, PullRequestFilter, azureDevOpsPlugin, isAzureDevOpsAvailable, isAzurePipelinesAvailable };
