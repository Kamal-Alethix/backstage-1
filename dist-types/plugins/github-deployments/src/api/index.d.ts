import { ScmIntegrationRegistry } from '@backstage/integration';
import { OAuthApi } from '@backstage/core-plugin-api';
declare type Node = {
    logUrl?: string;
};
export declare type GithubDeployment = {
    environment: string;
    state: string;
    updatedAt: string;
    commit: {
        abbreviatedOid: string;
        commitUrl: string;
    } | null;
    statuses: {
        nodes: Node[];
    };
    creator: {
        login: string;
    };
    repository: {
        nameWithOwner: string;
    };
    payload: string;
};
declare type QueryParams = {
    host: string | undefined;
    owner: string;
    repo: string;
    last: number;
    lastStatuses: number;
};
export interface GithubDeploymentsApi {
    listDeployments(params: QueryParams): Promise<GithubDeployment[]>;
}
export declare const githubDeploymentsApiRef: import("@backstage/core-plugin-api").ApiRef<GithubDeploymentsApi>;
export declare type Options = {
    githubAuthApi: OAuthApi;
    scmIntegrationsApi: ScmIntegrationRegistry;
};
export declare type QueryResponse = {
    repository?: {
        deployments?: {
            nodes?: GithubDeployment[];
        };
    };
};
export declare class GithubDeploymentsApiClient implements GithubDeploymentsApi {
    private readonly githubAuthApi;
    private readonly scmIntegrationsApi;
    constructor(options: Options);
    listDeployments(params: QueryParams): Promise<GithubDeployment[]>;
}
export {};
