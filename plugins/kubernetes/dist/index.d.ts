/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, IdentityApi, OAuthApi, OpenIdConnectApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { KubernetesRequestBody, ObjectsByEntityResponse, ClusterObjects, ClientPodStatus, ClusterAttributes } from '@backstage/plugin-kubernetes-common';
import { JsonObject } from '@backstage/types';
import { V1Pod, V1ReplicaSet, V1Deployment, V1HorizontalPodAutoscaler, V1Service, V1ConfigMap, V1Ingress, V1Job, V1CronJob, V1StatefulSet, V1ObjectMeta } from '@kubernetes/client-node';
import React from 'react';

declare const kubernetesPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    entityContent: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
/**
 * Props of EntityKubernetesContent
 *
 * @public
 */
declare type EntityKubernetesContentProps = {
    /**
     * Sets the refresh interval in milliseconds. The default value is 10000 (10 seconds)
     */
    refreshIntervalMs?: number;
};
declare const EntityKubernetesContent: (props: EntityKubernetesContentProps) => JSX.Element;

declare const isKubernetesAvailable: (entity: Entity) => boolean;
declare const Router: (props: {
    refreshIntervalMs?: number;
}) => JSX.Element;

declare const kubernetesApiRef: _backstage_core_plugin_api.ApiRef<KubernetesApi>;
interface KubernetesApi {
    getObjectsByEntity(requestBody: KubernetesRequestBody): Promise<ObjectsByEntityResponse>;
    getClusters(): Promise<{
        name: string;
        authProvider: string;
        oidcTokenProvider?: string | undefined;
    }[]>;
}

declare class KubernetesBackendClient implements KubernetesApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    private handleResponse;
    private postRequired;
    getObjectsByEntity(requestBody: KubernetesRequestBody): Promise<ObjectsByEntityResponse>;
    getClusters(): Promise<{
        name: string;
        authProvider: string;
    }[]>;
}

