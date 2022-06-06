import { RollbarItemsResponse, RollbarProject, RollbarTopActiveItem } from './types';
export declare const rollbarApiRef: import("@backstage/core-plugin-api").ApiRef<RollbarApi>;
export interface RollbarApi {
    getAllProjects(): Promise<RollbarProject[]>;
    getProject(projectName: string): Promise<RollbarProject>;
    getTopActiveItems(project: string, hours?: number): Promise<RollbarTopActiveItem[]>;
    getProjectItems(project: string): Promise<RollbarItemsResponse>;
}
