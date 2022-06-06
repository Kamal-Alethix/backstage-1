import { CodeClimateData } from './code-climate-data';
import { CodeClimateApi } from './code-climate-api';
import { DiscoveryApi } from '@backstage/core-plugin-api';
export declare class ProductionCodeClimateApi implements CodeClimateApi {
    private readonly discoveryApi;
    constructor(discoveryApi: DiscoveryApi);
    fetchAllData(options: {
        apiUrl: string;
        repoID: string;
        snapshotID: string;
        testReportID: string;
    }): Promise<any>;
    fetchData(repoID: string): Promise<CodeClimateData>;
}
