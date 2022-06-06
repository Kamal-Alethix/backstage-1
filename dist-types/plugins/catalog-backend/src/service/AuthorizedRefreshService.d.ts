import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { RefreshOptions, RefreshService } from './types';
export declare class AuthorizedRefreshService implements RefreshService {
    private readonly service;
    private readonly permissionApi;
    constructor(service: RefreshService, permissionApi: PermissionEvaluator);
    refresh(options: RefreshOptions): Promise<void>;
}
