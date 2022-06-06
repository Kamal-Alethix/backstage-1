import { PermissionApi } from '@backstage/plugin-permission-react';
import { EvaluatePermissionResponse, EvaluatePermissionRequest, AuthorizeResult } from '@backstage/plugin-permission-common';
/**
 * Mock implementation of
 * {@link @backstage/plugin-permission-react#PermissionApi}. Supply a
 * requestHandler function to override the mock result returned for a given
 * request.
 * @public
 */
export declare class MockPermissionApi implements PermissionApi {
    private readonly requestHandler;
    constructor(requestHandler?: (request: EvaluatePermissionRequest) => AuthorizeResult.ALLOW | AuthorizeResult.DENY);
    authorize(request: EvaluatePermissionRequest): Promise<EvaluatePermissionResponse>;
}
