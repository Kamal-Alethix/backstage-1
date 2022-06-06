import { ConfigApi } from '@backstage/core-plugin-api';
import { AllureApi } from './AllureApi';
export declare class AllureApiClient implements AllureApi {
    readonly configApi: ConfigApi;
    constructor(options: {
        configApi: ConfigApi;
    });
    getReportUrl(projectId: string): Promise<string>;
}
