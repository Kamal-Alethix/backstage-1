import { JsonObject } from '@backstage/types';
import { V1Pod, V1Service, V1ConfigMap, V1Deployment, V1ReplicaSet, V1HorizontalPodAutoscaler, V1Job, V1CronJob, V1Ingress, V1StatefulSet } from '@kubernetes/client-node';
import { Entity } from '@backstage/catalog-model';

interface KubernetesRequestBody {
    auth?: {
        google?: string;
        oidc?: {
            [key: string]: string;
        };
    };
    entity: Entity;
}
interface ClusterAttributes {
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
interface ClusterObjects {
    cluster: ClusterAttributes;
    resources: FetchResponse[];
    podMetrics: ClientPodStatus[];
    errors: KubernetesFetchError[];
}
interface ObjectsByEntityResponse {
    items: ClusterObjects[];
}
declare type AuthProviderType = 'google' | 'serviceAccount' | 'aws' | 'azure';
declare type FetchResponse = PodFetchResponse | ServiceFetchResponse | ConfigMapFetchResponse | DeploymentFetchResponse | ReplicaSetsFetchResponse | HorizontalPodAutoscalersFetchResponse | JobsFetchResponse | CronJobsFetchResponse | IngressesFetchResponse | CustomResourceFetchResponse | StatefulSetsFetchResponse;
interface PodFetchResponse {
    type: 'pods';
    resources: Array<V1Pod>;
}
interface ServiceFetchResponse {
    type: 'services';
    resources: Array<V1Service>;
}
interface ConfigMapFetchResponse {
    type: 'configmaps';
    resources: Array<V1ConfigMap>;
}
interface DeploymentFetchResponse {
    type: 'deployments';
    resources: Array<V1Deployment>;
}
interface ReplicaSetsFetchResponse {
    type: 'replicasets';
    resources: Array<V1ReplicaSet>;
}
interface HorizontalPodAutoscalersFetchResponse {
    type: 'horizontalpodautoscalers';
    resources: Array<V1HorizontalPodAutoscaler>;
}
interface JobsFetchResponse {
    type: 'jobs';
    resources: Array<V1Job>;
}
interface CronJobsFetchResponse {
    type: 'cronjobs';
    resources: Array<V1CronJob>;
}
interface IngressesFetchResponse {
    type: 'ingresses';
    resources: Array<V1Ingress>;
}
interface CustomResourceFetchResponse {
    type: 'customresources';
    resources: Array<any>;
}
interface StatefulSetsFetchResponse {
    type: 'statefulsets';
    resources: Array<V1StatefulSet>;
}
interface KubernetesFetchError {
    errorType: KubernetesErrorTypes;
    statusCode?: number;
    resourcePath?: string;
}
declare type KubernetesErrorTypes = 'BAD_REQUEST' | 'UNAUTHORIZED_ERROR' | 'SYSTEM_ERROR' | 'UNKNOWN_ERROR';
interface ClientCurrentResourceUsage {
    currentUsage: number | string;
    requestTotal: number | string;
    limitTotal: number | string;
}
interface ClientContainerStatus {
    container: string;
    cpuUsage: ClientCurrentResourceUsage;
    memoryUsage: ClientCurrentResourceUsage;
}
interface ClientPodStatus {
    pod: V1Pod;
    cpu: ClientCurrentResourceUsage;
    memory: ClientCurrentResourceUsage;
    containers: ClientContainerStatus[];
}

export { AuthProviderType, ClientContainerStatus, ClientCurrentResourceUsage, ClientPodStatus, ClusterAttributes, ClusterObjects, ConfigMapFetchResponse, CronJobsFetchResponse, CustomResourceFetchResponse, DeploymentFetchResponse, FetchResponse, HorizontalPodAutoscalersFetchResponse, IngressesFetchResponse, JobsFetchResponse, KubernetesErrorTypes, KubernetesFetchError, KubernetesRequestBody, ObjectsByEntityResponse, PodFetchResponse, ReplicaSetsFetchResponse, ServiceFetchResponse, StatefulSetsFetchResponse };
