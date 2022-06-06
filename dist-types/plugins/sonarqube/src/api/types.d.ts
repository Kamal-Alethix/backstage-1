export interface ComponentWrapper {
    component: Component;
}
export interface Component {
    analysisDate: string;
}
export interface MeasuresWrapper {
    measures: Measure[];
}
export declare type MetricKey = 'alert_status' | 'bugs' | 'reliability_rating' | 'vulnerabilities' | 'security_rating' | 'code_smells' | 'sqale_rating' | 'security_hotspots_reviewed' | 'security_review_rating' | 'coverage' | 'duplicated_lines_density';
export interface Measure {
    metric: MetricKey;
    value: string;
    component: string;
}
export declare type SonarUrlProcessorFunc = (identifier: string) => string;
