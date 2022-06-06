import { Entity } from '@backstage/catalog-model';
import { ObjectsByEntityResponse } from '@backstage/plugin-kubernetes-common';
export interface KubernetesObjects {
    kubernetesObjects: ObjectsByEntityResponse | undefined;
    error: string | undefined;
}
export declare const useKubernetesObjects: (entity: Entity, intervalMs?: number) => KubernetesObjects;
