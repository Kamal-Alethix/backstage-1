import { DetectedError } from './types';
import { V1Deployment } from '@kubernetes/client-node';
export declare const detectErrorsInDeployments: (deployments: V1Deployment[], clusterName: string) => DetectedError[];
