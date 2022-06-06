import { DiscoveryApi } from '@backstage/core-plugin-api';
import { Dag, InstanceStatus, InstanceVersion } from './types';
export declare const apacheAirflowApiRef: import("@backstage/core-plugin-api").ApiRef<ApacheAirflowApi>;
export declare type ApacheAirflowApi = {
    discoveryApi: DiscoveryApi;
    baseUrl: string;
    listDags(options?: {
        objectsPerRequest: number;
    }): Promise<Dag[]>;
    updateDag(dagId: string, isPaused: boolean): Promise<any>;
    getInstanceStatus(): Promise<InstanceStatus>;
    getInstanceVersion(): Promise<InstanceVersion>;
};
