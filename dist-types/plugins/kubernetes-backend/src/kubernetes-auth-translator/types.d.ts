import { ClusterDetails } from '../types/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
export interface KubernetesAuthTranslator {
    decorateClusterDetailsWithAuth(clusterDetails: ClusterDetails, requestBody: KubernetesRequestBody): Promise<ClusterDetails>;
}
