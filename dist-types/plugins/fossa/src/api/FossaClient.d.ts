import { FindingSummary, FossaApi } from './FossaApi';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
export declare class FossaClient implements FossaApi {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    organizationId?: string;
    private readonly limit;
    constructor({ discoveryApi, identityApi, organizationId, }: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
        organizationId?: string;
    });
    private callApi;
    getProject(projectTitles: Set<string>): AsyncIterable<{
        title: string;
        summary: FindingSummary;
    }>;
    getFindingSummaries(projectTitles: string[]): Promise<Map<string, FindingSummary>>;
    getFindingSummary(projectTitle: string): Promise<FindingSummary | undefined>;
}
