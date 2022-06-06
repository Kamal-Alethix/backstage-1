import { DiscoveryApi } from '@backstage/core-plugin-api';
export declare type NewRelicApplication = {
    id: number;
    application_summary: NewRelicApplicationSummary;
    name: string;
    language: string;
    health_status: string;
    reporting: boolean;
    settings: NewRelicApplicationSettings;
    links?: NewRelicApplicationLinks;
};
export declare type NewRelicApplicationSummary = {
    apdex_score: number;
    error_rate: number;
    host_count: number;
    instance_count: number;
    response_time: number;
    throughput: number;
};
export declare type NewRelicApplicationSettings = {
    app_apdex_threshold: number;
    end_user_apdex_threshold: number;
    enable_real_user_monitoring: boolean;
    use_server_side_config: boolean;
};
export declare type NewRelicApplicationLinks = {
    application_instances: Array<any>;
    servers: Array<any>;
    application_hosts: Array<any>;
};
export declare type NewRelicApplications = {
    applications: NewRelicApplication[];
};
export declare const newRelicApiRef: import("@backstage/core-plugin-api").ApiRef<NewRelicApi>;
declare type Options = {
    discoveryApi: DiscoveryApi;
    /**
     * Path to use for requests via the proxy, defaults to /newrelic
     */
    proxyPathBase?: string;
};
export interface NewRelicApi {
    getApplications(): Promise<NewRelicApplications>;
}
export declare class NewRelicClient implements NewRelicApi {
    private readonly discoveryApi;
    private readonly proxyPathBase;
    constructor(options: Options);
    getApplications(): Promise<NewRelicApplications>;
    private getApiUrl;
}
export {};
