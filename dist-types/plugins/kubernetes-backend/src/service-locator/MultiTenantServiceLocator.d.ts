import { ClusterDetails, KubernetesClustersSupplier, KubernetesServiceLocator } from '../types/types';
export declare class MultiTenantServiceLocator implements KubernetesServiceLocator {
    private readonly clusterSupplier;
    constructor(clusterSupplier: KubernetesClustersSupplier);
    getClustersByServiceId(_serviceId: string): Promise<ClusterDetails[]>;
}
