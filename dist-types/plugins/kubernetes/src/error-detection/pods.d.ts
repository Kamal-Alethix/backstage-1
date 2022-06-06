import { V1Pod } from '@kubernetes/client-node';
import { DetectedError } from './types';
export declare const detectErrorsInPods: (pods: V1Pod[], clusterName: string) => DetectedError[];
