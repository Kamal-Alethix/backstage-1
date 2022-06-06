import { Config } from '@backstage/config';
import * as container from '@google-cloud/container';
import { Duration } from 'luxon';
import { ClusterDetails, GKEClusterDetails, KubernetesClustersSupplier } from '../types/types';
interface MatchResourceLabelEntry {
    key: string;
    value: string;
}
declare type GkeClusterLocatorOptions = {
    projectId: string;
    region?: string;
    skipTLSVerify?: boolean;
    skipMetricsLookup?: boolean;
    exposeDashboard?: boolean;
    matchingResourceLabels?: MatchResourceLabelEntry[];
};
export declare class GkeClusterLocator implements KubernetesClustersSupplier {
    private readonly options;
    private readonly client;
    private clusterDetails;
    private hasClusterDetails;
    constructor(options: GkeClusterLocatorOptions, client: container.v1.ClusterManagerClient, clusterDetails?: GKEClusterDetails[] | undefined, hasClusterDetails?: boolean);
    static fromConfigWithClient(config: Config, client: container.v1.ClusterManagerClient, refreshInterval?: Duration): GkeClusterLocator;
    static fromConfig(config: Config, refreshInterval?: Duration | undefined): GkeClusterLocator;
    getClusters(): Promise<ClusterDetails[]>;
    refreshClusters(): Promise<void>;
}
export {};
