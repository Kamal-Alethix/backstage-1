import { GitTag } from '@backstage/plugin-azure-devops-common';
import { Entity } from '@backstage/catalog-model';
export declare function useGitTags(entity: Entity): {
    items?: GitTag[];
    loading: boolean;
    error?: Error;
};
