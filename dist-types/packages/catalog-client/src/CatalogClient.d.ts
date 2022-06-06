import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import { AddLocationRequest, AddLocationResponse, CatalogApi, GetEntitiesRequest, GetEntitiesResponse, CatalogRequestOptions, GetEntityAncestorsRequest, GetEntityAncestorsResponse, Location, GetEntityFacetsRequest, GetEntityFacetsResponse } from './types/api';
/**
 * A frontend and backend compatible client for communicating with the Backstage
 * software catalog.
 *
 * @public
 */
export declare class CatalogClient implements CatalogApi {
    private readonly discoveryApi;
    private readonly fetchApi;
    constructor(options: {
        discoveryApi: {
            getBaseUrl(pluginId: string): Promise<string>;
        };
        fetchApi?: {
            fetch: typeof fetch;
        };
    });
    /**
     * {@inheritdoc CatalogApi.getEntityAncestors}
     */
    getEntityAncestors(request: GetEntityAncestorsRequest, options?: CatalogRequestOptions): Promise<GetEntityAncestorsResponse>;
    /**
     * {@inheritdoc CatalogApi.getLocationById}
     */
    getLocationById(id: string, options?: CatalogRequestOptions): Promise<Location | undefined>;
    /**
     * {@inheritdoc CatalogApi.getEntities}
     */
    getEntities(request?: GetEntitiesRequest, options?: CatalogRequestOptions): Promise<GetEntitiesResponse>;
    /**
     * {@inheritdoc CatalogApi.getEntityByRef}
     */
    getEntityByRef(entityRef: string | CompoundEntityRef, options?: CatalogRequestOptions): Promise<Entity | undefined>;
    /**
     * @deprecated Use getEntityByRef instead
     */
    getEntityByName(compoundName: CompoundEntityRef, options?: CatalogRequestOptions): Promise<Entity | undefined>;
    /**
     * {@inheritdoc CatalogApi.refreshEntity}
     */
    refreshEntity(entityRef: string, options?: CatalogRequestOptions): Promise<void>;
    /**
     * {@inheritdoc CatalogApi.getEntityFacets}
     */
    getEntityFacets(request: GetEntityFacetsRequest, options?: CatalogRequestOptions): Promise<GetEntityFacetsResponse>;
    /**
     * {@inheritdoc CatalogApi.addLocation}
     */
    addLocation({ type, target, dryRun }: AddLocationRequest, options?: CatalogRequestOptions): Promise<AddLocationResponse>;
    /**
     * {@inheritdoc CatalogApi.getLocationByRef}
     */
    getLocationByRef(locationRef: string, options?: CatalogRequestOptions): Promise<Location | undefined>;
    /**
     * {@inheritdoc CatalogApi.removeLocationById}
     */
    removeLocationById(id: string, options?: CatalogRequestOptions): Promise<void>;
    /**
     * {@inheritdoc CatalogApi.removeEntityByUid}
     */
    removeEntityByUid(uid: string, options?: CatalogRequestOptions): Promise<void>;
    private requestIgnored;
    private requestRequired;
    private requestOptional;
}
