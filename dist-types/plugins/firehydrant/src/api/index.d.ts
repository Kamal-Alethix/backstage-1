import { ServiceAnalyticsResponse, ServiceDetailsResponse, ServiceIncidentsResponse } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
export interface FireHydrantAPI {
    getServiceAnalytics(options: {
        serviceId: string;
        startDate: string;
        endDate: string;
    }): Promise<ServiceAnalyticsResponse>;
    getServiceDetails(options: {
        serviceName: string;
    }): Promise<ServiceDetailsResponse>;
    getServiceIncidents(options: {
        serviceId: string;
    }): Promise<ServiceIncidentsResponse>;
}
export declare const fireHydrantApiRef: import("@backstage/core-plugin-api").ApiRef<FireHydrantAPI>;
export declare type Options = {
    discoveryApi: DiscoveryApi;
    proxyPath?: string;
};
export declare class FireHydrantAPIClient implements FireHydrantAPI {
    private readonly discoveryApi;
    private readonly proxyPath;
    constructor(options: Options);
    getServiceAnalytics(options: {
        serviceId: string;
        startDate: string;
        endDate: string;
    }): Promise<ServiceAnalyticsResponse>;
    getServiceDetails(options: {
        serviceName: string;
    }): Promise<ServiceDetailsResponse>;
    getServiceIncidents(options: {
        serviceId: string;
    }): Promise<ServiceIncidentsResponse>;
    private getApiUrl;
}
