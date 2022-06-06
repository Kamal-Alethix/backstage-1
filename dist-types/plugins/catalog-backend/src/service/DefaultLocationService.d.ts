import { Entity } from '@backstage/catalog-model';
import { Location } from '@backstage/catalog-client';
import { CatalogProcessingOrchestrator } from '../processing/types';
import { LocationInput, LocationService, LocationStore } from './types';
export declare class DefaultLocationService implements LocationService {
    private readonly store;
    private readonly orchestrator;
    constructor(store: LocationStore, orchestrator: CatalogProcessingOrchestrator);
    createLocation(input: LocationInput, dryRun: boolean): Promise<{
        location: Location;
        entities: Entity[];
        exists?: boolean;
    }>;
    listLocations(): Promise<Location[]>;
    getLocation(id: string): Promise<Location>;
    deleteLocation(id: string): Promise<void>;
    private processEntities;
    private dryRunCreateLocation;
}
