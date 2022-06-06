import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
export declare function useDashboardPullRequests(project?: string, pollingInterval?: number): {
    pullRequests?: DashboardPullRequest[];
    loading: boolean;
    error?: Error;
};
