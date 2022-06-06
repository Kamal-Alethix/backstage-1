import { DashboardPullRequest, PullRequestOptions, Team } from '@backstage/plugin-azure-devops-common';
import { AzureDevOpsApi } from './AzureDevOpsApi';
import { Logger } from 'winston';
export declare class PullRequestsDashboardProvider {
    private readonly logger;
    private readonly azureDevOpsApi;
    private teams;
    private teamMembers;
    private constructor();
    static create(logger: Logger, azureDevOpsApi: AzureDevOpsApi): Promise<PullRequestsDashboardProvider>;
    readTeams(): Promise<void>;
    getDashboardPullRequests(projectName: string, options: PullRequestOptions): Promise<DashboardPullRequest[]>;
    getUserTeamIds(email: string): Promise<string[]>;
    getAllTeams(): Promise<Team[]>;
}
