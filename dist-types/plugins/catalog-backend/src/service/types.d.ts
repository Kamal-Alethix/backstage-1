import { Entity } from '@backstage/catalog-model';
import { Location } from '@backstage/catalog-client';
/**
 * Holds the information required to create a new location in the catalog location store.
 *
 * @public
 */
export interface LocationInput {
    type: string;
    target: string;
}
/**
 * The location service manages entity locations.
 * @public
 */
export interface LocationService {
    createLocation(location: LocationInput, dryRun: boolean, options?: {
        authorizationToken?: string;
    }): Promise<{
        location: Location;
        entities: Entity[];
        exists?: boolean;
    }>;
    listLocations(options?: {
        authorizationToken?: string;
    }): Promise<Location[]>;
    getLocation(id: string, options?: {
        authorizationToken?: string;
    }): Promise<Location>;
    deleteLocation(id: string, options?: {
        authorizationToken?: string;
    }): Promise<void>;
}
/**
 * Options for requesting a refresh of entities in the catalog.
 *
 * @public
 */
export declare type RefreshOptions = {
    /** The reference to a single entity that should be refreshed */
    entityRef: string;
    authorizationToken?: string;
};
/**
 * A service that manages refreshes of entities in the catalog.
 *
 * @public
 */
export interface RefreshService {
    /**
     * Request a refresh of entities in the catalog.
     */
    refresh(options: RefreshOptions): Promise<void>;
}
/**
 * Interacts with the database to manage locations.
 * @public
 */
export interface LocationStore {
    createLocation(location: LocationInput): Promise<Location>;
    listLocations(): Promise<Location[]>;
    getLocation(id: string): Promise<Location>;
    deleteLocation(id: string): Promise<void>;
}
