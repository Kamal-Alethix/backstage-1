import { KubernetesAuthTranslator } from './types';
import { GKEClusterDetails } from '../types/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
export declare class GoogleKubernetesAuthTranslator implements KubernetesAuthTranslator {
    decorateClusterDetailsWithAuth(clusterDetails: GKEClusterDetails, requestBody: KubernetesRequestBody): Promise<GKEClusterDetails>;
}
