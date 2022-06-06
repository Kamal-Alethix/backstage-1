/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { OAuthApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare const cloudbuildPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    entityContent: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityCloudbuildContent: () => JSX.Element;
declare const EntityLatestCloudbuildRunCard: ({ branch, }: {
    branch: string;
}) => JSX.Element;
declare const EntityLatestCloudbuildsForBranchCard: ({ branch, }: {
    branch: string;
}) => JSX.Element;

interface ActionsListWorkflowRunsForRepoResponseData {
    builds: ActionsGetWorkflowResponseData[];
}
declare type ActionsGetWorkflowResponseData = {
    id: string;
    status: string;
    source: Source;
    createTime: string;
    startTime: string;
    steps: Step[];
    timeout: string;
    projectId: string;
    logsBucket: string;
    sourceProvenance: SourceProvenance;
    buildTriggerId: string;
    options: Options;
    logUrl: string;
    substitutions: Substitutions;
    tags: string[];
    queueTtl: string;
    name: string;
    finishTime: any;
    results: Results;
    timing: Timing2;
};
interface Step {
    name: string;
    args: string[];
    id: string;
    waitFor: string[];
    entrypoint: string;
    volumes: Volume[];
    dir: string;
    timing: Timing;
    status: string;
    pullTiming: PullTiming;
}
interface Timing2 {
    BUILD: BUILD;
    FETCHSOURCE: FETCHSOURCE;
}
interface SourceProvenance {
    resolvedStorageSource: {};
    fileHashes: {};
}
interface Options {
    machineType: string;
    substitutionOption: string;
    logging: string;
    dynamicSubstitutions: boolean;
}
interface Substitutions {
    COMMIT_SHA: string;
    SHORT_SHA: string;
    BRANCH_NAME: string;
    REPO_NAME: string;
    REVISION_ID: string;
}
interface Results {
    buildStepImages: string[];
    buildStepOutputs: string[];
}
interface BUILD {
    startTime: string;
    endTime: string;
}
interface FETCHSOURCE {
    startTime: string;
    endTime: string;
}
interface StorageSource {
    bucket: string;
    object: string;
}
interface Source {
    storageSource: StorageSource;
}
interface Volume {
    name: string;
    path: string;
}
interface Timing {
    startTime: string;
    endTime: string;
}
interface PullTiming {
    startTime: string;
    endTime: string;
}
interface ResolvedStorageSource {
    bucket: string;
    object: string;
    generation: string;
}

declare const cloudbuildApiRef: _backstage_core_plugin_api.ApiRef<CloudbuildApi>;
declare type CloudbuildApi = {
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

declare class CloudbuildClient implements CloudbuildApi {
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

declare const isCloudbuildAvailable: (entity: Entity) => boolean;
declare const Router: () => JSX.Element;

declare const LatestWorkflowRunCard: ({ branch, }: {
    branch: string;
}) => JSX.Element;
declare const LatestWorkflowsForBranchCard: ({ branch, }: {
    branch: string;
}) => JSX.Element;

declare const CLOUDBUILD_ANNOTATION = "google.com/cloudbuild-project-slug";

export { ActionsGetWorkflowResponseData, ActionsListWorkflowRunsForRepoResponseData, BUILD, CLOUDBUILD_ANNOTATION, CloudbuildApi, CloudbuildClient, EntityCloudbuildContent, EntityLatestCloudbuildRunCard, EntityLatestCloudbuildsForBranchCard, FETCHSOURCE, LatestWorkflowRunCard, LatestWorkflowsForBranchCard, Options, PullTiming, ResolvedStorageSource, Results, Router, Source, SourceProvenance, Step, StorageSource, Substitutions, Timing, Timing2, Volume, cloudbuildApiRef, cloudbuildPlugin, isCloudbuildAvailable, isCloudbuildAvailable as isPluginApplicableToEntity, cloudbuildPlugin as plugin };
