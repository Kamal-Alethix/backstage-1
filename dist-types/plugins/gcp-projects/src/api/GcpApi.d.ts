import { Project, Operation } from './types';
export declare const gcpApiRef: import("@backstage/core-plugin-api").ApiRef<GcpApi>;
export declare type GcpApi = {
    listProjects(): Promise<Project[]>;
    getProject(projectId: string): Promise<Project>;
    createProject(options: {
        projectId: string;
        projectName: string;
    }): Promise<Operation>;
};
