import { Logger } from 'winston';
import { KubernetesAuthTranslator } from './types';
import { AzureClusterDetails } from '../types/types';
import { TokenCredential } from '@azure/identity';
export declare class AzureIdentityKubernetesAuthTranslator implements KubernetesAuthTranslator {
    private readonly logger;
    private readonly tokenCredential;
    private accessToken;
    private newTokenPromise;
    constructor(logger: Logger, tokenCredential?: TokenCredential);
    decorateClusterDetailsWithAuth(clusterDetails: AzureClusterDetails): Promise<AzureClusterDetails>;
    private getToken;
    private fetchNewToken;
    private tokenRequiresRefresh;
    private tokenExpired;
}
