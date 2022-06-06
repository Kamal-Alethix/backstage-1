import { CoreV1Api } from '@kubernetes/client-node';
import { Logger } from 'winston';
import { ClusterDetails, FetchResponseWrapper, KubernetesFetcher, ObjectFetchParams } from '../types/types';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import { PodStatus } from '@kubernetes/client-node/dist/top';
export interface Clients {
    core: CoreV1Api;
}
export interface KubernetesClientBasedFetcherOptions {
    kubernetesClientProvider: KubernetesClientProvider;
    logger: Logger;
}
export declare class KubernetesClientBasedFetcher implements KubernetesFetcher {
    private readonly kubernetesClientProvider;
    private readonly logger;
    constructor({ kubernetesClientProvider, logger, }: KubernetesClientBasedFetcherOptions);
    fetchObjectsForService(params: ObjectFetchParams): Promise<FetchResponseWrapper>;
    fetchPodMetricsByNamespace(clusterDetails: ClusterDetails, namespace: string): Promise<PodStatus[]>;
    private captureKubernetesErrorsRethrowOthers;
    private fetchResource;
}
