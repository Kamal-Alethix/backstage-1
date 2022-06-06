import { Entity } from '@backstage/catalog-model';
export declare function useProjectSlugFromEntity(entity: Entity): {
    project: string;
    organization: string;
};
