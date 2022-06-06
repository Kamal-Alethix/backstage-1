export declare type Team = {
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
export declare type OnCall = {
    team?: OnCallTeamResource;
    oncallNow?: OnCallNowResource[];
};
export declare type OnCallTeamResource = {
    name?: string;
    slug?: string;
};
export declare type OnCallNowResource = {
    escalationPolicy?: OnCallEscalationPolicyResource;
    users?: OnCallUsersResource[];
};
export declare type OnCallEscalationPolicyResource = {
    name?: string;
    slug?: string;
};
export declare type OnCallUsersResource = {
    onCalluser?: OnCallUser;
};
export declare type OnCallUser = {
    username?: string;
};
export declare type User = {
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
export declare type IncidentPhase = 'UNACKED' | 'ACKED' | 'RESOLVED';
export declare type Incident = {
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
export declare type EscalationPolicyInfo = {
    policy: EscalationPolicySummary;
    team?: EscalationPolicyTeam;
};
export declare type IncidentTransition = {
    name?: string;
    at?: string;
    by?: string;
    message?: string;
    manually?: boolean;
    alertId?: string;
    alertUrl?: string;
};
export declare type EscalationPolicySummary = {
    name: string;
    slug: string;
    _selfUrl: string;
};
export declare type EscalationPolicyTeam = {
    name: string;
    slug: string;
};
export declare type RoutingKey = {
    routingKey: string;
    targets: RoutingKeyTarget[];
    isDefault: boolean;
};
export declare type RoutingKeyTarget = {
    policyName: string;
    policySlug: string;
    _teamUrl: string;
};
