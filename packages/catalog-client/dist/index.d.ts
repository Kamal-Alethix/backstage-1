import { Entity, CompoundEntityRef } from '@backstage/catalog-model';

/**
 * This symbol can be used in place of a value when passed to filters in e.g.
 * {@link CatalogClient.getEntities}, to signify that you want to filter on the
 * presence of that key no matter what its value is.
 *
 * @public
 */
declare const CATALOG_FILTER_EXISTS: unique symbol;
/**
 * The request type for {@link CatalogClient.getEntities}.
 *
 * @public
 */
interface GetEntitiesRequest {
    /**
     * If given, return only entities that match the given patterns.
     *
     * @remarks
     *
     * If multiple filter sets are given as an array, then there is effectively an
     * OR between each filter set.
     *
     * Within one filter set, there is effectively an AND between the various
     * keys.
     *
     * Within one key, if there are more than one value, then there is effectively
     * an OR between them.
     *
     * Example: For an input of
     *
     * ```
     * [
     *   { kind: ['API', 'Component'] },
     *   { 'metadata.name': 'a', 'metadata.namespace': 'b' }
     * ]
     * ```
     *
     * This effectively means
     *
     * ```
     * (kind = EITHER 'API' OR 'Component')
     * OR
     * (metadata.name = 'a' AND metadata.namespace = 'b' )
     * ```
     *
     * Each key is a dot separated path in each object.
     *
     * As a value you can also pass in the symbol `CATALOG_FILTER_EXISTS`
     * (exported from this package), which means that you assert on the existence
     * of that key, no matter what its value is.
     */
    filter?: Record<string, string | symbol | (string | symbol)[]>[] | Record<string, string | symbol | (string | symbol)[]> | undefined;
    /**
     * If given, return only the parts of each entity that match those dot
     * separated paths in each object.
     *
     * @remarks
     *
     * Example: For an input of `['kind', 'metadata.annotations']`, then response
     * objects will be shaped like
     *
     * ```
     * {
     *   "kind": "Component",
     *   "metadata": {
     *     "annotations": {
     *       "foo": "bar"
     *     }
     *   }
     * }
     * ```
     */
    fields?: string[] | undefined;
    /**
     * If given, skips over the first N items in the result set.
     */
    offset?: number;
    /**
     * If given, returns at most N items from the result set.
     */
    limit?: number;
    /**
     * If given, skips over all items before that cursor as returned by a previous
     * request.
     */
    after?: string;
}
/**
 * The response type for {@link CatalogClient.getEntities}.
 *
 * @public
 */
interface GetEntitiesResponse {
    items: Entity[];
}
/**
 * The request type for {@link CatalogClient.getEntityAncestors}.
 *
 * @public
 */
interface GetEntityAncestorsRequest {
    entityRef: string;
}
/**
 * The response type for {@link CatalogClient.getEntityAncestors}.
 *
 * @public
 */
interface GetEntityAncestorsResponse {
    rootEntityRef: string;
    items: Array<{
        entity: Entity;
        parentEntityRefs: string[];
    }>;
}
/**
 * The request type for {@link CatalogClient.getEntityFacets}.
 *
 * @public
 */
interface GetEntityFacetsRequest {
    /**
     * If given, return only entities that match the given patterns.
     *
     * @remarks
     *
     * If multiple filter sets are given as an array, then there is effectively an
     * OR between each filter set.
     *
     * Within one filter set, there is effectively an AND between the various
     * keys.
     *
     * Within one key, if there are more than one value, then there is effectively
     * an OR between them.
     *
     * Example: For an input of
     *
     * ```
     * [
     *   { kind: ['API', 'Component'] },
     *   { 'metadata.name': 'a', 'metadata.namespace': 'b' }
     * ]
     * ```
     *
     * This effectively means
     *
     * ```
     * (kind = EITHER 'API' OR 'Component')
     * OR
     * (metadata.name = 'a' AND metadata.namespace = 'b' )
     * ```
     *
     * Each key is a dot separated path in each object.
     *
     * As a value you can also pass in the symbol `CATALOG_FILTER_EXISTS`
     * (exported from this package), which means that you assert on the existence
     * of that key, no matter what its value is.
     */
    filter?: Record<string, string | symbol | (string | symbol)[]>[] | Record<string, string | symbol | (string | symbol)[]> | undefined;
    /**
     * Dot separated paths for the facets to extract from each entity.
     *
     * @remarks
     *
     * Example: For an input of `['kind', 'metadata.annotations.backstage.io/orphan']`, then the
     * response will be shaped like
     *
     * ```
     * {
     *   "facets": {
     *     "kind": [
     *       { "key": "Component", "count": 22 },
     *       { "key": "API", "count": 13 }
     *     ],
     *     "metadata.annotations.backstage.io/orphan": [
     *       { "key": "true", "count": 2 }
     *     ]
     *   }
     * }
     * ```
     */
    facets: string[];
}
/**
 * The response type for {@link CatalogClient.getEntityFacets}.
 *
 * @public
 */
