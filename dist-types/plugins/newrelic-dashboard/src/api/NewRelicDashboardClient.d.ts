import { DashboardEntitySummary, DashboardSnapshotSummary, NewRelicDashboardApi } from './NewRelicDashboardApi';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
export declare class NewRelicDashboardClient implements NewRelicDashboardApi {
    private readonly discoveryApi;
    private readonly fetchApi;
    constructor({ discoveryApi, fetchApi, }: {
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
        baseUrl?: string;
    });
    private callApi;
    getDashboardEntity(guid: string): Promise<DashboardEntitySummary | undefined>;
    getDashboardSnapshot(guid: string, duration: number): Promise<DashboardSnapshotSummary | undefined>;
}
