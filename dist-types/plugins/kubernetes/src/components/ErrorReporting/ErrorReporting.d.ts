/// <reference types="react" />
import { DetectedErrorsByCluster } from '../../error-detection';
declare type ErrorReportingProps = {
    detectedErrors: DetectedErrorsByCluster;
};
export declare const ErrorEmptyState: () => JSX.Element;
export declare const ErrorReporting: ({ detectedErrors }: ErrorReportingProps) => JSX.Element;
export {};
