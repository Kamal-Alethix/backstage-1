import { Entity } from '@backstage/catalog-model';
export declare function useProjectRepoFromEntity(entity: Entity): {
    project: string;
    repo: string;
};
