import { Config } from '@backstage/config';
import { ClusterDetails, KubernetesClustersSupplier } from '../types/types';
export declare class ConfigClusterLocator implements KubernetesClustersSupplier {
    private readonly clusterDetails;
    constructor(clusterDetails: ClusterDetails[]);
    static fromConfig(config: Config): ConfigClusterLocator;
    getClusters(): Promise<ClusterDetails[]>;
}
