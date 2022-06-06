import { Entity } from '@backstage/catalog-model';
export declare const CLOUDBUILD_ANNOTATION = "google.com/cloudbuild-project-slug";
export declare const useProjectName: (entity: Entity) => {
    value: string | undefined;
    loading: boolean;
    error: Error | undefined;
};
