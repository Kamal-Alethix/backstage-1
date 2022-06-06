import { CheckResult, BulkCheckResponse } from '@backstage/plugin-tech-insights-common';
import { Check } from './types';
import { CheckResultRenderer } from '../components/CheckResultRenderer';
import { CompoundEntityRef } from '@backstage/catalog-model';
/**
 * {@link @backstage/core-plugin-api#ApiRef} for the {@link TechInsightsApi}
 *
 * @public
 */
export declare const techInsightsApiRef: import("@backstage/core-plugin-api").ApiRef<TechInsightsApi>;
/**
 * API client interface for the Tech Insights plugin
 *
 * @public
 */
export interface TechInsightsApi {
    getScorecardsDefinition: (type: string, value: CheckResult[], title?: string, description?: string) => CheckResultRenderer | undefined;
    getAllChecks(): Promise<Check[]>;
    runChecks(entityParams: CompoundEntityRef, checks?: string[]): Promise<CheckResult[]>;
    runBulkChecks(entities: CompoundEntityRef[], checks?: Check[]): Promise<BulkCheckResponse>;
}
