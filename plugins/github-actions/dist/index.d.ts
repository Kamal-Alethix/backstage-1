/// <reference types="react" />
import * as _backstage_core_components from '@backstage/core-components';
import { InfoCardVariants } from '@backstage/core-components';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { ConfigApi, OAuthApi } from '@backstage/core-plugin-api';
import { RestEndpointMethodTypes } from '@octokit/rest';
import { Entity } from '@backstage/catalog-model';

declare type Props$1 = {
    branch?: string;
    dense?: boolean;
    limit?: number;
    variant?: InfoCardVariants;
};
declare const RecentWorkflowRunsCard: ({ branch, dense, limit, variant, }: Props$1) => JSX.Element;

declare const githubActionsPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    entityContent: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityGithubActionsContent: () => JSX.Element;
declare const EntityLatestGithubActionRunCard: ({ branch, variant, }: {
    branch: string;
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;
declare const EntityLatestGithubActionsForBranchCard: ({ branch, variant, }: {
    branch: string;
    variant?: _backstage_core_components.InfoCardVariants | undefined;
}) => JSX.Element;
declare const EntityRecentGithubActionsRunsCard: ({ branch, dense, limit, variant, }: Props$1) => JSX.Element;

declare const githubActionsApiRef: _backstage_core_plugin_api.ApiRef<GithubActionsApi>;
declare type GithubActionsApi = {
    listWorkflowRuns: ({ hostname, owner, repo, pageSize, page, branch, }: {
        hostname?: string;
        owner: string;
        repo: string;
        pageSize?: number;
        page?: number;
        branch?: string;
    }) => Promise<RestEndpointMethodTypes['actions']['listWorkflowRuns']['response']['data']>;
    getWorkflow: ({ hostname, owner, repo, id, }: {
        hostname?: string;
        owner: string;
        repo: string;
        id: number;
    }) => Promise<RestEndpointMethodTypes['actions']['getWorkflow']['response']['data']>;
    getWorkflowRun: ({ hostname, owner, repo, id, }: {
        hostname?: string;
        owner: string;
        repo: string;
        id: number;
    }) => Promise<RestEndpointMethodTypes['actions']['getWorkflowRun']['response']['data']>;
    reRunWorkflow: ({ hostname, owner, repo, runId, }: {
        hostname?: string;
        owner: string;
        repo: string;
        runId: number;
    }) => Promise<any>;
    listJobsForWorkflowRun: ({ hostname, owner, repo, id, pageSize, page, }: {
        hostname?: string;
        owner: string;
        repo: string;
        id: number;
        pageSize?: number;
        page?: number;
    }) => Promise<RestEndpointMethodTypes['actions']['listJobsForWorkflowRun']['response']['data']>;
    downloadJobLogsForWorkflowRun: ({ hostname, owner, repo, runId, }: {
        hostname?: string;
        owner: string;
        repo: string;
        runId: number;
    }) => Promise<RestEndpointMethodTypes['actions']['downloadJobLogsForWorkflowRun']['response']['data']>;
};

declare class GithubActionsClient implements GithubActionsApi {
    private readonly configApi;
    private readonly githubAuthApi;
    constructor(options: {
        configApi: ConfigApi;
        githubAuthApi: OAuthApi;
    });
    private getOctokit;
    reRunWorkflow({ hostname, owner, repo, runId, }: {
        hostname?: string;
        owner: string;
        repo: string;
        runId: number;
    }): Promise<any>;
    listWorkflowRuns({ hostname, owner, repo, pageSize, page, branch, }: {
        hostname?: string;
        owner: string;
        repo: string;
        pageSize?: number;
        page?: number;
        branch?: string;
    }): Promise<RestEndpointMethodTypes['actions']['listWorkflowRuns']['response']['data']>;
    getWorkflow({ hostname, owner, repo, id, }: {
        hostname?: string;
        owner: string;
        repo: string;
        id: number;
    }): Promise<RestEndpointMethodTypes['actions']['getWorkflow']['response']['data']>;
    getWorkflowRun({ hostname, owner, repo, id, }: {
        hostname?: string;
        owner: string;
        repo: string;
        id: number;
    }): Promise<RestEndpointMethodTypes['actions']['getWorkflowRun']['response']['data']>;
    listJobsForWorkflowRun({ hostname, owner, repo, id, pageSize, page, }: {
        hostname?: string;
        owner: string;
        repo: string;
        id: number;
        pageSize?: number;
        page?: number;
    }): Promise<RestEndpointMethodTypes['actions']['listJobsForWorkflowRun']['response']['data']>;
    downloadJobLogsForWorkflowRun({ hostname, owner, repo, runId, }: {
        hostname?: string;
        owner: string;
        repo: string;
        runId: number;
    }): Promise<RestEndpointMethodTypes['actions']['downloadJobLogsForWorkflowRun']['response']['data']>;
}

declare type Step = {
    name: string;
    status: string;
    conclusion?: string;
    number: number;
    started_at: string;
    completed_at: string;
};
declare type Job = {
    html_url: string;
    status: string;
    conclusion: string;
    started_at: string;
    completed_at: string;
    id: number;
    name: string;
    steps: Step[];
};
declare type Jobs = {
    total_count: number;
    jobs: Job[];
};
declare enum BuildStatus {
    'success' = 0,
    'failure' = 1,
    'pending' = 2,
    'running' = 3
}

declare const isGithubActionsAvailable: (entity: Entity) => boolean;
declare const Router: () => JSX.Element;

declare const LatestWorkflowRunCard: ({ branch, variant, }: Props) => JSX.Element;
declare type Props = {
    branch: string;
    variant?: InfoCardVariants;
};
declare const LatestWorkflowsForBranchCard: ({ branch, variant, }: Props) => JSX.Element;

declare const GITHUB_ACTIONS_ANNOTATION = "github.com/project-slug";

export { BuildStatus, EntityGithubActionsContent, EntityLatestGithubActionRunCard, EntityLatestGithubActionsForBranchCard, EntityRecentGithubActionsRunsCard, GITHUB_ACTIONS_ANNOTATION, GithubActionsApi, GithubActionsClient, Job, Jobs, LatestWorkflowRunCard, LatestWorkflowsForBranchCard, RecentWorkflowRunsCard, Router, Step, githubActionsApiRef, githubActionsPlugin, isGithubActionsAvailable, isGithubActionsAvailable as isPluginApplicableToEntity, githubActionsPlugin as plugin };
