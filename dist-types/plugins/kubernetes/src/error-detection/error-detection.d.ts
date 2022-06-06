import { DetectedErrorsByCluster } from './types';
import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
export declare const detectErrors: (objects: ObjectsByEntityResponse) => DetectedErrorsByCluster;
