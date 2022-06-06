import { Groups } from './airbrakeGroups';
import { AirbrakeApi } from './AirbrakeApi';
import { DiscoveryApi } from '@backstage/core-plugin-api';
export declare class ProductionAirbrakeApi implements AirbrakeApi {
    private readonly discoveryApi;
    constructor(discoveryApi: DiscoveryApi);
    fetchGroups(projectId: string): Promise<Groups>;
}
