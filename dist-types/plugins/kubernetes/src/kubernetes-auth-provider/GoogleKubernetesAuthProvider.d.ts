import { KubernetesAuthProvider } from './types';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { OAuthApi } from '@backstage/core-plugin-api';
export declare class GoogleKubernetesAuthProvider implements KubernetesAuthProvider {
    authProvider: OAuthApi;
    constructor(authProvider: OAuthApi);
    decorateRequestBodyForAuth(requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}
