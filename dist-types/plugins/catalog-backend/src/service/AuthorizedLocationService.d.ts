import { Location } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { LocationInput, LocationService } from './types';
export declare class AuthorizedLocationService implements LocationService {
    private readonly locationService;
    private readonly permissionApi;
    constructor(locationService: LocationService, permissionApi: PermissionEvaluator);
    createLocation(spec: LocationInput, dryRun: boolean, options?: {
        authorizationToken?: string;
    }): Promise<{
        location: Location;
        entities: Entity[];
        exists?: boolean | undefined;
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
