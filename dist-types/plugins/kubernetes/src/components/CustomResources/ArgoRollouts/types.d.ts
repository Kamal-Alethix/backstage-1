export interface SetWeightStep {
    setWeight: number;
}
export interface PauseStep {
    pause: {
        duration?: string;
    };
}
export interface AnalysisStep {
    analysis: {
        templates: {
            templateName: string;
            clusterScope?: boolean;
        }[];
    };
}
export declare type ArgoRolloutCanaryStep = SetWeightStep | PauseStep | AnalysisStep;
