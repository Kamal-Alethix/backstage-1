import { FindingSummary, SonarQubeApi } from './SonarQubeApi';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
export declare class SonarQubeClient implements SonarQubeApi {
    discoveryApi: DiscoveryApi;
    baseUrl: string;
    identityApi: IdentityApi;
    constructor({ discoveryApi, identityApi, baseUrl, }: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
        baseUrl?: string;
    });
    private callApi;
    private getSupportedMetrics;
    getFindingSummary(componentKey?: string): Promise<FindingSummary | undefined>;
}
