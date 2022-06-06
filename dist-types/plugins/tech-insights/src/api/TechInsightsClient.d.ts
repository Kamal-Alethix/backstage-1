import { TechInsightsApi } from './TechInsightsApi';
import { BulkCheckResponse, CheckResult } from '@backstage/plugin-tech-insights-common';
import { Check } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { CheckResultRenderer } from '../components/CheckResultRenderer';
/** @public */
export declare class TechInsightsClient implements TechInsightsApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    getScorecardsDefinition(type: string, value: CheckResult[], title?: string, description?: string): CheckResultRenderer | undefined;
    getAllChecks(): Promise<Check[]>;
    runChecks(entityParams: CompoundEntityRef, checks?: string[]): Promise<CheckResult[]>;
    runBulkChecks(entities: CompoundEntityRef[], checks?: Check[]): Promise<BulkCheckResponse>;
}
