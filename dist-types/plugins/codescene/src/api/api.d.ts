import { DiscoveryApi } from '@backstage/core-plugin-api';
import { FetchProjectsResponse, Project, FetchAnalysesResponse, Analysis } from './types';
export declare const codesceneApiRef: import("@backstage/core-plugin-api").ApiRef<CodeSceneApi>;
export interface CodeSceneApi {
    fetchProjects(): Promise<FetchProjectsResponse>;
    fetchProject(projectId: number): Promise<Project>;
    fetchAnalyses(projectId: number): Promise<FetchAnalysesResponse>;
    fetchLatestAnalysis(projectId: number): Promise<Analysis>;
}
declare type Options = {
    discoveryApi: DiscoveryApi;
};
export declare class CodeSceneClient implements CodeSceneApi {
    private readonly discoveryApi;
    constructor(options: Options);
    fetchProjects(): Promise<FetchProjectsResponse>;
    fetchProject(projectId: number): Promise<Project>;
    fetchAnalyses(projectId: number): Promise<FetchAnalysesResponse>;
    fetchLatestAnalysis(projectId: number): Promise<Analysis>;
    private fetchFromApi;
    private getApiUrl;
}
export {};
