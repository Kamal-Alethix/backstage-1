/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, IdentityApi, ConfigApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { ReactNode } from 'react';

declare const pagerDutyPlugin: _backstage_core_plugin_api.BackstagePlugin<{}, {}>;
declare const EntityPagerDutyCard: () => JSX.Element;

declare const isPluginApplicableToEntity: (entity: Entity) => boolean;
declare const PagerDutyCard: () => JSX.Element;

declare type TriggerButtonProps = {
    children?: ReactNode;
};
declare function TriggerButton(props: TriggerButtonProps): JSX.Element;

declare type ChangeEvent = {
    id: string;
    integration: [
        {
            service: Service;
        }
    ];
    source: string;
    html_url: string;
    links: [
        {
            href: string;
            text: string;
        }
    ];
    summary: string;
    timestamp: string;
};
declare type Incident = {
    id: string;
    title: string;
    status: string;
    html_url: string;
    assignments: [
        {
            assignee: Assignee;
        }
    ];
    serviceId: string;
    created_at: string;
};
declare type Service = {
    id: string;
    name: string;
    html_url: string;
    integrationKey: string;
    escalation_policy: {
        id: string;
        user: User;
        html_url: string;
    };
};
declare type OnCall = {
    user: User;
    escalation_level: number;
};
declare type Assignee = {
    id: string;
    summary: string;
    html_url: string;
};
declare type User = {
    id: string;
    summary: string;
    email: string;
    html_url: string;
    name: string;
};

declare type TriggerAlarmRequest = {
    integrationKey: string;
    source: string;
    description: string;
    userName: string;
};
interface PagerDutyApi {
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
declare type ClientApiConfig = {
    eventsBaseUrl?: string;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
};

declare class UnauthorizedError extends Error {
}
declare const pagerDutyApiRef: _backstage_core_plugin_api.ApiRef<PagerDutyApi>;
declare class PagerDutyClient implements PagerDutyApi {
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

export { EntityPagerDutyCard, PagerDutyCard, PagerDutyClient, TriggerButton, UnauthorizedError, isPluginApplicableToEntity as isPagerDutyAvailable, isPluginApplicableToEntity, pagerDutyApiRef, pagerDutyPlugin, pagerDutyPlugin as plugin };
