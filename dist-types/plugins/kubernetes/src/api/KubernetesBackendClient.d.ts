import { KubernetesApi } from './types';
import { KubernetesRequestBody, ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
export declare class KubernetesBackendClient implements KubernetesApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    private handleResponse;
    private postRequired;
    getObjectsByEntity(requestBody: KubernetesRequestBody): Promise<ObjectsByEntityResponse>;
    getClusters(): Promise<{
        name: string;
        authProvider: string;
    }[]>;
}
