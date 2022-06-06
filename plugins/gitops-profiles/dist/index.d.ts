/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare const gitopsProfilesPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    listPage: _backstage_core_plugin_api.RouteRef<undefined>;
    detailsPage: _backstage_core_plugin_api.RouteRef<{
        owner: string;
        repo: string;
    }>;
    createPage: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const GitopsProfilesClusterListPage: () => JSX.Element;
declare const GitopsProfilesClusterPage: () => JSX.Element;
declare const GitopsProfilesCreatePage: () => JSX.Element;

interface CloneFromTemplateRequest {
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
interface ApplyProfileRequest {
    targetOrg: string;
    targetRepo: string;
    gitHubUser: string;
    gitHubToken: string;
    profiles: string[];
}
interface ChangeClusterStateRequest {
    targetOrg: string;
    targetRepo: string;
    gitHubUser: string;
    gitHubToken: string;
    clusterState: 'present' | 'absent';
}
interface PollLogRequest {
    targetOrg: string;
    targetRepo: string;
    gitHubUser: string;
    gitHubToken: string;
}
interface Status {
    status: string;
    message: string;
    conclusion: string;
}
interface StatusResponse {
    result: Status[];
    link: string;
    status: string;
}
interface ClusterStatus {
    name: string;
    link: string;
    status: string;
    conclusion: string;
    runStatus: Status[];
}
interface ListClusterStatusesResponse {
    result: ClusterStatus[];
}
interface ListClusterRequest {
    gitHubUser: string;
    gitHubToken: string;
}
interface GithubUserInfoRequest {
    accessToken: string;
}
interface GithubUserInfoResponse {
    login: string;
}
declare class FetchError extends Error {
    get name(): string;
    static forResponse(resp: Response): Promise<FetchError>;
}
declare type GitOpsApi = {
    url: string;
    fetchLog(req: PollLogRequest): Promise<StatusResponse>;
    changeClusterState(req: ChangeClusterStateRequest): Promise<any>;
    cloneClusterFromTemplate(req: CloneFromTemplateRequest): Promise<any>;
    applyProfiles(req: ApplyProfileRequest): Promise<any>;
    listClusters(req: ListClusterRequest): Promise<ListClusterStatusesResponse>;
    fetchUserInfo(req: GithubUserInfoRequest): Promise<GithubUserInfoResponse>;
};
declare const gitOpsApiRef: _backstage_core_plugin_api.ApiRef<GitOpsApi>;
declare class GitOpsRestApi implements GitOpsApi {
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

export { ApplyProfileRequest, ChangeClusterStateRequest, CloneFromTemplateRequest, ClusterStatus, FetchError, GitOpsApi, GitOpsRestApi, GithubUserInfoRequest, GithubUserInfoResponse, GitopsProfilesClusterListPage, GitopsProfilesClusterPage, GitopsProfilesCreatePage, ListClusterRequest, ListClusterStatusesResponse, PollLogRequest, Status, StatusResponse, gitOpsApiRef, gitopsProfilesPlugin, gitopsProfilesPlugin as plugin };
