/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { InfoCardVariants } from '@backstage/core-components';
import { Options } from '@material-table/core';

declare type SentryPlatform = 'javascript' | 'javascript-react' | string;
declare type EventPoint = number[];
declare type SentryProject = {
    platform: SentryPlatform;
    slug: string;
    id: string;
    name: string;
};
declare type SentryIssueMetadata = {
    function?: string;
    type?: string;
    value?: string;
    filename?: string;
};
declare type SentryIssue = {
    platform: SentryPlatform;
    lastSeen: string;
    numComments: number;
    userCount: number;
    stats: {
        '24h'?: EventPoint[];
        '14d'?: EventPoint[];
    };
    culprit: string;
    title: string;
    id: string;
    assignedTo: any;
    logger: any;
    type: string;
    annotations: any[];
    metadata: SentryIssueMetadata;
    status: string;
    subscriptionDetails: any;
    isPublic: boolean;
    hasSeen: boolean;
    shortId: string;
    shareId: string | null;
    firstSeen: string;
    count: string;
    permalink: string;
    level: string;
    isSubscribed: boolean;
    isBookmarked: boolean;
    project: SentryProject;
    statusDetails: any;
};

declare const sentryApiRef: _backstage_core_plugin_api.ApiRef<SentryApi>;
interface SentryApi {
    fetchIssues(project: string, statsFor: string, query?: string): Promise<SentryIssue[]>;
}

declare class MockSentryApi implements SentryApi {
    fetchIssues(): Promise<SentryIssue[]>;
}

declare class ProductionSentryApi implements SentryApi {
    private readonly discoveryApi;
    private readonly organization;
    private readonly identityApi?;
    constructor(discoveryApi: DiscoveryApi, organization: string, identityApi?: IdentityApi | undefined);
    fetchIssues(project: string, statsFor: string, query?: string): Promise<SentryIssue[]>;
    private authOptions;
}

declare const SentryIssuesWidget: ({ entity, statsFor, tableOptions, variant, query, }: {
    entity: Entity;
    statsFor: '24h' | '14d' | '';
    tableOptions: Options<never>;
    variant?: InfoCardVariants | undefined;
    query?: string | undefined;
}) => JSX.Element;

/**
 * @public
 * Checks to see if sentry is available
 */
declare const isSentryAvailable: (entity: Entity) => boolean;

declare const sentryPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;

declare type SentryPageProps = {
    statsFor?: '24h' | '14d' | '';
    tableOptions?: Options<never>;
};
declare const EntitySentryContent: ({ statsFor, tableOptions }: SentryPageProps) => JSX.Element;
declare const EntitySentryCard: ({ statsFor, tableOptions, }: SentryPageProps) => JSX.Element;

declare const Router: ({ entity }: {
    entity: Entity;
}) => JSX.Element;

export { EntitySentryCard, EntitySentryContent, MockSentryApi, ProductionSentryApi, Router, SentryApi, SentryIssue, SentryIssuesWidget, isSentryAvailable, sentryPlugin as plugin, sentryApiRef, sentryPlugin };
