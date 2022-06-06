import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { KubernetesAuthProvidersApi } from './types';
import { OAuthApi, OpenIdConnectApi } from '@backstage/core-plugin-api';
export declare class KubernetesAuthProviders implements KubernetesAuthProvidersApi {
    private readonly kubernetesAuthProviderMap;
    constructor(options: {
        googleAuthApi: OAuthApi;
        oidcProviders?: {
            [key: string]: OpenIdConnectApi;
        };
    });
    decorateRequestBodyForAuth(authProvider: string, requestBody: KubernetesRequestBody): Promise<KubernetesRequestBody>;
}
