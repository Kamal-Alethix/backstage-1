import { Incident, OnCall, User, EscalationPolicyInfo, RoutingKey, Team } from '../components/types';
import { SplunkOnCallApi, TriggerAlarmRequest, ClientApiConfig } from './types';
import { DiscoveryApi, ConfigApi } from '@backstage/core-plugin-api';
export declare class UnauthorizedError extends Error {
}
export declare const splunkOnCallApiRef: import("@backstage/core-plugin-api").ApiRef<SplunkOnCallApi>;
export declare class SplunkOnCallClient implements SplunkOnCallApi {
    private readonly config;
    static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi): SplunkOnCallClient;
    constructor(config: ClientApiConfig);
    getIncidents(): Promise<Incident[]>;
    getOnCallUsers(): Promise<OnCall[]>;
    getTeams(): Promise<Team[]>;
    getRoutingKeys(): Promise<RoutingKey[]>;
    getUsers(): Promise<User[]>;
    getEscalationPolicies(): Promise<EscalationPolicyInfo[]>;
    incidentAction({ routingKey, incidentType, incidentId, incidentDisplayName, incidentMessage, incidentStartTime, }: TriggerAlarmRequest): Promise<Response>;
    private getByUrl;
    private request;
}
