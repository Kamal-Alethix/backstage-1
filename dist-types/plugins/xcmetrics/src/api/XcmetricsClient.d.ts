import { DiscoveryApi } from '@backstage/core-plugin-api';
import { Build, BuildCount, BuildError, BuildFilters, BuildHost, BuildMetadata, BuildResponse, BuildStatusResult, BuildTime, BuildWarning, PaginationResult, XcmetricsApi } from './types';
interface Options {
    discoveryApi: DiscoveryApi;
}
export declare class XcmetricsClient implements XcmetricsApi {
    private readonly discoveryApi;
    constructor(options: Options);
    getBuild(id: string): Promise<BuildResponse>;
    getBuilds(limit?: number): Promise<Build[]>;
    getFilteredBuilds(filters: BuildFilters, page?: number, perPage?: number): Promise<PaginationResult<Build>>;
    getBuildCounts(days: number): Promise<BuildCount[]>;
    getBuildErrors(buildId: string): Promise<BuildError[]>;
    getBuildHost(buildId: string): Promise<BuildHost>;
    getBuildMetadata(buildId: string): Promise<BuildMetadata>;
    getBuildTimes(days: number): Promise<BuildTime[]>;
    getBuildStatuses(limit: number): Promise<BuildStatusResult[]>;
    getBuildWarnings(buildId: string): Promise<BuildWarning[]>;
    getProjects(): Promise<string[]>;
    private get;
    private post;
}
export {};
