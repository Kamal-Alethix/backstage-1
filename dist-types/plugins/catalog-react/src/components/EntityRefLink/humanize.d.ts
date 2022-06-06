import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
/** @public */
export declare function humanizeEntityRef(entityRef: Entity | CompoundEntityRef, opts?: {
    defaultKind?: string;
}): string;
