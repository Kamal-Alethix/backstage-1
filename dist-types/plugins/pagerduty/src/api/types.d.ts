import { Incident, ChangeEvent, OnCall, Service } from '../components/types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
export declare type TriggerAlarmRequest = {
    integrationKey: string;
    source: string;
    description: string;
    userName: string;
};
export interface PagerDutyApi {
    /**
     * Fetches a list of services, filtered by the provided integration key.
     *
     */
    getServiceByIntegrationKey(integrationKey: string): Promise<Service[]>;
    /**
     * Fetches a list of incidents a provided service has.
     *
     */
    getIncidentsByServiceId(serviceId: string): Promise<Incident[]>;
    /**
     * Fetches a list of change events a provided service has.
     *
     */
    getChangeEventsByServiceId(serviceId: string): Promise<ChangeEvent[]>;
    /**
     * Fetches the list of users in an escalation policy.
     *
     */
    getOnCallByPolicyId(policyId: string): Promise<OnCall[]>;
    /**
     * Triggers an incident to whoever is on-call.
     */
    triggerAlarm(request: TriggerAlarmRequest): Promise<Response>;
}
export declare type ServicesResponse = {
    services: Service[];
};
export declare type IncidentsResponse = {
    incidents: Incident[];
};
export declare type ChangeEventsResponse = {
    change_events: ChangeEvent[];
};
export declare type OnCallsResponse = {
    oncalls: OnCall[];
};
export declare type ClientApiConfig = {
    eventsBaseUrl?: string;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
};
export declare type RequestOptions = {
    method: string;
    headers: HeadersInit;
    body?: BodyInit;
};
