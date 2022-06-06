import { DetectedError, ErrorDetectable, ErrorDetectableKind, ErrorMapper } from './types';
export declare const detectErrorsInObjects: <T extends ErrorDetectable>(objects: T[], kind: ErrorDetectableKind, clusterName: string, errorMappers: ErrorMapper<T>[]) => DetectedError[];
