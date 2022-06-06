import { Entity } from '@backstage/catalog-model';
export declare const FOSSA_PROJECT_NAME_ANNOTATION = "fossa.io/project-name";
export declare const getProjectName: (entity: Entity) => string | undefined;
