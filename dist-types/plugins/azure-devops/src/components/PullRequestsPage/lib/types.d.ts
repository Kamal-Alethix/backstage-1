import { Filter, PullRequestFilter } from './filters';
import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
export interface PullRequestColumnConfig {
    title: string;
    filters: Filter[];
    simplified?: boolean;
}
export interface PullRequestGroupConfig {
    title: string;
    filter: PullRequestFilter;
    simplified?: boolean;
}
export interface PullRequestGroup {
    title: string;
    pullRequests: DashboardPullRequest[];
    simplified?: boolean;
}
