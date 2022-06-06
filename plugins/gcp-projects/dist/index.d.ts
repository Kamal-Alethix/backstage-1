/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { OAuthApi } from '@backstage/core-plugin-api';

declare const gcpProjectsPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const GcpProjectsPage: () => JSX.Element;

declare type Project = {
    name: string;
    projectNumber?: string;
    projectId: string;
    lifecycleState?: string;
    createTime?: string;
};
declare type ProjectDetails = {
    details: string;
};
declare type Operation = {
    name: string;
    metadata: string;
    done: boolean;
    error: Status;
    response: string;
};
declare type Status = {
    code: number;
    message: string;
    details: string[];
};

declare const gcpApiRef: _backstage_core_plugin_api.ApiRef<GcpApi>;
declare type GcpApi = {
    listProjects(): Promise<Project[]>;
    getProject(projectId: string): Promise<Project>;
    createProject(options: {
        projectId: string;
        projectName: string;
    }): Promise<Operation>;
};

declare class GcpClient implements GcpApi {
    private readonly googleAuthApi;
    constructor(googleAuthApi: OAuthApi);
    listProjects(): Promise<Project[]>;
    getProject(projectId: string): Promise<Project>;
    createProject(options: {
        projectId: string;
        projectName: string;
    }): Promise<Operation>;
    getToken(): Promise<string>;
}

export { GcpApi, GcpClient, GcpProjectsPage, Operation, Project, ProjectDetails, Status, gcpApiRef, gcpProjectsPlugin, gcpProjectsPlugin as plugin };
