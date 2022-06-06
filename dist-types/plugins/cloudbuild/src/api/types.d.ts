export interface ActionsListWorkflowRunsForRepoResponseData {
    builds: ActionsGetWorkflowResponseData[];
}
export declare type ActionsGetWorkflowResponseData = {
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
export interface Step {
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
export interface Timing2 {
    BUILD: BUILD;
    FETCHSOURCE: FETCHSOURCE;
}
export interface SourceProvenance {
    resolvedStorageSource: {};
    fileHashes: {};
}
export interface Options {
    machineType: string;
    substitutionOption: string;
    logging: string;
    dynamicSubstitutions: boolean;
}
export interface Substitutions {
    COMMIT_SHA: string;
    SHORT_SHA: string;
    BRANCH_NAME: string;
    REPO_NAME: string;
    REVISION_ID: string;
}
export interface Results {
    buildStepImages: string[];
    buildStepOutputs: string[];
}
export interface BUILD {
    startTime: string;
    endTime: string;
}
export interface FETCHSOURCE {
    startTime: string;
    endTime: string;
}
export interface StorageSource {
    bucket: string;
    object: string;
}
export interface Source {
    storageSource: StorageSource;
}
export interface Volume {
    name: string;
    path: string;
}
export interface Timing {
    startTime: string;
    endTime: string;
}
export interface PullTiming {
    startTime: string;
    endTime: string;
}
export interface ResolvedStorageSource {
    bucket: string;
    object: string;
    generation: string;
}
