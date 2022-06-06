import { CoreV1Api, KubeConfig, Metrics, CustomObjectsApi } from '@kubernetes/client-node';
import { ClusterDetails } from '../types/types';
export declare class KubernetesClientProvider {
    getKubeConfig(clusterDetails: ClusterDetails): KubeConfig;
    getCoreClientByClusterDetails(clusterDetails: ClusterDetails): CoreV1Api;
    getMetricsClient(clusterDetails: ClusterDetails): Metrics;
    getCustomObjectsClient(clusterDetails: ClusterDetails): CustomObjectsApi;
}
