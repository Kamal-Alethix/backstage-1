import { KubernetesAuthTranslator } from './types';
import { ClusterDetails } from '../types/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
export declare class OidcKubernetesAuthTranslator implements KubernetesAuthTranslator {
    decorateClusterDetailsWithAuth(clusterDetails: ClusterDetails, requestBody: KubernetesRequestBody): Promise<ClusterDetails>;
}
