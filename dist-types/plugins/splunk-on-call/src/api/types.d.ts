import { EscalationPolicyInfo, Incident, OnCall, RoutingKey, Team, User } from '../components/types';
import { DiscoveryApi } from '@backstage/core-plugin-api';
export declare type MessageType = 'CRITICAL' | 'WARNING' | 'ACKNOWLEDGEMENT' | 'INFO' | 'RECOVERY';
export declare type TriggerAlarmRequest = {
    routingKey?: string;
    incidentType: MessageType;
    incidentId?: string;
    incidentDisplayName?: string;
    incidentMessage?: string;
    incidentStartTime?: number;
};
export interface SplunkOnCallApi {
    /**
     * Fetches a list of incidents
     */
    getIncidents(): Promise<Incident[]>;
    /**
     * Fetches the list of users in an escalation policy.
     */
    getOnCallUsers(): Promise<OnCall[]>;
    /**
     * Triggers-Resolves-Acknowledge an incident.
     */
    incidentAction(request: TriggerAlarmRequest): Promise<Response>;
    /**
     * Get a list of users for your organization.
     */
    getUsers(): Promise<User[]>;
    /**
     * Get a list of teams for your organization.
     */
    getTeams(): Promise<Team[]>;
    /**
     * Get a list of routing keys for your organization.
     */
    getRoutingKeys(): Promise<RoutingKey[]>;
    /**
     * Get a list of escalation policies for your organization.
     */
    getEscalationPolicies(): Promise<EscalationPolicyInfo[]>;
}
export declare type EscalationPolicyResponse = {
    policies: EscalationPolicyInfo[];
};
export declare type ListUserResponse = {
    users: User[];
    _selfUrl?: string;
};
export declare type ListRoutingKeyResponse = {
    routingKeys: RoutingKey[];
    _selfUrl?: string;
};
export declare type IncidentsResponse = {
    incidents: Incident[];
};
export declare type OnCallsResponse = {
    teamsOnCall: OnCall[];
};
export declare type ClientApiConfig = {
    eventsRestEndpoint: string | null;
    discoveryApi: DiscoveryApi;
};
export declare type RequestOptions = {
    method: string;
    headers: HeadersInit;
    body?: BodyInit;
};
