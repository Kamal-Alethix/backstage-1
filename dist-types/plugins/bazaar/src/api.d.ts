import { DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
export declare const bazaarApiRef: import("@backstage/core-plugin-api").ApiRef<BazaarApi>;
export interface BazaarApi {
    updateProject(bazaarProject: any): Promise<any>;
    addProject(bazaarProject: any): Promise<any>;
    getProjectById(id: number): Promise<any>;
    getProjectByRef(entityRef: string): Promise<any>;
    getMembers(id: number): Promise<any>;
    deleteMember(id: number, userId: string): Promise<void>;
    addMember(id: number, userId: string): Promise<void>;
    getProjects(): Promise<any>;
    deleteProject(id: number): Promise<void>;
}
export declare class BazaarClient implements BazaarApi {
    private readonly identityApi;
    private readonly discoveryApi;
    private readonly fetchApi;
    constructor(options: {
        identityApi: IdentityApi;
        discoveryApi: DiscoveryApi;
        fetchApi: FetchApi;
    });
    updateProject(bazaarProject: any): Promise<any>;
    addProject(bazaarProject: any): Promise<any>;
    getProjectById(id: number): Promise<any>;
    getProjectByRef(entityRef: string): Promise<any>;
    getMembers(id: number): Promise<any>;
    addMember(id: number, userId: string): Promise<void>;
    deleteMember(id: number, userId: string): Promise<void>;
    getProjects(): Promise<any>;
    deleteProject(id: number): Promise<void>;
}
