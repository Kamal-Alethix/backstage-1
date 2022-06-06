import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { PermissionApi } from './PermissionApi';
import { AuthorizePermissionRequest, AuthorizePermissionResponse } from '@backstage/plugin-permission-common';
import { Config } from '@backstage/config';
/**
 * The default implementation of the PermissionApi, which simply calls the authorize method of the given
 * {@link @backstage/plugin-permission-common#PermissionClient}.
 * @public
 */
export declare class IdentityPermissionApi implements PermissionApi {
    private readonly permissionClient;
    private readonly identityApi;
    private constructor();
    static create(options: {
        config: Config;
        discovery: DiscoveryApi;
        identity: IdentityApi;
    }): IdentityPermissionApi;
    authorize(request: AuthorizePermissionRequest): Promise<AuthorizePermissionResponse>;
}
