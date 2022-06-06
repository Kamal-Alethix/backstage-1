import { ProjectGrowthData, UnlabeledDataflowAlertProject, UnlabeledDataflowData } from '../types';
declare type mockAlertRenderer<T> = (alert: T) => T;
declare type mockEntityRenderer<T> = (entity: T) => T;
export declare const createMockUnlabeledDataflowData: (callback?: mockAlertRenderer<UnlabeledDataflowData> | undefined) => UnlabeledDataflowData;
export declare const createMockUnlabeledDataflowAlertProject: (callback?: mockEntityRenderer<UnlabeledDataflowAlertProject> | undefined) => UnlabeledDataflowAlertProject;
export declare const createMockProjectGrowthData: (callback?: mockAlertRenderer<ProjectGrowthData> | undefined) => ProjectGrowthData;
export {};
