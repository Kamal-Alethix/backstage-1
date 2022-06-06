/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi } from '@backstage/core-plugin-api';

declare type CodeClimateData = {
    repoID: string;
    maintainability: {
        letter: string;
        value: string;
    };
    testCoverage: {
        letter: string;
        value: string;
    };
    numberOfCodeSmells: number;
    numberOfDuplication: number;
    numberOfOtherIssues: number;
};

declare const codeClimateApiRef: _backstage_core_plugin_api.ApiRef<CodeClimateApi>;
interface CodeClimateApi {
    fetchData(repoID: string): Promise<CodeClimateData>;
}

declare const mockData: CodeClimateData;
declare class MockCodeClimateApi implements CodeClimateApi {
    fetchData(): Promise<CodeClimateData>;
}

declare class ProductionCodeClimateApi implements CodeClimateApi {
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

declare const codeClimatePlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityCodeClimateCard: () => JSX.Element;

export { CodeClimateApi, CodeClimateData, EntityCodeClimateCard, MockCodeClimateApi, ProductionCodeClimateApi, codeClimateApiRef, codeClimatePlugin, mockData };
