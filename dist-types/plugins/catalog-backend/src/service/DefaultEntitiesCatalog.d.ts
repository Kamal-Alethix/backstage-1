import { Knex } from 'knex';
import { EntitiesCatalog, EntitiesRequest, EntitiesResponse, EntityAncestryResponse, EntityFacetsRequest, EntityFacetsResponse } from '../catalog/types';
export declare class DefaultEntitiesCatalog implements EntitiesCatalog {
    private readonly database;
    constructor(database: Knex);
    entities(request?: EntitiesRequest): Promise<EntitiesResponse>;
    removeEntityByUid(uid: string): Promise<void>;
    entityAncestry(rootRef: string): Promise<EntityAncestryResponse>;
    facets(request: EntityFacetsRequest): Promise<EntityFacetsResponse>;
}
