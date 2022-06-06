import { DiscoveryApi } from '@backstage/core-plugin-api';
import { ApacheAirflowApi } from './ApacheAirflowApi';
import { Dag, InstanceStatus, InstanceVersion } from './types';
export declare class ApacheAirflowClient implements ApacheAirflowApi {
    discoveryApi: DiscoveryApi;
    baseUrl: string;
    constructor({ discoveryApi, baseUrl, }: {
        discoveryApi: DiscoveryApi;
        baseUrl: string;
    });
    /**
     * List all DAGs in the Airflow instance
     *
     * @remarks
     *
     * All DAGs with a limit of 100 results per request are returned; this may be
     * bogged-down for instances with many DAGs, in which case table pagination
     * should be implemented
     *
     * @param objectsPerRequest - records returned per request in pagination
     */
    listDags(options?: {
        objectsPerRequest: number;
    }): Promise<Dag[]>;
    updateDag(dagId: string, isPaused: boolean): Promise<Dag>;
    getInstanceStatus(): Promise<InstanceStatus>;
    getInstanceVersion(): Promise<InstanceVersion>;
    private fetch;
}
