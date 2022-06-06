/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, ConfigApi, IconComponent } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare const ilertPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const ILertPage$1: () => JSX.Element;
declare const EntityILertCard: () => JSX.Element;

declare const ILertPage: () => JSX.Element;

declare const isPluginApplicableToEntity: (entity: Entity) => boolean;
declare const ILertCard: () => JSX.Element;

interface Incident {
    id: number;
    summary: string;
    details: string;
    reportTime: string;
    resolvedOn: string;
    status: IncidentStatus;
    priority: IncidentPriority;
    incidentKey: string;
    alertSource: AlertSource | null;
    assignedTo: User | null;
    logEntries: LogEntry[];
    links: Link[];
    images: Image[];
    subscribers: Subscriber[];
    commentText: string;
    commentPublishToSubscribers: boolean;
}
declare const PENDING = "PENDING";
declare const ACCEPTED = "ACCEPTED";
declare const RESOLVED = "RESOLVED";
declare type IncidentStatus = typeof PENDING | typeof ACCEPTED | typeof RESOLVED;
declare type IncidentPriority = 'HIGH' | 'LOW';
interface Link {
    href: string;
    text: string;
}
interface Image {
    src: string;
    href: string;
    alt: string;
}
declare type SubscriberType = 'TEAM' | 'USER';
interface Subscriber {
    id: number;
    name: string;
    type: SubscriberType;
}
interface LogEntry {
    id: number;
    timestamp: string;
    logEntryType: string;
    text: string;
    incidentId?: number;
    iconName?: string;
    iconClass?: string;
    filterTypes?: string[];
}
interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: Phone;
    landline: Phone;
    timezone?: string;
    language?: Language;
    role?: UserRole;
    notificationPreferences?: any[];
    position: string;
    department: string;
}
declare type UserRole = 'USER' | 'ADMIN' | 'STAKEHOLDER' | 'ACCOUNT_OWNER' | 'RESPONDER';
declare type Language = 'de' | 'en';
interface Phone {
    regionCode: string;
    number: string;
}
interface AlertSource {
    id: number;
    name: string;
    status: AlertSourceStatus;
    escalationPolicy: EscalationPolicy;
    integrationType: AlertSourceIntegrationType;
    integrationKey?: string;
    iconUrl?: string;
    lightIconUrl?: string;
    darkIconUrl?: string;
    incidentCreation?: AlertSourceIncidentCreation;
    incidentPriorityRule?: AlertSourceIncidentPriorityRule;
    emailFiltered?: boolean;
    emailResolveFiltered?: boolean;
    active?: boolean;
    emailPredicates?: AlertSourceEmailPredicate[];
    emailResolvePredicates?: AlertSourceEmailPredicate[];
    filterOperator?: AlertSourceFilterOperator;
    resolveFilterOperator?: AlertSourceFilterOperator;
    supportHours?: AlertSourceSupportHours;
    heartbeat?: AlertSourceHeartbeat;
    autotaskMetadata?: AlertSourceAutotaskMetadata;
    autoResolutionTimeout?: string;
    teams: TeamShort[];
}
interface TeamShort {
    id: number;
    name: string;
}
declare type AlertSourceStatus = 'PENDING' | 'ALL_ACCEPTED' | 'ALL_RESOLVED' | 'IN_MAINTENANCE' | 'DISABLED';
declare type AlertSourceIntegrationType = 'NAGIOS' | 'ICINGA' | 'EMAIL' | 'SMS' | 'API' | 'CRN' | 'HEARTBEAT' | 'PRTG' | 'PINGDOM' | 'CLOUDWATCH' | 'AWSPHD' | 'STACKDRIVER' | 'INSTANA' | 'ZABBIX' | 'SOLARWINDS' | 'PROMETHEUS' | 'NEWRELIC' | 'GRAFANA' | 'GITHUB' | 'DATADOG' | 'UPTIMEROBOT' | 'APPDYNAMICS' | 'DYNATRACE' | 'TOPDESK' | 'STATUSCAKE' | 'MONITOR' | 'TOOL' | 'CHECKMK' | 'AUTOTASK' | 'AWSBUDGET' | 'KENTIXAM' | 'CONSUL' | 'ZAMMAD' | 'SIGNALFX' | 'SPLUNK' | 'KUBERNETES' | 'SEMATEXT' | 'SENTRY' | 'SUMOLOGIC' | 'RAYGUN' | 'MXTOOLBOX' | 'ESWATCHER' | 'AMAZONSNS' | 'KAPACITOR' | 'CORTEXXSOAR' | string;
declare type AlertSourceIncidentCreation = 'ONE_INCIDENT_PER_EMAIL' | 'ONE_INCIDENT_PER_EMAIL_SUBJECT' | 'ONE_PENDING_INCIDENT_ALLOWED' | 'ONE_OPEN_INCIDENT_ALLOWED' | 'OPEN_RESOLVE_ON_EXTRACTION';
declare type AlertSourceFilterOperator = 'AND' | 'OR';
declare type AlertSourceIncidentPriorityRule = 'HIGH' | 'LOW' | 'HIGH_DURING_SUPPORT_HOURS' | 'LOW_DURING_SUPPORT_HOURS';
interface AlertSourceEmailPredicate {
    field: 'EMAIL_FROM' | 'EMAIL_SUBJECT' | 'EMAIL_BODY';
    criteria: 'CONTAINS_ANY_WORDS' | 'CONTAINS_NOT_WORDS' | 'CONTAINS_STRING' | 'CONTAINS_NOT_STRING' | 'IS_STRING' | 'IS_NOT_STRING' | 'MATCHES_REGEX' | 'MATCHES_NOT_REGEX';
    value: string;
}
declare type AlertSourceTimeZone = 'Europe/Berlin' | 'America/New_York' | 'America/Los_Angeles' | 'Asia/Istanbul';
interface AlertSourceSupportDay {
    start: string;
    end: string;
}
interface AlertSourceSupportHours {
    timezone: AlertSourceTimeZone;
    autoRaiseIncidents: boolean;
    supportDays: {
        MONDAY: AlertSourceSupportDay;
        TUESDAY: AlertSourceSupportDay;
        WEDNESDAY: AlertSourceSupportDay;
        THURSDAY: AlertSourceSupportDay;
        FRIDAY: AlertSourceSupportDay;
        SATURDAY: AlertSourceSupportDay;
        SUNDAY: AlertSourceSupportDay;
    };
}
interface AlertSourceHeartbeat {
    summary: string;
    intervalSec: number;
    status: 'OVERDUE' | 'ON_TIME' | 'NEVER_RECEIVED';
}
interface AlertSourceAutotaskMetadata {
    userName: string;
    secret: string;
    apiIntegrationCode: string;
    webServer: string;
}
interface EscalationPolicy {
    id: number;
    name: string;
    escalationRules: EscalationRule[];
    newEscalationRule: EscalationRule;
    repeating?: boolean;
    frequency?: number;
    teams: TeamShort[];
}
interface EscalationRule {
    user: User | null;
    schedule: Schedule | null;
    escalationTimeout: number;
}
interface Schedule {
    id: number;
    name: string;
    timezone: string;
    startsOn: string;
    currentShift: Shift;
    nextShift: Shift;
    shifts: Shift[];
    overrides: Shift[];
    teams: TeamShort[];
}
interface Shift {
    user: User;
    start: string;
    end: string;
}
interface UptimeMonitor {
    id: number;
    name: string;
    region: 'EU' | 'US';
    checkType: 'http' | 'tcp' | 'udp' | 'ping';
    checkParams: UptimeMonitorCheckParams;
    intervalSec: number;
    timeoutMs: number;
    createIncidentAfterFailedChecks: number;
    paused: boolean;
    embedUrl: string;
    shareUrl: string;
    status: string;
    lastStatusChange: string;
    escalationPolicy: EscalationPolicy;
    teams: TeamShort[];
}
interface UptimeMonitorCheckParams {
    host?: string;
    port?: number;
    url?: string;
}
interface IncidentResponder {
    group: 'SUGGESTED' | 'USER' | 'ESCALATION_POLICY' | 'ON_CALL_SCHEDULE';
    id: number;
    name: string;
    disabled: boolean;
}
interface IncidentAction {
    name: string;
    type: string;
    webhookId: string;
    extensionId?: string;
    history?: IncidentActionHistory[];
}
interface IncidentActionHistory {
    id: string;
    webhookId: string;
    incidentId: number;
    actor: User;
    success: boolean;
}
interface OnCall {
    user: User;
    escalationPolicy: EscalationPolicy;
    schedule?: Schedule;
    start: string;
    end: string;
    escalationLevel: number;
}

