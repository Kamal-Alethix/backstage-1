import { KubernetesAuthProvider } from './types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
export declare class AwsKubernetesAuthProvider implements KubernetesAuthProvider {
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}
