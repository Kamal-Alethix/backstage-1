import { BitriseApi } from './bitriseApi';
import { BitriseApp, BitriseBuildArtifact, BitriseBuildArtifactDetails, BitriseQueryParams, BitriseBuildListResponse } from './bitriseApi.model';
import { DiscoveryApi } from '@backstage/core-plugin-api';
export declare class BitriseClientApi implements BitriseApi {
    private readonly discoveryApi;
    constructor(discoveryApi: DiscoveryApi);
    getArtifactDetails(appSlug: string, buildSlug: string, artifactSlug: string): Promise<BitriseBuildArtifactDetails | undefined>;
    getBuildArtifacts(appSlug: string, buildSlug: string): Promise<BitriseBuildArtifact[]>;
    getAppsPaginated(from: string): Promise<BitriseApp[]>;
    getApps(): Promise<BitriseApp[]>;
    getApp(appName: string): Promise<BitriseApp | undefined>;
    getBuildWorkflows(appSlug: string): Promise<string[]>;
    getBuilds(appSlug: string, params?: BitriseQueryParams): Promise<BitriseBuildListResponse>;
}
