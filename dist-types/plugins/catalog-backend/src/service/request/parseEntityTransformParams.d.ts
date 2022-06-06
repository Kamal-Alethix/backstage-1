import { Entity } from '@backstage/catalog-model';
export declare function parseEntityTransformParams(params: Record<string, unknown>): ((entity: Entity) => Entity) | undefined;
