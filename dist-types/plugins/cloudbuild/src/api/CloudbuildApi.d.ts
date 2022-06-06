import { ActionsListWorkflowRunsForRepoResponseData, ActionsGetWorkflowResponseData } from '../api/types';
export declare const cloudbuildApiRef: import("@backstage/core-plugin-api").ApiRef<CloudbuildApi>;
export declare type CloudbuildApi = {
    listWorkflowRuns: (request: {
        projectId: string;
    }) => Promise<ActionsListWorkflowRunsForRepoResponseData>;
    getWorkflow: ({ projectId, id, }: {
        projectId: string;
        id: string;
    }) => Promise<ActionsGetWorkflowResponseData>;
    getWorkflowRun: ({ projectId, id, }: {
        projectId: string;
        id: string;
    }) => Promise<ActionsGetWorkflowResponseData>;
    reRunWorkflow: ({ projectId, runId, }: {
        projectId: string;
        runId: string;
    }) => Promise<any>;
};
