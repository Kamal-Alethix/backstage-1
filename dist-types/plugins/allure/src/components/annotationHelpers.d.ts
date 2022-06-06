import { Entity } from '@backstage/catalog-model';
export declare const ALLURE_PROJECT_ID_ANNOTATION = "qameta.io/allure-project";
export declare const isAllureReportAvailable: (entity: Entity) => boolean;
export declare const getAllureProjectId: (entity: Entity) => string;
