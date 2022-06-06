/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, ConfigApi } from '@backstage/core-plugin-api';

declare const isSplunkOnCallAvailable: (entity: Entity) => boolean;
/** @public */
declare type EntitySplunkOnCallCardProps = {
    readOnly?: boolean;
};

declare type SplunkOnCallPageProps = {
    title?: string;
    subtitle?: string;
    pageTitle?: string;
};

declare const splunkOnCallPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const SplunkOnCallPage: {
    ({ title, subtitle, pageTitle, }: SplunkOnCallPageProps): JSX.Element;
    defaultProps: {
        title: string;
        subtitle: string;
        pageTitle: string;
    };
};
declare const EntitySplunkOnCallCard: (props: EntitySplunkOnCallCardProps) => JSX.Element;

declare type Team = {
    name?: string;
    slug?: string;
    memberCount?: number;
    version?: number;
    isDefaultTeam?: boolean;
    _selfUrl?: string;
    _policiesUrl?: string;
    _membersUrl?: string;
    _adminsUrl?: string;
};
declare type OnCall = {
    team?: OnCallTeamResource;
    oncallNow?: OnCallNowResource[];
};
declare type OnCallTeamResource = {
    name?: string;
    slug?: string;
};
declare type OnCallNowResource = {
    escalationPolicy?: OnCallEscalationPolicyResource;
    users?: OnCallUsersResource[];
};
declare type OnCallEscalationPolicyResource = {
    name?: string;
    slug?: string;
};
declare type OnCallUsersResource = {
    onCalluser?: OnCallUser;
};
declare type OnCallUser = {
    username?: string;
};
declare type User = {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    username?: string;
    email?: string;
    createdAt?: string;
    passwordLastUpdated?: string;
    verified?: boolean;
    _selfUrl?: string;
};
declare type IncidentPhase = 'UNACKED' | 'ACKED' | 'RESOLVED';
declare type Incident = {
    incidentNumber?: string;
    startTime?: string;
    currentPhase: IncidentPhase;
    entityState?: string;
    entityType?: string;
    routingKey?: string;
    alertCount?: number;
    lastAlertTime?: string;
    lastAlertId?: string;
    entityId: string;
    host?: string;
    service?: string;
    pagedUsers?: string[];
    pagedTeams?: string[];
    entityDisplayName?: string;
    pagedPolicies?: EscalationPolicyInfo[];
    transitions?: IncidentTransition[];
    firstAlertUuid?: string;
    monitorName?: string;
    monitorType?: string;
    incidentLink?: string;
};
declare type EscalationPolicyInfo = {
    policy: EscalationPolicySummary;
    team?: EscalationPolicyTeam;
};
declare type IncidentTransition = {
    name?: string;
    at?: string;
    by?: string;
    message?: string;
    manually?: boolean;
    alertId?: string;
    alertUrl?: string;
};
declare type EscalationPolicySummary = {
    name: string;
    slug: string;
    _selfUrl: string;
};
declare type EscalationPolicyTeam = {
    name: string;
    slug: string;
};
declare type RoutingKey = {
    routingKey: string;
    targets: RoutingKeyTarget[];
    isDefault: boolean;
};
declare type RoutingKeyTarget = {
    policyName: string;
    policySlug: string;
    _teamUrl: string;
};

declare type MessageType = 'CRITICAL' | 'WARNING' | 'ACKNOWLEDGEMENT' | 'INFO' | 'RECOVERY';
declare type TriggerAlarmRequest = {
    routingKey?: string;
    incidentType: MessageType;
    incidentId?: string;
    incidentDisplayName?: string;
    incidentMessage?: string;
    incidentStartTime?: number;
};
interface SplunkOnCallApi {
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
declare type ClientApiConfig = {
    eventsRestEndpoint: string | null;
    discoveryApi: DiscoveryApi;
};

declare class UnauthorizedError extends Error {
}
declare const splunkOnCallApiRef: _backstage_core_plugin_api.ApiRef<SplunkOnCallApi>;
declare class SplunkOnCallClient implements SplunkOnCallApi {
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

export { EntitySplunkOnCallCard, SplunkOnCallClient, SplunkOnCallPage, UnauthorizedError, isSplunkOnCallAvailable, splunkOnCallPlugin as plugin, splunkOnCallApiRef, splunkOnCallPlugin };
