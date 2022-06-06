import { RestEndpointMethodTypes } from '@octokit/rest';
export declare const githubActionsApiRef: import("@backstage/core-plugin-api").ApiRef<GithubActionsApi>;
export declare type GithubActionsApi = {
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
