import { KubernetesAuthProvider } from './types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { OpenIdConnectApi } from '@backstage/core-plugin-api';
export declare class OidcKubernetesAuthProvider implements KubernetesAuthProvider {
    providerName: string;
    authProvider: OpenIdConnectApi;
    constructor(providerName: string, authProvider: OpenIdConnectApi);
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}