declare type TableState = {
    page: number;
    pageSize: number;
};
declare type GetIncidentsOpts = {
    maxResults?: number;
    startIndex?: number;
    states?: IncidentStatus[];
    alertSources?: number[];
};
declare type GetIncidentsCountOpts = {
    states?: IncidentStatus[];
};
declare type EventRequest = {
    integrationKey: string;
    summary: string;
    details: string;
    userName: string;
    source: string;
};
interface ILertApi {
    fetchIncidents(opts?: GetIncidentsOpts): Promise<Incident[]>;
    fetchIncidentsCount(opts?: GetIncidentsCountOpts): Promise<number>;
    fetchIncident(id: number): Promise<Incident>;
    fetchIncidentResponders(incident: Incident): Promise<IncidentResponder[]>;
    fetchIncidentActions(incident: Incident): Promise<IncidentAction[]>;
    acceptIncident(incident: Incident, userName: string): Promise<Incident>;
    resolveIncident(incident: Incident, userName: string): Promise<Incident>;
    assignIncident(incident: Incident, responder: IncidentResponder): Promise<Incident>;
    createIncident(eventRequest: EventRequest): Promise<boolean>;
    triggerIncidentAction(incident: Incident, action: IncidentAction): Promise<void>;
    fetchUptimeMonitors(): Promise<UptimeMonitor[]>;
    pauseUptimeMonitor(uptimeMonitor: UptimeMonitor): Promise<UptimeMonitor>;
    resumeUptimeMonitor(uptimeMonitor: UptimeMonitor): Promise<UptimeMonitor>;
    fetchUptimeMonitor(id: number): Promise<UptimeMonitor>;
    fetchAlertSources(): Promise<AlertSource[]>;
    fetchAlertSource(idOrIntegrationKey: number | string): Promise<AlertSource>;
    fetchAlertSourceOnCalls(alertSource: AlertSource): Promise<OnCall[]>;
    enableAlertSource(alertSource: AlertSource): Promise<AlertSource>;
    disableAlertSource(alertSource: AlertSource): Promise<AlertSource>;
    addImmediateMaintenance(alertSourceId: number, minutes: number): Promise<void>;
    fetchOnCallSchedules(): Promise<Schedule[]>;
    fetchUsers(): Promise<User[]>;
    overrideShift(scheduleId: number, userId: number, start: string, end: string): Promise<Schedule>;
    getIncidentDetailsURL(incident: Incident): string;
    getAlertSourceDetailsURL(alertSource: AlertSource | null): string;
    getEscalationPolicyDetailsURL(escalationPolicy: EscalationPolicy): string;
    getUptimeMonitorDetailsURL(uptimeMonitor: UptimeMonitor): string;
    getScheduleDetailsURL(schedule: Schedule): string;
    getUserPhoneNumber(user: User | null): string;
    getUserInitials(user: User | null): string;
}
declare type Options = {
    discoveryApi: DiscoveryApi;
    /**
     * URL used by users to access iLert web UI.
     * Example: https://my-org.ilert.com/
     */
    baseUrl: string;
    /**
     * Path to use for requests via the proxy, defaults to /ilert/api
     */
    proxyPath: string;
};

