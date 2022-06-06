import type { JsonObject } from '@backstage/types';
import { V1Deployment, V1Pod, V1ReplicaSet, V1HorizontalPodAutoscaler, V1Service, V1ConfigMap, V1Ingress, V1Job, V1CronJob, V1StatefulSet } from '@kubernetes/client-node';
export interface DeploymentResources {
    pods: V1Pod[];
    replicaSets: V1ReplicaSet[];
    deployments: V1Deployment[];
    horizontalPodAutoscalers: V1HorizontalPodAutoscaler[];
}
export interface GroupedResponses extends DeploymentResources {
    services: V1Service[];
    configMaps: V1ConfigMap[];
    ingresses: V1Ingress[];
    jobs: V1Job[];
    cronJobs: V1CronJob[];
    customResources: any[];
    statefulsets: V1StatefulSet[];
}
export interface ClusterLinksFormatterOptions {
    dashboardUrl?: URL;
    dashboardParameters?: JsonObject;
    object: any;
    kind: string;
}
export declare type ClusterLinksFormatter = (options: ClusterLinksFormatterOptions) => URL;
