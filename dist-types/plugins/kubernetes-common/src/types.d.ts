import type { JsonObject } from '@backstage/types';
import { V1ConfigMap, V1CronJob, V1Deployment, V1HorizontalPodAutoscaler, V1Ingress, V1Job, V1Pod, V1ReplicaSet, V1Service, V1StatefulSet } from '@kubernetes/client-node';
import { Entity } from '@backstage/catalog-model';
export interface KubernetesRequestBody {
    auth?: {
        google?: string;
        oidc?: {
            [key: string]: string;
        };
    };
    entity: Entity;
}
export interface ClusterAttributes {
    /**
     * Specifies the name of the Kubernetes cluster.
     */
    name: string;
    /**
     * Specifies the link to the Kubernetes dashboard managing this cluster.
     * @remarks
     * Note that you should specify the app used for the dashboard
     * using the dashboardApp property, in order to properly format
     * links to kubernetes resources,  otherwise it will assume that you're running the standard one.
     * Also, for cloud clusters such as GKE, you should provide addititonal parameters using dashboardParameters.
     * @see dashboardApp
     */
    dashboardUrl?: string;
    /**
     * Specifies the app that provides the Kubernetes dashboard.
     * This will be used for formatting links to kubernetes objects inside the dashboard.
     * @remarks
     * The supported dashboards are: standard, rancher, openshift, gke, aks, eks
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
     */
    dashboardParameters?: JsonObject;
}
export interface ClusterObjects {
    cluster: ClusterAttributes;
    resources: FetchResponse[];
    podMetrics: ClientPodStatus[];
    errors: KubernetesFetchError[];
}
export interface ObjectsByEntityResponse {
    items: ClusterObjects[];
}
export declare type AuthProviderType = 'google' | 'serviceAccount' | 'aws' | 'azure';
export declare type FetchResponse = PodFetchResponse | ServiceFetchResponse | ConfigMapFetchResponse | DeploymentFetchResponse | ReplicaSetsFetchResponse | HorizontalPodAutoscalersFetchResponse | JobsFetchResponse | CronJobsFetchResponse | IngressesFetchResponse | CustomResourceFetchResponse | StatefulSetsFetchResponse;
export interface PodFetchResponse {
    type: 'pods';
    resources: Array<V1Pod>;
}
export interface ServiceFetchResponse {
    type: 'services';
    resources: Array<V1Service>;
}
export interface ConfigMapFetchResponse {
    type: 'configmaps';
    resources: Array<V1ConfigMap>;
}
export interface DeploymentFetchResponse {
    type: 'deployments';
    resources: Array<V1Deployment>;
}
export interface ReplicaSetsFetchResponse {
    type: 'replicasets';
    resources: Array<V1ReplicaSet>;
}
export interface HorizontalPodAutoscalersFetchResponse {
    type: 'horizontalpodautoscalers';
    resources: Array<V1HorizontalPodAutoscaler>;
}
export interface JobsFetchResponse {
    type: 'jobs';
    resources: Array<V1Job>;
}
export interface CronJobsFetchResponse {
    type: 'cronjobs';
    resources: Array<V1CronJob>;
}
export interface IngressesFetchResponse {
    type: 'ingresses';
    resources: Array<V1Ingress>;
}
export interface CustomResourceFetchResponse {
    type: 'customresources';
    resources: Array<any>;
}
export interface StatefulSetsFetchResponse {
    type: 'statefulsets';
    resources: Array<V1StatefulSet>;
}
export interface KubernetesFetchError {
    errorType: KubernetesErrorTypes;
    statusCode?: number;
    resourcePath?: string;
}
export declare type KubernetesErrorTypes = 'BAD_REQUEST' | 'UNAUTHORIZED_ERROR' | 'SYSTEM_ERROR' | 'UNKNOWN_ERROR';
export interface ClientCurrentResourceUsage {
    currentUsage: number | string;
    requestTotal: number | string;
    limitTotal: number | string;
}
export interface ClientContainerStatus {
    container: string;
    cpuUsage: ClientCurrentResourceUsage;
    memoryUsage: ClientCurrentResourceUsage;
}
export interface ClientPodStatus {
    pod: V1Pod;
    cpu: ClientCurrentResourceUsage;
    memory: ClientCurrentResourceUsage;
    containers: ClientContainerStatus[];
}
