import { RepoBuild } from '@backstage/plugin-azure-devops-common';
import { Entity } from '@backstage/catalog-model';
export declare function useRepoBuilds(entity: Entity, defaultLimit?: number): {
    items?: RepoBuild[];
    loading: boolean;
    error?: Error;
};
