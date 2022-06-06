export interface CloneFromTemplateRequest {
    templateRepository: string;
    secrets: {
        awsAccessKeyId: string;
        awsSecretAccessKey: string;
    };
    targetOrg: string;
    targetRepo: string;
    gitHubUser: string;
    gitHubToken: string;
}
export interface ApplyProfileRequest {
    targetOrg: string;
    targetRepo: string;
    gitHubUser: string;
    gitHubToken: string;
    profiles: string[];
}
export interface ChangeClusterStateRequest {
    targetOrg: string;
    targetRepo: string;
    gitHubUser: string;
    gitHubToken: string;
    clusterState: 'present' | 'absent';
}
export interface PollLogRequest {
    targetOrg: string;
    targetRepo: string;
    gitHubUser: string;
    gitHubToken: string;
}
export interface Status {
    status: string;
    message: string;
    conclusion: string;
}
export interface StatusResponse {
    result: Status[];
    link: string;
    status: string;
}
export interface ClusterStatus {
    name: string;
    link: string;
    status: string;
    conclusion: string;
    runStatus: Status[];
}
export interface ListClusterStatusesResponse {
    result: ClusterStatus[];
}
export interface ListClusterRequest {
    gitHubUser: string;
    gitHubToken: string;
}
export interface GithubUserInfoRequest {
    accessToken: string;
}
export interface GithubUserInfoResponse {
    login: string;
}
export declare class FetchError extends Error {
    get name(): string;
    static forResponse(resp: Response): Promise<FetchError>;
}
export declare type GitOpsApi = {
    url: string;
    fetchLog(req: PollLogRequest): Promise<StatusResponse>;
    changeClusterState(req: ChangeClusterStateRequest): Promise<any>;
    cloneClusterFromTemplate(req: CloneFromTemplateRequest): Promise<any>;
    applyProfiles(req: ApplyProfileRequest): Promise<any>;
    listClusters(req: ListClusterRequest): Promise<ListClusterStatusesResponse>;
    fetchUserInfo(req: GithubUserInfoRequest): Promise<GithubUserInfoResponse>;
};
export declare const gitOpsApiRef: import("@backstage/core-plugin-api").ApiRef<GitOpsApi>;
export declare class GitOpsRestApi implements GitOpsApi {
    url: string;
    constructor(url?: string);
    private fetch;
    fetchUserInfo(req: GithubUserInfoRequest): Promise<GithubUserInfoResponse>;
    fetchLog(req: PollLogRequest): Promise<StatusResponse>;
    changeClusterState(req: ChangeClusterStateRequest): Promise<any>;
    cloneClusterFromTemplate(req: CloneFromTemplateRequest): Promise<any>;
    applyProfiles(req: ApplyProfileRequest): Promise<any>;
    listClusters(req: ListClusterRequest): Promise<ListClusterStatusesResponse>;
}
