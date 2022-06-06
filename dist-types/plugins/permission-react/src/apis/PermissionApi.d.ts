import { EvaluatePermissionRequest, EvaluatePermissionResponse } from '@backstage/plugin-permission-common';
import { ApiRef } from '@backstage/core-plugin-api';
/**
 * This API is used by various frontend utilities that allow developers to implement authorization within their frontend
 * plugins. A plugin developer will likely not have to interact with this API or its implementations directly, but
 * rather with the aforementioned utility components/hooks.
 * @public
 */
export declare type PermissionApi = {
    authorize(request: EvaluatePermissionRequest): Promise<EvaluatePermissionResponse>;
};
/**
 * A Backstage ApiRef for the Permission API. See https://backstage.io/docs/api/utility-apis for more information on
 * Backstage ApiRefs.
 * @public
 */
export declare const permissionApiRef: ApiRef<PermissionApi>;
