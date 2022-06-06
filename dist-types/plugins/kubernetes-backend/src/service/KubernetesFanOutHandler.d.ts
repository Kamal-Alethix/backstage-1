import { ClusterDetails, KubernetesObjectsProviderOptions, ObjectsByEntityRequest, FetchResponseWrapper, ObjectToFetch } from '../types/types';
import { ClusterObjects, ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
import { PodStatus } from '@kubernetes/client-node';
export declare const DEFAULT_OBJECTS: ObjectToFetch[];
export interface KubernetesFanOutHandlerOptions extends KubernetesObjectsProviderOptions {
}
export interface KubernetesRequestBody extends ObjectsByEntityRequest {
}
declare type responseWithMetrics = [FetchResponseWrapper, PodStatus[][]];
export declare class KubernetesFanOutHandler {
    private readonly logger;
    private readonly fetcher;
    private readonly serviceLocator;
    private readonly customResources;
    private readonly objectTypesToFetch;
    private readonly authTranslators;
    constructor({ logger, fetcher, serviceLocator, customResources, objectTypesToFetch, }: KubernetesFanOutHandlerOptions);
    getKubernetesObjectsByEntity(requestBody: KubernetesRequestBody): Promise<ObjectsByEntityResponse>;
    toObjectsByEntityResponse(clusterObjects: ClusterObjects[]): ObjectsByEntityResponse;
    toClusterObjects(clusterDetails: ClusterDetails, [result, metrics]: responseWithMetrics): ClusterObjects;
    getMetricsForPods(clusterDetails: ClusterDetails, result: FetchResponseWrapper): Promise<responseWithMetrics>;
    private getAuthTranslator;
}
export {};
