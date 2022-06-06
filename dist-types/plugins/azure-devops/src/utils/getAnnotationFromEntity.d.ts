import { Entity } from '@backstage/catalog-model';
export declare function getAnnotationFromEntity(entity: Entity): {
    project: string;
    repo?: string;
    definition?: string;
};
