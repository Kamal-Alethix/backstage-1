import { KubernetesRequestBody, ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
export declare const kubernetesApiRef: import("@backstage/core-plugin-api").ApiRef<KubernetesApi>;
export interface KubernetesApi {
    getObjectsByEntity(requestBody: KubernetesRequestBody): Promise<ObjectsByEntityResponse>;
    getClusters(): Promise<{
        name: string;
        authProvider: string;
        oidcTokenProvider?: string | undefined;
    }[]>;
}
