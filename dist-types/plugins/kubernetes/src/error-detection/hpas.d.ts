import { V1HorizontalPodAutoscaler } from '@kubernetes/client-node';
import { DetectedError } from './types';
export declare const detectErrorsInHpa: (hpas: V1HorizontalPodAutoscaler[], clusterName: string) => DetectedError[];
