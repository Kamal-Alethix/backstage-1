import { Build, BuildDefinitionReference } from 'azure-devops-node-api/interfaces/BuildInterfaces';
import { RepoBuild, GitTag, PullRequestOptions, PullRequest, DashboardPullRequest, Team, TeamMember, BuildRun } from '@backstage/plugin-azure-devops-common';
import { GitRepository } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { Logger } from 'winston';
import { WebApi } from 'azure-devops-node-api';
import { Config } from '@backstage/config';
import express from 'express';

declare class AzureDevOpsApi {
    private readonly logger;
    private readonly webApi;
    constructor(logger: Logger, webApi: WebApi);
    getGitRepository(projectName: string, repoName: string): Promise<GitRepository>;
    getBuildList(projectName: string, repoId: string, top: number): Promise<Build[]>;
    getRepoBuilds(projectName: string, repoName: string, top: number): Promise<RepoBuild[]>;
    getGitTags(projectName: string, repoName: string): Promise<GitTag[]>;
    getPullRequests(projectName: string, repoName: string, options: PullRequestOptions): Promise<PullRequest[]>;
    getDashboardPullRequests(projectName: string, options: PullRequestOptions): Promise<DashboardPullRequest[]>;
    private getPullRequestPolicies;
    getAllTeams(): Promise<Team[]>;
    getTeamMembers({ projectId, teamId, }: {
        projectId: string;
        teamId: string;
    }): Promise<TeamMember[] | undefined>;
    getBuildDefinitions(projectName: string, definitionName: string): Promise<BuildDefinitionReference[]>;
    getBuilds(projectName: string, top: number, repoId?: string, definitions?: number[]): Promise<Build[]>;
    getBuildRuns(projectName: string, top: number, repoName?: string, definitionName?: string): Promise<BuildRun[]>;
}

interface RouterOptions {
    azureDevOpsApi?: AzureDevOpsApi;
    logger: Logger;
    config: Config;
}
declare function createRouter(options: RouterOptions): Promise<express.Router>;

export { AzureDevOpsApi, RouterOptions, createRouter };
