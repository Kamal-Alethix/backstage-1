import { Entity } from '@backstage/catalog-model';
export declare const SONARQUBE_PROJECT_KEY_ANNOTATION = "sonarqube.org/project-key";
export declare const isSonarQubeAvailable: (entity: Entity) => boolean;
export declare const useProjectKey: (entity: Entity) => string;
