import { Config } from '@backstage/config';
import { PermissionEvaluator, QueryPermissionRequest, AuthorizePermissionRequest, EvaluatorRequestOptions, AuthorizePermissionResponse, QueryPermissionResponse } from './types/api';
import { DiscoveryApi } from './types/discovery';
/**
 * An isomorphic client for requesting authorization for Backstage permissions.
 * @public
 */
export declare class PermissionClient implements PermissionEvaluator {
    private readonly enabled;
    private readonly discovery;
    constructor(options: {
        discovery: DiscoveryApi;
        config: Config;
    });
    /**
     * {@inheritdoc PermissionEvaluator.authorize}
     */
    authorize(requests: AuthorizePermissionRequest[], options?: EvaluatorRequestOptions): Promise<AuthorizePermissionResponse[]>;
    /**
     * {@inheritdoc PermissionEvaluator.authorizeConditional}
     */
    authorizeConditional(queries: QueryPermissionRequest[], options?: EvaluatorRequestOptions): Promise<QueryPermissionResponse[]>;
    private makeRequest;
    private getAuthorizationHeader;
}
