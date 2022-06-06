import { KubernetesAuthProvider } from './types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
export declare class GoogleServiceAccountAuthProvider implements KubernetesAuthProvider {
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}
