import { V1ObjectMeta } from '@kubernetes/client-node/dist/gen/model/v1ObjectMeta';
import { V1HorizontalPodAutoscaler, V1Pod, V1ReplicaSet } from '@kubernetes/client-node';
interface CanOwn {
    metadata?: V1ObjectMeta;
}
interface CanBeOwned {
    metadata?: V1ObjectMeta;
}
export declare function getOwnedResources<R extends CanBeOwned>(potentialOwner: CanOwn, possiblyOwned: R[]): R[];
export declare const getOwnedPodsThroughReplicaSets: (potentialOwner: CanOwn, replicaSets: V1ReplicaSet[], pods: V1Pod[]) => V1Pod[];
interface ResourceRef {
    kind: string;
    namespace?: string;
    name?: string;
}
export declare const getMatchingHpa: (owner: ResourceRef, hpas: V1HorizontalPodAutoscaler[]) => V1HorizontalPodAutoscaler | undefined;
export {};
