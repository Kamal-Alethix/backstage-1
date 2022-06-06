import { Credentials } from 'aws-sdk';
import { AWSClusterDetails } from '../types/types';
import { KubernetesAuthTranslator } from './types';
declare type SigningCreds = {
    accessKeyId: string | undefined;
    secretAccessKey: string | undefined;
    sessionToken: string | undefined;
};
export declare class AwsIamKubernetesAuthTranslator implements KubernetesAuthTranslator {
    validCredentials(creds: SigningCreds): boolean;
    awsGetCredentials: () => Promise<Credentials>;
    getCredentials(assumeRole?: string, externalId?: string): Promise<SigningCreds>;
    getBearerToken(clusterName: string, assumeRole?: string, externalId?: string): Promise<string>;
    decorateClusterDetailsWithAuth(clusterDetails: AWSClusterDetails): Promise<AWSClusterDetails>;
}
export {};
