import { Logger } from 'winston';
import type { JsonObject } from '@backstage/types';
import type { FetchResponse, KubernetesFetchError, KubernetesRequestBody, ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
import { PodStatus } from '@kubernetes/client-node/dist/top';
export interface ObjectFetchParams {
    serviceId: string;
    clusterDetails: AWSClusterDetails | GKEClusterDetails | ServiceAccountClusterDetails | ClusterDetails;
    objectTypesToFetch: Set<ObjectToFetch>;
    labelSelector: string;
    customResources: CustomResource[];
    namespace?: string;
}
export interface KubernetesFetcher {
    fetchObjectsForService(params: ObjectFetchParams): Promise<FetchResponseWrapper>;
    fetchPodMetricsByNamespace(clusterDetails: ClusterDetails, namespace: string): Promise<PodStatus[]>;
}
export interface FetchResponseWrapper {
    errors: KubernetesFetchError[];
    responses: FetchResponse[];
}
export interface ObjectToFetch {
    objectType: KubernetesObjectTypes;
    group: string;
    apiVersion: string;
    plural: string;
}
export interface CustomResource extends ObjectToFetch {
    objectType: 'customresources';
}
export declare type KubernetesObjectTypes = 'pods' | 'services' | 'configmaps' | 'deployments' | 'replicasets' | 'horizontalpodautoscalers' | 'jobs' | 'cronjobs' | 'ingresses' | 'customresources' | 'statefulsets';
export interface KubernetesClustersSupplier {
    /**
     * Returns the cached list of clusters.
     *
     * Implementations _should_ cache the clusters and refresh them periodically,
     * as getClusters is called whenever the list of clusters is needed.
     */
    getClusters(): Promise<ClusterDetails[]>;
}
export interface KubernetesServiceLocator {
    getClustersByServiceId(serviceId: string): Promise<ClusterDetails[]>;
}
export declare type ServiceLocatorMethod = 'multiTenant' | 'http';
export interface ClusterDetails {
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
export interface GKEClusterDetails extends ClusterDetails {
}
export interface AzureClusterDetails extends ClusterDetails {
}
export interface ServiceAccountClusterDetails extends ClusterDetails {
}
export interface AWSClusterDetails extends ClusterDetails {
    assumeRole?: string;
    externalId?: string;
}
export interface KubernetesObjectsProviderOptions {
    logger: Logger;
    fetcher: KubernetesFetcher;
    serviceLocator: KubernetesServiceLocator;
    customResources: CustomResource[];
    objectTypesToFetch?: ObjectToFetch[];
}
export declare type ObjectsByEntityRequest = KubernetesRequestBody;
export interface KubernetesObjectsProvider {
    getKubernetesObjectsByEntity(request: ObjectsByEntityRequest): Promise<ObjectsByEntityResponse>;
}
