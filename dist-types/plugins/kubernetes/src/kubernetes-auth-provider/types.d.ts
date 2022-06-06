import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
export interface KubernetesAuthProvider {
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}
export declare const kubernetesAuthProvidersApiRef: import("@backstage/core-plugin-api").ApiRef<KubernetesAuthProvidersApi>;
export interface KubernetesAuthProvidersApi {
    decorateRequestBodyForAuth(authProvider: string, requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}
