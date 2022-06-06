import { KubernetesAuthTranslator } from './types';
import { ServiceAccountClusterDetails } from '../types/types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
export declare class ServiceAccountKubernetesAuthTranslator implements KubernetesAuthTranslator {
    decorateClusterDetailsWithAuth(clusterDetails: ServiceAccountClusterDetails, _requestBody: KubernetesRequestBody): Promise<ServiceAccountClusterDetails>;
}
