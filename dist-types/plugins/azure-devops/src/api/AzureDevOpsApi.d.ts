import { BuildRun, BuildRunOptions, DashboardPullRequest, GitTag, PullRequest, PullRequestOptions, RepoBuild, RepoBuildOptions, Team } from '@backstage/plugin-azure-devops-common';
export declare const azureDevOpsApiRef: import("@backstage/core-plugin-api").ApiRef<AzureDevOpsApi>;
export interface AzureDevOpsApi {
    getRepoBuilds(projectName: string, repoName: string, options?: RepoBuildOptions): Promise<{
        items: RepoBuild[];
    }>;
    getGitTags(projectName: string, repoName: string): Promise<{
        items: GitTag[];
    }>;
    getPullRequests(projectName: string, repoName: string, options?: PullRequestOptions): Promise<{
        items: PullRequest[];
    }>;
    getDashboardPullRequests(projectName: string): Promise<DashboardPullRequest[]>;
    getAllTeams(): Promise<Team[]>;
    getUserTeamIds(userId: string): Promise<string[]>;
    getBuildRuns(projectName: string, repoName?: string, definitionName?: string, options?: BuildRunOptions): Promise<{
        items: BuildRun[];
    }>;
}
