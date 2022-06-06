/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare type RollbarEnvironment = 'production' | string;
declare enum RollbarLevel {
    debug = 10,
    info = 20,
    warning = 30,
    error = 40,
    critical = 50
}
declare enum RollbarFrameworkId {
    'unknown' = 0,
    'rails' = 1,
    'django' = 2,
    'pyramid' = 3,
    'node-js' = 4,
    'pylons' = 5,
    'php' = 6,
    'browser-js' = 7,
    'rollbar-system' = 8,
    'android' = 9,
    'ios' = 10,
    'mailgun' = 11,
    'logentries' = 12,
    'python' = 13,
    'ruby' = 14,
    'sidekiq' = 15,
    'flask' = 16,
    'celery' = 17,
    'rq' = 18
}
declare enum RollbarPlatformId {
    'unknown' = 0,
    'browser' = 1,
    'flash' = 2,
    'android' = 3,
    'ios' = 4,
    'heroku' = 5,
    'google-app-engine' = 6,
    'client' = 7
}
declare type RollbarProject = {
    id: number;
    name: string;
    accountId: number;
    status: 'enabled' | string;
};
declare type RollbarItem = {
    publicItemId: number;
    integrationsData: null;
    levelLock: number;
    controllingId: number;
    lastActivatedTimestamp: number;
    assignedUserId: number;
    groupStatus: number;
    hash: string;
    id: number;
    environment: RollbarEnvironment;
    titleLock: number;
    title: string;
    lastOccurrenceId: number;
    lastOccurrenceTimestamp: number;
    platform: RollbarPlatformId;
    firstOccurrenceTimestamp: number;
    project_id: number;
    resolvedInVersion: string;
    status: 'enabled' | string;
    uniqueOccurrences: number;
    groupItemId: number;
    framework: RollbarFrameworkId;
    totalOccurrences: number;
    level: RollbarLevel;
    counter: number;
    lastModifiedBy: number;
    firstOccurrenceId: number;
    activatingOccurrenceId: number;
    lastResolvedTimestamp: number;
};
declare type RollbarItemsResponse = {
    items: RollbarItem[];
    page: number;
    totalCount: number;
};
declare type RollbarTopActiveItem = {
    item: {
        id: number;
        counter: number;
        environment: RollbarEnvironment;
        framework: RollbarFrameworkId;
        lastOccurrenceTimestamp: number;
        level: number;
        occurrences: number;
        projectId: number;
        title: string;
        uniqueOccurrences: number;
    };
    counts: number[];
};

declare const rollbarApiRef: _backstage_core_plugin_api.ApiRef<RollbarApi>;
interface RollbarApi {
    getAllProjects(): Promise<RollbarProject[]>;
    getProject(projectName: string): Promise<RollbarProject>;
    getTopActiveItems(project: string, hours?: number): Promise<RollbarTopActiveItem[]>;
    getProjectItems(project: string): Promise<RollbarItemsResponse>;
}

declare class RollbarClient implements RollbarApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    getAllProjects(): Promise<RollbarProject[]>;
    getProject(projectName: string): Promise<RollbarProject>;
    getTopActiveItems(project: string, hours?: number, environment?: string): Promise<RollbarTopActiveItem[]>;
    getProjectItems(project: string): Promise<RollbarItemsResponse>;
    private get;
}

declare const EntityPageRollbar: () => JSX.Element;

declare const isPluginApplicableToEntity: (entity: Entity) => boolean;
declare type Props = {};
declare const Router: (_props: Props) => JSX.Element;

declare const ROLLBAR_ANNOTATION = "rollbar.com/project-slug";

declare const rollbarPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    entityContent: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityRollbarContent: (_props: {}) => JSX.Element;

export { EntityPageRollbar, EntityRollbarContent, ROLLBAR_ANNOTATION, RollbarApi, RollbarClient, Router, isPluginApplicableToEntity, isPluginApplicableToEntity as isRollbarAvailable, rollbarPlugin as plugin, rollbarApiRef, rollbarPlugin };
