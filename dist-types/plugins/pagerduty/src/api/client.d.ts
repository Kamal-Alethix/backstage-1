import { Service, Incident, ChangeEvent, OnCall } from '../components/types';
import { PagerDutyApi, TriggerAlarmRequest, ClientApiConfig } from './types';
import { DiscoveryApi, ConfigApi, IdentityApi } from '@backstage/core-plugin-api';
export declare class UnauthorizedError extends Error {
}
export declare const pagerDutyApiRef: import("@backstage/core-plugin-api").ApiRef<PagerDutyApi>;
export declare class PagerDutyClient implements PagerDutyApi {
    private readonly config;
    static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi, identityApi: IdentityApi): PagerDutyClient;
    constructor(config: ClientApiConfig);
    getServiceByIntegrationKey(integrationKey: string): Promise<Service[]>;
    getIncidentsByServiceId(serviceId: string): Promise<Incident[]>;
    getChangeEventsByServiceId(serviceId: string): Promise<ChangeEvent[]>;
    getOnCallByPolicyId(policyId: string): Promise<OnCall[]>;
    triggerAlarm(request: TriggerAlarmRequest): Promise<Response>;
    private getByUrl;
    private request;
}
