import { RollbarApi } from './RollbarApi';
import { RollbarItemsResponse, RollbarProject, RollbarTopActiveItem } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
export declare class RollbarClient implements RollbarApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: {
        discoveryApi: DiscoveryApi;
        identityApi: IdentityApi;
    });
    getAllProjects(): Promise<RollbarProject[]>;
    getProject(projectName: string): Promise<RollbarProject>;
    getTopActiveItems(project: string, hours?: number, environment?: string): Promise<RollbarTopActiveItem[]>;
    getProjectItems(project: string): Promise<RollbarItemsResponse>;
    private get;
}
