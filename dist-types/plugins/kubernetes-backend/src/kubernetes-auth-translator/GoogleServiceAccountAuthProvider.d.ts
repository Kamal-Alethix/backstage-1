import { KubernetesAuthTranslator } from './types';
import { GKEClusterDetails } from '../types/types';
export declare class GoogleServiceAccountAuthTranslator implements KubernetesAuthTranslator {
    decorateClusterDetailsWithAuth(clusterDetails: GKEClusterDetails): Promise<GKEClusterDetails>;
}