interface KubernetesAuthProvider {
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}
declare const kubernetesAuthProvidersApiRef: _backstage_core_plugin_api.ApiRef<KubernetesAuthProvidersApi>;
interface KubernetesAuthProvidersApi {
    decorateRequestBodyForAuth(authProvider: string, requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}

declare class KubernetesAuthProviders implements KubernetesAuthProvidersApi {
    private readonly kubernetesAuthProviderMap;
    constructor(options: {
        googleAuthApi: OAuthApi;
        oidcProviders?: {
            [key: string]: OpenIdConnectApi;
        };
    });
    decorateRequestBodyForAuth(authProvider: string, requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}

declare class AwsKubernetesAuthProvider implements KubernetesAuthProvider {
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}

declare class GoogleKubernetesAuthProvider implements KubernetesAuthProvider {
    authProvider: OAuthApi;
    constructor(authProvider: OAuthApi);
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}

declare class GoogleServiceAccountAuthProvider implements KubernetesAuthProvider {
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}

declare class ServiceAccountKubernetesAuthProvider implements KubernetesAuthProvider {
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}

declare type FormatClusterLinkOptions = {
    dashboardUrl?: string;
    dashboardApp?: string;
    dashboardParameters?: JsonObject;
    object: any;
    kind: string;
};
declare function formatClusterLink(options: FormatClusterLinkOptions): string | undefined;

interface DeploymentResources {
    pods: V1Pod[];
    replicaSets: V1ReplicaSet[];
    deployments: V1Deployment[];
    horizontalPodAutoscalers: V1HorizontalPodAutoscaler[];
}
interface GroupedResponses extends DeploymentResources {
    services: V1Service[];
    configMaps: V1ConfigMap[];
    ingresses: V1Ingress[];
    jobs: V1Job[];
    cronJobs: V1CronJob[];
    customResources: any[];
    statefulsets: V1StatefulSet[];
}
interface ClusterLinksFormatterOptions {
    dashboardUrl?: URL;
    dashboardParameters?: JsonObject;
    object: any;
    kind: string;
}
declare type ClusterLinksFormatter = (options: ClusterLinksFormatterOptions) => URL;

declare const clusterLinksFormatters: Record<string, ClusterLinksFormatter>;

declare type ClusterProps = {
    clusterObjects: ClusterObjects;
    podsWithErrors: Set<string>;
    children?: React.ReactNode;
};
declare const Cluster: ({ clusterObjects, podsWithErrors }: ClusterProps) => JSX.Element;

declare type CronJobsAccordionsProps = {
    children?: React.ReactNode;
};
declare const CronJobsAccordions: ({}: CronJobsAccordionsProps) => JSX.Element;

interface CustomResourcesProps {
    children?: React.ReactNode;
}
declare const CustomResources: ({}: CustomResourcesProps) => JSX.Element;

declare type ErrorPanelProps = {
    entityName: string;
    errorMessage?: string;
    clustersWithErrors?: ClusterObjects[];
    children?: React.ReactNode;
};
declare const ErrorPanel: ({ entityName, errorMessage, clustersWithErrors, }: ErrorPanelProps) => JSX.Element;

declare type ErrorSeverity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
declare type ErrorDetectableKind = 'Pod' | 'Deployment' | 'HorizontalPodAutoscaler';
declare type DetectedErrorsByCluster = Map<string, DetectedError[]>;
interface DetectedError {
    severity: ErrorSeverity;
    cluster: string;
    kind: ErrorDetectableKind;
    names: string[];
    message: string[];
}

declare type ErrorReportingProps = {
    detectedErrors: DetectedErrorsByCluster;
};
declare const ErrorReporting: ({ detectedErrors }: ErrorReportingProps) => JSX.Element;

declare const HorizontalPodAutoscalerDrawer: ({ hpa, expanded, children, }: {
    hpa: V1HorizontalPodAutoscaler;
    expanded?: boolean | undefined;
    children?: React.ReactNode;
}) => JSX.Element;

declare type IngressesAccordionsProps = {};
declare const IngressesAccordions: ({}: IngressesAccordionsProps) => JSX.Element;

declare type JobsAccordionsProps = {
    jobs: V1Job[];
    children?: React.ReactNode;
};
declare const JobsAccordions: ({ jobs }: JobsAccordionsProps) => JSX.Element;

interface KubernetesDrawerable {
    metadata?: V1ObjectMeta;
}
interface KubernetesDrawerProps<T extends KubernetesDrawerable> {
    object: T;
    renderObject: (obj: T) => object;
    buttonVariant?: 'h5' | 'subtitle2';
    kind: string;
    expanded?: boolean;
    children?: React.ReactNode;
}
declare const KubernetesDrawer: <T extends KubernetesDrawerable>({ object, renderObject, kind, buttonVariant, expanded, children, }: KubernetesDrawerProps<T>) => JSX.Element;

declare const PodDrawer: ({ pod, expanded, }: {
    pod: V1Pod;
    expanded?: boolean | undefined;
}) => JSX.Element;

declare type PodColumns = 'READY' | 'RESOURCE';
declare type PodsTablesProps = {
    pods: V1Pod[];
    extraColumns?: PodColumns[];
    children?: React.ReactNode;
};
declare const PodsTable: ({ pods, extraColumns }: PodsTablesProps) => JSX.Element;

declare type ServicesAccordionsProps = {};
declare const ServicesAccordions: ({}: ServicesAccordionsProps) => JSX.Element;

declare type KubernetesContentProps = {
    entity: Entity;
    refreshIntervalMs?: number;
    children?: React.ReactNode;
};
declare const KubernetesContent: ({ entity, refreshIntervalMs, }: KubernetesContentProps) => JSX.Element;

interface KubernetesObjects {
    kubernetesObjects: ObjectsByEntityResponse | undefined;
    error: string | undefined;
}
declare const useKubernetesObjects: (entity: Entity, intervalMs?: number) => KubernetesObjects;

declare const PodNamesWithErrorsContext: React.Context<Set<string>>;

declare const PodNamesWithMetricsContext: React.Context<Map<string, ClientPodStatus>>;

declare const GroupedResponsesContext: React.Context<GroupedResponses>;

declare const ClusterContext: React.Context<ClusterAttributes>;

export { AwsKubernetesAuthProvider, Cluster, ClusterContext, ClusterLinksFormatter, ClusterLinksFormatterOptions, CronJobsAccordions, CustomResources, DeploymentResources, EntityKubernetesContent, EntityKubernetesContentProps, ErrorPanel, ErrorReporting, GoogleKubernetesAuthProvider, GoogleServiceAccountAuthProvider, GroupedResponses, GroupedResponsesContext, HorizontalPodAutoscalerDrawer, IngressesAccordions, JobsAccordions, KubernetesApi, KubernetesAuthProviders, KubernetesAuthProvidersApi, KubernetesBackendClient, KubernetesContent, KubernetesDrawer, KubernetesObjects, PodDrawer, PodNamesWithErrorsContext, PodNamesWithMetricsContext, PodsTable, Router, ServiceAccountKubernetesAuthProvider, ServicesAccordions, clusterLinksFormatters, formatClusterLink, isKubernetesAvailable, kubernetesApiRef, kubernetesAuthProvidersApiRef, kubernetesPlugin, kubernetesPlugin as plugin, useKubernetesObjects };
