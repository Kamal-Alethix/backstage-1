import { BitriseApp, BitriseBuildArtifact, BitriseBuildArtifactDetails, BitriseBuildListResponse, BitriseQueryParams } from './bitriseApi.model';
export interface BitriseApi {
    getBuilds(appSlug: string, params?: BitriseQueryParams): Promise<BitriseBuildListResponse>;
    getBuildWorkflows(appSlug: string): Promise<string[]>;
    getBuildArtifacts(appSlug: string, buildSlug: string): Promise<BitriseBuildArtifact[]>;
    getArtifactDetails(appSlug: string, buildSlug: string, artifactSlug: string): Promise<BitriseBuildArtifactDetails | undefined>;
    getApps(): Promise<BitriseApp[]>;
    getApp(appName: string): Promise<BitriseApp | undefined>;
}
