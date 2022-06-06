import { MetricKey, SonarUrlProcessorFunc } from './types';
/**
 * Define a type to make sure that all metrics are used
 */
export declare type Metrics = {
    [key in MetricKey]: string | undefined;
};
export interface FindingSummary {
    lastAnalysis: string;
    metrics: Metrics;
    projectUrl: string;
    getIssuesUrl: SonarUrlProcessorFunc;
    getComponentMeasuresUrl: SonarUrlProcessorFunc;
    getSecurityHotspotsUrl: () => string;
}
export declare const sonarQubeApiRef: import("@backstage/core-plugin-api").ApiRef<SonarQubeApi>;
export declare type SonarQubeApi = {
    getFindingSummary(componentKey?: string): Promise<FindingSummary | undefined>;
};
