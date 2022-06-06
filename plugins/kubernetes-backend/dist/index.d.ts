import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { JsonObject } from '@backstage/types';
import { KubernetesFetchError, FetchResponse, KubernetesRequestBody, ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
import { PodStatus } from '@kubernetes/client-node/dist/top';
import express from 'express';
import { Duration } from 'luxon';

interface ObjectFetchParams {
    serviceId: string;
    clusterDetails: AWSClusterDetails | GKEClusterDetails | ServiceAccountClusterDetails | ClusterDetails;
    objectTypesToFetch: Set<ObjectToFetch>;
    labelSelector: string;
    customResources: CustomResource[];
    namespace?: string;
}
interface KubernetesFetcher {
    fetchObjectsForService(params: ObjectFetchParams): Promise<FetchResponseWrapper>;
    fetchPodMetricsByNamespace(clusterDetails: ClusterDetails, namespace: string): Promise<PodStatus[]>;
}
interface FetchResponseWrapper {
    errors: KubernetesFetchError[];
    responses: FetchResponse[];
}
interface ObjectToFetch {
    objectType: KubernetesObjectTypes;
    group: string;
    apiVersion: string;
    plural: string;
}
interface CustomResource extends ObjectToFetch {
    objectType: 'customresources';
}
declare type KubernetesObjectTypes = 'pods' | 'services' | 'configmaps' | 'deployments' | 'replicasets' | 'horizontalpodautoscalers' | 'jobs' | 'cronjobs' | 'ingresses' | 'customresources' | 'statefulsets';
interface KubernetesClustersSupplier {
    /**
     * Returns the cached list of clusters.
     *
     * Implementations _should_ cache the clusters and refresh them periodically,
     * as getClusters is called whenever the list of clusters is needed.
     */
    getClusters(): Promise<ClusterDetails[]>;
}
interface KubernetesServiceLocator {
    getClustersByServiceId(serviceId: string): Promise<ClusterDetails[]>;
}
declare type ServiceLocatorMethod = 'multiTenant' | 'http';
interface ClusterDetails {
    /**
     * Specifies the name of the Kubernetes cluster.
     */
    name: string;
    url: string;
    authProvider: string;
    serviceAccountToken?: string | undefined;
    /**
     * oidc provider used to get id tokens to authenticate against kubernetes
     */
    oidcTokenProvider?: string | undefined;
    skipTLSVerify?: boolean;
    /**
     * Whether to skip the lookup to the metrics server to retrieve pod resource usage.
     * It is not guaranteed that the Kubernetes distro has the metrics server installed.
     */
    skipMetricsLookup?: boolean;
    caData?: string | undefined;
    /**
     * Specifies the link to the Kubernetes dashboard managing this cluster.
     * @remarks
     * Note that you should specify the app used for the dashboard
     * using the dashboardApp property, in order to properly format
     * links to kubernetes resources, otherwise it will assume that you're running the standard one.
     * @see dashboardApp
     * @see dashboardParameters
     */
    dashboardUrl?: string;
    /**
     * Specifies the app that provides the Kubernetes dashboard.
     * This will be used for formatting links to kubernetes objects inside the dashboard.
     * @remarks
     * The existing apps are: standard, rancher, openshift, gke, aks, eks
     * Note that it will default to the regular dashboard provided by the Kubernetes project (standard).
     * Note that you can add your own formatter by registering it to the clusterLinksFormatters dictionary.
     * @defaultValue standard
     * @see dashboardUrl
     * @example
     * ```ts
     * import { clusterLinksFormatters } from '@backstage/plugin-kubernetes';
     * clusterLinksFormatters.myDashboard = (options) => ...;
     * ```
     */
    dashboardApp?: string;
    /**
     * Specifies specific parameters used by some dashboard URL formatters.
     * This is used by the GKE formatter which requires the project, region and cluster name.
     * @see dashboardApp
     */
    dashboardParameters?: JsonObject;
}
interface GKEClusterDetails extends ClusterDetails {
}
interface AzureClusterDetails extends ClusterDetails {
}
interface ServiceAccountClusterDetails extends ClusterDetails {
}
interface AWSClusterDetails extends ClusterDetails {
    assumeRole?: string;
    externalId?: string;
}
interface KubernetesObjectsProviderOptions {
    logger: Logger;
    fetcher: KubernetesFetcher;
    serviceLocator: KubernetesServiceLocator;
    customResources: CustomResource[];
    objectTypesToFetch?: ObjectToFetch[];
}
declare type ObjectsByEntityRequest = KubernetesRequestBody;
interface KubernetesObjectsProvider {
    getKubernetesObjectsByEntity(request: ObjectsByEntityRequest): Promise<ObjectsByEntityResponse>;
}

interface RouterOptions {
    logger: Logger;
    config: Config;
    clusterSupplier?: KubernetesClustersSupplier;
}
/**
 * creates and configure a new router for handling the kubernetes backend APIs
 * @param options - specifies the options required by this plugin
 * @returns a new router
 * @deprecated Please use the new KubernetesBuilder instead like this
 * ```
 * import { KubernetesBuilder } from '@backstage/plugin-kubernetes-backend';
 * const { router } = await KubernetesBuilder.createBuilder({
 *   logger,
 *   config,
 * }).build();
 * ```
 */
declare function createRouter(options: RouterOptions): Promise<express.Router>;

interface KubernetesEnvironment {
    logger: Logger;
    config: Config;
}
/**
 * The return type of the `KubernetesBuilder.build` method
 *
 * @public
 */
declare type KubernetesBuilderReturn = Promise<{
    router: express.Router;
    clusterSupplier: KubernetesClustersSupplier;
    customResources: CustomResource[];
    fetcher: KubernetesFetcher;
    objectsProvider: KubernetesObjectsProvider;
    serviceLocator: KubernetesServiceLocator;
}>;
declare class KubernetesBuilder {
    protected readonly env: KubernetesEnvironment;
    private clusterSupplier?;
    private defaultClusterRefreshInterval;
    private objectsProvider?;
    private fetcher?;
    private serviceLocator?;
    static createBuilder(env: KubernetesEnvironment): KubernetesBuilder;
    constructor(env: KubernetesEnvironment);
    build(): KubernetesBuilderReturn;
    setClusterSupplier(clusterSupplier?: KubernetesClustersSupplier): this;
    setDefaultClusterRefreshInterval(refreshInterval: Duration): this;
    setObjectsProvider(objectsProvider?: KubernetesObjectsProvider): this;
    setFetcher(fetcher?: KubernetesFetcher): this;
    setServiceLocator(serviceLocator?: KubernetesServiceLocator): this;
    protected buildCustomResources(): CustomResource[];
    protected buildClusterSupplier(refreshInterval: Duration): KubernetesClustersSupplier;
    protected buildObjectsProvider(options: KubernetesObjectsProviderOptions): KubernetesObjectsProvider;
    protected buildFetcher(): KubernetesFetcher;
    protected buildServiceLocator(method: ServiceLocatorMethod, clusterSupplier: KubernetesClustersSupplier): KubernetesServiceLocator;
    protected buildMultiTenantServiceLocator(clusterSupplier: KubernetesClustersSupplier): KubernetesServiceLocator;
    protected buildHttpServiceLocator(_clusterSupplier: KubernetesClustersSupplier): KubernetesServiceLocator;
    protected buildRouter(objectsProvider: KubernetesObjectsProvider, clusterSupplier: KubernetesClustersSupplier): express.Router;
    protected fetchClusterDetails(clusterSupplier: KubernetesClustersSupplier): Promise<ClusterDetails[]>;
    protected getServiceLocatorMethod(): ServiceLocatorMethod;
    protected getObjectTypesToFetch(): ObjectToFetch[] | undefined;
}

declare const DEFAULT_OBJECTS: ObjectToFetch[];

export { AWSClusterDetails, AzureClusterDetails, ClusterDetails, CustomResource, DEFAULT_OBJECTS, FetchResponseWrapper, GKEClusterDetails, KubernetesBuilder, KubernetesBuilderReturn, KubernetesClustersSupplier, KubernetesEnvironment, KubernetesFetcher, KubernetesObjectTypes, KubernetesObjectsProvider, KubernetesObjectsProviderOptions, KubernetesServiceLocator, ObjectFetchParams, ObjectToFetch, ObjectsByEntityRequest, RouterOptions, ServiceAccountClusterDetails, ServiceLocatorMethod, createRouter };
