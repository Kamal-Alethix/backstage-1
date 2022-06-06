import { GithubActionsApi } from './GithubActionsApi';
import { RestEndpointMethodTypes } from '@octokit/rest';
import { ConfigApi, OAuthApi } from '@backstage/core-plugin-api';
export declare class GithubActionsClient implements GithubActionsApi {
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
