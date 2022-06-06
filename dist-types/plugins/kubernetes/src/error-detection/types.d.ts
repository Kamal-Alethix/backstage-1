import { V1Deployment, V1HorizontalPodAutoscaler, V1Pod } from '@kubernetes/client-node';
export declare type ErrorSeverity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export declare type ErrorDetectable = V1Pod | V1Deployment | V1HorizontalPodAutoscaler;
export declare type ErrorDetectableKind = 'Pod' | 'Deployment' | 'HorizontalPodAutoscaler';
export declare type DetectedErrorsByCluster = Map<string, DetectedError[]>;
export interface DetectedError {
    severity: ErrorSeverity;
    cluster: string;
    kind: ErrorDetectableKind;
    names: string[];
    message: string[];
}
export interface ErrorMapper<T extends ErrorDetectable> {
    severity: ErrorSeverity;
    errorExplanation: string;
    errorExists: (object: T) => boolean;
    messageAccessor: (object: T) => string[];
}
