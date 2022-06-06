import { Location } from '@backstage/catalog-client';
import { Knex } from 'knex';
import { EntityProvider, EntityProviderConnection } from '../../api';
import { LocationInput, LocationStore } from '../../service/types';
export declare class DefaultLocationStore implements LocationStore, EntityProvider {
    private readonly db;
    private _connection;
    constructor(db: Knex);
    getProviderName(): string;
    createLocation(input: LocationInput): Promise<Location>;
    listLocations(): Promise<Location[]>;
    getLocation(id: string): Promise<Location>;
    deleteLocation(id: string): Promise<void>;
    private get connection();
    connect(connection: EntityProviderConnection): Promise<void>;
    private locations;
}