declare const ilertApiRef: _backstage_core_plugin_api.ApiRef<ILertApi>;
declare class ILertClient implements ILertApi {
    private readonly discoveryApi;
    private readonly proxyPath;
    private readonly baseUrl;
    static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi): ILertClient;
    constructor(opts: Options);
    private fetch;
    fetchIncidents(opts?: GetIncidentsOpts): Promise<Incident[]>;
    fetchIncidentsCount(opts?: GetIncidentsCountOpts): Promise<number>;
    fetchIncident(id: number): Promise<Incident>;
    fetchIncidentResponders(incident: Incident): Promise<IncidentResponder[]>;
    fetchIncidentActions(incident: Incident): Promise<IncidentAction[]>;
    acceptIncident(incident: Incident, userName: string): Promise<Incident>;
    resolveIncident(incident: Incident, userName: string): Promise<Incident>;
    assignIncident(incident: Incident, responder: IncidentResponder): Promise<Incident>;
    triggerIncidentAction(incident: Incident, action: IncidentAction): Promise<void>;
    createIncident(eventRequest: EventRequest): Promise<boolean>;
    fetchUptimeMonitors(): Promise<UptimeMonitor[]>;
    fetchUptimeMonitor(id: number): Promise<UptimeMonitor>;
    pauseUptimeMonitor(uptimeMonitor: UptimeMonitor): Promise<UptimeMonitor>;
    resumeUptimeMonitor(uptimeMonitor: UptimeMonitor): Promise<UptimeMonitor>;
    fetchAlertSources(): Promise<AlertSource[]>;
    fetchAlertSource(idOrIntegrationKey: number | string): Promise<AlertSource>;
    fetchAlertSourceOnCalls(alertSource: AlertSource): Promise<OnCall[]>;
    enableAlertSource(alertSource: AlertSource): Promise<AlertSource>;
    disableAlertSource(alertSource: AlertSource): Promise<AlertSource>;
    addImmediateMaintenance(alertSourceId: number, minutes: number): Promise<void>;
    fetchOnCallSchedules(): Promise<Schedule[]>;
    fetchUsers(): Promise<User[]>;
    overrideShift(scheduleId: number, userId: number, start: string, end: string): Promise<Schedule>;
    getIncidentDetailsURL(incident: Incident): string;
    getAlertSourceDetailsURL(alertSource: AlertSource | null): string;
    getEscalationPolicyDetailsURL(escalationPolicy: EscalationPolicy): string;
    getUptimeMonitorDetailsURL(uptimeMonitor: UptimeMonitor): string;
    getScheduleDetailsURL(schedule: Schedule): string;
    getUserPhoneNumber(user: User | null): string;
    getUserInitials(user: User | null): string;
    private apiUrl;
}

declare const iLertRouteRef: _backstage_core_plugin_api.RouteRef<undefined>;

declare const ILertIcon: IconComponent;

export { EntityILertCard, GetIncidentsCountOpts, GetIncidentsOpts, ILertApi, ILertCard, ILertClient, ILertIcon, ILertPage$1 as ILertPage, ILertPage as Router, TableState, iLertRouteRef, ilertApiRef, ilertPlugin, isPluginApplicableToEntity as isILertAvailable, isPluginApplicableToEntity, ilertPlugin as plugin };
