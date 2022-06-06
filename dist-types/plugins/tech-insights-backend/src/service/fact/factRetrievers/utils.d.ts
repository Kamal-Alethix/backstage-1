import { Entity } from '@backstage/catalog-model';
import { FactLifecycle, MaxItems, TTL } from '@backstage/plugin-tech-insights-node';
export declare const generateAnnotationFactName: (annotation: string) => string;
export declare const entityHasAnnotation: (entity: Entity, annotation: string) => boolean;
export declare const isTtl: (lifecycle: FactLifecycle) => lifecycle is TTL;
export declare const isMaxItems: (lifecycle: FactLifecycle) => lifecycle is MaxItems;