interface GetEntityFacetsResponse {
    /**
     * The computed facets, one entry per facet in the request.
     */
    facets: Record<string, Array<{
        value: string;
        count: number;
    }>>;
}
/**
 * Options you can pass into a catalog request for additional information.
 *
 * @public
 */
interface CatalogRequestOptions {
    token?: string;
}
/**
 * Entity location for a specific entity.
 *
 * @public
 */
declare type Location = {
    id: string;
    type: string;
    target: string;
};
/**
 * The request type for {@link CatalogClient.addLocation}.
 *
 * @public
 */
declare type AddLocationRequest = {
    type?: string;
    target: string;
    dryRun?: boolean;
};
/**
 * The response type for {@link CatalogClient.addLocation}.
 *
 * @public
 */
declare type AddLocationResponse = {
    location: Location;
    entities: Entity[];
    exists?: boolean;
};
/**
 * A client for interacting with the Backstage software catalog through its API.
 *
 * @public
 */
interface CatalogApi {
    /**
     * Lists catalog entities.
     *
     * @param request - Request parameters
     * @param options - Additional options
     */
    getEntities(request?: GetEntitiesRequest, options?: CatalogRequestOptions): Promise<GetEntitiesResponse>;
    /**
     * Gets entity ancestor information, i.e. the hierarchy of parent entities
     * whose processing resulted in a given entity appearing in the catalog.
     *
     * @param request - Request parameters
     * @param options - Additional options
     */
    getEntityAncestors(request: GetEntityAncestorsRequest, options?: CatalogRequestOptions): Promise<GetEntityAncestorsResponse>;
    /**
     * Gets a single entity from the catalog by its ref (kind, namespace, name)
     * triplet.
     *
     * @param entityRef - A complete entity ref, either on string or compound form
     * @param options - Additional options
     * @returns The matching entity, or undefined if there was no entity with that ref
     */
    getEntityByRef(entityRef: string | CompoundEntityRef, options?: CatalogRequestOptions): Promise<Entity | undefined>;
    /**
     * Removes a single entity from the catalog by entity UID.
     *
     * @param uid - An entity UID
     * @param options - Additional options
     */
    removeEntityByUid(uid: string, options?: CatalogRequestOptions): Promise<void>;
    /**
     * Refreshes (marks for reprocessing) an entity in the catalog.
     *
     * @param entityRef - An entity ref on string form (e.g.
     *        'component/default:my-component')
     * @param options - Additional options
     */
    refreshEntity(entityRef: string, options?: CatalogRequestOptions): Promise<void>;
    /**
     * Gets a summary of field facets of entities in the catalog.
     *
     * @param request - Request parameters
     * @param options - Additional options
     */
    getEntityFacets(request: GetEntityFacetsRequest, options?: CatalogRequestOptions): Promise<GetEntityFacetsResponse>;
    /**
     * Gets a registered location by its ID.
     *
     * @param id - A location ID
     * @param options - Additional options
     */
    getLocationById(id: string, options?: CatalogRequestOptions): Promise<Location | undefined>;
    /**
     * Gets a registered location by its ref.
     *
     * @param locationRef - A location ref, e.g. "url:https://github.com/..."
     * @param options - Additional options
     */
    getLocationByRef(locationRef: string, options?: CatalogRequestOptions): Promise<Location | undefined>;
    /**
     * Registers a new location.
     *
     * @param location - Request parameters
     * @param options - Additional options
     */
    addLocation(location: AddLocationRequest, options?: CatalogRequestOptions): Promise<AddLocationResponse>;
    /**
     * Removes a registered Location by its ID.
     *
     * @param id - A location ID
     * @param options - Additional options
     */
    removeLocationById(id: string, options?: CatalogRequestOptions): Promise<void>;
}

/**
 * A frontend and backend compatible client for communicating with the Backstage
 * software catalog.
 *
 * @public
 */
declare class CatalogClient implements CatalogApi {
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

/**
 * The entity `status.items[].type` for the status of the processing engine in
 * regards to an entity.
 *
 * @public
 */
declare const ENTITY_STATUS_CATALOG_PROCESSING_TYPE = "backstage.io/catalog-processing";

export { AddLocationRequest, AddLocationResponse, CATALOG_FILTER_EXISTS, CatalogApi, CatalogClient, CatalogRequestOptions, ENTITY_STATUS_CATALOG_PROCESSING_TYPE, GetEntitiesRequest, GetEntitiesResponse, GetEntityAncestorsRequest, GetEntityAncestorsResponse, GetEntityFacetsRequest, GetEntityFacetsResponse, Location };
