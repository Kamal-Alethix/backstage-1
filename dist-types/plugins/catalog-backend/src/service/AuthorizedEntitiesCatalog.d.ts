import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { ConditionTransformer } from '@backstage/plugin-permission-node';
import { EntitiesCatalog, EntitiesRequest, EntitiesResponse, EntityAncestryResponse, EntityFacetsRequest, EntityFacetsResponse, EntityFilter } from '../catalog/types';
export declare class AuthorizedEntitiesCatalog implements EntitiesCatalog {
    private readonly entitiesCatalog;
    private readonly permissionApi;
    private readonly transformConditions;
    constructor(entitiesCatalog: EntitiesCatalog, permissionApi: PermissionEvaluator, transformConditions: ConditionTransformer<EntityFilter>);
    entities(request?: EntitiesRequest): Promise<EntitiesResponse>;
    removeEntityByUid(uid: string, options?: {
        authorizationToken?: string;
    }): Promise<void>;
    entityAncestry(entityRef: string, options?: {
        authorizationToken?: string;
    }): Promise<EntityAncestryResponse>;
    facets(request: EntityFacetsRequest): Promise<EntityFacetsResponse>;
    private findParents;
}
