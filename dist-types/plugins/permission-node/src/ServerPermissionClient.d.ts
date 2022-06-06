import { TokenManager, PluginEndpointDiscovery } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { PermissionEvaluator, AuthorizePermissionRequest, EvaluatorRequestOptions, AuthorizePermissionResponse, PolicyDecision, QueryPermissionRequest } from '@backstage/plugin-permission-common';
/**
 * A thin wrapper around
 * {@link @backstage/plugin-permission-common#PermissionClient} that allows all
 * backend-to-backend requests.
 * @public
 */
export declare class ServerPermissionClient implements PermissionEvaluator {
    private readonly permissionClient;
    private readonly tokenManager;
    private readonly permissionEnabled;
    static fromConfig(config: Config, options: {
        discovery: PluginEndpointDiscovery;
        tokenManager: TokenManager;
    }): ServerPermissionClient;
    private constructor();
    authorizeConditional(queries: QueryPermissionRequest[], options?: EvaluatorRequestOptions): Promise<PolicyDecision[]>;
    authorize(requests: AuthorizePermissionRequest[], options?: EvaluatorRequestOptions): Promise<AuthorizePermissionResponse[]>;
    private isValidServerToken;
    private isEnabled;
}
