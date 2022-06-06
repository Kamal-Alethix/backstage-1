import { CloudbuildApi } from './CloudbuildApi';
import { ActionsListWorkflowRunsForRepoResponseData, ActionsGetWorkflowResponseData } from '../api/types';
import { OAuthApi } from '@backstage/core-plugin-api';
export declare class CloudbuildClient implements CloudbuildApi {
    private readonly googleAuthApi;
    constructor(googleAuthApi: OAuthApi);
    reRunWorkflow({ projectId, runId, }: {
        projectId: string;
        runId: string;
    }): Promise<void>;
    listWorkflowRuns({ projectId, }: {
        projectId: string;
    }): Promise<ActionsListWorkflowRunsForRepoResponseData>;
    getWorkflow({ projectId, id, }: {
        projectId: string;
        id: string;
    }): Promise<ActionsGetWorkflowResponseData>;
    getWorkflowRun({ projectId, id, }: {
        projectId: string;
        id: string;
    }): Promise<ActionsGetWorkflowResponseData>;
    getToken(): Promise<string>;
}
